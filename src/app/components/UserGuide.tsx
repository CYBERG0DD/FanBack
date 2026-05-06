import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Sparkles, Send, Fingerprint, Search,
    ExternalLink, RefreshCw, Hash, Zap,
    Inbox, ShieldAlert, Cpu, Layers, Languages,
    ArrowLeft, Tag, Globe, MessageSquare,
    Clock, Eye, Shield, Star, ChevronRight, UserCircle2, ZoomIn
} from 'lucide-react';
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   KEYWORD HIGHLIGHT COMPONENT
───────────────────────────────────────────── */
function KW({ children, c = 'indigo' }: { children: React.ReactNode; c?: string }) {
    const map: Record<string, string> = {
        indigo: 'text-indigo-300  bg-indigo-500/10  border-indigo-400/30',
        orange: 'text-orange-300  bg-orange-500/10  border-orange-400/30',
        emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30',
        blue: 'text-blue-300    bg-blue-500/10    border-blue-400/30',
        purple: 'text-purple-300  bg-purple-500/10  border-purple-400/30',
        amber: 'text-amber-300   bg-amber-500/10   border-amber-400/30',
        red: 'text-red-300     bg-red-500/10     border-red-400/30',
        pink: 'text-pink-300    bg-pink-500/10    border-pink-400/30',
        cyan: 'text-cyan-300    bg-cyan-500/10    border-cyan-400/30',
    };
    return (
        <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-md border font-bold text-[0.82em] mx-0.5',
            'transition-all duration-200 hover:scale-105 hover:brightness-125 cursor-default',
            map[c] ?? map.indigo
        )}>
            {children}
        </span>
    );
}

/* ─────────────────────────────────────────────
   FEATURE DATA
───────────────────────────────────────────── */
const FEATURES = [
    {
        id: 'inbox',
        icon: Inbox,
        emoji: '📬',
        title: 'Your Clean Inbox',
        node: { bg: 'bg-orange-500', glow: '0 0 22px rgba(249,115,22,0.8)' },
        accent: { text: 'text-orange-400', border: 'border-orange-500/35', grad: 'from-orange-500/8' },
        tags: [
            { label: 'Anti-Spam', cls: 'text-orange-300  bg-orange-500/10  border-orange-400/25' },
            { label: 'Only What Matters', cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/25' },
        ],
        kidLine: "Think of this like your bedroom dresser — everything messy gets removed, and only the important stuff stays.",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                FanBack pulls <KW c="orange">only your comments</KW> from YouTube and neatly places them all in one spot.
                Spam, bots and irrelevant noise are <KW c="red">filtered</KW> —
                leaving you with a <KW c="emerald">clean inbox</KW> of real fans who actually care about your content.
            </p>
        ),
        steps: null as null,
        alert: null as null,
        navGrid: null as null,
    },
    {
        id: 'classify',
        icon: Tag,
        emoji: '🏷️',
        title: 'Smart Comment Sorting',
        node: { bg: 'bg-emerald-500', glow: '0 0 22px rgba(16,185,129,0.8)' },
        accent: { text: 'text-emerald-400', border: 'border-emerald-500/35', grad: 'from-emerald-500/8' },
        tags: [
            { label: '1-Click Sorting', cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/25' },
            { label: 'AI-Powered', cls: 'text-blue-300    bg-blue-500/10    border-blue-400/25' },
        ],
        kidLine: "Like sorting your LEGO pieces into different boxes — questions here, spam there. FanBack does it all for you instantly!",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                Press the <KW c="emerald">Classify button</KW> and FanBack's AI reads every comment and classifies them.
                Comments get categorized as <KW c="emerald">Questions</KW>, <KW c="blue">Positive</KW>, <KW c="red">Spam</KW>, or <KW c="amber">Links</KW>.
                Then use the filter tabs to focus on <KW c="indigo">only the comments that matter</KW> right now.
            </p>
        ),
        steps: null as null,
        alert: null as null,
        navGrid: null as null,
    },
    {
        id: 'integrity',
        icon: Shield,
        emoji: '🔒',
        title: 'Your Data is Always Safe',
        node: { bg: 'bg-amber-500', glow: '0 0 22px rgba(245,158,11,0.8)' },
        accent: { text: 'text-amber-400', border: 'border-amber-500/35', grad: 'from-amber-500/8' },
        tags: [],
        kidLine: "Every comment gets saved the second it shows up — nothing disappears, ever. Like a magic journal that writes itself.",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                Every comment that arrives is <KW c="amber">instantly saved</KW> and visible in the <KW c="amber">All tab</KW> — even before you classify anything.
                Think of it as a safety net underneath your inbox.
                Run <KW c="amber">Classify</KW> whenever you're ready to organize everything into neat piles.
            </p>
        ),
        steps: null as null,
        alert: null as null,
        navGrid: null as null,
    },
    {
        id: 'ai-reply',
        icon: Cpu,
        emoji: '🤖',
        title: 'AI Smart Replies',
        node: { bg: 'bg-indigo-500', glow: '0 0 22px rgba(99,102,241,0.8)' },
        accent: { text: 'text-indigo-400', border: 'border-indigo-500/35', grad: 'from-indigo-500/8' },
        tags: [
            { label: 'Tone-Aware', cls: 'text-indigo-300 bg-indigo-500/10 border-indigo-400/25' },
            { label: 'Instant Draft', cls: 'text-purple-300 bg-purple-500/10 border-purple-400/25' },
        ],
        kidLine: "Imagine a really smart helper who reads a comment and writes a perfect reply for you — but YOU decide if it goes out!",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                FanBack reads each comment's <KW c="indigo">tone and meaning</KW> and drafts a personalized reply that sounds exactly like you.
                You stay in full control — <KW c="purple">edit anything</KW> before it's sent.
                No more typing the same reply hundreds of times.
            </p>
        ),
        steps: [
            { icon: Sparkles, color: 'text-indigo-300 bg-indigo-500/12', label: 'Tap the ✨ sparkle icon on any comment to generate an AI reply draft.' },
            { icon: MessageSquare, color: 'text-white/50   bg-white/5', label: 'Click the reply box to edit and personalize the draft.' },
            { icon: Send, color: 'text-emerald-300 bg-emerald-500/12', label: 'Hit Send — your reply goes live on YouTube instantly.' },
        ],
        alert: null as null,
        navGrid: null as null,
    },
    {
        id: 'translation',
        icon: Globe,
        emoji: '🌍',
        title: 'Break the Language Barrier',
        node: { bg: 'bg-purple-500', glow: '0 0 22px rgba(168,85,247,0.8)' },
        accent: { text: 'text-purple-400', border: 'border-purple-500/35', grad: 'from-purple-500/8' },
        tags: [
            { label: 'Instant Translation', cls: 'text-purple-300 bg-purple-500/10 border-purple-400/25' },
            { label: 'Original Preserved', cls: 'text-blue-300   bg-blue-500/10   border-blue-400/25' },
        ],
        kidLine: "If a fan writes to you in French, Spanish or Korean — FanBack translates it so you always know what they said!",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                FanBack automatically <KW c="purple">detects foreign-language comments</KW> and shows a translate button right there.
                One tap and you see exactly what your fan said.
                Your <KW c="blue">global audience</KW> finally gets to feel heard — no matter what language they speak.
            </p>
        ),
        steps: null as null,
        alert: null as null,
        navGrid: null as null,
    },
    {
        id: 'mass-reply',
        icon: Layers,
        emoji: '📢',
        title: 'Mass Reply — One Message, Many Fans',
        node: { bg: 'bg-blue-500', glow: '0 0 22px rgba(59,130,246,0.8)' },
        accent: { text: 'text-blue-400', border: 'border-blue-500/35', grad: 'from-blue-500/8' },
        tags: [
            { label: 'Bulk Send', cls: 'text-blue-300   bg-blue-500/10   border-blue-400/25' },
            { label: 'Smart Delay', cls: 'text-indigo-300 bg-indigo-500/10 border-indigo-400/25' },
        ],
        kidLine: "Like texting the same message to your whole friend group at once — quick, easy, and you choose exactly what to say!",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                Select multiple comments, type <KW c="blue">one message</KW>, and FanBack delivers it to all of them.
                Perfect for quick shoutouts like <KW c="cyan">"Thanks for watching! 🙏"</KW> or <KW c="cyan">"New video dropping Friday!"</KW>.
                You write it — <KW c="blue">FanBack handles the delivery</KW>.
            </p>
        ),
        steps: [
            { icon: Eye, color: 'text-blue-300    bg-blue-500/12', label: 'Tick the checkboxes on the comments you want to reply to.' },
            { icon: MessageSquare, color: 'text-white/50    bg-white/5', label: 'The Mass Reply bar appears at the bottom — type your message there.' },
            { icon: Send, color: 'text-emerald-300 bg-emerald-500/12', label: 'Hit Send. FanBack replies to every selected comment for you.' },
        ],
        alert: (
            <div className="mt-5 flex gap-4 p-4 rounded-xl border border-blue-500/25 bg-blue-500/5">
                <Clock size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-1.5">Smart Delay — Always On</p>
                    <p className="text-sm opacity-72 leading-relaxed">
                        FanBack doesn't blast all replies at the exact same time. It staggers each one with a
                        <KW c="blue">random 2–5 second gap</KW> to mimic natural human behaviour —
                        keeping your YouTube account safe from spam detection systems and temporary ban.
                    </p>
                </div>
            </div>
        ),
        navGrid: null as null,
    },
    {
        id: 'fan-profile',
        icon: UserCircle2,
        emoji: null,
        title: 'Fan Profile Viewer',
        node: { bg: 'bg-rose-500', glow: '0 0 22px rgba(244,63,94,0.8)' },
        accent: { text: 'text-rose-400', border: 'border-rose-500/35', grad: 'from-rose-500/8' },
        tags: [
            { label: 'Profile Expand', cls: 'text-rose-300   bg-rose-500/10   border-rose-400/25' },
            { label: 'Channel Link', cls: 'text-orange-300 bg-orange-500/10 border-orange-400/25' },
        ],
        kidLine: "Like tapping on someone's face in a photo to zoom in and see them clearly — or clicking their name to visit their YouTube page!",
        body: (
            <p className="text-[0.95rem] leading-relaxed opacity-72 mb-5">
                Every comment shows the fan's <KW c="rose">profile picture</KW> and <KW c="orange">username</KW> right next to what they wrote.
                These aren't just decorative — both are <KW c="rose">fully interactive</KW> and give you two different ways to learn more about who's engaging with your content.
            </p>
        ),
        steps: [
            { icon: ZoomIn, color: 'text-rose-300   bg-rose-500/12', label: "Click the profile picture — it expands into a full-size overlay so you can see your fan's avatar clearly." },
            { icon: ExternalLink, color: 'text-orange-300 bg-orange-500/12', label: "Click the fan's username — it opens their YouTube channel page directly in a new tab." },
        ],
        alert: null as null,
        navGrid: null as null,
    },
    {
        id: 'navigation',
        icon: Fingerprint,
        emoji: '🎮',
        title: 'Navigating the Dashboard',
        node: { bg: 'bg-pink-500', glow: '0 0 22px rgba(236,72,153,0.8)' },
        accent: { text: 'text-pink-400', border: 'border-pink-500/35', grad: 'from-pink-500/8' },
        tags: [],
        kidLine: "These are the secret power-ups hidden inside FanBack. Once you know them, using the dashboard feels like having a superpower!",
        body: null as null,
        steps: null as null,
        alert: null as null,
        navGrid: [
            { icon: Search, color: 'text-pink-400', title: 'Stealth HUD', desc: 'Long-press any filter tab to see a hidden description of what it does.' },
            { icon: ExternalLink, color: 'text-indigo-400', title: 'Watch Directly', desc: 'Click the play button on any video on the dashboard to watch that video inside FanBack.' },
            { icon: RefreshCw, color: 'text-blue-400', title: 'Batch Syncing', desc: 'FanBack loads comments in groups of 50 to keep everything fast and smooth.' },
            { icon: Hash, color: 'text-emerald-400', title: 'Exact Numbers', desc: 'Toggle Full Stats to see exact counts instead of rounded numbers like "1.2K".' },
        ],
    },
];


/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function UserGuidePage() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── Back navigation ──
       navigate(-1) goes to the previous history entry if it exists.
       If history stack is too shallow (e.g. user opened this page directly),
       fall back to /dashboard so they're never stranded.                    */
    const handleBack = () => {
        navigate(-1);
    };

    /* ── Styles + GSAP ── */
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'ugp-styles';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Satoshi:wght@400;500;600;700&display=swap');

            .ugp-root    { font-family: 'Satoshi', sans-serif; }
            .ugp-display { font-family: 'Clash Display', sans-serif; }

            @keyframes ugp-float {
                0%,100% { transform: translateY(0px)   translateX(0px); }
                33%      { transform: translateY(-18px) translateX(9px); }
                66%      { transform: translateY(9px)  translateX(-7px); }
            }
            @keyframes ugp-shimmer {
                0%   { background-position: -300% center; }
                100% { background-position:  300% center; }
            }
            @keyframes ugp-glow-pulse {
                0%,100% { opacity:.55; transform:scale(1);    }
                50%      { opacity:1;   transform:scale(1.18); }
            }
            @keyframes ugp-scan {
                0%   { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
            @keyframes ugp-bounce-soft {
                0%,100% { transform: translateY(0px); }
                50%      { transform: translateY(-5px); }
            }

            .ugp-shimmer-text {
                background: linear-gradient(90deg, #818cf8, #c084fc, #60a5fa, #818cf8);
                background-size: 300% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: ugp-shimmer 5s linear infinite;
            }
            .ugp-particle {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                animation: ugp-float var(--dur, 8s) ease-in-out infinite var(--delay, 0s);
            }
            .ugp-node-pulse {
                animation: ugp-glow-pulse 2.8s ease-in-out infinite;
            }
            .ugp-card {
                transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease;
            }
            .ugp-card:hover { transform: translateY(-5px); }

            .ugp-step {
                transition: transform .25s ease, background .25s ease;
            }
            .ugp-step:hover { transform: translateX(7px); background: rgba(255,255,255,0.04); }

            .ugp-nav-item {
                transition: transform .3s ease, border-color .3s ease, background .3s ease;
            }
            .ugp-nav-item:hover {
                transform: translateY(-3px);
                border-color: rgba(255,255,255,0.18);
                background: rgba(255,255,255,0.05);
            }
            .ugp-kid-badge {
                animation: ugp-bounce-soft 4s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);

        const ctx = gsap.context(() => {
            /* Hero entrance */
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo('.ugp-hero-bar',
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: .9, ease: 'power4.inOut' })
                .fromTo('.ugp-hero-icon',
                    { opacity: 0, scale: .5, rotation: -20 },
                    { opacity: 1, scale: 1, rotation: 0, duration: .7 }, '-=.2')
                .fromTo('.ugp-hero-title',
                    { opacity: 0, y: 50, skewX: -4 },
                    { opacity: 1, y: 0, skewX: 0, duration: .8 }, '-=.4')
                .fromTo('.ugp-hero-sub',
                    { opacity: 0, y: 25 },
                    { opacity: 1, y: 0, duration: .65 }, '-=.35')
                .fromTo('.ugp-hero-badge',
                    { opacity: 0, x: -15 },
                    { opacity: 1, x: 0, duration: .5, stagger: .08 }, '-=.3');

            /* Section reveals */
            gsap.utils.toArray<Element>('.ugp-section').forEach((el) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 55, scale: .97 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: .85, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 83%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            });

            /* Nav grid stagger */
            gsap.utils.toArray<Element>('.ugp-nav-item').forEach((el, i) => {
                gsap.fromTo(el,
                    { opacity: 0, scale: .75, rotation: -6 },
                    {
                        opacity: 1, scale: 1, rotation: 0, duration: .45, delay: i * .09,
                        ease: 'back.out(1.8)',
                        scrollTrigger: { trigger: el, start: 'top 90%' }
                    }
                );
            });

            /* Timeline line scrub */
            gsap.fromTo('.ugp-timeline-line',
                { scaleY: 0, transformOrigin: 'top center' },
                {
                    scaleY: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: '.ugp-timeline-wrap',
                        start: 'top 65%', end: 'bottom 30%',
                        scrub: 1.2,
                    }
                }
            );
        }, containerRef);

        return () => {
            ctx.revert();
            document.getElementById('ugp-styles')?.remove();
        };
    }, []);

    /* ── Particles ── */
    const COLORS = ['#818cf8', '#60a5fa', '#a78bfa', '#34d399', '#f59e0b', '#f472b6'];
    const particles = Array.from({ length: 28 }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        size: Math.random() * 3 + 2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        dur: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.35 + 0.08,
    }));

    return (
        <div ref={containerRef} className="ugp-root min-h-screen bg-[#050508] text-white overflow-x-hidden relative">

            {/* ── Particles ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="ugp-particle"
                        style={{
                            width: p.size,
                            height: p.size,
                            top: `${p.top}%`,
                            left: `${p.left}%`,
                            background: p.color,
                            opacity: p.opacity,
                            '--dur': `${p.dur}s`,
                            '--delay': `${p.delay}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* ── Ambient glows ── */}
            <div className="fixed top-[-25%] left-[-15%]  w-[65%] h-[65%] bg-indigo-600/7 blur-[180px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-25%] right-[-15%] w-[55%] h-[55%] bg-blue-500/5  blur-[160px] rounded-full pointer-events-none z-0" />
            <div className="fixed top-[35%] right-0          w-[35%] h-[45%] bg-purple-600/4 blur-[140px] rounded-full pointer-events-none z-0" />

            {/* ── Scan-line ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.012]" aria-hidden="true">
                <div className="w-full h-[2px] bg-white" style={{ animation: 'ugp-scan 10s linear infinite' }} />
            </div>

            {/* ════════════════ CONTENT ════════════════ */}
            <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-12 lg:px-16 py-10">

                {/* ── Back button ── */}
                <button
                    type="button"
                    onClick={handleBack}
                    className="group flex items-center gap-2.5 text-sm font-semibold opacity-45 hover:opacity-100 transition-all duration-300 mb-16"
                >
                    <span className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-400/40 group-hover:bg-indigo-500/10 group-hover:-translate-x-1 transition-all duration-300 flex items-center justify-center">
                        <ArrowLeft size={15} />
                    </span>
                    Go Back
                </button>

                {/* ════════ HERO ════════ */}
                <header className="mb-24 pb-14 border-b border-white/[0.055] relative">
                    {/* Animated scan bar */}
                    <div className="ugp-hero-bar h-[2px] w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-400 mb-12 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />

                    <div className="flex items-start gap-5 mb-7">
                        {/* Icon */}
                        <div className="ugp-hero-icon relative flex-shrink-0">
                            <div className="w-[72px] h-[72px] rounded-3xl bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.18)]">
                                <Zap size={32} className="text-indigo-300" />
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.9)]">
                                <Star size={10} className="fill-white text-white" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="ugp-hero-badge text-[10px] font-black uppercase tracking-[.28em] text-indigo-400/70 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20">
                                    User Guide
                                </span>
                                <span className="ugp-hero-badge text-[10px] opacity-25 font-bold">v2.0</span>
                            </div>
                            <h1 className="ugp-display ugp-hero-title text-5xl md:text-[4.5rem] font-bold leading-none tracking-tight mb-2">
                                Fan<span className="ugp-shimmer-text">Back</span>
                            </h1>
                            <p className="ugp-display ugp-hero-title text-2xl md:text-3xl font-semibold opacity-30 tracking-tight">
                                Mastery Guide
                            </p>
                        </div>
                    </div>

                    <p className="ugp-hero-sub text-lg font-medium opacity-50 max-w-xl leading-relaxed">
                        Every feature explained simply —
                        <span className="text-indigo-300 opacity-100 font-semibold"> anyone can read this and understand</span>.
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2.5 mt-7">
                        {['8 Features', 'AI-Powered', 'For Creators', 'Always Free'].map((b, i) => (
                            <span key={i} className="ugp-hero-badge flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.035] border border-white/[0.07] opacity-60 hover:opacity-100 transition-opacity cursor-default">
                                <ChevronRight size={11} className="text-indigo-400" />
                                {b}
                            </span>
                        ))}
                    </div>
                </header>

                {/* ════════ TIMELINE ════════ */}
                <div className="ugp-timeline-wrap relative pl-5 md:pl-0 space-y-[5.5rem]">

                    {/* Vertical line */}
                    <div className="ugp-timeline-line absolute left-[9px] md:left-[43px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/55 via-purple-500/25 via-blue-400/15 to-transparent" />

                    {FEATURES.map((feat, idx) => {
                        const Icon = feat.icon;
                        return (
                            <section key={feat.id} className="ugp-section relative md:pl-28">

                                {/* Timeline node */}
                                <div
                                    className={cn('ugp-node-pulse absolute left-[-7px] md:left-[37px] top-[18px] w-[18px] h-[18px] rounded-full z-10 flex items-center justify-center', feat.node.bg)}
                                    style={{ boxShadow: feat.node.glow }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-white/85" />
                                </div>

                                {/* Index number */}
                                <div className="absolute left-[-38px] md:left-[16px] top-[17px] text-[9px] font-black tracking-widest opacity-15 select-none tabular-nums">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>

                                {/* ── Card ── */}
                                <div className={cn(
                                    'ugp-card rounded-2xl border p-6 md:p-8',
                                    'bg-gradient-to-br to-transparent', feat.accent.grad,
                                    feat.accent.border,
                                    'bg-[#0b0b10]/85 backdrop-blur-sm',
                                    'shadow-[0_6px_48px_rgba(0,0,0,0.5)]',
                                )}>

                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 bg-white/[0.025]', feat.accent.border)}>
                                            <Icon size={22} className={feat.accent.text} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                                <h2 className="ugp-display text-xl md:text-2xl font-semibold leading-tight">{feat.title}</h2>
                                                <span className="text-2xl leading-none">{feat.emoji}</span>
                                            </div>
                                            {feat.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                    {feat.tags.map((t, ti) => (
                                                        <span key={ti} className={cn('text-[11px] font-bold px-2.5 py-0.5 rounded-full border', t.cls)}>
                                                            {t.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Kid-friendly callout */}
                                    <div className="ugp-kid-badge flex items-start gap-3 bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3 mb-5">
                                        <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
                                        <p className="text-sm font-semibold opacity-75 leading-snug italic">{feat.kidLine}</p>
                                    </div>

                                    {/* Body */}
                                    {feat.body}

                                    {/* Steps */}
                                    {feat.steps && (
                                        <div className="space-y-2.5 mt-2">
                                            {feat.steps.map((step, si) => {
                                                const SIcon = step.icon;
                                                return (
                                                    <div key={si} className="ugp-step flex items-center gap-3.5 px-4 py-3 rounded-xl border border-white/[0.05] cursor-default">
                                                        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', step.color)}>
                                                            <SIcon size={16} />
                                                        </div>
                                                        <span className="text-[11px] font-black text-white/20 tabular-nums flex-shrink-0">
                                                            {String(si + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className="text-sm font-medium opacity-78">{step.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Alert */}
                                    {feat.alert}

                                    {/* Nav grid */}
                                    {feat.navGrid && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            {feat.navGrid.map((item, ni) => {
                                                const NIcon = item.icon;
                                                return (
                                                    <div key={ni} className="ugp-nav-item flex items-start gap-3 p-4 rounded-xl bg-white/[0.025] border border-white/[0.055] cursor-default">
                                                        <NIcon size={17} className={cn(item.color, 'flex-shrink-0 mt-0.5')} />
                                                        <div>
                                                            <h5 className="font-bold text-sm mb-0.5">{item.title}</h5>
                                                            <p className="text-xs opacity-55 leading-relaxed">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* ── Footer ── */}
                <footer className="ugp-section mt-28 pb-14 text-center">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent mb-10" />
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/8 border border-indigo-400/20 flex items-center justify-center mx-auto mb-3">
                        <Zap size={20} className="text-indigo-300" />
                    </div>
                    <p className="ugp-display font-semibold text-base opacity-20 tracking-wide">End of Documentation</p>
                    <p className="text-xs opacity-12 mt-1.5">FanBack · Built for Creators</p>
                </footer>
            </div>
        </div>
    );
}