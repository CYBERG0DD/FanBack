import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../../lib/supabase';

import {
  Plus, Search, Filter, ArrowDownLeft, ArrowUpRight, Loader2,
  Video, Lock, Sun, Moon, Menu, X, LayoutDashboard, ExternalLink,
  CreditCard, Sparkles, LogOut, Bell, RefreshCw, Home, MessageSquare, Settings,
  CheckCircle2, Hash, PlaySquare, Eye, ThumbsUp, ThumbsDown,
  BadgeCheck, Send, MoreVertical, Trash, EyeOff, Pin,
  CheckSquare, AlertTriangle, Share2, ArrowDownToLine, 
  ArrowUpFromLine, Play, BarChart3, Languages
} from "lucide-react";

import { motion, AnimatePresence, animate } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── NEW: ANIMATED STAT COMPONENT ───
export function AnimatedStat({ value, isShort }: { value: number, isShort: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevIsShort = useRef(isShort);
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);


  useEffect(() => {
    if (prevIsShort.current !== isShort) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });

      // Update the memory to match the new state
      prevIsShort.current = isShort;

      return () => controls.stop();
    }
  }, [isShort, value]);

  const formatted = isShort
    ? Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(displayValue)
    : displayValue.toLocaleString('en-US');

  return <>{formatted}</>;
}

export function CyclingLoadingText({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="h-12 sm:h-8 overflow-hidden relative w-full flex justify-center mt-2 px-4">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-bold dark:text-slate-400 text-slate-500 tracking-widest uppercase absolute text-center w-full"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}


// ⏱ UTILITY: Converts timestamps to relative "Time Ago" strings
function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `just now`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;

  const years = Math.floor(days / 365);
  return `${years} yr${years === 1 ? '' : 's'} ago`;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getHighResAvatar = (url: string) => {
  if (!url) return "";

  if (!url.includes('googleusercontent.com') && !url.includes('ggpht.com')) return url;

  return url.replace(/(=s)\d+/, "$1400");
};

// ─── SECTION 2: ASSET CONSTANTS ────────────────────────────────────────────────
const SOCIAL_ICONS = {
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  twitter: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  tiktok: 'M12.525 0.02c1.31-0.032 2.612 0.016 3.916-0.013 0.117 1.41 0.69 2.757 1.63 3.768 0.93 1.001 2.213 1.65 3.585 1.832v3.664c-1.783-0.06-3.493-0.726-4.85-1.892v6.2c-0.06 3.957-3.268 7.353-7.225 7.353a7.352 7.352 0 0 1-7.353-7.353A7.352 7.352 0 0 1 9.58 6.223c0.31-0.005 0.62-0.005 0.93 0v3.702a3.645 3.645 0 0 0-2.457 3.428 3.642 3.642 0 0 0 3.643 3.643 3.642 3.642 0 0 0 3.642-3.643V0l-2.813 0.02z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
};

interface UserProfile {
  id: string;
  is_premium: boolean;
  replies_used_today: number;
  last_reply_date: string;
  username?: string; // Add any other fields you have in Supabase
}

export function Dashboard() {
  const navigate = useNavigate();
  const filterRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // ─── SECTION 3: CORE STATE ──────────────────────────────────────────────────
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [dashboardFullNumbers, setDashboardFullNumbers] = useState(false); // Controls the delayed animation

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isLoadingMoreVideos, setIsLoadingMoreVideos] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const [massReplyProgress, setMassReplyProgress] = useState<{ current: number; total: number } | null>(null);
  const abortMassReplyRef = useRef(false);

  const [deleteTarget, setDeleteTarget] = useState<{ ytId: string; dbId: string } | null>(null);

  const [zoomedUser, setZoomedUser] = useState<{ avatar: string, name: string } | null>(null);
  const [zoomFailed, setZoomFailed] = useState(false);


  const [activePlatform, setActivePlatform] = useState<'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'facebook'>('youtube');
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);

  const [videoPageToken, setVideoPageToken] = useState<string>(() => {
    return localStorage.getItem("fanback-yt-token") || '';
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    return localStorage.getItem("fanback-last-sync") || null;
  });

  const markAsSynced = () => {
    const now = new Date().toISOString();
    setLastUpdated(now);
    localStorage.setItem("fanback-last-sync", now);
  };

  const [theme, setTheme] = useState<'light' | 'black' | 'charcoal'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("fanback-theme");
      return (saved as 'light' | 'black' | 'charcoal') || 'black';
    }
    return 'black';
  });

  const [isPremium, setIsPremium] = useState(false);
  const [showFullNumbers, setShowFullNumbers] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'comments' | 'settings' | 'analysis'>('home');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);


  // ─── SECTION 4: DATA STATES ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isClassifyingAll, setIsClassifyingAll] = useState(false);
  const [classificationProgress, setClassificationProgress] = useState(0);

  const abortClassificationRef = useRef(false);

  const [classifyEta, setClassifyEta] = useState<string | null>(null);
  const [classifyJobId, setClassifyJobId] = useState<string | null>(null);
  const classifyPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [stats, setStats] = useState({
    subs: 0,
    following: 0,
    totalVideos: 0,
    total: 0,
    replied: 0,
    pending: 0,
    channelName: "",
    channelAvatar: "",
    channelId: ""
  });

  const [activity, setActivity] = useState({ receivedToday: 0, sentToday: 0 });
  const [gamification, setGamification] = useState({ streakDays: 0, dailyGoal: 50, dailyDone: 0 });
  const [videos, setVideos] = useState<any[]>([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<string | null>(null);
  const [isFetchingMoreComments, setIsFetchingMoreComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  // COMMENT ENGINE STATES
  const [activeComments, setActiveComments] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<{ [key: string]: string }>({});
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'replied' | 'replied_back' | 'questions' | 'links' | 'verified' | 'negative' | 'spam' | 'newbie' | 'birthday'>('all');

  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  // 🌍 TRANSLATION STATES (Paste these here!)
  const [translations, setTranslations] = useState<{ [key: string]: { text: string; language: string } }>({});
  const [showTranslation, setShowTranslation] = useState<{ [key: string]: boolean }>({});
  const [isTranslating, setIsTranslating] = useState<string | null>(null);

  // ─── SWIPE GESTURE STATES ───
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 75; // Minimum pixels to count as a swipe

    // Ignore swipes if the user is scrolling a horizontal slider, filter pills, or typing in a textarea
    if ((e.target as HTMLElement).closest('.overflow-x-auto, .hide-scrollbar, textarea')) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    const tabs: ('home' | 'comments' | 'analysis' | 'settings')[] = ['home', 'comments', 'analysis', 'settings'];
    const currentIndex = tabs.indexOf(activeTab);

    if (distance > minSwipeDistance) {
      // Swipe Left -> Go to Next Tab
      if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
    } else if (distance < -minSwipeDistance) {
      // Swipe Right -> Go to Previous Tab
      if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };


  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // --- LONG PRESS TOOLTIP STATE ---
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTooltipPressStart = (filterId: string) => {
    tooltipTimerRef.current = setTimeout(() => {
      setActiveTooltip(filterId);
      // Native vibration feedback for mobile!
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTooltipPressEnd = () => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setActiveTooltip(null);
  };

  const commentsCache = useRef<{ [videoId: string]: any[] }>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // NEW STATES: For Notifications and Kebab Menu
  const [showNotifications, setShowNotifications] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [newSubscribers, setNewSubscribers] = useState(0);

  // ─── SECTION 5: UTILITY FUNCTIONS ───────────────────────────────────────────
  // 1. Add 'warning' to the type list
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });

    // Warnings should probably stay a bit longer so people read the safety info
    const stayTime = type === 'warning' ? 5000 : (type === 'error' ? 6000 : 4000);

    setTimeout(() => setNotification(null), stayTime);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'black' : theme === 'black' ? 'charcoal' : 'light';
    setTheme(nextTheme);
    localStorage.setItem("fanback-theme", nextTheme);
  };

  const toggleNumberFormat = async () => {
    const newPref = !showFullNumbers;
    setShowFullNumbers(newPref);
    const { error } = await supabase.from('profiles').update({ show_full_numbers: newPref }).eq('id', user.id);
    if (error) { showToast("Error saving preference", "error"); setShowFullNumbers(!newPref); }
    else { showToast(`Showing ${newPref ? 'full' : 'short'} numbers`, "success"); }
  };
  // 🔥 THE LIVE YOUTUBE LIKING ENGINE
  const handleRateComment = async (commentId: string, rating: 'like' | 'dislike' | 'none') => {
    try {
      const oldRating = activeComments.find(c => c.youtube_comment_id === commentId)?.viewer_rating;

      // 1. Update the UI instantly so the button changes color
      setActiveComments(prev => prev.map(c =>
        c.youtube_comment_id === commentId ? { ...c, viewer_rating: rating } : c
      ));

      await supabase.from('comments').update({ viewer_rating: rating }).eq('youtube_comment_id', commentId);

      if (rating === 'like') {
        showToast("Comment liked! but only in the app. YouTube API does not support liking a comment", "success");
      } else if (rating === 'dislike') {
        showToast("Comment disliked! but only in the app. YouTube API does not support disliking a comment", "success");
      } else if (rating === 'none') {
        if (oldRating === 'like') showToast("You unliked this", "success");
        else if (oldRating === 'dislike') showToast("You undisliked this", "success");
        else showToast("Rating removed", "success");
      }
    } catch (err: any) {
      console.error("Rating Error:", err);
      showToast("Database error: " + err.message, "error");
    }
  };

  // 🧠 THE AI GENERATION ENGINE
  const handleGenerateAI = async (commentId: string, commentText: string, videoTitle: string) => {
      try {
      setIsGeneratingAI(commentId);

      // 1. Send the data to your live Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-ai-reply', {
        body: { commentText, videoTitle },
      });

      if (error) throw error;

      if (data && data.reply) {
        // 2. Drop the generated text directly into the draft box
        setDrafts(prev => ({ ...prev, [commentId]: data.reply }));
        
        // Optional: Update the comment with the AI's classification tags instantly
        if (data.tags && data.tags.length > 0) {
          setActiveComments(prev => prev.map(c =>
            c.id === commentId ? { ...c, ai_tags: data.tags } : c
          ));
        }
        
        showToast("AI generated a reply!", "success");
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      showToast("AI failed to think: " + err.message, "error");
    } finally {
      setIsGeneratingAI(null);
    }
  };

  // 🌍 THE INBOUND TRANSLATION ENGINE (Fan to Creator)
  const handleTranslateComment = async (commentId: string, text: string) => {
    // If we already translated it, just toggle the view back and forth
    if (translations[commentId]) {
      setShowTranslation(prev => ({ ...prev, [commentId]: !prev[commentId] }));
      setOpenMenuId(null);
      return;
    }

    setIsTranslating(commentId);
    try {
      // 1. Send the original foreign text to your Edge Function
      const { data, error } = await supabase.functions.invoke('generate-ai-reply', {
        body: {
          commentText: text,
          action: 'translate-inbound' // Tells the Edge Function to just translate to English
        },
      });

      if (error) throw error;

      if (data && data.translation) {
        // 2. Save the English translation AND the detected language to state
        setTranslations(prev => ({
          ...prev,
          [commentId]: {
            text: data.translation,
            language: data.sourceLanguage || "Original"
          }
        }));
        setShowTranslation(prev => ({ ...prev, [commentId]: true }));
        showToast("Translation complete!", "success");
      }
    } catch (err: any) {
      console.error("Translation Error:", err);
      showToast("Failed to translate comment.", "error");
    } finally {
      setIsTranslating(null);
      setOpenMenuId(null);
    }
  };

  function getClassifyEta(count: number): string {
    const batches = Math.ceil(count / 30);
    const estimatedSeconds = batches * 8;
    if (estimatedSeconds < 60) return `~${estimatedSeconds} seconds`;
    const mins = Math.ceil(estimatedSeconds / 60);
    return `~${mins} minute${mins > 1 ? 's' : ''}`;
  }

  // 🏷️ THE BATCH CLASSIFICATION ENGINE
  const handleClassifyComments = async () => {
  const targetComments = selectedComments.length > 0
    ? activeComments.filter(c => selectedComments.includes(c.id))
    : activeComments.filter(c => !c.ai_tags || c.ai_tags.length === 0);

  const commentIds = targetComments.map(c => c.id);

  if (commentIds.length === 0) {
    showToast("All comments are already classified!", "warning");
    return;
  }

  const eta = getClassifyEta(commentIds.length);
  const batches = Math.ceil(commentIds.length / 30);

  showToast(
    `Classifying ${commentIds.length} comments in ${batches} batch${batches > 1 ? 'es' : ''}. Estimated time: ${eta}. You can safely close this tab.`,
    "warning"
  );

  setIsClassifyingAll(true);
  setClassificationProgress(1);
  abortClassificationRef.current = false;

  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  setClassifyJobId(jobId);

  try {
    const { data, error } = await supabase.functions.invoke('classify-comment', {
      body: { commentIds, jobId },
    });

    if (error) throw error;

    if (classifyPollRef.current) clearInterval(classifyPollRef.current);

    classifyPollRef.current = setInterval(async () => {
      if (abortClassificationRef.current) {
        clearInterval(classifyPollRef.current!);
        classifyPollRef.current = null;
        return;
      }

      const { data: job } = await supabase
        .from('classification_jobs')
        .select('status, processed, total')
        .eq('id', jobId)
        .single();

      if (!job) return;

      const pct = Math.round((job.processed / job.total) * 100);
      setClassificationProgress(Math.max(pct, 1));

      if (job.status === 'done' || job.status === 'partial') {
        clearInterval(classifyPollRef.current!);
        classifyPollRef.current = null;

        if (data?.tagsMap && Object.keys(data.tagsMap).length > 0) {
          setActiveComments(prev =>
            prev.map(c => {
              const newTags = data.tagsMap[c.id];
              return newTags !== undefined ? { ...c, ai_tags: newTags } : c;
            })
          );
        }

        setSelectedComments([]);
        setIsClassifyingAll(false);
        setTimeout(() => setClassificationProgress(0), 2000);
        setClassifyJobId(null);

        if (job.status === 'partial') {
          showToast(`Classification complete with some errors. ${job.processed} of ${job.total} comments sorted.`, "warning");
        } else {
          showToast(`Done! ${job.processed} comments classified successfully.`, "success");
        }
      }
    }, 2500);

  } catch (err: any) {
    console.error("Classification Error:", err);
    showToast("Classification failed: " + err.message, "error");
    setIsClassifyingAll(false);
    setClassificationProgress(0);
    setClassifyJobId(null);

    if (classifyPollRef.current) {
      clearInterval(classifyPollRef.current);
      classifyPollRef.current = null;
    }
  }
};

  const handleCancelClassification = () => {
    abortClassificationRef.current = true;

    if (classifyPollRef.current) {
      clearInterval(classifyPollRef.current);
      classifyPollRef.current = null;
    }

    setIsClassifyingAll(false);
    setClassificationProgress(0);
    setClassifyJobId(null);

    showToast("Classification cancelled by the user. Comments processed and classified so far have been saved.", "warning");
  };

  // THE OPTIMISTIC YOUTUBE REPLY ENGINE
  async function handleSendReply(commentId: string, replyText: string, skipRefresh = false) {
    if (!replyText.trim()) { showToast("Nope. Please type in a message first", "error"); return false; }

    const isEditing = !!editingCommentId;
    const currentUsage = gamification.dailyDone || 0;

    if (!isPremium && !isEditing && currentUsage >= gamification.dailyGoal) {
      setIsUpgradeModalOpen(true);
      return false;
    }

    // ─── 🚀 NEW: OUTBOUND TRANSLATION INTERCEPTOR ───
    let finalReplyTextToPost = replyText;

    // Check if we previously translated this comment (meaning it's foreign)
    // We find the db internal ID to check our translations state
    const internalComment = activeComments.find(c => c.youtube_comment_id === commentId);

    if (internalComment && internalComment.language !== 'en') {

      // 1. Convert the 2-letter code (e.g., 'es') into a full name (e.g., 'Spanish')
      let languageName = "their native language"; // A safe fallback just in case
      try {
        const languageTranslator = new Intl.DisplayNames(['en'], { type: 'language' });
        // This turns "es" -> "Spanish", "ko" -> "Korean", "sw" -> "Swahili"
        languageName = languageTranslator.of(internalComment.language) || internalComment.language;
      } catch (e) {
        // If the AI somehow hallucinates a weird code that breaks the translator
        console.warn("Could not parse language code", e);
      }

      // 2. Inject the dynamic name into your toast!
      showToast(`Translating message to ${languageName}...`, "warning");

      try {
        const { data, error } = await supabase.functions.invoke('generate-ai-reply', {
          body: {
            commentText: internalComment.comment_text,
            draftText: replyText,
            action: 'translate-outbound'
          },
        });

        if (error) throw error;
        if (data && data.translation) {
          finalReplyTextToPost = data.translation;
        }
      } catch (err) {
        console.error("Outbound Translation Failed:", err);
        // Silent fail — just post in English if translation fails
      }
    }

    // 1. SNAPSHOT PREVIOUS STATE (For rollback if the API fails)
    const previousComments = [...activeComments];
    const previousGamification = { ...gamification };

    // 2. OPTIMISTIC UI UPDATE (Instantaneous visual feedback!)
    setActiveComments(prev => prev.map(c =>
      c.youtube_comment_id === commentId
        ? {
          ...c,
          status: 'replied',
          reply_text: finalReplyTextToPost, // Display the translated text
          replied_at: new Date().toISOString(),
          ...(isEditing && { is_edited: true })
        }
        : c
    ));

    setEditingCommentId(null);
    showToast(isEditing ? "Reply updated on YouTube!" : "Reply posted!", "success");

    // Optimistically update the daily quota wheel
    if (!isEditing) {
      setGamification(prev => ({ ...prev, dailyDone: prev.dailyDone + 1 }));
    }

    // 3. BACKGROUND PROCESSING (API calls happen quietly while the user keeps working)
    try {
      const token = await getFreshYouTubeToken();
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!token || !userId) {
        throw new Error("Session expired. Please sign in again.");
      }

      const targetReplyId = isEditing
        ? previousComments.find(c => c.youtube_comment_id === commentId)?.youtube_reply_id
        : null;

      if (isEditing && !targetReplyId) {
        throw new Error("Cannot edit: YouTube Reply ID is missing. Try replying to a new comment.");
      }

      const url = `https://www.googleapis.com/youtube/v3/comments?part=snippet`;
      const requestBody = isEditing
        ? { id: targetReplyId, snippet: { textOriginal: finalReplyTextToPost } }
        : { snippet: { parentId: commentId, textOriginal: finalReplyTextToPost } };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'signal' in controller ? 'POST' : 'POST', // fallback for old browsers
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      clearTimeout(timeoutId);
      if (response.status === 401) {
        throw new Error("Session expired"); 
      }
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      // Silently save to Database
      const { error: commentUpdateError } = await supabase.from('comments').update({
        status: 'replied',
        reply_text: finalReplyTextToPost, // Save translated text to DB
        replied_at: new Date().toISOString(),
        youtube_reply_id: data.id,
        ...(isEditing && { is_edited: true })
      }).eq('youtube_comment_id', commentId);

      if (commentUpdateError) console.error("DB SAVE FAILED:", commentUpdateError);

      if (!isEditing) {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: latestProfile } = await supabase.from('profiles').select('replies_used_today, last_reply_date').eq('id', userId).single();

        const trueCurrentUsage = latestProfile?.last_reply_date === todayStr ? (latestProfile?.replies_used_today || 0) : 0;

        await supabase.from('profiles').update({
          replies_used_today: trueCurrentUsage + 1,
          last_reply_date: todayStr
        }).eq('id', userId);
      }

      setActiveComments(prev => prev.map(c =>
        c.youtube_comment_id === commentId ? { ...c, youtube_reply_id: isEditing ? targetReplyId : data.id } : c
      ));

      if (!isEditing && userId && !skipRefresh) {
        fetchDashboardData(userId); // Fire and forget background data sync
      }

      return true;

    } catch (err: any) {
      setActiveComments(previousComments);
      setGamification(previousGamification);

      showToast(err.message || "Failed to post. Network error.", "error");

      if (err.message.includes("Session expired")) {
        setIsSessionExpired(true);
      }
      return false;
    }
  }


  // ─── SESSION HELPERS ────────────────────────────────────────────────────
  async function getFreshSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {

      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed.session) {
        setIsSessionExpired(true);
        return null;
      }
      return refreshed.session;
    }

    // Check expiry of the existing session
    const expiresAt = session.expires_at || 0;
    const now = Math.floor(Date.now() / 1000);

    if (expiresAt - now < 300) {
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed.session) {
        setIsSessionExpired(true);
        return null;
      }
      return refreshed.session;
    }

    return session;
  }

 async function getFreshYouTubeToken(): Promise<string | null> {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    setIsSessionExpired(true);
    return null;
  }

  const expiresAt = session.expires_at || 0;
  const now = Math.floor(Date.now() / 1000);
  const fiveMinutes = 300;

  // If the session is about to expire or already expired, refresh it
  if (expiresAt - now < fiveMinutes) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !refreshed.session) {
      setIsSessionExpired(true);
      return null;
    }

    return refreshed.session.provider_token ?? null;
  }

  return session.provider_token ?? null;
}

  // ─── SECTION 6: THE YOUTUBE API SYNC ENGINE ───────────────────────────
  async function syncYouTubeData(userId: string, isAutoSync = false) {

    if (!isAutoSync) setIsSyncing(true);

    try {
      const token = await getFreshYouTubeToken();

      if (!token) {
        if (!isAutoSync) setIsSyncing(false);
        setIsSessionExpired(true);
        if (!isAutoSync) showToast("Session expired. Please log out and log back in.", "error");
        return;
      }

      // 1. Check if we have the channel ID in our DB
      let { data: channelData } = await supabase.from('channels')
        .select('id, channel_id')
        .eq('user_id', userId)
        .single();

      const { data: channelCheck } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', userId)
        .single();
      console.log('📦 Channel in DB before sync:', channelCheck);

      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

      // 2. THE AUTO-LINKER: Initial link if record is missing
      if (!channelData) {
        showToast("First time sync: Linking your channel...", "warning");
        const ytChannelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true&key=${API_KEY}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const ytChannelData = await ytChannelRes.json();

        if (!ytChannelData.items || ytChannelData.items.length === 0) {
          throw new Error("No YouTube channel found for this Google account. Want to link another platform? Upgrade to pro");
        }

        const channel = ytChannelData.items[0];

        const { data: newChannel, error: insertError } = await supabase
          .from('channels')
          .upsert({
            user_id: userId,
            channel_id: channel.id.trim(),
            channel_name: channel.snippet.title,
            thumbnail_url: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
            subscriber_count: Number(channel.statistics.subscriberCount || 0),
            platform: 'youtube'
          }, {
            onConflict: 'channel_id'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        channelData = newChannel;
      }

      if (!channelData) throw new Error("Failed to link YouTube channel.");

      // 3. Get fresh Channel Stats & Name FROM YOUTUBE
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelData.channel_id}&part=contentDetails,snippet,statistics`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const channelApiData = await channelRes.json();

      if (!channelApiData.items || channelApiData.items.length === 0) {
        showToast("Could not verify channel details.", "warning");
        setIsSyncing(false);
        return;
      }

      const channel = channelApiData.items[0];

      const rawSubCount = channel.statistics?.subscriberCount;
      const safeSubCount = parseInt(rawSubCount, 10) || 0;

      const rawVideoCount = channel.statistics?.videoCount;
      const safeVideoCount = parseInt(rawVideoCount, 10) || 0;

      let safeFollowingCount = 0;
      try {
        const followingRes = await fetch(
          `https://www.googleapis.com/youtube/v3/subscriptions?part=id&mine=true&maxResults=1&key=${API_KEY}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const followingData = await followingRes.json();
        // The API returns the total count inside pageInfo
        safeFollowingCount = followingData.pageInfo?.totalResults || 0;
      } catch (err) {
        console.error("Failed to fetch following count:", err);
      }

      const { error: patchError } = await supabase.from('channels').update({
        channel_name: channel.snippet.title,
        thumbnail_url: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
        subscriber_count: safeSubCount,
        total_videos: safeVideoCount,
        following_count: safeFollowingCount
      }).eq('channel_id', channelData.channel_id.trim());

      if (patchError) {
        console.error("PATCH Update Failed:", patchError);
        throw patchError;
      }
      // 4. Get the Uploads Playlist ID
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

      // 5. Fetch the videos
      const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=50`);
      const playlistData = await playlistRes.json();

      // THE SAFETY GATE (Now it's safe to exit here)
      if (playlistData.error || !playlistData.items || playlistData.items.length === 0) {
        setHasFetchedData(true);
        setIsSyncing(false);
        // Pull the Name/Subs we just saved into the UI
        await fetchDashboardData(userId);
        showToast("Channel linked! No videos found.", "warning");
        return;
      }

      const nextToken = playlistData.nextPageToken || '';
      setVideoPageToken(nextToken);
      localStorage.setItem("fanback-yt-token", nextToken);

      // STEP 3: Map the data
      const videoIds = playlistData.items.map((i: any) => i.contentDetails.videoId).join(',');
      const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=statistics`);
      const statsData = await statsRes.json();

      const formattedVideos = playlistData.items.map((item: any) => {
        const stats = statsData.items.find((s: any) => s.id === item.contentDetails.videoId)?.statistics || {};
        return {
          user_id: userId,
          youtube_id: item.contentDetails.videoId,
          title: item.snippet.title,
          thumbnail_url: item.snippet.thumbnails?.medium?.url,
          published_at: item.snippet.publishedAt,
          view_count: parseInt(stats.viewCount || '0'),
          like_count: parseInt(stats.likeCount || '0'),
          comment_count: parseInt(stats.commentCount || '0')
        };
      });

      await supabase.from('videos').upsert(formattedVideos, { onConflict: 'youtube_id' });

      await fetchDashboardData(userId);
      markAsSynced();
      showToast(isAutoSync ? "YouTube Auto sync complete" : "Deep Sync Complete!", "success");

    } catch (err: any) {
      console.error("Sync Error:", err);
      if (!isAutoSync) showToast("Sync failed: " + err.message, "error");
    } finally {
      if (!isAutoSync) setIsSyncing(false);
    }
  }

  // ─── THE MISSING FUNCTION ───
  async function loadMoreVideos() {

    if (!navigator.onLine) {
      showToast("No internet connection. Please check your network.", "error");
      return;
    }

    if (!videoPageToken || videoPageToken === 'undefined') {
      showToast("No more videos to load", "warning");
      return;
    }

    setIsLoadingMoreVideos(true);

    try {
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

      // 1. Get the channel record from your DB
      const { data: channelData } = await supabase.from('channels')
        .select('channel_id')
        .eq('user_id', user.id)
        .single();

      if (!channelData) throw new Error("No channel linked to this account.");

      // 2. FETCH THE REAL UPLOADS ID (Don't guess it!)
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelData.channel_id}&part=contentDetails`
      );
      const channelApiData = await channelRes.json();

      if (!channelApiData.items) throw new Error("YouTube couldn't find your channel details.");

      // This is the guaranteed correct ID for your videos
      const uploadsPlaylistId = channelApiData.items[0].contentDetails.relatedPlaylists.uploads;

      // 3. FETCH THE NEXT 50 VIDEOS
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=50&pageToken=${videoPageToken}`
      );

      const data = await res.json();


      if (data.error) {
        if (data.error.message.includes("Invalid value")) {
          localStorage.removeItem("fanback-yt-token");
          setVideoPageToken("");
          throw new Error("The search session expired. Please try syncing again.");
        }
        throw new Error(data.error.message);
      }

      // 4. Update the "Bookmark" (Token)
      const nextToken = data.nextPageToken || '';
      setVideoPageToken(nextToken);
      if (nextToken) {
        localStorage.setItem("fanback-yt-token", nextToken);
      } else {
        localStorage.removeItem("fanback-yt-token");
      }

      // 5. Get Stats for the new batch
      const videoIds = data.items.map((i: any) => i.contentDetails.videoId).join(',');
      const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=statistics`);
      const statsData = await statsRes.json();

      const newVideos = data.items.map((item: any) => {
        const stats = statsData.items.find((s: any) => s.id === item.contentDetails.videoId)?.statistics || {};
        return {
          user_id: user.id,
          youtube_id: item.contentDetails.videoId,
          title: item.snippet.title,
          thumbnail_url: item.snippet.thumbnails?.medium?.url || null,
          published_at: item.snippet.publishedAt,
          view_count: parseInt(stats.viewCount || '0'),
          like_count: parseInt(stats.likeCount || '0'),
          comment_count: parseInt(stats.commentCount || '0')
        };
      });

      // 6. Save and Refresh
      await supabase.from('videos').upsert(newVideos, { onConflict: 'youtube_id' });
      setVideos(prevVideos => [...prevVideos, ...newVideos]);

      await fetchDashboardData(user.id);
      showToast(`Loaded ${newVideos.length} more videos!`, "success");

    } catch (err: any) {
      console.error("Load More Error:", err);
      showToast(err.message, "error");
    } finally {
      setIsLoadingMoreVideos(false);
    }
  }

  // ─── SECTION 6.2: THE COMMENT FETCH ENGINE (PAGINATED - LIMIT 500) ───
  async function fetchCommentsForVideo(videoId: string) {
    setIsFetchingComments(true);

    try {
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

      let allFetchedItems: any[] = [];
      let nextPageToken = '';
      let pagesFetched = 0;
      const MAX_PAGES = 20;

      // Loop to "turn the pages" of the YouTube API
      while (pagesFetched < MAX_PAGES) {
        const pageTokenParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&videoId=${videoId}&part=snippet&order=time&maxResults=100${pageTokenParam}`
        );
        const data = await res.json();

        if (data.error) {
          if (data.error.errors[0].reason === 'commentsDisabled') {
            setActiveComments([]); setIsFetchingComments(false); return;
          }
          throw new Error(data.error.message);
        }

        if (!data.items || data.items.length === 0) break;

        allFetchedItems = [...allFetchedItems, ...data.items];
        nextPageToken = data.nextPageToken;
        pagesFetched++;

        if (!nextPageToken) break;
      }

      if (allFetchedItems.length === 0) {
        setActiveComments([]); setIsFetchingComments(false); return;
      }

      const { data: videoRow, error: videoLookupError } = await supabase.from('videos').select('id').eq('youtube_id', videoId).single();

      if (videoLookupError || !videoRow) {
        showToast("Video not found in database. Please sync first.", "error"); setIsFetchingComments(false); return;
      }

      const formattedComments = allFetchedItems.map((item: any) => {
        const topLevel = item.snippet.topLevelComment.snippet;
        return {
          user_id: user.id,
          youtube_comment_id: item.snippet.topLevelComment.id,
          video_id: videoRow.id,
          fan_name: topLevel.authorDisplayName,
          avatar: topLevel.authorProfileImageUrl,
          comment_text: topLevel.textDisplay,
          published_at: topLevel.publishedAt,
          status: 'pending' // Only applied to fresh comments! available filters depend on this field so be careful if you change it
        };
      });


      const { data: existingInDb } = await supabase
        .from('comments')
        .select('youtube_comment_id')
        .eq('video_id', videoRow.id);

      // ✅ NEW CODE
      const existingYtIds = new Set((existingInDb || []).map(c => c.youtube_comment_id));
      // const completelyNewComments = formattedComments.filter(c => !existingYtIds.has(c.youtube_comment_id));

      const uniqueNewComments = formattedComments
        .filter(c => !existingYtIds.has(c.youtube_comment_id))
        .filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.youtube_comment_id === value.youtube_comment_id
          ))
        );

      if (uniqueNewComments.length > 0) {
        // 2. Use UPSERT instead of INSERT, and ignore duplicates
        const { data: insertedData, error: insertError } = await supabase
          .from('comments')
          .upsert(uniqueNewComments, { onConflict: 'youtube_comment_id', ignoreDuplicates: true })
          .select('id, youtube_comment_id');

        if (insertError) {
          console.error("Insert failed:", insertError);
        } else if (insertedData && insertedData.length > 0) {

          console.log(`Inserted ${insertedData.length} new comments. Ready for manual classification.`);
        }
      }

      // ── STEP 2: Load comments from DB and show them immediately ──
      const savedCountStr = localStorage.getItem(`fanback-count-${videoId}`);
      const fetchLimit = savedCountStr ? parseInt(savedCountStr, 10) - 1 : 49;

      const { data: dbComments, error: dbError } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', videoRow.id)
        .order('published_at', { ascending: false })
        .range(0, fetchLimit);

      if (dbError) {
        console.error("DB fetch error:", dbError);
        showToast("Could not load comments from database.", "error");
        return;
      }

      // Replace state completely with fresh DB data
      setActiveComments(dbComments || []);

      fetchDashboardData(user.id);
      markAsSynced();

    } catch (error: any) {
      showToast("Could not load comments for this video probably due to bad network.", "error");
    } finally {
      setIsFetchingComments(false);
    }
  }

  async function loadMoreComments() {
    if (!navigator.onLine) {
      showToast("No internet connection. Please check your network.", "error");
      return;
    }

    if (isFetchingMoreComments || !hasMoreComments) return;

    setIsFetchingMoreComments(true);
    const currentCount = activeComments.length;
    const lastVideoId = localStorage.getItem('lastSelectedVideoId');

    try {
      // 1. Get the DB ID for the current video
      const { data: videoRow } = await supabase
        .from('videos')
        .select('id')
        .eq('youtube_id', lastVideoId)
        .single();

      if (!videoRow) return;

      // 2. Fetch the next range (e.g., 50 to 99)
      const { data: newComments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', videoRow.id)
        .order('published_at', { ascending: false })
        .range(currentCount, currentCount + 49);

      if (error) throw error;

      if (newComments && newComments.length > 0) {
        // 3. Append new comments to the existing list
        setActiveComments(prev => [...newComments, ...prev]);
        showToast(`${newComments.length} more comments loaded!`, "success");

        if (newComments.length < 50) {
          setHasMoreComments(false);
        }
      } else {
        setHasMoreComments(false);
      }
    } catch (err) {
      console.error("Error loading more comments:", err);
      showToast("Could not load more comments", "error");
    } finally {
      setIsFetchingMoreComments(false);
    }
  }


  // ─── CHECK FOR FAN REPLIES BACK (OPTIMIZED) ─────────────────────────
  async function checkFanRepliesBack(userId: string) {
    const token = await getFreshYouTubeToken();
    if (!token) return;

    const { data: repliedComments } = await supabase
      .from('comments')
      .select('id, youtube_comment_id, fan_name')
      .eq('user_id', userId)
      .eq('status', 'replied')
      .order('replied_at', { ascending: false })
      .limit(30);

    if (!repliedComments || repliedComments.length === 0) return;

    for (const comment of repliedComments) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${comment.youtube_comment_id}&maxResults=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (!data.items || data.items.length === 0) continue;

        const fanReplyItem = data.items.find((item: any) =>
          item.snippet.authorDisplayName === comment.fan_name
        );

        if (!fanReplyItem) continue;

        const fanReply = fanReplyItem.snippet;

        await supabase
          .from('comments')
          .update({
            status: 'replied_back',
            fan_replied_text: fanReply.textDisplay,
            fan_replied_at: fanReply.publishedAt,
          })
          .eq('id', comment.id);

      } catch (err) {
        console.error('Error checking fan reply for:', comment.id, err);
      }
    }
  }

  // ─── SECTION 6.5: THE DATA FETCH ENGINE ─────────────────────────────────────
  async function fetchDashboardData(userId: string) {
    try {

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();

      const { data: channels } = await supabase.from('channels').select('subscriber_count, total_videos, channel_name, thumbnail_url, channel_id, following_count').eq('user_id', userId);
      const { count: totalCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId);
      const { count: repliedCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'replied');
      const { count: receivedTodayCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', new Date().toISOString().split('T')[0]);

      const { data: videosData, error: vError } = await supabase.from('videos').select('*').eq('user_id', userId).order('published_at', { ascending: false });

      const totalYoutubeComments = videosData?.reduce((acc, video) => acc + (video.comment_count || 0), 0) || 0;

      const subCount = channels?.reduce((acc, curr) => acc + curr.subscriber_count, 0) || 0;

      const lastSubs = localStorage.getItem('fanback-last-subs');
      if (lastSubs !== null) {
        const prevCount = parseInt(lastSubs, 10);
        if (subCount > prevCount) {
          const diff = subCount - prevCount;
          setNewSubscribers(prev => prev + diff);
          showToast(`Hurray! You have ${diff} new subscriber${diff > 1 ? 's' : ''}!`, "success");
        }
      }
      // Always update the tracker so we don't trigger the same toast twice
      localStorage.setItem('fanback-last-subs', subCount.toString());

      const fetchedChannelName = channels?.[0]?.channel_name || "your channel";
      const fetchedAvatar = channels?.[0]?.thumbnail_url || "";

      if (profile) {
        setIsPremium(profile.is_premium);
        setShowFullNumbers(profile.show_full_numbers);
        setDashboardFullNumbers(profile.show_full_numbers); // Sync delayed state on load

        const today = new Date().toISOString().split('T')[0];

        if (profile.last_reply_date !== today) {
          await supabase
            .from('profiles')
            .update({
              replies_used_today: 0,
              last_reply_date: today,
            })
            .eq('id', userId);

          // Use 0 for today's display since it just reset
          profile.replies_used_today = 0;
          profile.last_reply_date = today;
        }

        // We use this helper to decide: Full or Short?
        setStats({
          // Send raw numbers directly to the state for the animation component
          subs: subCount,
          following: channels?.[0]?.following_count || 0,
          totalVideos: channels?.[0]?.total_videos || 0,
          total: totalYoutubeComments,
          replied: repliedCount || 0,
          pending: totalYoutubeComments - (repliedCount || 0),
          channelName: fetchedChannelName,
          channelAvatar: fetchedAvatar,
          channelId: channels?.[0]?.channel_id || ""
        });

        setActivity({
          receivedToday: receivedTodayCount || 0,
          sentToday: profile.replies_used_today
        });

        setGamification({
          streakDays: profile.streak_days,
          dailyGoal: profile.daily_goal,
          dailyDone: profile.replies_used_today
        });
      }

      if (vError) setVideoError(vError.message);
      else { setVideos(videosData || []); setVideoError(null); }

      setHasFetchedData(true);
    } catch (e) { console.error(e); }
  }



  // ─── SECTION 7: LIFECYCLE & AUTH ────────────────────────────────────────────
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/');
      } else {
        // 1. Set the basic Auth user
        setUser(user);

        // 2. FETCH THE PROFILE DATA (This fills 'userProfile')
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile); // This makes 'userProfile.is_premium' work!
        } else {
          console.error("Profile not found:", error);
        }

        // 3. Fetch the rest of your dashboard data
        await fetchDashboardData(user.id);
        setIsLoading(false);
      }
    }
    checkUser();
  }, [navigate]);


  // ─── WELCOME TOAST ENGINE ───
  useEffect(() => {
    // Only trigger AFTER the loading screen is gone and we have a user
    if (!isLoading && user) {
      const hasBeenWelcomed = sessionStorage.getItem('fanback_welcome_shown');

      if (!hasBeenWelcomed) {
        const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "User";

        // Wait just 500ms after the dashboard appears so the UI can settle
        const timer = setTimeout(() => {
          showToast(`Welcome back, ${firstName}! Feel free to explore.`, 'success');
        }, 500);

        sessionStorage.setItem('fanback_welcome_shown', 'true');

        // This cleanup function stops the "Ghost Component" bug in local testing
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, user]);


  // ⏱ SMART AUTO-SYNC ENGINE
  const syncRef = useRef(syncYouTubeData);

  // 1. Always keep the interval locked onto the freshest version of your functions
  useEffect(() => {
    syncRef.current = syncYouTubeData;
  });

  useEffect(() => {
    if (!user?.id) return;

    const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

    const triggerSilentSync = () => {
      if (document.visibilityState === 'visible') {
        syncRef.current(user.id, true);
      }
    };

    // 2. The standard looping interval
    const autoSyncInterval = setInterval(triggerSilentSync, SYNC_INTERVAL_MS);

    // 3. The "Welcome Back" Sync: If they click back into the tab, check if they need a sync instantly
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const last = localStorage.getItem("fanback-last-sync");
        if (last) {
          const timeSinceLastSync = new Date().getTime() - new Date(last).getTime();
          if (timeSinceLastSync > SYNC_INTERVAL_MS) {
            triggerSilentSync();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(autoSyncInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.id]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
        if (event === 'TOKEN_REFRESHED' && session) {
          setUser(session.user);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [navigate]);


  useLayoutEffect(() => {
    if (theme !== 'light') document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  // ─── SYNC DASHBOARD NUMBERS WHEN MENU CLOSES ───
  useEffect(() => {
    if (!isMenuOpen) {
      setDashboardFullNumbers(showFullNumbers);
    }
  }, [isMenuOpen, showFullNumbers]);

  //  AUTOSAVE CACHE: Memorizes the exact state of the feed before you switch videos
  useEffect(() => {
    const currentVideoId = localStorage.getItem('lastSelectedVideoId');
    if (currentVideoId && activeComments.length > 0) {
      commentsCache.current[currentVideoId] = activeComments;
      // NEW: Permanently memorize how many comments we have pulled for this video
      localStorage.setItem(`fanback-count-${currentVideoId}`, activeComments.length.toString());
    }
  }, [activeComments]);

  const CIRCUMFERENCE = 2 * Math.PI * 22;


  const handleTogglePin = (commentId: string) => {
    // 1. Identify the current state BEFORE updating
    const target = activeComments.find(c => c.id === commentId);
    if (!target) return;

    const willBePinned = !target.is_pinned;

    // 2. Update the state
    setActiveComments(prev => {
      const updated = prev.map(c =>
        c.id === commentId ? { ...c, is_pinned: willBePinned } : c
      );

      return [...updated].sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });
    });

    // 3. Show the toast immediately (fixes the lag)
    showToast(willBePinned ? "Comment Pinned to Top" : "Comment Unpinned", "success");
  };

  // 1. Just opens the modal
  const requestDelete = (youtube_comment_id: string, databaseId: string) => {
    setDeleteTarget({ ytId: youtube_comment_id, dbId: databaseId });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = await getFreshYouTubeToken();

      if (!token) {
        setIsSessionExpired(true);
        showToast("Session expired. Please log out and log back in.", "error");
        return;
      }

      const response = await fetch(`https://www.googleapis.com/youtube/v3/comments/setModerationStatus?id=${deleteTarget.ytId}&moderationStatus=rejected`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204 || response.ok) {
        setActiveComments(prev => prev.filter(c => c.youtube_comment_id !== deleteTarget.ytId));
        await supabase.from('comments').delete().eq('id', deleteTarget.dbId);
        showToast("Comment permanently hidden from YouTube.", "success");
      } else {
        const errorData = await response.json();

        // THE GHOST PROTOCOL: If YouTube throws a 400, force clean the local UI anyway
        if (response.status === 400) {
          console.warn("YouTube refused the ID. Assuming Ghost Comment. Forcing local wipe.");
          setActiveComments(prev => prev.filter(c => c.youtube_comment_id !== deleteTarget.ytId));
          await supabase.from('comments').delete().eq('id', deleteTarget.dbId);
          showToast("Comment deleted successfully!.", "success");
          return;
        }

        throw new Error(`YouTube Error: ${errorData.error?.message || "Refused"}`);
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ─── SECTION 8: NAVIGATION HANDLERS ─────────────────────────────────────────
  const handleCommentsNav = () => {
    setIsMenuOpen(false);
    const lastVideoId = localStorage.getItem('lastSelectedVideoId');

    if (lastVideoId) {
      setActiveTab('comments');
      if (activeComments.length === 0) {
        fetchCommentsForVideo(lastVideoId);
      }
    } else {
      showToast("Select a video from the Dashboard first.", "error");
    }
  };

  const handleVideoSelect = (videoId: string) => {
    localStorage.setItem('lastSelectedVideoId', videoId);
    setActiveTab('comments');

    // 1. Check if we already loaded this video during this session
    if (commentsCache.current[videoId]) {
      // INSTANT RESTORE: Put the saved comments right back on the screen instantly
      setActiveComments(commentsCache.current[videoId]);
    } else {
      // FIRST TIME: It's a fresh click, so fetch the standard 50 from the DB
      setActiveComments([]);
      fetchCommentsForVideo(videoId);
    }
  };

  // 🧭 AUTO-SCROLL LOGIC: Moves the horizontal bar when the filter changes
  useEffect(() => {
    const activeTab = filterRefs.current[commentFilter];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center", // This keeps the active tab centered in the scroll view
      });
    }
  }, [commentFilter]);

  const currentVideo = videos.find(v => v.youtube_id === localStorage.getItem('lastSelectedVideoId'));


  // ─── SECTION 9: LOADING STATE ───────────────────────────────────────────────
 if (isLoading) return (
    <div className="min-h-screen dark:bg-black bg-white flex flex-col items-center justify-center gap-4 p-4">
      <Loader2 size={40} className="text-primary animate-spin opacity-80" />
      <CyclingLoadingText messages={[
        "Initializing Neural Data Nodes...",
        "Syncing your dashboard...",
        "Fetching your profile...",
       "Establishing Secure Media Uplink...",
       "Almost Ready..."
      ]} />
    </div>
  );

  const totalInFeed = activeComments.length;
  const unrepliedCount = activeComments.filter(c => c.status === 'pending').length;
  const repliedInFeed = activeComments.filter(c => c.status === 'replied').length;

  // 🧠 AI FILTER LOGIC: Pre-calculate the visible comments based on the active tab
  const filteredComments = activeComments.filter(c => {
    if (commentFilter === 'all') return true;

    // The Workflow Tabs look at the 'status' column
    if (commentFilter === 'pending' || commentFilter === 'replied') {
      return c.status === commentFilter;
    }

    // The Smart Tabs look at the new 'ai_tags' array
    return Array.isArray(c.ai_tags) && c.ai_tags.includes(commentFilter);  });

  // ─── SECTION 10: MAIN UI RENDER ──────────────────────────────────────────────
  return (
    <div className={cn(
      "min-h-dvh overscroll-none pb-28 font-sans selection:bg-primary/30 relative",
      theme === 'light' ? "bg-white text-slate-900" : theme === 'black' ? "bg-black text-white" : "bg-[#121212] text-white"
    )}>

      {/* TOP TOASTS */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-full max-w-xs px-4"
          >
            <div className={cn(
              "px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border text-sm font-bold",
              // 🎨 COLOR LOGIC
              notification.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              notification.type === 'warning' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
              notification.type === 'error' && "bg-red-500/10 border-red-500/20 text-red-400"
            )}>

              {/* 🎭 ICON LOGIC */}
              {notification.type === 'success' && <CheckCircle2 size={18} />}
              {notification.type === 'warning' && <AlertTriangle size={18} />}
              {notification.type === 'error' && <X size={18} />}

              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className={cn("sticky top-0 z-50 backdrop-blur-xl border-b px-4 py-4 flex items-center justify-between shadow-sm transition-colors duration-500", theme === 'light' ? "bg-white/90 border-slate-200" : theme === 'black' ? "bg-black/90 border-white/5" : "bg-[#121212]/90 border-white/10")}>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Open menu" onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 rounded-full hover:bg-secondary/10 dark:text-white text-slate-900 transition-colors"><Menu size={22} /></button>
          <span className="font-extrabold text-lg tracking-tight hidden sm:block">Fan<span className="text-primary">Back</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => syncYouTubeData(user.id)}
            disabled={isSyncing}
            className={cn(
              "flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all",
              theme === 'light'
                ? "bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400"
                : "bg-white/5 border-white/20 text-slate-400 hover:text-primary hover:border-primary/30",
              isSyncing && "opacity-50 cursor-not-allowed"
            )}
          >
            <RefreshCw size={14} className={cn(isSyncing && "animate-spin text-primary")} />
            <span className="hidden sm:block">{isSyncing ? 'Syncing...' : 'Sync YouTube'}</span>
          </button>

          {/* Wired Notification Bell Dropdown */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
              className="dark:text-slate-400 text-slate-500 hover:dark:text-white hover:text-slate-900 transition-colors relative"
            >
              <div className="relative group">
                <Bell size={22} className="dark:text-slate-400 text-slate-500 group-hover:dark:text-white transition-colors" />

                {/* 2. The Smart Offset Badge */}
                {((typeof stats.pending === 'string' ? parseFloat(stats.pending) : stats.pending) + (newSubscribers > 0 ? 1 : 0)) > 0 && (
                  <span className={cn(
                    "absolute h-4 flex items-center justify-center bg-red-500 border-2 border-background font-black text-white shadow-lg z-10 whitespace-nowrap",
                    "-top-2.5 -right-6",

                    // 1. DYNAMIC WIDTH: explicitly checking for true/false
                    (dashboardFullNumbers
                      ? ((typeof stats.pending === 'string' ? parseFloat(stats.pending) : stats.pending) + (newSubscribers > 0 ? 1 : 0)).toLocaleString()
                      : Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(((typeof stats.pending === 'string' ? parseFloat(stats.pending) : stats.pending) + (newSubscribers > 0 ? 1 : 0)))
                    ).length > 3
                      ? "px-2 rounded-full text-[7px] min-w-8"
                      : "w-5 rounded-full text-[9px]"
                  )}>

                    {/* 2. DYNAMIC NUMBER: explicitly checking for true/false */}
                    {dashboardFullNumbers
                      ? ((typeof stats.pending === 'string' ? parseFloat(stats.pending) : stats.pending) + (newSubscribers > 0 ? 1 : 0)).toLocaleString()
                      : Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(((typeof stats.pending === 'string' ? parseFloat(stats.pending) : stats.pending) + (newSubscribers > 0 ? 1 : 0)))
                    }

                  </span>
                )}
              </div>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className={cn("absolute right-0 mt-4 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden", theme === 'light' ? "bg-white border-slate-200" : "bg-[#1a1a1a] border-white/10")}
                >
                  <div className="p-4 border-b dark:border-white/10 border-slate-200 flex justify-between items-center">
                    <span className="font-black text-sm">Notifications</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      {/* FIXED: Formatted the total number in the header with commas */}
                      {dashboardFullNumbers
                        ? ((typeof stats.pending === 'string' ? parseFloat(stats.pending || "0") : (stats.pending || 0)) + (newSubscribers > 0 ? 1 : 0)).toLocaleString()
                        : Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(((typeof stats.pending === 'string' ? parseFloat(stats.pending || "0") : (stats.pending || 0)) + (newSubscribers > 0 ? 1 : 0)))
                      } New
                    </span>
                  </div>
                  <div className="max-h-75 overflow-y-auto">
                    {((typeof stats.pending === 'string' ? parseFloat(stats.pending || "0") : (stats.pending || 0)) + (newSubscribers > 0 ? 1 : 0)) > 0 ? (
                      <div className="p-4 text-sm font-medium dark:text-slate-300 text-slate-700 flex flex-col gap-4">

                        {/* NEW SUBSCRIBER ALERT */}
                        {newSubscribers > 0 && (
                          <div className="flex items-start gap-3 border-b dark:border-white/5 border-slate-100 pb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                              <CheckCircle2 size={14} />
                            </div>
                            <div className="flex-1">
                              {/* FIXED: Added .toLocaleString() to the newSubscribers variable */}
                              <p className="text-xs">Hurray! You have <strong className="text-emerald-500">{newSubscribers.toLocaleString()} new subscriber{newSubscribers > 1 ? 's' : ''}</strong>!</p>
                              <button onClick={() => setNewSubscribers(0)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white mt-2 uppercase tracking-widest transition-colors">
                                Dismiss
                              </button>
                            </div>
                          </div>
                        )}

                        {/* PENDING COMMENTS */}
                        {(typeof stats.pending === 'string' ? parseFloat(stats.pending || "0") : (stats.pending || 0)) > 0 && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0"><MessageSquare size={14} /></div>
                            <div>
                              {/* FIXED: Replaced raw {stats.pending} with the fully formatted version that includes commas */}
                              <p className="text-xs">You have <strong className="text-primary">
                                {dashboardFullNumbers
                                  ? (typeof stats.pending === 'string' ? parseFloat(stats.pending || "0") : (stats.pending || 0)).toLocaleString()
                                  : Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(typeof stats.pending === 'string' ? parseFloat(stats.pending || "0") : (stats.pending || 0))
                                } unreplied comments</strong> waiting for your attention.
                              </p>
                              <button onClick={() => { setShowNotifications(false); setActiveTab('comments'); }} className="text-xs text-blue-500 font-bold mt-1 hover:underline">Go to Comments Feed</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm font-bold dark:text-slate-500 text-slate-400">
                        <Bell className="mx-auto mb-2 opacity-20" size={24} />
                        You're all caught up!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full border-2 transition-all active:scale-90 flex items-center justify-center shadow-sm group",
              theme === 'light'
                ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40"
            )}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Sun size={16} className="animate-in zoom-in duration-300" fill="currentColor" />
            ) : (
              <Moon size={16} className="animate-in zoom-in duration-300" fill="currentColor" />
            )}
          </button>

          <div onClick={() => stats.channelAvatar && setIsProfileModalOpen(true)} className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden sm:flex flex-col items-end">

            {/* NEW YOUTUBE LOGO & TEXT */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500 fill-current">
                  <path d={SOCIAL_ICONS.youtube} />
                </svg>
                <span className="text-sm font-black text-red-500 tracking-tight">YouTube</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold dark:text-white text-slate-900">
                  {stats.channelName || user?.user_metadata?.full_name || "Creator"}
                </span>
                {isPremium && stats.channelName && <BadgeCheck size={16} className="text-blue-500" fill="currentColor" />}
              </div>
              <span className="text-[10px] dark:text-slate-400 text-slate-500 font-bold tracking-widest uppercase">
                {isPremium ? "Pro Access" : "Free Plan"}
              </span>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-60 blur transition duration-500" />
              <div className="relative w-10 h-10 rounded-full p-0.5 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full dark:bg-black bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {stats.channelAvatar && (
                    <img
                      src={stats.channelAvatar}
                      alt="Channel"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLDivElement;
                        if (fallback) { fallback.classList.remove('hidden'); fallback.classList.add('flex'); }
                      }}
                    />
                  )}
                  <div className={cn("w-full h-full items-center justify-center font-extrabold dark:text-white text-slate-900 text-sm uppercase", stats.channelAvatar ? "hidden" : "flex")}>
                    {user?.user_metadata?.full_name?.[0] || "U"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR MODAL */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className={cn("fixed top-0 left-0 bottom-0 w-70 border-r z-50 p-6 flex flex-col shadow-2xl transition-colors duration-500", theme === 'light' ? "bg-white border-slate-200" : theme === 'black' ? "bg-black border-white/5" : "bg-[#121212] border-white/10")}>
              <div className="flex items-center justify-between mb-8">
                <span className="font-extrabold text-xl tracking-tight">Fan<span className="text-primary">Back</span></span>
                <button type="button" aria-label="Open menu" onClick={() => setIsMenuOpen(false)} className="p-2 dark:text-slate-400 text-slate-500"><X size={20} /></button>
              </div>

              <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl dark:bg-white/5 bg-slate-100 border dark:border-white/5 border-slate-300 shadow-sm">
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="relative w-14 h-14 rounded-full p-0.5 bg-linear-to-tr from-indigo-500 to-purple-500 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-black text-xl text-white overflow-hidden">
                    {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                      <img
                        src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      user?.user_metadata?.full_name?.[0] || "U"
                    )}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate dark:text-white text-slate-900 flex items-center gap-1">
                    {user?.user_metadata?.full_name || "Creator"}
                    {isPremium && <BadgeCheck size={14} className="text-blue-500 shrink-0" fill="currentColor" />}
                  </p>
                  <p className="text-[10px] dark:text-slate-400 text-slate-500 truncate">{user?.email}</p>
                  <p className="text-[10px] font-black mt-1 text-emerald-600 dark:text-emerald-500 uppercase tracking-tighter">Current plan: {userProfile?.is_premium ? "Premium User" : "Free User"}</p>
                </div>
              </div>

              <nav className="flex-1 space-y-2 text-sm font-bold">
                <div onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }} className={cn("flex items-center gap-3 p-3 rounded-xl cursor-pointer", activeTab === 'home' ? "bg-primary/10 text-primary" : "dark:text-slate-400 text-slate-500 hover:bg-secondary/10 transition-colors")}>
                  <LayoutDashboard size={18} /><span>Dashboard</span>
                </div>
                <div
                  onClick={handleCommentsNav}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
                    activeTab === 'comments'
                      ? "bg-primary/10 text-primary"
                      : "dark:text-slate-400 text-slate-500 hover:bg-secondary/10"
                  )}
                >
                  <MessageSquare size={18} />
                  <span>Comments</span>
                </div>
                <div onClick={toggleNumberFormat} className="flex items-center justify-between p-3 rounded-xl dark:text-slate-400 text-slate-500 cursor-pointer hover:bg-secondary/10 transition-colors">
                  <div className="flex items-center gap-3"><Hash size={18} /><span>Full Stats Numbers</span></div>
                  <div className={cn("w-8 h-4 rounded-full relative", showFullNumbers ? "bg-primary" : "bg-slate-300 dark:bg-slate-700")}><div className={cn("absolute top-1 w-2 h-2 bg-white rounded-full", showFullNumbers ? "left-5" : "left-1")} /></div>
                </div>

                {/* 📊 ANALYSIS BUTTON */}
                <div
                  onClick={() => { setActiveTab('analysis'); setIsMenuOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
                    activeTab === 'analysis' ? "bg-primary/10 text-primary" : "dark:text-slate-400 text-slate-500 hover:bg-secondary/10"
                  )}
                >
                  <BarChart3 size={18} />
                  <span>Analysis</span>
                </div>

                <div onClick={() => { setIsUpgradeModalOpen(true); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl dark:text-slate-400 text-slate-500 cursor-pointer hover:bg-secondary/10 transition-colors"><CreditCard size={18} /><span>Pricing</span></div>
                <Link 
                    to="/guide" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 p-3 rounded-xl dark:text-slate-400 text-slate-500 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>User Guide</span>
                  </Link>
                <div onClick={() => { setActiveTab('settings'); setIsMenuOpen(false); }} className={cn("flex items-center gap-3 p-3 rounded-xl cursor-pointer", activeTab === 'settings' ? "bg-primary/10 text-primary" : "dark:text-slate-400 text-slate-500 hover:bg-secondary/10 transition-colors")}>
                  <Settings size={18} /><span>Settings</span>
                </div>
              </nav>

              <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} className="mt-auto w-full flex items-center gap-3 p-3 text-red-500 font-bold transition-colors hover:bg-red-500/10 rounded-xl"><LogOut size={18} /><span>Sign Out</span></button>
            </motion.div>
          </>
        )}

        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUpgradeModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative dark:bg-black bg-white border dark:border-white/10 border-slate-200 w-full max-w-sm rounded-4xl p-8 shadow-2xl z-10 flex flex-col items-center text-center">
              <button type="button" aria-label="Open menu" onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-6 right-6 dark:text-slate-400 text-slate-500 hover:dark:text-white hover:text-slate-900"><X size={20} /></button>
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20"><Sparkles size={32} /></div>
              <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-2">Unlock FanBack Pro</h3>
              <p className="text-sm dark:text-slate-400 text-slate-500 mb-8 leading-relaxed font-medium">Link all platforms to your command center. Unlimited AI replies & growth tools.</p>
              <button onClick={() => { setIsUpgradeModalOpen(false); navigate('/pricing'); }} className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
                Subscribe — $20/month
              </button>
              <p className="mt-4 text-[11px] dark:text-slate-400 text-slate-500">Pricing page currently under development</p>
            </motion.div>
          </div>
        )}

        {isProfileModalOpen && stats.channelAvatar && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative z-10 w-full max-w-sm aspect-square rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              <img src={stats.channelAvatar} alt="Channel Full Profile" className="w-full h-full object-cover" />
              <button type="button" aria-label="Open menu" onClick={() => setIsProfileModalOpen(false)} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"><X size={20} /></button>
            </motion.div>
          </div>
        )}

        {/* 2. THE FULLSCREEN SIDEBAR AVATAR LIGHTBOX */}
        <AnimatePresence>
          {isAvatarModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAvatarModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-sm aspect-square rounded-full overflow-hidden border-4 border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]"
              >
                {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                  <img
                    src={(user?.user_metadata?.avatar_url || user?.user_metadata?.picture).replace(/=s\d+/, "=s1800")}
                    alt="User Profile Expanded"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-8xl font-black text-white">
                    {user?.user_metadata?.full_name?.[0] || "U"}
                  </div>
                )}
                <button type="button" aria-label="Close" onClick={() => setIsAvatarModalOpen(false)} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors">
                  <X size={20} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 🔒 SESSION EXPIRED MODAL */}
        {isSessionExpired && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={cn("relative border w-full max-w-sm rounded-4xl p-8 shadow-2xl z-10 flex flex-col items-center text-center", theme === 'light' ? "bg-white border-slate-200" : "bg-[#1a1a1a] border-white/10")}>

              <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
                <Lock size={32} />
              </div>

              <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-2">Session Expired</h3>
              <p className="text-sm dark:text-slate-400 text-slate-500 mb-8 leading-relaxed font-medium">
                For your security, your connection to YouTube has timed out and your session is expired. Please sign in again to continue.
              </p>

              <div className="w-full flex flex-col gap-3">
                {/* Primary Action */}
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                  }}
                  className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  Sign In Again <ArrowUpRight size={18} />
                </button>

                <button
                  onClick={() => setIsSessionExpired(false)}
                  className="w-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} /> Go Back
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative border w-full max-w-sm rounded-4xl p-8 shadow-2xl z-10 flex flex-col items-center text-center",
                theme === 'light' ? "bg-white border-slate-200" : "bg-[#1a1a1a] border-white/10"
              )}
            >
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
                <Trash size={32} />
              </div>

              <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-2">Delete Comment?</h3>
              <p className="text-sm dark:text-slate-400 text-slate-500 mb-8 leading-relaxed font-medium">
                This will permanently remove the comment from <span className="font-bold text-red-500">YouTube</span>. This action cannot be undone.
              </p>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={executeDelete}
                  className="w-full bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-red-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Proceed & Delete
                </button>

                <button
                  onClick={() => setDeleteTarget(null)}
                  className="w-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-bold py-3 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SECTION 11: MAIN CONTENT SWITCHER ────────────── */}
      <main
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="max-w-4xl mx-auto px-4 pt-8 pb-20 animate-in fade-in duration-500 relative z-10"
      >

        {/* ── VIEW A: HOME DASHBOARD ── */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div>
              <h1 className={cn(
                "text-2xl font-extrabold transition-none",
                theme === 'light' ? "text-slate-900" : "text-white"
              )}>
                {getGreeting()}, {user?.user_metadata?.full_name?.split(" ")[0] || "Creator"}
              </h1>

              {/* Changed to flex so the badge sits perfectly next to or under the text */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                <p className={cn(
                  "text-sm font-medium",
                  theme === 'light' ? "text-slate-500" : "text-slate-400"
                )}>
                  Here's what's happening in your account today{" "}
                  {stats.channelId ? (
                    <a
                      href={`https://www.youtube.com/channel/${stats.channelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open YouTube Channel"
                      className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {stats.channelName}
                    </a>
                  ) : (
                    <span className="font-bold text-primary">{stats.channelName}</span>
                  )}.
                </p>

                {/* THE NEW LAST UPDATED BADGE */}
                {lastUpdated && (
                  <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
                    <CheckCircle2 size={12} />
                    Last Synced: {new Date(lastUpdated).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                )}
              </div>
            </div>

            {/* MOBILE HERO CARD: Subscribers (full width on mobile only) */}
            <div className="sm:hidden">
              {(() => {
                const s = { id: 'subs', label: "Subscribers", val: stats.subs, subtext: "Current total", color: "text-slate-950 dark:text-white" };
                return (
                  <div className={cn(
                    "w-full border p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 mb-3",
                    theme === 'light'
                      ? "bg-white border-slate-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      : theme === 'black'
                        ? "bg-[#111111] border-white/5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        : "bg-[#1e1e1e] border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                  )}>
                    <span className={cn("text-5xl font-black tracking-tight", s.color)}>
                      <AnimatedStat value={s.val as number} isShort={!dashboardFullNumbers} />
                    </span>
                    <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-widest mt-1 font-black">{s.label}</span>
                    <span className="text-xs dark:text-slate-500 text-slate-400 font-bold mt-1">{s.subtext}</span>
                  </div>
                );
              })()}

              {/* MOBILE PRIMARY ROW: Total Comments + Pending (2 col, prominent) */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { id: 'total', label: "Total Comments", val: stats.total, subtext: "All videos. All time", color: "text-slate-950 dark:text-white" },
                  { id: 'pending', label: "Pending", val: stats.pending, subtext: "Awaiting reply", color: "text-orange-600 dark:text-orange-500", special: true },
                ].map((s, i) => (
                  <div key={i} className={cn(
                    "border p-4 py-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300",
                    s.special
                      ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                      : theme === 'light'
                        ? "bg-white border-slate-200 hover:border-primary/50"
                        : theme === 'black'
                          ? "bg-[#111111] border-white/5 hover:border-primary/50"
                          : "bg-[#1e1e1e] border-white/10 hover:border-primary/50"
                  )}>
                    {s.special && <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-2xl rounded-full animate-pulse" />}
                    <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-widest mb-1 font-black relative z-10">{s.label}</span>
                    <span className={cn("text-3xl font-black tracking-tight relative z-10", s.color)}>
                      <AnimatedStat value={s.val as number} isShort={!dashboardFullNumbers} />
                    </span>
                    <span className="text-[11px] dark:text-slate-500 text-slate-400 font-bold mt-1 relative z-10">{s.subtext}</span>
                  </div>
                ))}
              </div>

              {/* MOBILE SECONDARY ROW: Following, Total Videos, Replied — compact horizontal scroll */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
                {[
                  { id: 'following', label: "Following", val: stats.following, subtext: "Channels you follow", color: "text-slate-950 dark:text-white" },
                  { id: 'videos', label: "Total Videos", val: stats.totalVideos, subtext: "All time uploads", color: "text-slate-950 dark:text-white" },
                  { id: 'replied', label: "Replied", val: stats.replied, subtext: "All videos", color: "text-emerald-700 dark:text-emerald-400" },
                ].map((s, i) => (
                  <div key={i} className={cn(
                    "flex-shrink-0 w-32 border px-3 py-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300",
                    theme === 'light'
                      ? "bg-white border-slate-200"
                      : theme === 'black'
                        ? "bg-[#111111] border-white/5"
                        : "bg-[#1e1e1e] border-white/10"
                  )}>
                    <span className="text-[9px] dark:text-slate-400 text-slate-500 uppercase tracking-widest mb-1 font-black">{s.label}</span>
                    <span className={cn("text-xl font-black tracking-tight", s.color)}>
                      <AnimatedStat value={s.val as number} isShort={!dashboardFullNumbers} />
                    </span>
                    <span className="text-[10px] dark:text-slate-500 text-slate-400 font-bold mt-1 text-center leading-tight">{s.subtext}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP: Original layout — completely unchanged, hidden on mobile */}
            <div className="hidden sm:flex flex-wrap gap-3">
              {[
                { id: 'subs', label: "Subscribers", val: stats.subs, subtext: "Current total", color: "text-slate-950 dark:text-white" },
                { id: 'following', label: "Following", val: stats.following, subtext: "Channels you follow", color: "text-slate-950 dark:text-white" },
                { id: 'videos', label: "Total Videos", val: stats.totalVideos, subtext: "All time uploads", color: "text-slate-950 dark:text-white" },
                { id: 'total', label: "Total Comments", val: stats.total, subtext: "All videos . All time", color: "text-slate-950 dark:text-white" },
                { id: 'replied', label: "Replied", val: stats.replied, subtext: "All videos", color: "text-emerald-700 dark:text-emerald-400" },
                { id: 'pending', label: "Pending", val: stats.pending, subtext: "Awaiting reply", color: "text-orange-600 dark:text-orange-500", special: true }
              ].map((s, i) => (
                <div key={i} className={cn(
                  "flex-1 min-w-35 sm:min-w-45 border p-4 py-7 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default",
                  s.special
                    ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                    : theme === 'light'
                      ? "bg-white border-slate-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      : theme === 'black'
                        ? "bg-[#111111] border-white/5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        : "bg-[#1e1e1e] border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                )}>
                  {s.special && <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-2xl rounded-full animate-pulse" />}
                  {s.id !== 'subs' && (
                    <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-widest mb-2 font-black relative z-10">{s.label}</span>
                  )}
                  <span className={cn("text-2xl sm:text-4xl font-black relative z-10 tracking-tight", s.color)}>
                    <AnimatedStat value={s.val as number} isShort={!dashboardFullNumbers} />
                  </span>
                  {s.id === 'subs' && (
                    <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-widest mt-1 font-black relative z-10">{s.label}</span>
                  )}
                  <span className="text-[11px] sm:text-xs dark:text-slate-500 text-slate-400 font-bold mt-2 relative z-10">{s.subtext}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-5 mt-2">

              {/* ── LEFT CARD: DAILY ACTIVITY OVERVIEW ── */}
              <div className={cn(
                "relative rounded-2xl p-4 sm:p-6 overflow-hidden shadow-lg flex flex-col justify-between min-h-[200px] sm:min-h-[220px] transition-all hover:shadow-xl",
                theme === 'light' ? "bg-white border border-slate-200" : "bg-[#1c1d24] border border-white/5"
              )}>
                <h3 className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest mb-4 relative z-10 text-slate-400">
                  Daily Activity
                </h3>

                {/* Inner Grid: Stacks on mobile, side-by-side on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 mb-8 sm:mb-6 relative z-10">

                  {/* Received Card (Arrow Down) */}
                  <div className={cn("rounded-xl p-3 sm:p-4 flex flex-col", theme === 'light' ? "bg-slate-50 border border-slate-100" : "bg-white/[0.03] border border-white/10")}>
                    <div className="flex items-center sm:items-start gap-2 mb-1 sm:mb-3 text-[9px] sm:text-[10px] font-bold uppercase leading-tight text-slate-500">
                      <ArrowDownToLine size={14} className="shrink-0 sm:mt-0.5" />
                      <span>Comments Received Today</span>
                    </div>
                    <div className={cn("text-xl sm:text-3xl font-black", theme === 'light' ? "text-slate-900" : "text-white")}>
                      {activity.receivedToday.toLocaleString()}
                    </div>
                  </div>

                  {/* Replied Card (Arrow Up) */}
                  <div className={cn("rounded-xl p-3 sm:p-4 flex flex-col", theme === 'light' ? "bg-slate-50 border border-slate-100" : "bg-white/[0.03] border border-white/10")}>
                    <div className="flex items-center sm:items-start gap-2 mb-1 sm:mb-3 text-[9px] sm:text-[10px] font-bold uppercase leading-tight text-slate-500">
                      <ArrowUpFromLine size={14} className="shrink-0 sm:mt-0.5" />
                      <span>Comments Replied Today</span>
                    </div>
                    <div className={cn("text-xl sm:text-3xl font-black", theme === 'light' ? "text-slate-900" : "text-white")}>
                      {gamification.dailyDone.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* The Wave Chart */}
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none">
                  <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full opacity-60">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={theme === 'light' ? "0.1" : "0.2"} />
                        <stop offset="100%" stopColor="#1c1d24" stopOpacity={theme === 'light' ? "0" : "1"} />
                      </linearGradient>
                    </defs>
                    <path d="M0,50 C150,120 350,-20 500,50 L500,100 L0,100 Z" fill="url(#waveGradient)" />
                    <path d="M0,50 C150,120 350,-20 500,50" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* ── RIGHT CARD: DAILY REPLY QUOTA ── */}
              <div className={cn(
                "rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col min-h-[200px] sm:min-h-[220px] transition-all hover:shadow-xl",
                theme === 'light' ? "bg-white border border-slate-200" : "bg-[#1c1d24] border border-white/5"
              )}>
                <h3 className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400">
                  {isPremium ? 'Pro Access' : 'Reply Quota'}
                </h3>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[90px] sm:max-w-[144px] aspect-square flex items-center justify-center mb-2 sm:mb-4 mt-2">
                    <svg viewBox="0 0 144 144" className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" fill="transparent" stroke={theme === 'light' ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="10" />

                      <circle
                        cx="72" cy="72" r="60" fill="transparent" stroke={isPremium ? "#a855f7" : "#8b5cf6"} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={isPremium ? 0 : (2 * Math.PI * 60) - ((Math.min((gamification.dailyDone / gamification.dailyGoal) * 100, 100) || 0) / 100) * (2 * Math.PI * 60)}
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      {isPremium ? (
                        <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">∞</span>
                      ) : (
                        <span className={cn("text-xl sm:text-3xl font-black tracking-tight", theme === 'light' ? "text-slate-900" : "text-white")}>
                          {gamification.dailyDone} <span className="text-slate-400 text-sm sm:text-2xl">/ {gamification.dailyGoal}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] sm:text-xs font-medium text-slate-400 text-center">
                    {isPremium ? "Unlimited Enabled" : (
                      <div className="flex flex-col items-center gap-0.5 mt-1">
                        <span>
                          Progress: <span className={theme === 'light' ? "text-slate-700" : "text-white"}>{Math.round(Math.min((gamification.dailyDone / gamification.dailyGoal) * 100, 100) || 0)}%</span>
                        </span>
                        {/* Added Reset Text Here */}
                        <span className="text-[8px] sm:text-[9px] opacity-60 uppercase tracking-widest font-bold mt-1">
                          Resets at midnight (UTC)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── PLATFORM SELECTOR (RESPONSIVE & REFINED) ── */}
            <div className="hidden md:flex items-center gap-4 py-6 px-2 overflow-x-auto hide-scrollbar">
              {[
                { id: 'youtube', name: 'YouTube', color: '#FF0000' },
                { id: 'instagram', name: 'Instagram', color: '#E1306C' },
                { id: 'tiktok', name: 'TikTok', color: theme !== 'light' ? '#FFFFFF' : '#000000' },
                { id: 'twitter', name: 'Twitter', color: theme !== 'light' ? '#FFFFFF' : '#000000' },
                { id: 'facebook', name: 'Facebook', color: '#1877F2' }
              ].map((p) => {
                const isSelected = activePlatform === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePlatform(p.id as any)}
                    className={cn(
                      "relative flex items-center gap-3 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-500 border-2",
                      isSelected
                        ? (theme === 'light'
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                          : theme === 'black'
                            ? "bg-primary/20 border-primary text-primary shadow-[0_0_25px_rgba(99,102,241,0.6)]" // Intense OLED glow
                            : "bg-primary/10 border-primary/60 text-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]") // Softer matte glow
                        : theme === 'light'
                          ? "bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400"
                          : theme === 'black'
                            ? "bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/20"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-primary/30"
                    )}
                  >
                    {/* Pulse Glow Effect for Active Tab */}
                    {isSelected && (
                      <motion.div
                        layoutId="pulseGlow"
                        className="absolute inset-0 rounded-full bg-primary/20 blur-md"
                        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}

                    {/* Brand Colored Icon */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10" fill={p.color}>
                      <path d={SOCIAL_ICONS[p.id as keyof typeof SOCIAL_ICONS]} />
                    </svg>
                    <span className="relative z-10">{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* MOBILE VIEW: Individual Floating Pills */}
            <div className="md:hidden">
              <AnimatePresence>
                {isPlatformMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setIsPlatformMenuOpen(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
                    />

                    {/* Stacked Individual Pills */}
                    <div className="fixed bottom-40 right-6 z-70 flex flex-col items-end gap-3">
                      {[
                        { id: 'youtube', name: 'YouTube', color: '#FF0000' },
                        { id: 'instagram', name: 'Instagram', color: '#E1306C' },
                        { id: 'tiktok', name: 'TikTok', color: theme !== 'light' ? '#FFFFFF' : '#000000' },
                        { id: 'twitter', name: 'Twitter', color: theme !== 'light' ? '#FFFFFF' : '#000000' },
                        { id: 'facebook', name: 'Facebook', color: '#1877F2' }
                      ].map((p, i) => {
                        const isSelected = activePlatform === p.id;

                        return (
                          <motion.button
                            key={p.id}
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 500, damping: 30 }}
                            onClick={() => {
                              setActivePlatform(p.id as any);
                              setIsPlatformMenuOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-3 px-5 py-3 rounded-full border-2 shadow-2xl transition-all active:scale-95",
                              isSelected
                                ? (theme === 'light'
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                  : "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(99,102,241,0.5)]")
                                : theme === 'light'
                                  ? "bg-white border-slate-300 text-slate-800"
                                  : "dark:bg-[#1a1a1a] bg-white dark:border-white/20 border-slate-200 dark:text-slate-200 text-slate-800"
                            )}
                          >
                            <span className="text-sm font-black tracking-wide">{p.name}</span>
                            {/* Brand Colored Icon */}
                            <svg viewBox="0 0 24 24" fill={p.color} className="w-5 h-5">
                              <path d={SOCIAL_ICONS[p.id as keyof typeof SOCIAL_ICONS]} />
                            </svg>
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}
              </AnimatePresence>

              {/* MAIN FAB (HOME TAB) */}
              <button
                onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                className={cn(
                  "fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-70 border-2 transition-all active:scale-90",
                  isPlatformMenuOpen
                    ? "bg-red-500 border-red-500/20 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                    : "bg-primary border-white/20 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                )}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlatformMenuOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isPlatformMenuOpen ? <X size={28} /> : <Share2 size={26} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>

            {/* VIDEO LIST SECTION */}
            <div className="pb-8">
              <div className={cn(
                "sticky top-[68px] sm:top-[72px] z-40 flex items-center justify-between mb-4 py-3 -mx-4 px-4 backdrop-blur-xl transition-colors duration-500",
                theme === 'light' ? "bg-white/90" : theme === 'black' ? "bg-black/90" : "bg-[#121212]/90"
              )}>
                <h2 className="text-sm font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500">Recent Videos</h2>
                
                <div className="relative group w-full max-w-45 sm:max-w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-400 text-slate-500 group-focus-within:text-primary transition-colors" size={14} />
                  <input type="text" placeholder="Search videos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-secondary/5 border dark:border-white/10 border-slate-200 rounded-xl py-1.5 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>

              {videoError ? (
                <div className="w-full border-2 border-red-500/20 bg-red-500/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6"><X className="text-red-500 opacity-80" size={32} /></div>
                  <h3 className="text-xl font-extrabold mb-2 text-red-500">Sync Failed</h3>
                  <p className="text-sm text-red-500/70 font-medium max-w-62.5">{videoError}</p>
                </div>
              ) : hasFetchedData && videos.length === 0 ? (
                <div className={cn("w-full border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm", theme === 'light' ? "bg-white border-slate-200" : "bg-white/5 border-white/5")}>
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6"><PlaySquare className="text-secondary opacity-60" size={32} /></div>
                  <h3 className="text-xl font-extrabold mb-2">Link your YouTube channel to see your latest videos and start replying to fans!</h3>
                  <p className="text-sm dark:text-slate-400 text-slate-500 font-medium mb-6">Click the sync button below to pull your latest content.</p>
                  <button onClick={() => syncYouTubeData(user.id)} disabled={isSyncing} className="bg-primary text-primary-foreground font-black px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                    <RefreshCw size={16} className={cn(isSyncing && "animate-spin")} /> {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              ) : (
                <>
                  {/* 🎯 THE NEW SEARCH EMPTY STATE */}
                  {videos.filter(v => v.title?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && searchQuery.trim() !== "" ? (
                    <div className={cn("w-full border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm mt-2", theme === 'light' ? "bg-white border-slate-200" : "bg-white/5 border-white/5")}>
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                        <Search className="text-secondary opacity-60" size={32} />
                      </div>
                      <h3 className="text-xl font-extrabold mb-2">No videos found</h3>
                      <p className="text-sm dark:text-slate-400 text-slate-500 font-medium">
                        We couldn't find any results for <span className="text-primary font-bold">"{searchQuery}"</span>
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {videos.filter(v => v.title?.toLowerCase().includes(searchQuery.toLowerCase())).map(video => (
                        <div key={video.id} onClick={() => handleVideoSelect(video.youtube_id)} className={cn("p-4 border rounded-2xl flex items-start sm:items-center justify-between group hover:border-primary transition-all cursor-pointer shadow-sm", theme === 'light' ? "bg-white border-slate-200" : "bg-white/5 border-white/10")}>
                          <div className="flex items-start sm:items-center gap-4 w-full min-w-0">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoId(video.youtube_id);
                              }}
                              className="relative block w-28 sm:w-40 h-20 sm:h-24 rounded-xl overflow-hidden bg-secondary/10 shrink-0 border dark:border-white/10 border-slate-200 group cursor-pointer"
                            >
                              {video.thumbnail_url ? (
                                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary/50 bg-primary/5"><Video size={18} /></div>
                              )}

                              {/* The Play Button HUD (MINIMALIST TACTICAL VERSION) */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-all duration-300">
                                <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-lg scale-75 group-hover:scale-90 group-hover:bg-primary/40 group-hover:border-primary/50 transition-all duration-500">
                                  <Play size={12} className="text-white fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                             <p 
                              className="text-sm font-bold dark:text-white text-slate-900 line-clamp-2 break-words"
                              dangerouslySetInnerHTML={{ __html: video.title }}
                            />

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 w-full">
                                {video.published_at && (
                                  <p className="text-[10px] dark:text-slate-400 text-slate-500 font-semibold wrap-break-word whitespace-normal">
                                    {formatTimeAgo(video.published_at)}
                                    <span className="opacity-40"> · </span>
                                    {new Date(video.published_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 text-[10px] font-bold dark:text-slate-400/80 text-slate-500/80 whitespace-nowrap">
                                  <span className="flex items-center gap-1"><Eye size={12} /> {video.view_count?.toLocaleString() || 0}</span>
                                  <span className="flex items-center gap-1"><ThumbsUp size={12} /> {video.like_count?.toLocaleString() || 0}</span>
                                  <span className="flex items-center gap-1"><MessageSquare size={12} /> {video.comment_count?.toLocaleString() || 0}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <ArrowUpRight size={18} className="dark:text-slate-400 text-slate-500 group-hover:text-primary transition-colors shrink-0 ml-2 hidden sm:block" />
                        </div>
                      ))}
                    </div>
                  )}

                  {videoPageToken && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={loadMoreVideos}
                        disabled={isLoadingMoreVideos}
                        className="px-8 py-3 rounded-full border dark:border-white/10 border-slate-200 text-sm font-bold dark:text-white text-slate-900 hover:bg-secondary/5 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        {/* Corrected Icon Logic */}
                        {isLoadingMoreVideos ? (
                          <RefreshCw size={16} className="animate-spin text-primary" />
                        ) : (
                          <Plus size={16} className="text-primary" />
                        )}

                        {/* Corrected Text Logic */}
                        <span>{isLoadingMoreVideos ? 'Loading...' : 'Load Older Videos'}</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/*  VIEW B: THE NEW PILL-SHAPED COMMENTS FEED */}
        {activeTab === 'comments' && (
          <div className="space-y-6 relative">

            {/* ── 1. STICKY HEADER & FILTER TABS ── */}
            <div className={cn(
              "sticky top-18 md:top-20 z-40 backdrop-blur-2xl border rounded-3xl p-3.5 mb-4 transition-all duration-500",
              theme === 'light' ? "bg-white/90 border-slate-200 shadow-sm" :
                theme === 'black' ? "bg-black/90 border-red-600/40 shadow-[0_0_25px_rgba(220,38,38,0.15)]" :
                  "bg-[#121212]/90 border-white/10 shadow-sm"
            )}>

              {/* Title Row: Now more compact */}
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex flex-col min-w-0">
                  <h1 className="text-lg sm:text-xl font-black dark:text-white text-slate-900 flex items-center gap-2">
                    Comments <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">{activeComments.length}</span>
                  </h1>
                  <p className={cn(
                    "text-xs sm:text-sm font-bold uppercase tracking-wide truncate max-w-50 sm:max-w-md mt-0.5 transition-colors",
                    theme === 'light' ? "text-slate-500" : "text-slate-400"
                  )}>
                    {currentVideo ? `From: ${currentVideo.title}` : "Engagement Feed"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasMoreComments && activeComments.length > 0 && (
                    <button
                      onClick={loadMoreComments}
                      disabled={isFetchingMoreComments}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full border transition-all flex items-center gap-1",
                        isFetchingMoreComments
                          ? "bg-slate-500/10 border-slate-500/20 text-slate-500 cursor-not-allowed opacity-60"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white active:scale-95"
                      )}
                    >
                      {isFetchingMoreComments ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} />}
                      {isFetchingMoreComments ? 'Loading...' : 'Get More'}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-1.5 rounded-full transition-all shadow-md active:scale-95"
                  >
                    <ArrowDownLeft size={12} /> Back
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 relative">
                {/* THE HUD TOOLTIP ── Fixed the Clipping Bug! */}
                <AnimatePresence>
                  {activeTooltip && activeTooltip !== 'main-filter' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.1 }}
                      className={cn(
                        "absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-max max-w-[90vw] px-4 py-2.5 z-[100] pointer-events-none rounded-xl border flex items-center",
                        // Clean high-contrast styling based on your theme
                        theme === 'light'
                          ? "bg-slate-900 text-white border-slate-800"
                          : "bg-white text-black border-white/20"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                        {activeTooltip === 'all' && 'Shows every comment pulled from the video.'}
                        {activeTooltip === 'pending' && 'Comments that need your attention.'}
                        {activeTooltip === 'replied' && 'Comments you have already responded to.'}
                        {activeTooltip === 'questions' && 'Comments containing questions from fans.'}
                        {activeTooltip === 'links' && 'Comments containing URLs and links.'}
                        {activeTooltip === 'verified' && 'Comments from verified creators.'}
                        {activeTooltip === 'negative' && 'Potential negative sentiment.'}
                        {activeTooltip === 'spam' && 'Likely spam or self-promotion.'}
                        {activeTooltip === 'newbie' && 'First-time commenters.'}
                        {activeTooltip === 'birthday' && 'Comments mentioning birthdays.'}
                        {activeTooltip === 'bots' && 'Comments suspected to be from bots or fake accounts.'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-secondary/5 p-1.5 rounded-2xl dark:border-white/5 border-slate-200 w-full">
                  {/* RESPONSIVE CONTAINER */}
                  <div className="flex md:grid overflow-x-auto md:overflow-visible md:grid-cols-5 gap-1.5 hide-scrollbar snap-x md:snap-none pb-0.5 md:pb-0">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: 'Unreplied' },
                      { id: 'replied', label: 'Replied' },
                      { id: 'questions', label: 'Questions' },
                      { id: 'links', label: 'Links' },
                      { id: 'verified', label: 'Verified' },
                      { id: 'negative', label: 'Negative' },
                      { id: 'spam', label: 'Spam' },
                      { id: 'newbie', label: 'Newbie' },
                      { id: 'birthday', label: 'Birthday' },
                      { id: 'bots', label: 'Bots' },
                    ].map((f) => {
                      const count = f.id === 'all'
                        ? activeComments.length
                        : activeComments.filter(c =>
                          (f.id === 'pending' || f.id === 'replied')
                            ? c.status === f.id
                            : (Array.isArray(c.ai_tags) && c.ai_tags.includes(f.id))
                        ).length;

                      return (
                        <button type="button" aria-label={`Filter comments by ${f.label}`}
                          key={f.id}
                          ref={(el) => { filterRefs.current[f.id] = el; }}
                          onClick={() => setCommentFilter(f.id as any)}

                          // 1. Kills mobile right-click menu
                          onContextMenu={(e) => e.preventDefault()}

                          // 2. Start/Stop Timers for HUD
                          onTouchStart={() => handleTooltipPressStart(f.id)}
                          onTouchEnd={handleTooltipPressEnd}
                          onTouchCancel={handleTooltipPressEnd}
                          onMouseDown={() => handleTooltipPressStart(f.id)}
                          onMouseUp={handleTooltipPressEnd}
                          onMouseLeave={handleTooltipPressEnd}

                          className={cn(
                            "relative select-none whitespace-nowrap md:whitespace-normal shrink-0 md:shrink w-auto md:w-full snap-start md:snap-none px-4 py-2.5 md:px-2 md:py-2 rounded-full text-[11px] md:text-[10px] font-black capitalize transition-all flex items-center justify-center gap-1.5 border-2",
                            commentFilter === f.id
                              ? (theme === 'light'
                                ? "bg-primary text-white border-primary shadow-[0_8px_16px_-4px_rgba(99,102,241,0.4)]"
                                : "bg-primary/10 text-primary border-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]")
                              : theme === 'light'
                                ? "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                                : "dark:border-white/5 border-slate-200 dark:text-slate-400 text-slate-500 hover:dark:text-white hover:bg-secondary/10 hover:border-primary/30"
                          )}
                          style={{
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                            touchAction: 'pan-x'
                          }}
                        >
                          {/* Visual Indicators */}
                          {f.id === 'pending' && count > 0 && (
                            <div className={cn("w-2 h-2 rounded-full", commentFilter === 'pending' ? "bg-white" : "bg-orange-500 animate-pulse")} />
                          )}
                          {f.id === 'replied' && (
                            <CheckCircle2 size={12} className={cn("text-emerald-500", commentFilter === 'replied' && "text-white")} />
                          )}
                          {f.id === 'verified' && (
                            <BadgeCheck size={14} className={cn(commentFilter === 'verified' ? "text-white" : "text-[#3b82f6]")} />
                          )}

                          <span>{f.label}</span>
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded-full font-bold transition-colors",
                            commentFilter === f.id
                              ? "bg-primary text-white" // Active: Solid background so white text pops
                              : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400" // Inactive: Darker text for Light Mode
                          )}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Small Select All Row & Bulk Actions */}
                  <div className="flex items-center justify-between px-2 mt-5 w-full">

                    {/* Left Side: Select All / Clear */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedComments(filteredComments.map(c => c.id))} className="text-[9px] font-black dark:text-slate-400 text-slate-500 hover:text-primary flex items-center gap-1 transition-colors uppercase">
                        <CheckSquare size={12} /> Select All
                      </button>
                      {selectedComments.length > 0 && (
                        <button onClick={() => setSelectedComments([])} className="text-[9px] font-black text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-2 py-0.5 rounded-full uppercase">
                          Clear All ({selectedComments.length})
                        </button>
                      )}
                    </div>

                    {/* Right Side: NEW Classify Button */}
                    <div className={cn(
                      "relative inline-flex rounded-full p-[1px] transition-all shadow-md",
                      isClassifyingAll || activeComments.length === 0
                        ? "bg-slate-700 opacity-60 cursor-not-allowed" // Dull gray border when disabled
                        : "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 hover:scale-[1.02]" // Rainbow gradient
                    )}>
                      <button
                        type="button"
                        onClick={handleClassifyComments}
                        disabled={isClassifyingAll || activeComments.length === 0}
                        className={cn(
                          "flex items-center gap-1.5 text-[10px] font-black text-gray-200 px-3 py-1.5 rounded-full transition-all uppercase tracking-wider h-full w-full",
                          isClassifyingAll || activeComments.length === 0
                            ? "bg-[#0f0f0f] cursor-not-allowed"
                            : "bg-[#0f0f0f] hover:bg-[#1a1a1a]" // Matches the dark background of the GET MORE button
                        )}
                      >
                        {isClassifyingAll ? (
                          <Loader2 size={12} className="animate-spin text-white" />
                        ) : (
                          <Sparkles size={12} className="text-white" />
                        )}
                        <span>
                          {isClassifyingAll ? "Classifying" : "Sort All"}
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {classificationProgress > 0 && (
              <div className={cn(
                "w-full mb-6 p-4 rounded-2xl border transition-all",
                theme === 'light'
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-[#1a1a1a] border-white/10"
              )}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-wider">
                      {classificationProgress >= 100 ? "Finalising..." : "Classifying Comments"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold dark:text-slate-400 text-slate-500">
                      {classificationProgress}%
                    </span>
                    <button
                      onClick={handleCancelClassification}
                      className="px-3 py-1 text-[10px] font-black text-red-500 bg-red-500/10 border border-red-500/20 rounded-full hover:bg-red-500/20 transition-colors uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ width: "1%" }}
                    animate={{ width: `${classificationProgress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                <p className="mt-2.5 text-[10px] font-medium dark:text-slate-500 text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Running server-side — safe to close this tab. Progress saves automatically.
                </p>
              </div>
            )}

            {/* ── 2. COMMENTS LIST ── */}
            {isFetchingComments ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <Loader2 size={40} className="text-primary animate-spin mb-4 opacity-50" />
                <CyclingLoadingText messages={[
                  "Fetching your Comments...",
                  "Scanning Public Data Streams...",
                  "Categorizing comments...",
                  "Optimizing Engagement Feed...",
                  "AI Filtering...",
                  "Finalizing...",
                  "Almost Ready..."
                ]} />
              </div>
            ) : activeComments.length === 0 ? (
              <div className={cn("p-20 border-2 border-dashed rounded-[40px] text-center", theme === 'light' ? "bg-white border-slate-200" : "bg-white/5 border-white/5")}>
                <MessageSquare className="mx-auto mb-4 opacity-10" size={48} />
                <p className="text-sm font-bold dark:text-slate-400 text-slate-500">No comments found.</p>
              </div>
            ) : filteredComments.length === 0 ? (
              // 🆕 THE NEW EMPTY STATE FOR FILTERS
              <div className={cn("p-20 border-2 border-dashed rounded-[40px] text-center mt-4", theme === 'light' ? "bg-white border-slate-200" : "bg-white/5 border-white/5")}>
                <Filter className="mx-auto mb-4 opacity-10" size={48} />

                <p className="text-sm font-bold dark:text-slate-400 text-slate-500">
                  This section currently has no <span className="text-primary">{(commentFilter === 'pending' ? 'unreplied' : commentFilter).toLowerCase()}</span> comments.
                </p>

                <button
                  onClick={() => setCommentFilter('all')}
                  className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  View all comments
                </button>
              </div>
            ) : (
              <div className="space-y-4 pb-32">
                <AnimatePresence>
                  {/* Using the pre-calculated array here! */}
                  {filteredComments.map((comment, index) => {
                    const isSelected = selectedComments.includes(comment.id);
                    const isMenuOpen = openMenuId === comment.id;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={comment.id || comment.youtube_comment_id || `comment-${index}`}
                        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1, delay: Math.min(index * 0.04, 0.8) }}
                        onTouchStart={() => { pressTimer.current = setTimeout(() => { setSelectedComments(p => p.includes(comment.id) ? p.filter(id => id !== comment.id) : [...p, comment.id]) }, 500) }}
                        onTouchEnd={() => { if (pressTimer.current) clearTimeout(pressTimer.current) }}
                        onTouchMove={() => { if (pressTimer.current) clearTimeout(pressTimer.current) }}
                        onClick={() => selectedComments.length > 0 && setSelectedComments(p => p.includes(comment.id) ? p.filter(id => id !== comment.id) : [...p, comment.id])}
                        className={cn(
                          "p-5 px-8 border rounded-[40px] transition-colors duration-300 shadow-none", // shadow-none kills all glow
                          theme === 'light' ? "bg-white border-slate-200" :
                            theme === 'black' ? "bg-[#0a0a0a] border-red-900/30" : // This is much darker than charcoal
                              "bg-[#1a1a1a] border-white/10",

                          isSelected && "ring-2 ring-primary border-primary bg-primary/5",
                          editingCommentId === comment.id && "border-orange-500 bg-orange-500/3 dark:bg-orange-500/5"
                        )}
                      >
                        <div className="flex flex-col w-full gap-2">

                          {/* --- TOP ROW: AVATAR & TEXT --- */}
                          <div className="flex items-start gap-5 w-full">
                            <div
                              className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary/10 shrink-0 border dark:border-white/10 border-slate-200 flex items-center justify-center mt-1 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomFailed(false); // Stops the comment from being selected
                                setZoomedUser({ avatar: comment.avatar, name: comment.fan_name });
                              }}
                            >
                              <img
                                src={getHighResAvatar(comment.avatar)}
                                alt={comment.fan_name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLDivElement;
                                  if (fallback) { fallback.classList.remove('hidden'); fallback.classList.add('flex'); }
                                }}
                              />
                              <div className="hidden absolute inset-0 items-center justify-center bg-primary/10 text-primary">
                                <span className="font-black text-sm uppercase">{(comment.fan_name || "").replace('@', '').charAt(0) || "U"}</span>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">

                                  {comment.is_pinned && (
                                    <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest animate-in fade-in slide-in-from-left-2 shrink-0 whitespace-nowrap">
                                      <Pin size={10} className="rotate-45" fill="currentColor" />
                                      Pinned
                                    </div>
                                  )}

                                  <a
                                    href={`https://www.youtube.com/${comment.fan_name?.startsWith('@') ? comment.fan_name : '@' + comment.fan_name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-black text-sm dark:text-white text-slate-900 truncate hover:underline hover:text-primary transition-colors cursor-pointer"
                                  >
                                    {comment.fan_name}
                                  </a>

                                  {/* NEW SMALL YOUTUBE ICON */}
                                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-500 fill-current shrink-0">
                                    <title>YouTube Icont</title>
                                    <path d={SOCIAL_ICONS.youtube} />
                                  </svg>

                                  <span className="text-[10px] dark:text-slate-400 text-slate-500 font-bold opacity-60 shrink-0 whitespace-nowrap">
                                    {formatTimeAgo(comment.published_at)}
                                    <span className="hidden sm:inline">
                                      <span className="opacity-40"> · </span>
                                      {new Date(comment.published_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                  </span>
                                </div>

                                <div className="relative shrink-0 z-10">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : comment.id); }}
                                    aria-label="Open menu"
                                    className="p-1.5 rounded-full dark:text-slate-400 text-slate-500 hover:bg-secondary/10 hover:dark:text-white hover:text-slate-900 transition-colors"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  {isMenuOpen && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                                      <div className={cn("absolute right-0 top-full mt-1 w-36 border rounded-2xl shadow-xl z-50 overflow-hidden", theme === 'light' ? "bg-white border-slate-200" : "bg-[#1a1a1a] border-white/10")}>

                                        {/* NEW TRANSLATE BUTTON */}
                                        <button onClick={(e) => { e.stopPropagation(); handleTranslateComment(comment.id, comment.comment_text); }} className="w-full text-left px-4 py-2.5 text-xs font-bold dark:text-white text-slate-900 hover:bg-secondary/10 flex items-center gap-2 transition-colors border-b dark:border-white/10 border-slate-200">
                                          {isTranslating === comment.id ? <Loader2 size={14} className="animate-spin text-blue-500" /> : <Languages size={14} className="text-blue-500" />}
                                          {showTranslation[comment.id] ? "Show Original" : "Translate"}
                                        </button>

                                        <button onClick={(e) => { e.stopPropagation(); handleTogglePin(comment.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold dark:text-white text-slate-900 hover:bg-secondary/10 flex items-center justify-between transition-colors">
                                          <div className="flex items-center gap-2">
                                            <Pin size={14} className={cn(comment.is_pinned && "rotate-45 text-primary")} />
                                            {comment.is_pinned ? "Unpin Comment" : "Pin to Top"}
                                          </div>
                                          {comment.is_pinned && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                                        </button>

                                        <button onClick={(e) => { e.stopPropagation(); setActiveComments(prev => prev.filter(c => c.id !== comment.id)); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-orange-500 hover:bg-orange-500/10 flex items-center gap-2 transition-colors">
                                          <EyeOff size={14} /> Hide
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); requestDelete(comment.youtube_comment_id, comment.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors border-t dark:border-white/10 border-slate-200">
                                          <Trash size={14} /> Delete
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              
                              <div className="flex flex-col gap-1">
                                {showTranslation[comment.id] && translations[comment.id] && (
                                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                                    Translated from {translations[comment.id].language}
                                  </span>
                                )}
                                <p
                                  className="text-sm dark:text-gray-200 text-slate-800 break-words"
                                  // Swap the text based on the showTranslation state!
                                  dangerouslySetInnerHTML={{
                                    __html: showTranslation[comment.id] ? translations[comment.id].text : comment.comment_text
                                  }}
                                />
                              </div>

                              <div className="flex items-center gap-4 mt-3">
                                <button onClick={(e) => { e.stopPropagation(); const newRating = comment.viewer_rating === 'like' ? 'none' : 'like'; handleRateComment(comment.youtube_comment_id, newRating); }} className={cn("flex items-center gap-1.5 text-[11px] font-bold transition-all p-1 rounded-md", comment.viewer_rating === 'like' ? "text-blue-500 bg-blue-500/10" : "dark:text-slate-400 text-slate-500 hover:text-primary")}>
                                  <ThumbsUp size={16} fill={comment.viewer_rating === 'like' ? "currentColor" : "none"} /> Like
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); const newRating = comment.viewer_rating === 'dislike' ? 'none' : 'dislike'; handleRateComment(comment.youtube_comment_id, newRating); }} className={cn("flex items-center gap-1.5 text-[11px] font-bold transition-all p-1 rounded-md", comment.viewer_rating === 'dislike' ? "text-red-500 bg-red-500/10" : "dark:text-slate-400 text-slate-500 hover:text-red-500")}>
                                  <ThumbsDown size={16} fill={comment.viewer_rating === 'dislike' ? "currentColor" : "none"} /> Dislike
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* --- CONTINUOUS CHAT: BADGE + REPLY BOX --- */}
                          <div className="flex flex-col w-full gap-1.5 mt-2">

                            {/* THE NEW BADGE (Framer Motion Sync) */}
                            {comment.status === 'replied' && editingCommentId !== comment.id && comment.reply_text && (
                              <motion.div
                                layout
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="flex items-start gap-2 ml-2 mt-1 mb-1 origin-top-left overflow-hidden"
                              >
                                <div className="w-5 h-5 border-l-2 border-b-2 dark:border-white/10 border-slate-200 rounded-bl-xl mt-1 shrink-0" />

                                {/* Your preferred Bubble or Card approach goes inside here */}
                                <div className="w-fit max-w-[95%] bg-emerald-500/5 border border-emerald-500/20 py-2 px-3.5 rounded-3xl rounded-tl-xl shadow-sm">
                                  <div className="flex items-center justify-between gap-6 mb-0.5">
                                    <span className="text-[10px] text-emerald-500 font-black flex items-center gap-1.5 uppercase tracking-wide">
                                      <CheckCircle2 size={12} /> You sent
                                      {comment.is_edited && (
                                        <span className="text-[9px] text-emerald-500/60 font-bold normal-case tracking-normal ml-1">
                                          (edited)
                                        </span>
                                      )}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCommentId(comment.id);
                                        // 🚀 THE FIX: Load the existing reply into the draft state immediately
                                        setDrafts(prev => ({ ...prev, [comment.id]: comment.reply_text }));
                                      }}
                                      className="text-[10px] text-primary font-bold hover:text-primary/80 transition-colors underline-offset-2 hover:underline shrink-0"
                                    >
                                      Edit
                                    </button>
                                  </div>

                                  <p className="text-sm dark:text-slate-300 text-slate-700 font-medium opacity-90 break-words max-h-25 py-0.5 leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {comment.reply_text}
                                  </p>

                                  {comment.replied_at && (
                                    <div className="mt-0.5 flex items-center justify-end">
                                      <span className="text-[8px] font-bold text-slate-500/60 dark:text-slate-400/60 tracking-wider">
                                        {formatTimeAgo(comment.replied_at)} . {new Date(comment.replied_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).replace('.', ':').replace(' ', '')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}

                            {/* THE TEXT BOX */}
                            <div className="flex flex-row items-center gap-2 w-full">
                              <div className={cn(
                                "relative flex-1 min-w-0 bg-secondary/5 border rounded-3xl transition-all duration-300",
                                editingCommentId === comment.id ? "border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20" : "dark:border-white/10 border-slate-200 focus-within:ring-2 focus-within:ring-primary/20"
                              )}>
                                <textarea
                                  rows={1}
                                  placeholder={editingCommentId === comment.id ? "Edit reply..." : "Type a reply or use AI..."}
                                  value={drafts[comment.id] !== undefined ? drafts[comment.id] : (editingCommentId === comment.id ? comment.reply_text : "")}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full bg-transparent py-2.5 pl-5 pr-14 text-sm outline-none resize-none min-h-10.5 max-h-37.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                  onChange={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                    setDrafts(prev => ({ ...prev, [comment.id]: e.target.value }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      const sendBtn = e.currentTarget.parentElement?.querySelector('button[aria-label="inner-send"]') as HTMLButtonElement;
                                      const updateBtn = e.currentTarget.parentElement?.parentElement?.querySelector('button[aria-label="Update reply"]') as HTMLButtonElement;
                                      if (editingCommentId === comment.id) { if (updateBtn) updateBtn.click(); } else { if (sendBtn) sendBtn.click(); }
                                    }
                                  }}
                                />
                                <AnimatePresence>
                                  {(drafts[comment.id]?.length > 0 && editingCommentId !== comment.id) && (
                                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} aria-label="inner-send"
                                      onClick={async (e) => {
                                        e.stopPropagation();

                                        if (massReplyProgress) {
                                          showToast("Cannot perform operation! Please wait while Mass reply is in progress", "error");
                                          return;
                                        }

                                        const savedMessage = drafts[comment.id];
                                        if (!savedMessage?.trim()) return;

                                        setDrafts(prev => ({ ...prev, [comment.id]: "" }));
                                        const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                                        if (textarea) textarea.style.height = 'auto';

                                        const success = await handleSendReply(comment.youtube_comment_id, savedMessage);

                                        if (!success) {
                                          setDrafts(prev => ({ ...prev, [comment.id]: savedMessage }));
                                        }
                                      }}
                                      className="absolute right-2.5 bottom-1.5 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                                    >
                                      <Send size={14} className="rotate-45 ml-0.5" />
                                    </motion.button>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className={cn("flex shrink-0", editingCommentId === comment.id ? "flex-col gap-1.5" : "flex-row items-center gap-1.5")}>
                                {editingCommentId === comment.id ? (
                                  <>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditingCommentId(null); setDrafts({ ...drafts, [comment.id]: "" }); }} className="px-3 py-1.5 rounded-xl bg-secondary/10 text-slate-500 text-[9px] font-black uppercase tracking-tighter hover:bg-secondary/20 transition-all shrink-0">Cancel</button>
                                    <button
                                      type="button"
                                      aria-label="Update reply"
                                      disabled={
                                        drafts[comment.id] === undefined ||
                                        drafts[comment.id].trim() === (comment.reply_text || "").trim() ||
                                        drafts[comment.id].trim() === ""
                                      }
                                      onClick={async (e) => {
                                        e.stopPropagation();

                                        if (massReplyProgress) {
                                          showToast("Cannot perform operation! Please wait while the mass reply is in progress.", "error");
                                          return;
                                        }

                                        // 1. Capture the message first
                                        const updatedMessage = (drafts[comment.id] || comment.reply_text)?.trim();
                                        if (!updatedMessage) return;

                                        // 🚀 THE MAGIC: Update the UI INSTANTLY before the API call
                                        setEditingCommentId(null);
                                        setDrafts(prev => ({ ...prev, [comment.id]: "" }));

                                        const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                                        if (textarea) textarea.style.height = 'auto';

                                        // 2. Now talk to YouTube in the background
                                        const success = await handleSendReply(comment.youtube_comment_id, updatedMessage);

                                        // 3. Rollback ONLY if it failed
                                        if (!success) {
                                          setEditingCommentId(comment.id);
                                          setDrafts(prev => ({ ...prev, [comment.id]: updatedMessage }));
                                          showToast("Update failed. Restoring your text.", "error");
                                        }
                                      }}
                                      className={cn(
                                        "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all shrink-0",
                                        (drafts[comment.id] === undefined || drafts[comment.id].trim() === (comment.reply_text || "").trim() || drafts[comment.id].trim() === "")
                                          ? "bg-orange-500/40 text-white/50 cursor-not-allowed shadow-none" // The disabled state (faded out)
                                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-md" // The active state (bright orange)
                                      )}
                                    >
                                      Update
                                    </button>
                                  </>
                                ) : (
                                    <button
                                      type="button"
                                      aria-label="Generate AI reply"
                                      disabled={isGeneratingAI === comment.id}
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        await handleGenerateAI(comment.id, comment.comment_text, currentVideo?.title || 'Unknown Video');
                                      }}
                                      className={cn(
                                        "w-9 h-9 rounded-full transition-all shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border-2",
                                        theme === 'light'
                                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-110"
                                          : theme === 'black'
                                            ? "bg-primary/20 text-primary border-primary shadow-[0_0_15px_rgba(99,102,241,0.6)] hover:bg-primary/30 hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                                            : "bg-primary/15 text-primary border-primary/50 shadow-[0_0_10px_rgba(99,102,241,0.3)] hover:border-primary"
                                      )}
                                    >
                                      {isGeneratingAI === comment.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                      ) : (
                                        <Sparkles size={16} />
                                      )}
                                    </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
            {/* ── 3. MASS REPLY BAR ── */}
            <AnimatePresence>
              {(selectedComments.length > 0 || massReplyProgress) && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className={cn(
                    "fixed bottom-24 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl border border-primary/40 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-4xl p-4 z-50 flex flex-row items-center gap-2 transition-colors duration-500",
                    theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'
                  )}
                >
                  {massReplyProgress ? (
                    <div className="flex flex-row items-center justify-between w-full px-2 animate-in fade-in zoom-in-95">
                      <div className="flex flex-col flex-1 gap-1">
                        <div className="flex justify-between items-center pr-4">
                          <span className="text-[10px] font-black uppercase text-primary tracking-widest">Sending Replies...</span>
                          <span className="text-[10px] font-bold dark:text-slate-400 text-slate-500">
                            {massReplyProgress.current} / {massReplyProgress.total}
                          </span>
                        </div>
                        {/* Progress Bar Background */}
                        <div className="h-1.5 w-full bg-secondary/10 rounded-full overflow-hidden mr-4">
                          {/* Animated Progress Fill */}
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(massReplyProgress.current / massReplyProgress.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => { abortMassReplyRef.current = true; }}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative flex-1 min-w-0 bg-secondary/5 border rounded-3xl transition-colors dark:border-white/10 border-slate-200 focus-within:ring-2 focus-within:ring-primary/20">
                        <textarea
                          rows={1}
                          placeholder={`Mass reply to ${selectedComments.length} comments...`}
                          className="w-full bg-transparent py-2.5 pl-5 pr-12 text-sm outline-none resize-none min-h-10.5 max-h-37.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                          onChange={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const sendBtn = e.currentTarget.parentElement?.querySelector('button[aria-label="Send mass reply"]') as HTMLButtonElement;
                              if (sendBtn) sendBtn.click();
                            }
                          }}
                        />

                        {/* INNER SEND BUTTON */}
                        <button
                          type="button"
                          aria-label="Send mass reply"
                          onClick={(e) => {
                            const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                            const message = textarea?.value.trim();
                            const filteredIds = new Set(filteredComments.map(c => c.id));
                            const commentsToProcess = selectedComments.filter(id => filteredIds.has(id));
                            const selectionCount = commentsToProcess.length;

                            if (!message) {
                              showToast("Please type a comment first before sending", "error");
                              return;
                            }

                            // Quota Check
                            const currentUsage = gamification.dailyDone || 0;
                            const totalPotential = selectionCount + currentUsage;

                            if (!isPremium && totalPotential > gamification.dailyGoal) {
                              const remaining = gamification.dailyGoal - currentUsage;

                              if (remaining > 0) {
                                showToast(`Quota Warning: You only have ${remaining} replies left today. You tried to send ${selectionCount}.`, "error");
                              } else {
                                setIsUpgradeModalOpen(true);
                              }
                              return;
                            }

                            abortMassReplyRef.current = false;
                            setMassReplyProgress({ current: 0, total: selectionCount });
                            showToast(`Sending ${selectionCount} replies...`, "success");

                            setSelectedComments([]);
                            if (textarea) {
                              textarea.value = '';
                              textarea.style.height = 'auto';
                            }

                            // The Loop
                            (async () => {
                              let processed = 0;
                              let hasErrors = false;
                              setEditingCommentId(null); // Prevents accidental edits

                              for (const commentId of commentsToProcess) {
                                if (abortMassReplyRef.current) break;

                                const target = activeComments.find(c => c.id === commentId);
                                if (target) {
                                  // 🚨 FIX: Pass 'true' to skip UI refreshing until the loop finishes
                                  const success = await handleSendReply(target.youtube_comment_id, message, true);

                                  processed++;
                                  setMassReplyProgress({ current: processed, total: selectionCount });

                                  // 🚨 FIX: Actually stop the loop if YouTube rejects the comment
                                  if (!success) {
                                    hasErrors = true;
                                    showToast("Mass reply interrupted due to an error.", "error");
                                    break;
                                  }

                                  await new Promise(r => setTimeout(r, Math.random() * 700 + 800));
                                }
                              }

                              setMassReplyProgress(null);

                              // 🚨 FIX: Refresh the dashboard once at the very end to update the Daily Quota UI
                              await fetchDashboardData(user?.id);

                              if (!abortMassReplyRef.current && !hasErrors) {
                                showToast("Mass reply finished. All comments posted!", "success");
                              }
                            })();
                          }}
                          className="absolute right-1.5 bottom-1.5 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                        >
                          <Send size={14} className="rotate-45 ml-0.5" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* COMMENTS FILTER FAB */}
            <button type="button" aria-label="Open filter menu"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={cn(
                "fixed bottom-20 right-4 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center z-50 md:hidden hover:scale-105 active:scale-95 transition-all border-2",
                showMobileFilters
                  ? "bg-red-500 border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                  : "bg-primary border-white/20 shadow-[0_0_25px_rgba(99,102,241,0.4)]"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showMobileFilters ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {showMobileFilters ? <X size={24} /> : <Filter size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* MOBILE FILTER MODAL */}
            <AnimatePresence>
              {showMobileFilters && (
                <>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMobileFilters(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                  />

                  {/* Stacked Individual Filter Pills */}
                  <div className="fixed bottom-36 right-4 left-4 z-50 grid grid-cols-2 gap-3 md:hidden">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: 'Unreplied' },
                      { id: 'replied', label: 'Replied' },
                      { id: 'questions', label: 'Questions' },
                      { id: 'links', label: 'Links' },
                      { id: 'verified', label: 'Verified' },
                      { id: 'negative', label: 'Negative' },
                      { id: 'spam', label: 'Spam' },
                      { id: 'newbie', label: 'Newbie' },
                      { id: 'birthday', label: 'Birthday' },
                      { id: 'bots', label: 'Bots' },
                    ].map((f, i) => {
                      const isSelected = commentFilter === f.id;
                      const count = f.id === 'all'
                        ? activeComments.length
                        : activeComments.filter(c =>
                          (f.id === 'pending' || f.id === 'replied')
                            ? c.status === f.id
                            : (Array.isArray(c.ai_tags) && c.ai_tags.includes(f.id))
                        ).length;

                      return (
                        <motion.button
                          key={f.id}
                          initial={{ opacity: 0, x: 20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 20, scale: 0.8 }}
                          transition={{ delay: i * 0.04, type: "spring", stiffness: 500, damping: 20 }}

                          // ─── 1. STANDARD CLICK LOGIC ───
                          onClick={() => {
                            setCommentFilter(f.id as any);
                            setShowMobileFilters(false);
                          }}

                          // ─── 2. THE LONG PRESS TOUCH EVENTS ───
                          onContextMenu={(e) => e.preventDefault()}
                          onTouchStart={() => handleTooltipPressStart(f.id)}
                          onTouchEnd={handleTooltipPressEnd}
                          onTouchCancel={handleTooltipPressEnd}
                          onMouseDown={() => handleTooltipPressStart(f.id)}
                          onMouseUp={handleTooltipPressEnd}
                          onMouseLeave={handleTooltipPressEnd}

                          className={cn(
                            "relative select-none flex items-center gap-2.5 px-5 py-3 rounded-full border-2 shadow-2xl transition-all active:scale-95",
                            isSelected
                              ? (theme === 'light'
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                : theme === 'black'
                                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                                  : "bg-primary/15 border-primary/70 text-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]")
                              : theme === 'light'
                                ? "bg-white border-slate-300 text-slate-800"
                                : theme === 'black'
                                  ? "bg-black border-white/10 text-slate-400"
                                  : "bg-[#1a1a1a] border-white/15 text-slate-300"
                          )}
                          // 🚨 Added the iOS safeguard styles here
                          style={{
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                          }}
                        >
                          <span className="text-sm font-black capitalize tracking-wide">{f.label}</span>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto transition-colors",
                            isSelected
                              ? "bg-white text-primary" // Active on Mobile
                              : "bg-slate-100 dark:bg-secondary/10 text-slate-700 dark:text-slate-400" // Inactive: Slate-700 for max clarity
                          )}>
                            {count}
                          </span>

                          {/* Dynamic Visual Indicators */}
                          {f.id === 'pending' && unrepliedCount > 0 && (
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isSelected ? "bg-white" : "bg-orange-500 animate-pulse"
                            )} />
                          )}
                          {f.id === 'replied' && (
                            <CheckCircle2 size={14} className={isSelected ? "text-white" : "text-emerald-500"} />
                          )}
                          {f.id === 'verified' && (
                            <BadgeCheck size={14} className={isSelected ? "text-white" : "text-blue-500"} />
                          )}

                          {/* ─── 3. THE TOOLTIP UI ─── */}
                          <AnimatePresence>
                            {activeTooltip === f.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 p-2.5 bg-black/90 backdrop-blur-md text-white text-xs rounded-xl shadow-2xl border border-white/20 z-50 pointer-events-none whitespace-normal text-center leading-relaxed"
                              >
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/90 border-r border-b border-white/20 rotate-45" />

                                {/* We need to grab the info text from the array you built earlier! */}
                                <span className="relative z-10 font-medium normal-case">
                                  {f.id === 'all' && 'Shows every comment pulled from the video.'}
                                  {f.id === 'pending' && 'Comments that need your attention.'}
                                  {f.id === 'replied' && 'Comments you have already responded to.'}
                                  {f.id === 'replied_back' && 'Fans who have replied back to you.'}
                                  {f.id === 'questions' && 'Comments containing question.'}
                                  {f.id === 'links' && 'Comments containing URLs and links.'}
                                  {f.id === 'verified' && 'Comments from verified content creators e.g Mr.Beast.'}
                                  {f.id === 'negative' && 'Comments with potential negative sentiment.'}
                                  {f.id === 'spam' && 'Likely spam or self-promotion.'}
                                  {f.id === 'newbie' && 'First-time commenters.'}
                                  {f.id === 'birthday' && 'Comments mentioning birthdays.'}
                                  {f.id === 'bots' && 'Comments suspected to be from bots or fake accounts.'}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* FULL SCREEN IMAGE ZOOM MODAL */}
        <AnimatePresence>
          {zoomedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-9999 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setZoomedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl border-4 border-white/10 overflow-hidden bg-secondary/20 flex items-center justify-center"
              >
                {/* LAYER 1: THE INITIALS (Only shows if there is NO avatar URL at all) */}
                {!zoomedUser.avatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary z-0">
                    <span className="font-black text-6xl md:text-8xl uppercase">
                      {(zoomedUser.name || "").replace('@', '').charAt(0) || "U"}
                    </span>
                  </div>
                )}

                {/* LAYER 2: THE BASE IMAGE (Becomes the crisp fallback if high-res fails) */}
                {zoomedUser.avatar && (
                  <img
                    src={zoomedUser.avatar}
                    referrerPolicy="no-referrer"
                    alt="Profile Base"
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover z-10 transition-all duration-300",
                      !zoomFailed ? "blur-xl scale-110 opacity-60" : "blur-0 scale-100 opacity-100"
                    )}
                  />
                )}

                {/* LAYER 3: THE HIGH-RES UPGRADE (Pops in over the blur if successful) */}
                {zoomedUser.avatar && !zoomFailed && (
                  <img
                    src={zoomedUser.avatar.replace(/=s\d+/, "=s1800")}
                    referrerPolicy="no-referrer"
                    alt="Zoomed Profile"
                    className="absolute inset-0 w-full h-full object-cover z-20"
                    onError={() => setZoomFailed(true)} // If it 404s, trigger the un-blur of Layer 2
                  />
                )}
              </motion.div>

              <span className="absolute top-8 right-8 text-white/50 text-sm font-bold uppercase tracking-widest animate-pulse">
                Click anywhere to close
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎬 THEATER MODE MODAL */}
        <AnimatePresence>
          {activeVideoId && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Dark Blur Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveVideoId(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
              />

              {/* Video & Controls Wrapper */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl z-50 flex flex-col items-end gap-3"
              >
                {/* TOP CONTROL BAR (HUD) - Optimized for space */}
                <div className="flex items-center gap-2 pr-2">

                  {/* 🔗 THE EXTERNAL LINK BUTTON */}
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-black/60 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all border border-white/10 flex items-center gap-2 px-3 group shadow-xl"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                      View Source
                    </span>
                    <ExternalLink size={14} />
                  </a>

                  {/* ❌ THE CLOSE BUTTON */}
                  <button type="button" aria-label="Close"
                    onClick={() => setActiveVideoId(null)}
                    className="p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-xl"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* YouTube Embed Box */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.3)] bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM TAB BAR */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t pb-2 shadow-2xl transition-colors duration-500",
        // 🎨 Expanded Logic:
        theme === 'light' ? "bg-white border-slate-200" :
          theme === 'black' ? "bg-black border-white/5" :
            "bg-[#121212] border-white/10" // This is your Charcoal mode!
      )}>
        <div className="max-w-md mx-auto flex justify-around items-center p-3">

          {/* HOME BUTTON */}
          <button
            onClick={() => setActiveTab('home')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === 'home' ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            )}
          >
            <Home size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* COMMENTS BUTTON - FIXED LOGIC */}
          <button
            onClick={handleCommentsNav}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === 'comments' ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            )}
          >
            <MessageSquare size={22} />
            <span className="text-[10px] font-bold">Comments</span>
          </button>

          {/* 📊 ANALYSIS BUTTON (MOBILE) */}
          <button
            onClick={() => setActiveTab('analysis')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === 'analysis' ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            )}
          >
            <BarChart3 size={22} />
            <span className="text-[10px] font-bold">My Analysis</span>
          </button>

          {/* SETTINGS BUTTON */}
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === 'settings' ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            )}
          >
            <Settings size={22} />
            <span className="text-[10px] font-bold">Settings</span>
          </button>

        </div>
      </nav>

    </div>
  );
}