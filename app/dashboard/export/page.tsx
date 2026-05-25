"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileJson, Share2, Zap, ArrowRight } from "lucide-react";

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5 }
  })
};

export default function ExportPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <motion.h1 custom={0} variants={stagger} initial="hidden" animate="visible"
          className="text-3xl font-black tracking-tight text-white"
        >
          Export & Share
        </motion.h1>
        <motion.p custom={1} variants={stagger} initial="hidden" animate="visible"
          className="text-violet-200 mt-1 font-medium"
        >
          Download your scripts in multiple formats or share directly with creators.
        </motion.p>
      </div>

      {/* Export Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Print-ready PDF",
            icon: FileText,
            desc: "Compiles a beautifully formatted stylesheet perfect for on-set filming.",
            gradient: "from-rose-500 to-red-600",
            glow: "shadow-rose-500/20"
          },
          {
            title: "Structured JSON",
            icon: FileJson,
            desc: "Raw structured data format ideal for passing into other APIs and tools.",
            gradient: "from-amber-500 to-orange-600",
            glow: "shadow-amber-500/20"
          },
          {
            title: "Share Link",
            icon: Share2,
            desc: "Generate a public read-only link to share with your content creators.",
            gradient: "from-cyan-500 to-blue-600",
            glow: "shadow-cyan-500/20"
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            custom={i + 2}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="glass-card p-8 flex flex-col items-start gap-5 group cursor-pointer"
          >
            <div className={`bg-gradient-to-br ${item.gradient} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${item.glow} group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-violet-200/70 leading-relaxed">{item.desc}</p>
            </div>
            <button className="mt-auto btn-gradient text-sm py-2.5 px-5 opacity-80 group-hover:opacity-100 transition-opacity">
              <Download className="w-4 h-4" />
              Download
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
