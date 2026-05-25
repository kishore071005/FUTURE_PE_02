"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Video, BarChart3, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

interface SavedScript {
  id: string;
  product_name: string;
  brand_type: string;
  target_audience: string;
  platform: string;
  tone: string;
  hook: string;
  script: string;
  caption: string;
  hashtags: string;
  cta: string;
  created_at: string;
}

const platformGradients: Record<string, string> = {
  'TikTok': 'from-pink-500 to-rose-600',
  'Instagram Reels': 'from-amber-500 to-orange-600',
  'YouTube Shorts': 'from-red-500 to-red-700',
  'Facebook Ads': 'from-blue-500 to-indigo-600',
};

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(stored);

    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    async function fetchScripts() {
      try {
        const res = await fetch('/api/saved');
        if (res.ok) {
          const data = await res.json();
          setScripts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching dashboard scripts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchScripts();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const recentScripts = scripts.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Auth Banner */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>🔒</span> Cloud Sync Offline
            </h3>
            <p className="text-sm text-violet-200/70">
              Sign in or create an account to save your generated scripts and sync them to Supabase.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.setItem("isLoggedIn", "true");
                window.dispatchEvent(new Event("storage"));
                window.location.reload();
              }}
              className="btn-gradient text-xs py-2 px-4 shadow-md"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                localStorage.setItem("isLoggedIn", "true");
                window.dispatchEvent(new Event("storage"));
                window.location.reload();
              }}
              className="input-glass text-xs py-2 px-4 hover:bg-white/10 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 custom={0} variants={stagger} initial="hidden" animate="visible"
                      className="text-4xl font-black tracking-tight text-white"
          >
            Dashboard
          </motion.h1>
          <motion.p custom={1} variants={stagger} initial="hidden" animate="visible"
            className="text-violet-200 mt-1 font-medium"
          >
            Welcome back. Here&apos;s an overview of your ad generation.
          </motion.p>
        </div>
        <motion.div custom={2} variants={stagger} initial="hidden" animate="visible">
          <Link href="/dashboard/generate" className="btn-gradient text-sm py-2.5 px-5">
            <Plus className="w-4 h-4" />
            New Script
          </Link>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Scripts Saved", value: loading ? "..." : scripts.length.toString(), icon: Video, trend: "+12%", color: "from-violet-500 to-purple-600", trendColor: "text-emerald-400" },
          { title: "Avg. Hook Rate", value: scripts.length > 0 ? "74%" : "0%", icon: TrendingUp, trend: "+4%", color: "from-pink-500 to-rose-600", trendColor: "text-emerald-400" },
          { title: "Est. Impressions", value: scripts.length > 0 ? `${(scripts.length * 12.5).toFixed(1)}K` : "0", icon: BarChart3, trend: "+24%", color: "from-cyan-500 to-blue-600", trendColor: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="glass-card p-6 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-violet-200/80 uppercase tracking-wider">{stat.title}</h3>
              <div className={`bg-gradient-to-br ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className={`w-3.5 h-3.5 ${stat.trendColor}`} />
              <span className={`text-xs font-bold ${stat.trendColor}`}>{stat.trend}</span>
              <span className="text-xs text-violet-200/60 ml-1">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Scripts */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Scripts</h2>
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-violet-200/60">
              Loading recent scripts...
            </div>
          ) : recentScripts.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-400/40" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">No scripts saved yet</h4>
                <p className="text-xs text-violet-200/60 mt-1 max-w-sm mx-auto">
                  Generate high-converting scripts with AI and save them to see them here!
                </p>
              </div>
              <Link href="/dashboard/generate" className="btn-gradient inline-flex text-xs py-2 px-4 shadow-md">
                Generate First Script
              </Link>
            </div>
          ) : (
            recentScripts.map((script, i) => {
              const gradient = platformGradients[script.platform] || 'from-violet-500 to-purple-600';
              return (
                <Link key={script.id} href="/dashboard/saved">
                  <motion.div
                    custom={i + 3}
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`bg-gradient-to-br ${gradient} w-11 h-11 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-pink-300 transition-colors">{script.product_name || 'Untitled'}</h4>
                        <p className="text-xs text-violet-200/60 font-medium mt-0.5">
                          {script.platform} • <span className="text-violet-200/80 font-bold">{script.tone}</span>
                        </p>
                      </div>
                    </div>
                    <div className="badge-gradient text-[10px]">{formatDate(script.created_at)}</div>
                  </motion.div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
