"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Layers, Wand2, MonitorPlay, Zap, Star, Video } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden dot-grid">
      {/* Animated background blobs */}
      <div className="blob blob-violet w-[700px] h-[700px] -top-60 -left-40 pulse-glow" />
      <div className="blob blob-pink w-[500px] h-[500px] top-20 right-[-15%] pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="blob blob-cyan w-[400px] h-[400px] bottom-[-10%] left-[20%] pulse-glow" style={{ animationDelay: '4s' }} />
      <div className="blob blob-amber w-[300px] h-[300px] bottom-[30%] right-[10%] pulse-glow" style={{ animationDelay: '3s' }} />

      {/* Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-50 relative" style={{ backdropFilter: 'blur(12px)', background: 'rgba(15,12,41,0.5)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-violet-500 to-pink-500 text-white p-2 rounded-xl shadow-lg shadow-violet-500/30">
            <Video className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            UGC<span className="text-pink-400">AD</span><span className="text-violet-300">.AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-violet-200/80 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard/generate" className="btn-gradient text-sm py-2.5 px-6">
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="flex flex-col lg:flex-row items-center gap-12 pt-16 pb-20">
          {/* Left: Text */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="badge-gradient inline-flex">
              <Sparkles className="w-3.5 h-3.5" />
              NEXT-GEN AD CREATION ENGINE
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]"
            >
              Generate <span className="gradient-text">Viral Scripts</span> in Seconds
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg md:text-xl text-violet-200/70 max-w-xl font-medium leading-relaxed"
            >
              Stop staring at a blank canvas. Let AI craft high-converting hooks, visual directions, and CTA lines for TikTok, Reels, and Shorts.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/dashboard/generate" className="btn-gradient text-lg py-4 px-10 shadow-2xl shadow-violet-600/30">
                Start Generating Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="btn-gradient-cyan text-lg py-4 px-10">
                View Demo <Zap className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-6 pt-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['🎬','🎯','🚀','💎'].map((e, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-sm border-2 border-[#1a0e3e]">{e}</div>
                ))}
              </div>
              <div className="text-sm text-violet-200/80">
                <span className="text-white font-bold">2,400+</span> scripts generated this week
              </div>
            </motion.div>
          </div>

          {/* Right: 3D Image */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 to-pink-600/40 rounded-[2rem] blur-3xl scale-110" />
              <img
                src="/hero-3d.png"
                alt="3D Hero Visual"
                className="relative z-10 w-full max-w-lg float-anim drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="py-24">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-4"
            >
              Engineered to <span className="gradient-text-warm">Convert</span>
            </motion.h2>
            <p className="text-violet-200/80 text-lg max-w-2xl mx-auto">Everything you need to produce engaging social media ad copy, automated and organized.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Platform Optimized", desc: "Formats perfectly designed for TikTok pacing, IG Reels, and YouTube Shorts.", icon: MonitorPlay, gradient: "from-cyan-500 to-blue-600" },
              { title: "Custom Brand Tones", desc: "From authentic luxury to high-energy casual, match your exact brand voice.", icon: Wand2, gradient: "from-violet-500 to-purple-600" },
              { title: "Multiple Hooks", desc: "Generate 5+ viral hooks per script to split test your ads effectively.", icon: Layers, gradient: "from-pink-500 to-rose-600" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card p-8 group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-violet-200/80 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="py-16">
          <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-around gap-8 text-center">
            {[
              { value: "50K+", label: "Scripts Generated", color: "text-cyan-400" },
              { value: "98%", label: "Satisfaction Rate", color: "text-pink-400" },
              { value: "4.9", label: "Average Rating", icon: Star, color: "text-amber-400" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`text-5xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-violet-200/80 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] p-12 md:p-20 text-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)' }}
          >
            <div className="absolute inset-0 dot-grid opacity-20" />
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 text-white">
              Scale Your Ad Creative.
            </h2>
            <p className="text-white/75 text-xl mb-10 max-w-2xl mx-auto relative z-10 font-medium">
              Join thousands of marketers generating viral ad scripts in a fraction of the time.
            </p>
            <Link href="/dashboard/generate" className="relative z-10 inline-flex items-center gap-2 bg-white text-purple-700 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
              Launch Generator <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center border-t border-white/5">
          <p className="text-violet-200/60 text-sm">© 2026 UGCAD.AI — Built with AI. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
