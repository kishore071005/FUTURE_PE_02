"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, RefreshCw, CheckCircle2, Loader2, Sparkles, Save, Hash, MessageSquare, Clapperboard, Rocket } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

interface ScriptResult {
  hook: string;
  script: string;
  caption: string;
  hashtags: string;
  cta: string;
}

export default function GenerateAdsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ScriptResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [savedIndex, setSavedIndex] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Store form values for regeneration
  const [lastPayload, setLastPayload] = useState<Record<string, string> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    setLastPayload(payload);
    await generate(payload);
  };

  const generate = async (payload: Record<string, string>) => {
    setIsGenerating(true);
    setResults([]);
    setError(null);
    setSavedIndex(new Set());

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed');
      }
      const data = await res.json();
      // Ensure we always have an array
      const arr = Array.isArray(data) ? data : [data];
      setResults(arr);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (lastPayload) {
      generate(lastPayload);
    } else if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = (item: ScriptResult, idx: number) => {
    const fullText = `🎣 HOOK:\n${item.hook}\n\n🎬 SCRIPT:\n${item.script}\n\n📝 CAPTION:\n${item.caption}\n\n# HASHTAGS:\n${item.hashtags}\n\n🚀 CTA:\n${item.cta}`;
    handleCopy(fullText, `all-${idx}`);
  };

  const handleSave = async (item: ScriptResult, idx: number) => {
    try {
      const savePayload = {
        ...item,
        productName: lastPayload?.productName || '',
        brandType: lastPayload?.brandType || '',
        targetAudience: lastPayload?.targetAudience || '',
        platform: lastPayload?.platform || '',
        tone: lastPayload?.tone || '',
      };

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savePayload),
      });
      if (!res.ok) throw new Error('Save failed');
      setSavedIndex(prev => new Set(prev).add(idx));
    } catch (e) {
      console.error(e);
      setError('Failed to save script. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/30 float-anim-fast">
          <Wand2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="text-4xl font-black tracking-tight text-white"
          >
            Generate Ad Script
          </motion.h1>
          <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-violet-200 mt-1 font-medium text-base"
          >
            Fill out the details to generate high-converting UGC scripts.
          </motion.p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ===== FORM ===== */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="glass-card p-8"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Product Name</label>
              <input required name="productName" type="text" className="input-glass" placeholder="e.g. Lumina Skin Serum" />
            </div>
            <div>
              <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Brand Type</label>
              <input required name="brandType" type="text" className="input-glass" placeholder="e.g. Beauty & Skincare" />
            </div>
            <div>
              <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Target Audience</label>
              <input required name="targetAudience" type="text" className="input-glass" placeholder="e.g. Women 20-35" />
            </div>
            <div>
              <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Key Benefits / Features</label>
              <input required name="keyBenefits" type="text" className="input-glass" placeholder="e.g. 24h hydration, Cruelty-free, Organic" />
            </div>
            <div>
              <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Call to Action</label>
              <input required name="callToAction" type="text" className="input-glass" placeholder="e.g. Click the link in bio for 20% off" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Platform</label>
                <select name="platform" className="input-glass">
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                  <option>Facebook Ads</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-violet-200/80 mb-1.5 block">Ad Tone</label>
                <select name="tone" className="input-glass">
                  <option>Authentic</option>
                  <option>Luxury</option>
                  <option>Casual</option>
                  <option>Emotional</option>
                  <option>High-energy</option>
                  <option>Professional</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="btn-gradient w-full justify-center py-3.5 text-base disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isGenerating ? "Generating 3 Variations..." : "Generate AI Scripts"}
            </button>
          </form>
        </motion.div>

        {/* ===== OUTPUT ===== */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="glass-card p-8 flex flex-col relative overflow-hidden min-h-[500px]"
        >
          {/* Loading overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0f0c29]/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-[1.25rem]"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 animate-spin text-violet-400" />
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl pulse-glow" />
                  </div>
                  <p className="font-bold text-violet-200 animate-pulse text-lg">AI is crafting 3 script variations...</p>
                  <p className="text-sm text-violet-200/60">This may take 10-15 seconds</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          {error && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/20 to-pink-600/20 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-300 font-medium text-base">{error}</p>
              <button onClick={handleRegenerate} className="btn-gradient py-2 px-5 text-sm">
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {results.length === 0 && !isGenerating && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/20 to-pink-600/20 flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-violet-400/50" />
              </div>
              <p className="text-violet-200/60 font-medium text-base">Your generated scripts will appear here.<br/>Fill out the form and hit Generate!</p>
            </div>
          )}

          {/* Results */}
          <div className="space-y-6 overflow-y-auto max-h-[75vh] pr-1">
            <AnimatePresence>
              {results.map((item, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="space-y-4 border border-violet-300/20 p-5 rounded-2xl bg-white/[0.02]"
                >
                  {/* Variation header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      Variation {idx + 1}
                    </h2>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleCopyAll(item, idx)}
                        className="glass-card p-2 !rounded-xl hover:bg-white/10 transition-colors" title="Copy All">
                        {copiedIndex === `all-${idx}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-violet-300/60" />}
                      </button>
                      <button onClick={handleRegenerate}
                        className="glass-card p-2 !rounded-xl hover:bg-white/10 transition-colors" title="Regenerate All">
                        <RefreshCw className="w-4 h-4 text-violet-300/60" />
                      </button>
                      <button onClick={() => handleSave(item, idx)}
                        disabled={savedIndex.has(idx)}
                        className="glass-card p-2 !rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50" title={savedIndex.has(idx) ? "Saved!" : "Save Script"}>
                        {savedIndex.has(idx) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-violet-300/60" />}
                      </button>
                    </div>
                  </div>

                  {/* Hook */}
                  <div className="group/section">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Viral Hook
                      </h3>
                      <button onClick={() => handleCopy(item.hook, `hook-${idx}`)}
                        className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                        {copiedIndex === `hook-${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 font-semibold italic text-sm text-pink-200 leading-relaxed">
                      &ldquo;{item.hook}&rdquo;
                    </div>
                  </div>

                  {/* Script */}
                  <div className="group/section">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                        <Clapperboard className="w-3.5 h-3.5" /> Main Script
                      </h3>
                      <button onClick={() => handleCopy(item.script, `script-${idx}`)}
                        className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                        {copiedIndex === `script-${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-sm whitespace-pre-line leading-relaxed text-cyan-100/80">
                      {item.script}
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="group/section">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Caption
                      </h3>
                      <button onClick={() => handleCopy(item.caption, `caption-${idx}`)}
                        className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                        {copiedIndex === `caption-${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-sm text-amber-100/80 leading-relaxed">
                      {item.caption}
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="group/section">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" /> Hashtags
                      </h3>
                      <button onClick={() => handleCopy(item.hashtags, `hashtags-${idx}`)}
                        className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                        {copiedIndex === `hashtags-${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-sm text-violet-200 leading-relaxed">
                      {item.hashtags}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="group/section">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5" /> Call to Action
                      </h3>
                      <button onClick={() => handleCopy(item.cta, `cta-${idx}`)}
                        className="opacity-0 group-hover/section:opacity-100 transition-opacity p-1">
                        {copiedIndex === `cta-${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-300/40" />}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 font-bold text-sm text-emerald-300 leading-relaxed">
                      {item.cta}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
