import { supabase } from '../../lib/supabase';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import {
  ArrowRight, X, Sparkles, Menu, MessageSquareHeart,
  Layers, Zap, CheckCircle2, Play, ChevronRight,
  Star, TrendingUp, Shield, Heart,
  MousePointer2, Loader2, Building2, ShieldCheck, Lock, LayoutDashboard, Info
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// ─── SOCIAL ICONS ───
const SOCIAL_ICONS = [
  { name: 'youtube', color: '#FF0000', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'twitter', color: '#1DA1F2', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'facebook', color: '#1877F2', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'tiktok', color: '#ffffff', path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' },
  { name: 'instagram', color: '#E1306C', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
];

const FEATURES = [
  {
    icon: <Layers size={24} />,
    color: 'cyan',
    colorHex: '#22d3ee',
    glowColor: 'rgba(34,211,238,0.15)',
    borderColor: 'rgba(34,211,238,0.3)',
    title: 'Prioritized Inbox',
    desc: 'Transform comment chaos into an intelligent feed. Important questions, praise, and brand opportunities automatically rise to the top.',
  },
  {
    icon: <Sparkles size={24} />,
    color: 'purple',
    colorHex: '#a855f7',
    glowColor: 'rgba(168,85,247,0.15)',
    borderColor: 'rgba(168,85,247,0.3)',
    title: 'Personalized AI Replies',
    desc: 'Draft warm, authentic, emoji-friendly replies in seconds that perfectly match your unique voice as a creator.',
  },
  {
    icon: <MessageSquareHeart size={24} />,
    color: 'pink',
    colorHex: '#ec4899',
    glowColor: 'rgba(236,72,153,0.15)',
    borderColor: 'rgba(236,72,153,0.3)',
    title: 'Mass Reply Power',
    desc: 'Select multiple comments and send one big "Thank you everyone ❤️" or let AI personalize them. Perfect for post-drop fan appreciation.',
  },
  {
    icon: <Zap size={24} />,
    color: 'emerald',
    colorHex: '#10b981',
    glowColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.3)',
    title: 'Daily Free Start',
    desc: 'Begin with 50 smart replies per day (resets every 24 hours). Upgrade to Pro only when you need unlimited scale across all platforms.',
  },
];

const ECOSYSTEM_TOOLS = [
  {
    name: 'Fanfix & Patreon',
    logoIcon: <Lock size={24} className="text-pink-400" />,
    color: 'rgba(236,72,153,0.1)',
    desc: 'Incredible platforms for monetizing your top 1% of fans. They excel at building exclusive, paid spaces and rewarding financial support.',
  },
  {
    name: 'Respondology',
    logoIcon: <ShieldCheck size={24} className="text-emerald-400" />,
    color: 'rgba(16,185,129,0.1)',
    desc: 'The absolute gold standard for comment moderation. They specialize in automatically filtering hate speech, spam, and toxicity to keep your digital space safe.',
  },
  {
    name: 'Sprout & Hootsuite',
    logoIcon: <Building2 size={24} className="text-purple-400" />,
    color: 'rgba(168,85,247,0.1)',
    desc: 'Absolute powerhouses for enterprise brands. They offer brilliant, heavy-duty analytics, scheduling, and publishing workflows for massive marketing teams.',
  },
  {
    name: 'TubeBuddy & VidIQ',
    logoIcon: <TrendingUp size={24} className="text-cyan-400" />,
    color: 'rgba(34,211,238,0.1)',
    desc: 'Unmatched tools for YouTube SEO and algorithm optimization. They provide fantastic data insights to help your videos rank higher and reach more screens.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Your Platforms',
    desc: 'Link YouTube, Instagram, TikTok, Facebook, and X in seconds using secure OAuth. No password stored.',
    icon: <Shield size={28} />,
    color: '#22d3ee',
  },
  {
    step: '02',
    title: 'Review Your Smart Inbox',
    desc: 'All your comments flow into one intelligent feed. AI surfaces the most important ones — questions, praise, opportunities.',
    icon: <MessageSquareHeart size={28} />,
    color: '#a855f7',
  },
  {
    step: '03',
    title: 'Reply & Build Real Fans',
    desc: 'Use AI-generated replies that sound like you, or send a mass heartfelt thank-you to hundreds of fans at once.',
    icon: <Heart size={28} />,
    color: '#ec4899',
  },
];

// ─── MOCK DASHBOARD SCREENSHOT ───
function DashboardMockup() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#111]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="flex-1 mx-4 h-5 rounded-full bg-white/5 flex items-center px-3">
          <span className="text-[10px] text-white/30">fanback.app/dashboard</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white font-bold text-sm">Good morning, Alex 👋</div>
            <div className="text-white/40 text-xs">Here's your comment activity</div>
          </div>
          <div className="flex gap-2">
            {['YT', 'IG', 'TK'].map(p => (
              <div key={p} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">{p}</div>
            ))}
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Pending', val: '284', textColor: '#a855f7' },
            { label: 'Replied', val: '1.2k', textColor: '#22d3ee' },
            { label: 'Today', val: '47', textColor: '#10b981' },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
              <div className={cn("font-bold text-sm", s.textColor)}>{s.val}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Daily Activity Bar */}
        <div className="rounded-xl bg-white/5 border border-white/5 p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs">Daily Reply Progress</span>
            <span className="text-xs text-purple-400 font-bold">47 / 50</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-linear-to-r from-purple-500 to-cyan-500" style={{ width: '94%' }} />
          </div>
        </div>
        {/* Comment previews */}
        <div className="space-y-2">
          {[
            { user: '@mikayla_fan', msg: 'Your new track hits different omg 🔥', platform: 'YT', time: '2m' },
            { user: '@superfan99', msg: 'Can you do a tutorial on this?', platform: 'YT', time: '5m' },
            { user: '@music_lover', msg: 'Been listening on repeat all day!', platform: 'YT', time: '8m' },
          ].map(c => (
            <div key={c.user} className="flex items-start gap-2 p-2 rounded-lg bg-white/3 border border-white/5">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500/40 to-cyan-500/40 flex items-center justify-center text-xs shrink-0 text-white/70">
                {c.user[1].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-white/80 text-xs font-medium">{c.user}</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-white/40">{c.platform}</span>
                </div>
                <p className="text-white/50 text-[11px] truncate">{c.msg}</p>
              </div>
              <span className="text-white/30 text-[10px] shrink-0">{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MOCK COMMENTS SCREENSHOT ───

function AnimatedCommentsMockup() {
  const cursor = useAnimation();
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      // Give the page a second to load before starting the demo
      await new Promise(r => setTimeout(r, 1000));

      while (isActive) {
        // 1. Reset State
        setSelected([]);
        setStatus('idle');
        await cursor.start({ left: "50%", top: "90%", opacity: 0, transition: { duration: 0 } });
        await cursor.start({ opacity: 1, transition: { duration: 0.5 } });

        if (!isActive) break;
        await new Promise(r => setTimeout(r, 800));

        // 2. Move to Comment 1 Checkbox
        await cursor.start({ left: "12%", top: "36%", transition: { duration: 0.9, ease: "easeInOut" } });
        await cursor.start({ scale: 0.8, transition: { duration: 0.1 } }); // Click down
        setSelected(prev => [...prev, 0]);
        await cursor.start({ scale: 1, transition: { duration: 0.1 } }); // Click up

        if (!isActive) break;
        await new Promise(r => setTimeout(r, 400));

        // 3. Move to Comment 2 Checkbox
        await cursor.start({ left: "12%", top: "58%", transition: { duration: 0.8, ease: "easeInOut" } });
        await cursor.start({ scale: 0.8, transition: { duration: 0.1 } });
        setSelected(prev => [...prev, 1]);
        await cursor.start({ scale: 1, transition: { duration: 0.1 } });

        if (!isActive) break;
        await new Promise(r => setTimeout(r, 400));

        // 4. Move to Mass Reply Button
        await cursor.start({ left: "82%", top: "24%", transition: { duration: 0.9, ease: "easeInOut" } });
        await cursor.start({ scale: 0.8, transition: { duration: 0.1 } });
        setStatus('sending');
        await cursor.start({ scale: 1, transition: { duration: 0.1 } });

        // Fade cursor out during the "Processing" state
        await cursor.start({ opacity: 0, transition: { duration: 0.3 } });

        if (!isActive) break;
        await new Promise(r => setTimeout(r, 1200)); // Fake network delay

        // 5. Success State!
        setStatus('success');

        // Hold the success screen before looping back to the start
        await new Promise(r => setTimeout(r, 3500));
      }
    };

    runSequence();
    return () => { isActive = false; }; // Cleanup on unmount
  }, [cursor]);

  const comments = [
    { id: 0, user: '@superfan99', msg: "Can you do a tutorial on this? I've been trying to figure out the technique!", badge: '❓' },
    { id: 1, user: '@music_lover', msg: "Been listening on repeat all day! You're genuinely talented 🎵", badge: '❤️' },
    { id: 2, user: '@Alex_Music', msg: "This collab needs to happen asap please!", badge: '💡' },
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl relative select-none">

      {/* ── THE GHOST CURSOR ── */}
      <motion.div
        animate={cursor}
        className="absolute z-50 pointer-events-none drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
        style={{ left: "50%", top: "90%" }}
      >
        <MousePointer2 className="text-white fill-black w-6 h-6" />
      </motion.div>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#1a1a1a] border border-white/10 px-5 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="text-green-400" size={16} />
            </div>
            <span className="text-white font-bold text-sm whitespace-nowrap">2 Replies Sent!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#111]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="flex-1 mx-4 h-5 rounded-full bg-white/5 flex items-center px-3">
          <span className="text-[10px] text-white/30">fanback.app/comments</span>
        </div>
      </div>

      <div className="p-4">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 mb-4">
          {['All', 'Unreplied', 'Replied', 'Flagged'].map((tab, i) => (
            <div key={tab} className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${i === 0 ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/40 border border-white/10'}`}>
              {tab}
            </div>
          ))}
        </div>

        {/* Mass Reply Banner (Dynamic State) */}
        <div className={`flex items-center gap-2 p-2.5 rounded-xl transition-all duration-300 mb-4 border ${selected.length > 0 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}>
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.length > 0 ? 'border-purple-500/50 bg-purple-500/20' : 'border-white/10'}`}>
            {selected.length > 0 && <CheckCircle2 size={10} className="text-purple-400" />}
          </div>
          <span className={`text-xs flex-1 font-medium transition-colors ${selected.length > 0 ? 'text-purple-300' : 'text-white/30'}`}>
            {selected.length > 0 ? `${selected.length} comments selected` : 'Select comments to reply'}
          </span>
          <div className={`text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${selected.length > 0 ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/10 text-white/30'}`}>
            {status === 'sending' ? <><Loader2 size={10} className="animate-spin" /> Sending</> : 'Mass Reply'}
          </div>
        </div>

        {/* Comment Items */}
        <div className="space-y-2.5">
          {comments.map((c, i) => {
            const isChecked = selected.includes(c.id);
            return (
              <div key={c.id} className={`p-3 rounded-xl border transition-all duration-300 ${isChecked ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/5 bg-white/3'}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-all ${isChecked ? 'border-purple-500 bg-purple-500' : 'border-white/20'}`}>
                    {isChecked && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-white/90 text-xs font-bold">{c.user}</span>
                      <span>{c.badge}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed transition-colors ${isChecked ? 'text-white/80' : 'text-white/50'}`}>{c.msg}</p>

                    {/* Expand the AI suggestion only if checked */}
                    <AnimatePresence>
                      {isChecked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <div className="text-[9px] text-cyan-400 font-bold mb-1 flex items-center gap-1"><Sparkles size={10} /> AI Suggestion Draft</div>
                            <p className="text-[11px] text-white/70">Thanks for the support! Let's definitely make that happen soon 🔥</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <div className="mt-3 flex gap-2 opacity-50">
          <div className="flex-1 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center px-3">
            <span className="text-white/25 text-xs">Type a reply or use AI...</span>
          </div>
          <div className="px-3 h-8 bg-white/10 rounded-xl text-white/50 text-xs font-bold flex items-center gap-1">
            <Sparkles size={12} /> AI
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  // Put this right below const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  // Put this right below the useEffect you just added
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function connectYouTube() {
  setIsGoogleLoading(true);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
      ].join(' '),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',   // ← always, not just on signup
      }
    }
  });

  if (error) {
    alert(`Error: Login failed: ${error.message}`);
    setIsGoogleLoading(false);
  }
}

  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup'); // 'signup' or 'login'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false); 

  // Track scroll for header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Floating Background Icons ──
      const stars = gsap.utils.toArray<HTMLElement>('.gsap-star');
      stars.forEach((star) => {
        gsap.set(star, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 3,
          opacity: Math.random() * 0.08 + 0.02,
          scale: Math.random() * 0.6 + 0.4,
          width: Math.random() * 20 + 10,
          height: Math.random() * 20 + 10,
        });
        gsap.to(star, {
          y: `-=${100 + Math.random() * 150}`,
          x: `+=${(Math.random() - 0.5) * 80}`,
          rotation: Math.random() * 90 - 45,
          duration: 15 + Math.random() * 20,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 10,
        });
      });

      // ── Hero Text Stagger ──
      gsap.fromTo('.hero-text',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      );

      // ── Feature Cards ──
      gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.92 },
          {
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
            y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)',
            onComplete: () => {
              const icon = card.querySelector('.feature-icon');
              if (icon) gsap.to(icon, { scale: 1.15, repeat: 1, yoyo: true, duration: 0.3, ease: 'power2.inOut' });
            },
          }
        );
      });

      // ── Mockup Screenshots Parallax ──
      gsap.utils.toArray<HTMLElement>('.mockup-panel').forEach((panel, i) => {
        gsap.fromTo(panel,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: { trigger: panel, start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out', delay: i * 0.15,
          }
        );
      });

      // ── Comparison Items Slide In ──
      gsap.utils.toArray<HTMLElement>('.compare-item').forEach((item, i) => {
        gsap.fromTo(item,
          { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
          {
            scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
            x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: i * 0.05,
          }
        );
      });

      // ─── STATS COUNTERS (ANIMATED) ───
      gsap.utils.toArray<HTMLElement>('.stat-counter').forEach((counter) => {
        const el = counter;
        const targetValue = parseFloat(el.getAttribute('data-target') || '0');
        const suffix = el.getAttribute('data-suffix') || '';

        // Check if the number needs a decimal point (like 4.8 or 1.2)
        const isDecimal = el.getAttribute('data-target')?.includes('.');

        gsap.fromTo({ val: 0 }, { val: targetValue }, {
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 85%', // Starts when the section is 85% down the screen
          },
          duration: 2.5,
          ease: "power2.out",
          onUpdate: function () {
            const currentVal = (this as any).targets()[0].val;
            if (isDecimal) {
              el.textContent = currentVal.toFixed(1) + suffix;
            } else {
              el.textContent = Math.floor(currentVal).toLocaleString() + suffix;
            }
          }
        });
      });

      // ── How It Works Steps ──
      gsap.utils.toArray<HTMLElement>('.how-step').forEach((step, i) => {
        gsap.fromTo(step,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none reverse' },
            y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: i * 0.12,
          }
        );
      });

      // ── Section Titles ──
      gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
        gsap.fromTo(title,
          { y: 30, opacity: 0 },
          {
            scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none reverse' },
            y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.stat-counter').forEach((counter) => {
        const targetValue = parseFloat(counter.getAttribute('data-target') || '0');
        const suffix = counter.getAttribute('data-suffix') || '';
        const isDecimal = counter.getAttribute('data-target')?.includes('.');

        gsap.fromTo({ val: 0 }, { val: targetValue }, {
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
          },
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            const currentVal = (this as any).targets()[0].val;
            if (isDecimal) {
              counter.textContent = currentVal.toFixed(1) + suffix;
            } else {
              counter.textContent = Math.floor(currentVal).toLocaleString() + suffix;
            }
          }
        });
      });
      ScrollTrigger.refresh();

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen flex flex-col items-center bg-black text-white relative overflow-x-hidden font-sans">

      {/* ── BACKGROUND GLOW ORBS ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden max-h-screen w-full">
        <div className="absolute top-[10%] left-[15%] w-125 h-125 bg-purple-700/8 rounded-full blur-[140px]" />
        <div className="absolute top-[60%] right-[10%] w-100 h-100 bg-cyan-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-[35%] left-[55%] w-75 h-75 bg-pink-700/5 rounded-full blur-[100px]" />
        {/* Floating social icons */}
        {Array.from({ length: 35 }).map((_, i) => {
          const platform = SOCIAL_ICONS[i % SOCIAL_ICONS.length];
          return (
            <svg key={i} viewBox="0 0 24 24" fill={platform.color} className="gsap-star absolute opacity-0 pointer-events-none">
              <path d={platform.path} />
            </svg>
          );
        })}
      </div>

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-16 sm:h-18 flex items-center ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <span className="font-black text-2xl tracking-tight text-white">
              Fan<span className="text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]">Back</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/50">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-purple-400 transition-colors">Home</button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-400 transition-colors">Features</button>
            <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-400 transition-colors">How it Works</button>
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-purple-400 transition-colors"
            >
              Pricing
            </button>
          </nav>

         {/* CTA + Hamburger */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
              className="hidden md:block font-bold text-sm text-white/60 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="font-bold px-4 py-2 rounded-full text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all active:scale-95"
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex flex-col gap-5 shadow-2xl md:hidden"
              >
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
                  className="text-left text-lg font-bold text-white/70 hover:text-purple-400 transition-colors"
                >
                  Home
                </button>
                {[
                  { label: 'Features', id: 'features' },
                  { label: 'How it Works', id: 'how' },
                ].map(item => (
                  <button key={item.id} onClick={() => { document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
                    className="text-left text-lg font-bold text-white/70 hover:text-purple-400 transition-colors">
                    {item.label}
                  </button>
                ))}
                  <button
                    onClick={() => { setAuthMode('login'); setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-center hover:bg-white/10 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-center"
                  >
                    Start Free – 50 Replies/Day
                  </button>

              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center pt-32 sm:pt-40 pb-16 sm:pb-24 px-5">

        {/* Badge */}
        <div className="hero-text inline-flex items-center gap-2 mb-6 py-1 px-3 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          <Sparkles size={10} /> The Creator's Reply Engine
        </div>

        {/* Headline (Reduced Size) */}
        <h1 className="hero-text text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
          Stop drowning in fan comments.<br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            Turn viewers into loyal superfans.
          </span>
        </h1>

        {/* Subheadline (Reduced Size) */}
        <p className="hero-text text-sm sm:text-base text-white/50 max-w-2xl mb-10 leading-relaxed">
          FanBack Brings your community into a space of unity. Link any of your platforms YouTube, Instagram, TikTok, Facebook, and X (Twitter).
          and watch those comments co-exist perfectly in your dashboard.
          Get context-aware AI replies that actually sound like you, send heartfelt mass reply to your fans in one click,
          and build real connections without burnout.
        </p>

        {/* CTA Buttons */}
        <div className="hero-text flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-full transition-all shadow-[0_0_35px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] active:scale-95 text-base"
          >
            Start Free with 50 Replies <ArrowRight size={18} />
          </button>
          <button
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-bold py-4 px-8 rounded-full transition-all text-base"
          >
            <Play size={16} /> See it in Action
          </button>
        </div>

        {/* Social Proof */}
        <div className="hero-text flex flex-wrap items-center justify-center gap-4 mt-10 text-white/30 text-sm">
          {['YouTube', 'Instagram', 'TikTok', 'Facebook', 'X'].map(p => (
            <span key={p} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" /> {p}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="relative z-10 w-full max-w-6xl mx-auto px-5 pb-20 sm:pb-28">
        <div className="section-title text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Everything you need to love your fans back</h2>
          <p className="text-white/40 max-w-xl mx-auto">Purpose-built for creators who care about authentic connection, not just content output.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card group relative p-6 rounded-3xl border border-white/8 bg-white/2 hover:bg-white/4 transition-all duration-300 cursor-default overflow-hidden"
              style={{ '--glow-color': f.glowColor, '--border-color': f.borderColor } as React.CSSProperties}
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 30px ${f.glowColor}`, border: `1px solid ${f.borderColor}` }} />
              <div className="feature-icon relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${f.colorHex}15`, color: f.colorHex }}>
                {f.icon}
              </div>
              <h3 className="relative z-10 font-bold text-white mb-3">{f.title}</h3>
              <p className="relative z-10 text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEE FANBACK IN ACTION ── */}
      <section id="demo" className="relative z-10 w-full px-5 py-20 sm:py-28 border-y border-white/5" style={{ background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.03), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="section-title text-center mb-12 sm:mb-16">
            <div className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Live Preview</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">See FanBack in Action</h2>
            <p className="text-white/40 max-w-lg mx-auto">Scroll to explore the clean, intuitive dashboard and smart comments management interface.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Dashboard Mockup */}
            <div className="mockup-panel">
              <div className="mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-white/50 text-sm font-medium">Clean Dashboard Overview</span>
              </div>
              <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.1))' }}>
                <DashboardMockup />
              </div>
            </div>

            {/* Comments Mockup */}
            <div className="mockup-panel">
              <div className="mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-white/50 text-sm font-medium">Smart Comments Inbox with AI Reply Tools</span>
              </div>
              <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(236,72,153,0.1))' }}>
                <AnimatedCommentsMockup />
              </div>
            </div>
          </div>

          {/* Swipe hint for mobile */}
          <p className="text-center text-white/25 text-xs mt-6 sm:hidden">Scroll up to see both screens ↑</p>
        </div>
      </section>


      {/* ── THE ECOSYSTEM / PLATFORMS ── */}
      <section className="relative z-10 w-full px-5 py-20 sm:py-28 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="section-title text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">The platforms we supercharge</h2>
            <p className="text-white/40 max-w-xl mx-auto">FanBack integrates seamlessly with the world's most powerful creator platforms to centralize your community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'YouTube', color: '#FF0000', desc: 'The home of long-form connection. FanBack helps you manage subscriber Q&As and build long-term loyalty.', icon: SOCIAL_ICONS[0].path },
              { name: 'Instagram', color: '#E1306C', desc: 'Highly visual and personal. Engage instantly with fans responding to your latest Reels and photo drops.', icon: SOCIAL_ICONS[4].path },
              { name: 'TikTok', color: '#FFFFFF', desc: 'The engine of virality. Catch the massive wave of comments when a video blows up and ride the algorithm.', icon: SOCIAL_ICONS[3].path },
              { name: 'X (Twitter)', color: '#1DA1F2', desc: 'The pulse of real-time conversation. React instantly to fan mentions, trending moments, and foster a unified voice.', icon: SOCIAL_ICONS[1].path },
              { name: 'Facebook', color: '#1877F2', desc: 'Where true communities gather. Build meaningful co-existence with dedicated fan groups and lifelong supporters.', icon: SOCIAL_ICONS[2].path },

            ].map((plat) => (
              <div key={plat.name} className="p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <svg viewBox="0 0 24 24" fill={plat.color} className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <path d={plat.icon} />
                  </svg>
                  <h3 className="text-xl font-bold text-white">{plat.name}</h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                  {plat.desc}
                </p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE CREATOR ECOSYSTEM (PRAISING OTHERS) ── */}
      <section className="relative z-10 w-full px-5 py-20 sm:py-28 border-t border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="section-title text-center mb-12 sm:mb-16">
            <div className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold tracking-widest uppercase mb-4">Digital Co-existence</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Brilliant Platforms for different goals</h2>
            <p className="text-white/40 max-w-2xl mx-auto leading-relaxed">
              We believe in an ecosystem where great technology works in harmony. While FanBack is built entirely to foster unity with your public audience, here are other exceptional platforms that specialize in different parts of your creator journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ECOSYSTEM_TOOLS.map((tool) => (
              <div key={tool.name} className="flex gap-5 p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/5 transition-colors">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: tool.color }}
                >
                  {tool.logoIcon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FANBACK IS DIFFERENT ── */}
      <section className="relative z-10 w-full px-5 py-20 sm:py-28 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="section-title text-center mb-12 sm:mb-16">
            <div className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
              Built for Creators
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Why FanBack is Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/2 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Command center</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Manage YouTube, Instagram, TikTok, and more from one clean dashboard depending on the account that is linked. Stop switching tabs and losing track of your community.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/2 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Context-Aware AI</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Our AI doesn't just say "Thanks!" It reads the room, detects the emotion of the comment, and drafts hyper-personalized replies in your exact tone.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/2 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart Anti-Ban Protection</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Mass reply safely. FanBack's Smart Delay naturally staggers outgoing messages by 2-5 seconds to keep your accounts 100% ban-free.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/2 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Enhanced privacy</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Fanback does not store any of your data you have the liberty to link and unlink your social accounts.
                You can only view messages and comments on the platform you linked.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ── STATS SECTION ── */}
      <section className="stats-section relative z-10 w-full px-5 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-[3rem] border border-white/5 p-10 sm:p-16 overflow-hidden relative bg-[#050505]">

            {/* Background Glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">

              {/* Stat 1: Creators */}
              <div className="flex flex-col items-center flex-1">
                <div className="text-5xl sm:text-7xl font-black text-white mb-3 tracking-tighter">
                  <span className="stat-counter" data-target="2400" data-suffix="+">2400</span>
                </div>
                <div className="text-[11px] text-purple-400 font-bold uppercase tracking-[0.3em]">Active Creators</div>
              </div>

              <div className="hidden md:block w-px h-20 bg-white/10" />

              {/* Stat 2: Replies */}
              <div className="flex flex-col items-center flex-1">
                <div className="text-5xl sm:text-7xl font-black text-white mb-3 tracking-tighter">
                  <span className="stat-counter" data-target="1.2" data-suffix="M+">0</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-[0.3em]">Replies Sent</div>
              </div>

              <div className="hidden md:block w-px h-20 bg-white/10" />

              {/* Stat 3: Satisfaction */}
              <div className="flex flex-col items-center flex-1">
                <div className="text-5xl sm:text-7xl font-black text-white mb-3 tracking-tighter">
                  <span className="stat-counter" data-target="4.8" data-suffix="★">0</span>
                </div>
                <div className="text-[11px] text-yellow-500 font-bold uppercase tracking-[0.3em]">User Satisfaction</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="relative z-10 w-full px-5 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="section-title text-center mb-12 sm:mb-16">
            <div className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">Simple Process</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Get started in 3 steps</h2>
            <p className="text-white/40 max-w-md mx-auto">No complex setup. No learning curve. Just connect and start building real fan connections.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-linear-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="how-step relative flex flex-col items-center text-center p-6 rounded-3xl border border-white/8 bg-white/2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                  style={{ backgroundColor: `${step.color}12`, border: `1px solid ${step.color}25` }}>
                  <div style={{ color: step.color }}>{step.icon}</div>
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{ backgroundColor: step.color, color: 'black' }}>{step.step}</div>
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>

                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="sm:hidden mt-4 text-white/20">
                    <ChevronRight size={20} className="rotate-90 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 w-full px-5 py-16 sm:py-20 border-y border-white/5" style={{ background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.02), transparent)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="section-title text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Creators love FanBack</h2>
            <p className="text-white/40">Real feedback from musicians, actors, and creators</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Jordan M.', role: 'Music Producer · 2.1M YT subs', quote: 'FanBack saved me literally 3 hours a week. My fans feel heard and I don\'t feel overwhelmed anymore.', stars: 5 },
              { name: 'Priya K.', role: 'Actress & Creator · 890K IG', quote: 'The AI replies actually sound like me. I\'ve gotten DMs from fans saying I feel "more real" — that\'s everything.', stars: 5 },
              { name: 'Carlos R.', role: 'TikTok Comedian · 4.5M TK', quote: 'Mass reply is insane. After a viral video I thanked 400 fans in 60 seconds. The engagement spike was wild.', stars: 5 },
            ].map(t => (
              <div key={t.name} className="how-step p-5 rounded-3xl border border-white/8 bg-white/2 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed flex-1">"{t.quote}"</p>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-white/35 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative z-10 w-full px-5 py-24 sm:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-125 h-75 bg-purple-600/10 rounded-full blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-5">
              Ready to scale your<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #a855f7, #22d3ee)' }}>
                connection with fans?
              </span>
            </h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto leading-relaxed">
              Stop letting the algorithm dictate your community. Take control of your comment section today — free forever.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center gap-2 font-black py-4 px-10 rounded-full text-lg bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_70px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Start Free with 50 Replies Today <ArrowRight size={20} />
            </button>
            <p className="text-white/25 text-xs mt-4">No credit card required · Free forever plan available</p>
          </div>
        </div>
      </section>
      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="relative z-10 w-full px-5 py-20 sm:py-28 border-t border-white/5 bg-black overflow-hidden">

        {/* ── FLOATING BACKGROUND ELEMENTS ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Glows */}
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px]" />

          {/* Animated Icons */}
          <motion.div
            animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[15%] text-purple-500/20"
          >
            <Star size={50} />
          </motion.div>

          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[15%] text-cyan-500/20"
          >
            <Zap size={60} />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[8%] text-pink-500/20 hidden md:block"
          >
            <Sparkles size={40} />
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="section-title text-center mb-16">
            <div className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">Pricing Plans</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-white/40 max-w-md mx-auto">Scale your connection with fans at your own pace. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="feature-card p-8 rounded-[2.5rem] border border-white/10 bg-white/2 flex flex-col h-full hover:border-white/20 transition-all backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free tier</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-white/30 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['50 Replies / day', '1 Platform', 'Basic comment filtering'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/50">
                    <CheckCircle2 size={16} className="text-purple-500" /> {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all active:scale-95"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="feature-card relative p-8 rounded-[2.5rem] border border-purple-500/50 bg-purple-500/5 flex flex-col h-full shadow-[0_0_50px_rgba(168,85,247,0.1)] md:scale-105 z-10 backdrop-blur-sm">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-4 rounded-full bg-purple-600 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Most Popular</div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">FanBack Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$20</span>
                  <span className="text-white/30 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Unlimited AI Replies (∞)', 'All Social Platforms intergrated', 'Advanced Comment filtering', 'AI auto replies'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-cyan-400" /> {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500 transition-all active:scale-95"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 w-full border-t border-white/5 px-5 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black text-xl tracking-tight">
            Fan<span className="text-purple-400">Back</span>
          </span>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-white transition-colors"
            >
              Pricing
            </button>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <p className="text-white/20 text-xs">© 2026 FanBack. Built for creators.</p>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAuthOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm rounded-3xl p-7 shadow-2xl z-10 flex flex-col items-center overflow-hidden border border-white/10"
              style={{ background: '#0d0d0d' }}
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

              <button type="button" aria-label="Close login" onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <X size={18} />
              </button>

              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/25 text-purple-400 rounded-2xl flex items-center justify-center mb-5">
                <Sparkles size={28} />
              </div>

              <h3 className="text-2xl font-black mb-1 text-white text-center">
                {authMode === 'login' ? 'Welcome Back' : 'Welcome to FanBack'}
              </h3>
              <p className="text-sm text-white/40 mb-7 text-center">Securely link your accounts to start engaging. No more trying to remember a password just a simple click and you're in.</p>

              {/* Google / YouTube Connect */}
              <button
                onClick={connectYouTube}
                disabled={isGoogleLoading}
                className={`w-full flex items-center justify-center gap-3 border py-3.5 px-4 rounded-xl transition-all duration-300 mb-3 group ${isGoogleLoading
                  ? 'bg-white/10 border-purple-500/40 text-white/60 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/8 border-white/10 hover:border-purple-500/40 text-white font-bold'
                  }`}
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-purple-400 shrink-0" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}

                <span>
                  {isGoogleLoading
                    ? 'Connecting...'
                    : authMode === 'login'
                      ? 'Log in with Google'
                      : 'Sign up with Google'}
                </span>

                {!isGoogleLoading && (
                  <ChevronRight size={16} className="ml-auto text-white/30 group-hover:text-purple-400 transition-colors" />
                )}
              </button>

              <p className="text-white/20 text-xs text-center mt-5 flex items-center gap-1.5">
                <Shield size={11} /> Secured by OAuth · No password stored
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FLOATING DISCLAIMER BUTTON ── */}
      {!isAuthOpen && (
        <>
          {/* 1. THE INVISIBLE BACKDROP: Clicking anywhere else closes the disclaimer */}
          <AnimatePresence>
            {isDisclaimerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDisclaimerOpen(false)}
                className="fixed inset-0 z-[40] bg-black/20 backdrop-blur-[2px] cursor-pointer"
              />
            )}
          </AnimatePresence>

          <div className="fixed bottom-6 right-6 z-[50] flex flex-col items-end">
            <AnimatePresence>
              {isDisclaimerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                  className="mb-4 w-[calc(100vw-3rem)] sm:w-85 p-6 rounded-[2rem] bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                  {/* Cyberpunk accent line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-cyan-500 opacity-50" />

                  <div className="flex items-center gap-3 mb-4 text-purple-400">
                    <div className="p-2 bg-purple-500/10 rounded-xl">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-black text-sm tracking-[0.15em] uppercase">Security Note</h4>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed mb-6">
                    Just to clear the air: <strong className="text-white">FanBack</strong> is an independent platform. While our names sound similar to others in the space, we are not affiliated or an extension of FanFix. We are a separate team focused on solving community engagement for creators.
                  </p>
                  <button
                    onClick={() => setIsDisclaimerOpen(false)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
                  >
                    I Understand
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsDisclaimerOpen(!isDisclaimerOpen)}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 active:scale-90 border-2",
                isDisclaimerOpen
                  ? "bg-purple-600 border-purple-400/50 rotate-0"
                  : "bg-white/5 hover:bg-white/10 backdrop-blur-md border-white/10 hover:border-white/20"
              )}
              aria-label="Toggle Info"
            >
              {isDisclaimerOpen ? <X size={24} /> : <Info size={28} />}
            </button>
          </div>
        </>
      )}

    </div>
  );
}