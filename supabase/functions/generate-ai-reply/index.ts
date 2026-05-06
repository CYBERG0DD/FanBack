// deno-lint-ignore no-external-import
import { serve } from "std/http/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { commentText, videoTitle, draftText, action = "reply" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    let systemPrompt = "";
    let userPrompt = "";

    // ─── MODE 1: TRANSLATE INBOUND (Fan to Creator) ───
    if (action === "translate-inbound") {
      systemPrompt = `You are a professional translator. Detect the language of the comment and translate it directly into English. If it is already in English, return the exact same text. Return ONLY valid JSON: {
        "translation": "the english text",
        "sourceLanguage": "The English name of the detected language (e.g., Spanish, Japanese, French)"
      }`;
      userPrompt = `Comment: "${commentText}"`;
    }
    
    // ─── MODE 2: TRANSLATE OUTBOUND (Creator to Fan) ───
    else if (action === "translate-outbound") {
      systemPrompt = `You are a professional translator. Analyze the [Original Fan Comment] to detect its language. Then, translate the [Creator English Draft] into that EXACT SAME language. If the fan comment is in English, return the draft as-is. Return ONLY valid JSON: {"translation": "the translated draft"}`;
      userPrompt = `[Original Fan Comment]: "${commentText}"\n[Creator English Draft]: "${draftText}"`;
    } 
    
    // ─── MODE 3: GENERATE AI REPLY (Strictly English) ───
    else {
      systemPrompt = `You are FanBack AI. You write replies exactly like a real content creator would — a musician or actor who makes videos and replies to fans in their DMs or comments. 
You are NOT an assistant. NOT customer support. Just a real person typing casually.

Your job has TWO parts:

1. **CLASSIFY** the comment. Select ALL tags that genuinely apply from this list ONLY:
   ["questions", "links", "negative", "spam", "birthday", "bots"]
   If none apply, return an empty array [].

2. **WRITE** a natural reply with these strict rules:

TONE & STYLE:
- Sound like a busy creator replying quickly between edits or while scrolling comments.
- Casual, genuine, and warm — like texting a fan you actually appreciate.
- Use natural slang and short forms only when it feels right.
- Use emojis sparingly — only when the comment genuinely calls for it. Never force them.
- NEVER start with "Haha", "Lol", "Wow", "Aww", or any filler reaction.
- NEVER use the fan's name or tag them (@username). Just reply directly.
- NEVER say "thank you for your comment", "thanks for watching", or anything that sounds like support.
- NEVER repeat what the fan said back to them.
- Keep it spontaneous and human.

LENGTH:
- Short hype comment → 1 short sentence
- Genuine or heartfelt comment → 1-2 warm sentences
- Question → Answer it properly (can be longer if needed)
- Criticism → Keep it calm, short, and respectful (1-2 sentences)

Return ONLY valid JSON in this exact format. No explanations, no extra text:

{
  "tags": ["questions"],
  "reply": "Yeah I've been thinking about that too, might try it in the next video fr"
}
`;
      userPrompt = `Comment: "${commentText}"\nVideo title: "${videoTitle || "Untitled"}"`;
    }

      const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }
      ],
      generationConfig: { response_mime_type: "application/json" },
    }),
  }
);

    const data = await response.json();

    console.log("GOOGLE API RESPONSE:", data);

    if (!data.candidates) throw new Error(`Google API Error: ${JSON.stringify(data)}`);

    const aiText = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(aiText);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("CRITICAL EDGE FUNCTION ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});