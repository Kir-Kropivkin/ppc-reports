"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { motion, type Variants } from "framer-motion";
import {
  TrendingUp,
  Target,
  DollarSign,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Lightbulb,
  Layers,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import Link from "next/link";
import reports from "@/data/reports.json";

type Report = (typeof reports)[0];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Target,
  DollarSign,
};

const METRIC_COLORS: Record<string, { ring: string; glow: string; text: string; bg: string; badge: string }> = {
  green:  { ring: "border-green-500/30",  glow: "glow-green",  text: "text-green-400",  bg: "bg-green-500/10",  badge: "bg-green-500/20 text-green-400" },
  blue:   { ring: "border-blue-500/30",   glow: "glow-blue",   text: "text-blue-400",   bg: "bg-blue-500/10",   badge: "bg-blue-500/20 text-blue-400" },
  purple: { ring: "border-purple-500/30", glow: "glow-purple", text: "text-purple-400", bg: "bg-purple-500/10", badge: "bg-purple-500/20 text-purple-400" },
};

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  Scale:      { label: "Scale",      dot: "bg-green-400",  text: "text-green-400",  bg: "bg-green-500/10 border border-green-500/20" },
  Optimizing: { label: "Optimizing", dot: "bg-blue-400",   text: "text-blue-400",   bg: "bg-blue-500/10 border border-blue-500/20" },
  Cut:        { label: "Cut",        dot: "bg-red-400",    text: "text-red-400",    bg: "bg-red-500/10 border border-red-500/20" },
};

const BADGE_COLORS: Record<string, string> = {
  blue:   "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")   return <ArrowUp className="w-4 h-4 text-green-400" />;
  if (trend === "down") return <ArrowDown className="w-4 h-4 text-blue-400" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const report = reports.find((r) => r.slug === slug) as Report | undefined;
  if (!report) notFound();

  return (
    <main
      className="min-h-screen pb-20"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1f 50%, #0a0a0f 100%)" }}
    >
      {/* ── HEADER ── */}
      <header className="border-b border-white/5 px-6 py-4 sticky top-0 z-50"
        style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Всі звіти
            </Link>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">{report.client}</span>
            </div>
          </div>
          <span className="text-slate-500 text-sm hidden sm:block">{report.period}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-14">

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Звіт за {report.period}</p>
          <h1 className="text-5xl font-extrabold text-white mb-3 leading-tight">
            {report.client}
            <span className="text-blue-500"> /</span>
          </h1>
          <p className="text-slate-400 text-lg">Аналіз ефективності Google Ads кампаній</p>
        </motion.div>

        {/* ── METRIC CARDS ── */}
        <section>
          <motion.h2
            className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            Ключові показники
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {report.metrics.map((metric, i) => {
              const colors = METRIC_COLORS[metric.color] ?? METRIC_COLORS.blue;
              const Icon = ICON_MAP[metric.icon] ?? TrendingUp;
              return (
                <motion.div
                  key={metric.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`glass rounded-2xl p-6 border ${colors.ring} ${colors.glow} relative overflow-hidden`}
                >
                  {/* Background glow blob */}
                  <div
                    className={`absolute -top-8 -right-8 w-32 h-32 rounded-full ${colors.bg} blur-2xl opacity-60`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.ring} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                        <TrendIcon trend={metric.trend} />
                        {metric.delta}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                    <p className={`text-4xl font-extrabold ${colors.text} leading-none`}>{metric.value}</p>
                    <p className="text-slate-600 text-xs mt-3">{metric.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── STRATEGIES ── */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          >
            <Layers className="w-5 h-5 text-slate-500" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Нові стратегії</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {report.strategies.map((strategy, i) => (
              <motion.div
                key={strategy.id}
                custom={i + 4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="glass rounded-2xl border border-white/8 overflow-hidden"
              >
                {/* Card header */}
                <div className="px-6 py-5 border-b border-white/5">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-white font-bold text-xl">{strategy.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${BADGE_COLORS[strategy.badgeColor] ?? BADGE_COLORS.blue}`}>
                      {strategy.badge}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {strategy.params.map((p) => (
                      <div key={p.label} className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-xs">{p.label}:</span>
                        <span className="text-white text-sm font-semibold">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Idea */}
                <div className="px-6 py-4 border-b border-white/5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <p className="text-slate-300 text-sm leading-relaxed">{strategy.idea}</p>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 divide-x divide-white/5">
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">Плюси</p>
                    <ul className="space-y-2">
                      {strategy.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-slate-300 text-xs leading-snug">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Мінуси</p>
                    <ul className="space-y-2">
                      {strategy.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <span className="text-slate-300 text-xs leading-snug">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WORK PLAN TABLE ── */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          >
            <Target className="w-5 h-5 text-slate-500" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">План робіт</h2>
          </motion.div>

          <motion.div
            className="glass rounded-2xl border border-white/8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_2fr_120px] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Дата</span>
              <span>Кампанія</span>
              <span>Дія</span>
              <span className="text-right">Статус</span>
            </div>

            {/* Rows */}
            {report.workPlan.map((item, i) => {
              const st = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.Optimizing;
              return (
                <motion.div
                  key={i}
                  custom={i + 8}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-[80px_1fr_2fr_120px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="text-slate-400 text-sm font-mono">{item.date}</span>
                  <span className="text-white text-sm font-medium leading-snug">{item.campaign}</span>
                  <span className="text-slate-300 text-sm leading-snug">{item.action}</span>
                  <div className="flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

      </div>
    </main>
  );
}
