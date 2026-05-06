import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── FALLBACK MODEL CHAIN ──
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];

// ── FIX 2: Exponential backoff retry for rate limiting ──
async function callGeminiWithRetry(
  apiKey: string,
  prompt: string,
  maxRetries = 3
): Promise<string> {
  for (const model of MODELS) {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`⏳ Model: ${model} | Attempt: ${attempt + 1}`);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { response_mime_type: "application/json" },
            }),
          }
        );

        const data = await res.json();

        // ── FIX 2: On rate limit, wait with exponential backoff then retry ──
        if (data.error?.code === 429) {
          const waitMs = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
          console.warn(`🟡 Rate limited on ${model}. Waiting ${waitMs}ms before retry...`);
          await new Promise((r) => setTimeout(r, waitMs));
          attempt++;
          continue;
        }

        // 503 = model overloaded, skip to next model immediately
        if (data.error?.code === 503) {
          console.warn(`🟡 ${model} overloaded. Trying next model...`);
          break;
        }

        if (!data.candidates) {
          console.error(`🔴 Invalid response from ${model}:`, JSON.stringify(data));
          throw new Error(`Invalid response structure from ${model}`);
        }

        console.log(`🟢 Success with model: ${model}`);
        return data.candidates[0].content.parts[0].text;

      } catch (err: any) {
        console.error(`🔴 Model ${model} attempt ${attempt + 1} failed:`, err.message);
        attempt++;

        if (attempt < maxRetries) {
          const waitMs = Math.pow(2, attempt) * 1000;
          console.warn(`⏳ Retrying in ${waitMs}ms...`);
          await new Promise((r) => setTimeout(r, waitMs));
        }
      }
    }
  }

  throw new Error("All Gemini models failed after retries. Please try again later.");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { commentIds, jobId } = body;

    // ── FIX 3: Background job mode — jobId signals server-side processing ──
    // When jobId is present, this is a background job. We update a jobs table
    // so the frontend can poll for progress without keeping the tab open.
    const isBackgroundJob = !!jobId;

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid commentIds array" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("Server configuration error: Missing GEMINI_API_KEY.");

    // ── FIX 3: Mark job as "running" in DB so frontend can poll ──
    if (isBackgroundJob) {
      await supabaseAdmin.from("classification_jobs").upsert({
        id: jobId,
        status: "running",
        total: commentIds.length,
        processed: 0,
        started_at: new Date().toISOString(),
      });
    }

    // ── Fetch all comments from DB in safe chunks ──
    const CHUNK_SIZE = 50;
    let allComments: { id: string; comment_text: string }[] = [];

    console.log(`📥 Fetching ${commentIds.length} comments...`);

    for (let i = 0; i < commentIds.length; i += CHUNK_SIZE) {
      const chunk = commentIds.slice(i, i + CHUNK_SIZE);
      const { data, error } = await supabaseAdmin
        .from("comments")
        .select("id, comment_text")
        .in("id", chunk);

      if (error) {
        console.error(`🔴 DB fetch error for chunk ${i}:`, error.message);
        continue;
      }
      if (data) allComments = allComments.concat(data);
    }

    if (allComments.length === 0) {
      if (isBackgroundJob) {
        await supabaseAdmin.from("classification_jobs").update({
          status: "done",
          processed: 0,
        }).eq("id", jobId);
      }
      return new Response(JSON.stringify({ success: true, tagsMap: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── FIX 1: Process in batches of 30 with a LONGER 3.5s pause ──
    // This gives the AI API enough breathing room to avoid 429 errors
    // at scale without noticeably hurting UX (user is already waiting).
    const AI_BATCH_SIZE = 30;
    const BATCH_PAUSE_MS = 3500; // was 1000ms — increased to 3500ms for safety

    const fullTagsMap: Record<string, { tags: string[]; language: string } | string[]> = {};
    let totalProcessed = 0;

    for (let i = 0; i < allComments.length; i += AI_BATCH_SIZE) {
      const batch = allComments.slice(i, i + AI_BATCH_SIZE);

      // ── Map real UUIDs to safe short IDs for the AI prompt ──
      const idMap = new Map<string, string>();
      const formattedComments = batch
        .map((c, index) => {
          const safeId = `comment_${index}`;
          idMap.set(safeId, c.id);
          return `ID: ${safeId} | Comment: "${c.comment_text}"`;
        })
        .join("\n");

      const prompt = `You are FanBack Classifier — an extremely accurate comment tagging system for content creators and social media personnel.

Your ONLY job is to analyze a batch of comments and return the correct tags for each.

RULES:
- Return ALL tags that genuinely apply.
- You can return multiple tags.
- If no tags from the list apply, return an empty array [].
- Be strict and accurate.

AVAILABLE TAGS (Use ONLY these):
- "questions" → The comment asks a direct question.
- "links" → Contains any URL, website link, promo link, or self-promotion.
- "negative" → The comment is criticizing, hating, complaining, or saying something disappointing.
- "spam" → Repetitive message, obvious copy-paste, generic promotional spam.
- "birthday" → Mentions "birthday", "happy birthday", "bday", or celebrating someone's personal celebration.
- "bots" → Very short nonsense, random letters, repeated characters and too many emojis, or clearly automated/bot-like message.

LANGUAGE DETECTION:
For every comment, detect the primary language used. Return the standard 2-letter ISO 639-1 language code. 
You are NOT limited to specific languages; use ANY valid 2-letter code that matches the comment (e.g., "de" for German, "pt" for Portuguese, "ar" for Arabic, "sw" for Swahili, etc.). 
If the comment is purely emojis, gibberish, or you cannot safely determine the language, default to "en".

FORMATTING RULES:
Return ONLY a valid JSON object. No extra text, no explanation, no markdown formatting blocks.
The keys MUST be the exact short IDs (like comment_0) provided below. The values MUST be objects containing a "tags" array and a "language" string.

Example:
{
  "comment_0": { "tags": ["questions"], "language": "en" },
  "comment_1": { "tags": ["spam", "links"], "language": "es" },
  "comment_2": { "tags": [], "language": "ko" }
}

Comments to analyze:
${formattedComments}`;

      try {
        const responseText = await callGeminiWithRetry(apiKey, prompt);

        let batchTagsMap: Record<string, string[]>;
        try {
          batchTagsMap = JSON.parse(responseText);
        } catch (_parseError) {
          console.error("🔴 JSON parse failed for batch. Raw output:", responseText);
          // Don't crash the whole job — skip this batch and continue
          totalProcessed += batch.length;
          continue;
        }

        // ── Translate safe IDs back to real UUIDs ──
for (const [safeId, result] of Object.entries(batchTagsMap)) {
  const realUuid = idMap.get(safeId);
  if (!realUuid) {
    console.warn(`🟡 Ignored hallucinated AI key: ${safeId}`);
    continue;
  }
  // Handle both old format (plain array) and new format (object with tags + language)
  if (Array.isArray(result)) {
    fullTagsMap[realUuid] = { tags: result, language: 'en' };
  } else {
    fullTagsMap[realUuid] = result as { tags: string[]; language: string };
  }
}

        totalProcessed += batch.length;

        // ── FIX 3: Update job progress in DB after each batch ──
        if (isBackgroundJob) {
          await supabaseAdmin.from("classification_jobs").update({
            processed: totalProcessed,
          }).eq("id", jobId);
        }

        console.log(`✅ Batch done. ${totalProcessed}/${allComments.length} processed.`);

      } catch (batchErr: any) {
        console.error(`🔴 Batch ${i} failed entirely:`, batchErr.message);
        totalProcessed += batch.length;

        if (isBackgroundJob) {
          await supabaseAdmin.from("classification_jobs").update({
            processed: totalProcessed,
          }).eq("id", jobId);
        }
        // Continue to next batch rather than crashing the whole job
        continue;
      }

      // ── FIX 2: Longer pause between batches — only if more batches remain ──
      if (i + AI_BATCH_SIZE < allComments.length) {
        console.log(`⏳ Pausing ${BATCH_PAUSE_MS}ms before next batch...`);
        await new Promise((r) => setTimeout(r, BATCH_PAUSE_MS));
      }
    }

    // ── FIX 4: Write ALL DB updates in one parallel flush at the end ──
    // Instead of updating after every batch (causing repeated re-renders on frontend),
    // we collect everything and write it all at once here server-side.
    console.log(`💾 Flushing ${Object.keys(fullTagsMap).length} tag updates to DB...`);

   const updatePromises = Object.entries(fullTagsMap).map(([realUuid, result]) => {
  const tags = Array.isArray(result) ? result : (result as any).tags;
  const language = Array.isArray(result) ? 'en' : (result as any).language || 'en';

  return supabaseAdmin
    .from("comments")
    .update({ ai_tags: tags, language: language })
    .eq("id", realUuid)
    .then(({ error }) => {
      if (error) return { id: realUuid, error: error.message };
      return null;
    });
});

    const results = await Promise.all(updatePromises);
    const dbErrors = results.filter((r) => r !== null);

    if (dbErrors.length > 0) {
      console.error(`🔴 ${dbErrors.length} DB save errors:`, JSON.stringify(dbErrors));
    }

    // ── FIX 3: Mark job as complete ──
    if (isBackgroundJob) {
      await supabaseAdmin.from("classification_jobs").update({
        status: dbErrors.length > 0 ? "partial" : "done",
        processed: totalProcessed,
        finished_at: new Date().toISOString(),
      }).eq("id", jobId);
    }

    console.log("✅ FULL CLASSIFICATION COMPLETE!");

    return new Response(
      JSON.stringify({
        success: true,
        tagsMap: fullTagsMap,
        processed: totalProcessed,
        errors: dbErrors.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error: any) {
    const msg = error.message || "Unknown internal error";
    console.error("💥 FATAL CRASH:", msg);

    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});