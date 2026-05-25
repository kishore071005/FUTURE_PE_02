"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Copy, ChevronDown, ChevronUp, Calendar, Sparkles, Loader2, CheckCircle2, MessageSquare, Clapperboard, Hash, Rocket, AlertCircle } from "lucide-react";

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 }
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

export default function SavedScriptsPage() {
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/saved');
      if (!res.ok) throw new Error('Failed to fetch scripts');
      const data = await res.json();
      setScripts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load saved scripts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/saved?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setScripts(prev => prev.filter(s => s.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete script');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = (script: SavedScript) => {
    const fullText = `🎣 HOOK:\n${script.hook}\n\n🎬 SCRIPT:\n${script.script}\n\n📝 CAPTION:\n${script.caption}\n\n# HASHTAGS:\n${script.hashtags}\n\n🚀 CTA:\n${script.cta}`;
    handleCopy(fullText, `all-${script.id}`);
  };

  const filteredScripts = scripts.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.product_name?.toLowerCase().includes(q) ||
      s.hook?.toLowerCase().includes(q) ||
      s.platform?.toLowerCase().includes(q) ||
      s.tone?.toLowerCase().includes(q) ||
      s.caption?.toLowerCase().includes(q) ||
      s.hashtags?.toLowerCase().includes(q)
    );
  });

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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 custom={0} variants={stagger} initial="hidden" animate="visible"
            className="text-4xl font-black tracking-tight text-white"
          >
            Saved Scripts
          </motion.h1>
          <motion.p custom={1} variants={stagger} initial="hidden" animate="visible"
            className="text-violet-200 mt-1 font-medium text-base"
          >
            Manage and organize your generated AI ad scripts.
          </motion.p>
        </div>
        <motion.div custom={2} variants={stagger} initial="hidden" animate="visible" className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/40" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass pl-10 pr-4 py-2.5 w-full sm:w-72 text-sm"
          />
        </motion.div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <p className="text-violet-200/80 font-medium">Loading saved scripts...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-6 flex items-center gap-4 border-red-500/30"
        >
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <p className="text-red-300 font-medium">{error}</p>
            <button onClick={fetchScripts} className="text-sm text-violet-300/60 hover:text-white mt-1 underline">
              Try again
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredScripts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/20 to-pink-600/20 flex items-center justify-center">
            <Sparkles className="w-9 h-9 text-violet-400/50" />
          </div>
          <p className="text-violet-200/80 font-medium text-center text-base">
            {searchQuery ? 'No scripts match your search.' : 'No saved scripts yet.'}
            <br/>
            {!searchQuery && <span className="text-violet-300/80 text-sm">Generate some scripts and save your favorites!</span>}
          </p>
        </motion.div>
      )}

      {/* Scripts list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredScripts.map((script, i) => {
            const isExpanded = expandedId === script.id;
            const gradient = platformGradients[script.platform] || 'from-violet-500 to-purple-600';

            return (
              <motion.div
                key={script.id}
                custom={i + 2}
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                layout
                className="glass-card overflow-hidden"
              >
                {/* Card header - always visible */}
                <div
                  className="p-5 flex items-center justify-between group cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : script.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      <Clapperboard className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white group-hover:text-pink-300 transition-colors truncate text-base">
                        {script.product_name || 'Untitled Script'}
                      </h4>
                      <p className="text-xs text-violet-200/60 mt-0.5 font-medium">
                        {script.platform || 'Unknown'} • <span className="text-violet-200/80 font-bold">{script.tone || 'General'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-violet-200/60 text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      {formatDate(script.created_at)}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyAll(script); }}
                      className="p-2 text-violet-200/60 hover:text-white transition-all"
                      title="Copy All"
                    >
                      {copiedKey === `all-${script.id}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(script.id); }}
                      disabled={deletingId === script.id}
                      className="p-2 text-violet-200/60 hover:text-red-400 transition-all disabled:opacity-50"
                      title="Delete Script"
                    >
                      {deletingId === script.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>

                    <div className="text-violet-200/60">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                        {/* Hook */}
                        {script.hook && (
                          <div className="group/section">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Viral Hook
                              </h3>
                              <button onClick={() => handleCopy(script.hook, `hook-${script.id}`)}
                                className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                                {copiedKey === `hook-${script.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                              </button>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 font-semibold italic text-sm text-pink-200">
                              &ldquo;{script.hook}&rdquo;
                            </div>
                          </div>
                        )}

                        {/* Script */}
                        {script.script && (
                          <div className="group/section">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                                <Clapperboard className="w-3.5 h-3.5" /> Main Script
                              </h3>
                              <button onClick={() => handleCopy(script.script, `script-${script.id}`)}
                                className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                                {copiedKey === `script-${script.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                              </button>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-sm whitespace-pre-line leading-relaxed text-cyan-100/80">
                              {script.script}
                            </div>
                          </div>
                        )}

                        {/* Caption */}
                        {script.caption && (
                          <div className="group/section">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Caption
                              </h3>
                              <button onClick={() => handleCopy(script.caption, `caption-${script.id}`)}
                                className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                                {copiedKey === `caption-${script.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                              </button>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-sm text-amber-100/80">
                              {script.caption}
                            </div>
                          </div>
                        )}

                        {/* Hashtags */}
                        {script.hashtags && (
                          <div className="group/section">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5" /> Hashtags
                              </h3>
                              <button onClick={() => handleCopy(script.hashtags, `hashtags-${script.id}`)}
                                className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                                {copiedKey === `hashtags-${script.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                              </button>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-sm text-violet-200">
                              {script.hashtags}
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        {script.cta && (
                          <div className="group/section">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                                <Rocket className="w-3.5 h-3.5" /> Call to Action
                              </h3>
                              <button onClick={() => handleCopy(script.cta, `cta-${script.id}`)}
                                className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                                {copiedKey === `cta-${script.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                              </button>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 font-bold text-sm text-emerald-300">
                              {script.cta}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom summary */}
      {!loading && filteredScripts.length > 0 && (
        <motion.div custom={8} variants={stagger} initial="hidden" animate="visible"
          className="glass-card p-5 flex items-center justify-center gap-3 text-sm text-violet-200/80"
        >
          <Sparkles className="w-4 h-4 text-violet-400/60" />
          Showing {filteredScripts.length} of {scripts.length} scripts
        </motion.div>
      )}
    </div>
  );
}
