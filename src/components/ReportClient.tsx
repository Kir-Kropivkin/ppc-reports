"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  TrendingUp, Target, DollarSign, MousePointerClick,
  Users, BarChart3, ChevronDown, Mail, Phone,
  Globe, Send, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { ReportRow, ContactSettings } from "@/types/report";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Props {
  slug: string;
  rows: ReportRow[];
  contacts: ContactSettings;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString("uk-UA", { maximumFractionDigits: decimals });
}

function delta(current: number, prev: number | undefined): { text: string; trend: "up" | "down" | "neutral" } {
  if (prev === undefined || prev === 0) return { text: "—", trend: "neutral" };
  const pct = ((current - prev) / prev) * 100;
  const sign = pct >= 0 ? "+" : "";
  return { text: `${sign}${pct.toFixed(1)}%`, trend: pct >= 0 ? "up" : "down" };
}

function TrendBadge({ trend, text }: { trend: "up" | "down" | "neutral"; text: string }) {
  const colors = {
    up: "bg-green-500/20 text-green-400",
    down: "bg-blue-500/20 text-blue-400",
    neutral: "bg-slate-700/50 text-slate-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[trend]}`}>
      {trend === "up" && <ArrowUp className="w-3 h-3" />}
      {trend === "down" && <ArrowDown className="w-3 h-3" />}
      {trend === "neutral" && <Minus className="w-3 h-3" />}
      {text}
    </span>
  );
}

// ── Animations ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" } }),
};

// ── Period Selector ─────────────────────────────────────────────────────────────

function PeriodSelector({ rows, selectedIdx, onChange }: {
  rows: ReportRow[];
  selectedIdx: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="relative inline-block">
      <select
        value={selectedIdx}
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none glass border border-white/10 rounded-xl px-4 py-2 pr-9 text-sm text-white bg-transparent cursor-pointer focus:outline-none focus:border-blue-500/50"
      >
        {rows.map((r, i) => (
          <option key={i} value={i} className="bg-slate-900 text-white">
            {r.month}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── Metric Cards ───────────────────────────────────────────────────────────────

const METRICS = [
  { key: "roas",   label: "ROAS",        icon: TrendingUp,       color: "green",  format: (v: number) => `${fmt(v)}%`,     higherBetter: true },
  { key: "cpa",    label: "CPA",         icon: Target,           color: "blue",   format: (v: number) => `${fmt(v)} грн`,  higherBetter: false },
  { key: "spend",  label: "Бюджет",      icon: DollarSign,       color: "purple", format: (v: number) => `${fmt(v)} грн`,  higherBetter: false },
  { key: "clicks", label: "Кліки",       icon: MousePointerClick,color: "blue",   format: (v: number) => fmt(v),            higherBetter: true },
  { key: "conversions", label: "Конверсії", icon: Users,         color: "green",  format: (v: number) => fmt(v, 1),         higherBetter: true },
  { key: "cpc",    label: "CPC",         icon: BarChart3,        color: "purple", format: (v: number) => `${fmt(v, 2)} грн`, higherBetter: false },
] as const;

const COLOR_MAP = {
  green:  { ring: "border-green-500/30",  text: "text-green-400",  bg: "bg-green-500/10",  badge: "bg-green-500/20",  glow: "glow-green" },
  blue:   { ring: "border-blue-500/30",   text: "text-blue-400",   bg: "bg-blue-500/10",   badge: "bg-blue-500/20",   glow: "glow-blue" },
  purple: { ring: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10", badge: "bg-purple-500/20", glow: "glow-purple" },
};

function MetricCards({ current, prev }: { current: ReportRow; prev?: ReportRow }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {METRICS.map((m, i) => {
        const val = current[m.key as keyof ReportRow] as number;
        const prevVal = prev ? (prev[m.key as keyof ReportRow] as number) : undefined;
        const d = delta(val, prevVal);
        const c = COLOR_MAP[m.color];
        const Icon = m.icon;
        // For CPA/CPC/Spend — down is good
        const trendColor = m.higherBetter
          ? d.trend === "up" ? "up" : d.trend === "down" ? "down" : "neutral"
          : d.trend === "down" ? "up" : d.trend === "up" ? "down" : "neutral";

        return (
          <motion.div
            key={m.key}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, y: -2 }}
            className={`glass rounded-2xl p-5 border ${c.ring} ${c.glow} relative overflow-hidden`}
          >
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${c.bg} blur-2xl opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.ring} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <TrendBadge trend={trendColor} text={d.text} />
              </div>
              <p className="text-slate-500 text-xs mb-1">{m.label}</p>
              <p className={`text-2xl font-extrabold ${c.text} leading-none`}>{m.format(val)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Trend Charts ───────────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  contentStyle: { background: "#12121e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#94a3b8" },
  itemStyle: { color: "#e2e8f0" },
};

function TrendCharts({ rows }: { rows: ReportRow[] }) {
  if (rows.length < 2) {
    return (
      <div className="glass rounded-2xl border border-white/8 p-8 text-center">
        <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Недостатньо даних для побудови тренду.</p>
        <p className="text-slate-600 text-xs mt-1">Потрібно мінімум 2 записи в таблиці.</p>
      </div>
    );
  }

  const data = rows.map((r) => ({
    month: r.month,
    roas: r.roas,
    cpa: r.cpa,
    cpc: Math.round(r.cpc * 100) / 100,
    cr: Math.round(r.cr * 100) / 100,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* ROAS Trend */}
      <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible"
        className="glass rounded-2xl border border-white/8 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Тренд ROAS</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} unit="%" />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "ROAS"]} />
            <Line type="monotone" dataKey="roas" stroke="#22c55e" strokeWidth={2}
              dot={{ r: 3, fill: "#22c55e" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* CPA Trend */}
      <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible"
        className="glass rounded-2xl border border-white/8 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Тренд CPA</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} unit=" грн" />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v} грн`, "CPA"]} />
            <Line type="monotone" dataKey="cpa" stroke="#3b82f6" strokeWidth={2}
              dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* CPC Trend */}
      <motion.div custom={12} variants={fadeUp} initial="hidden" animate="visible"
        className="glass rounded-2xl border border-white/8 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Тренд CPC (Spend ÷ Clicks)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} unit=" грн" />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v} грн`, "CPC"]} />
            <Line type="monotone" dataKey="cpc" stroke="#a855f7" strokeWidth={2}
              dot={{ r: 3, fill: "#a855f7" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* CR Trend */}
      <motion.div custom={13} variants={fadeUp} initial="hidden" animate="visible"
        className="glass rounded-2xl border border-white/8 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Тренд CR — Конверсія (Conversions ÷ Clicks)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} unit="%" />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "CR"]} />
            <Line type="monotone" dataKey="cr" stroke="#f59e0b" strokeWidth={2}
              dot={{ r: 3, fill: "#f59e0b" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

// ── Work Plan ──────────────────────────────────────────────────────────────────

function WorkPlan({ text }: { text: string }) {
  if (!text.trim()) return null;

  // Split by newline or semicolons into bullet points
  const lines = text
    .split(/[\n;]/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <motion.div custom={14} variants={fadeUp} initial="hidden" animate="visible"
      className="glass rounded-2xl border border-white/8 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">📋 План робіт</p>
      {lines.length > 1 ? (
        <ul className="space-y-2">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
              <span className="text-slate-300 text-sm leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      )}
    </motion.div>
  );
}

// ── Contacts ───────────────────────────────────────────────────────────────────

function Contacts({ contacts }: { contacts: ContactSettings }) {
  const items = [
    { icon: Globe, label: contacts.website, href: contacts.website, show: !!contacts.website },
    { icon: Mail,  label: contacts.email,   href: `mailto:${contacts.email}`, show: !!contacts.email },
    { icon: Phone, label: contacts.phone,   href: `tel:${contacts.phone}`,    show: !!contacts.phone },
    { icon: Send,  label: contacts.telegram, href: contacts.telegram,         show: !!contacts.telegram },
  ].filter((i) => i.show);

  if (!contacts.name && items.length === 0) return null;

  return (
    <div className="glass rounded-2xl border border-white/8 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Контакти</p>
      {contacts.name && <p className="text-white font-semibold mb-3">{contacts.name}</p>}
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm transition-colors">
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Data Updating Fallback ────────────────────────────────────────────────────

function DataUpdating() {
  return (
    <div className="glass rounded-2xl border border-white/8 p-10 text-center">
      <BarChart3 className="w-10 h-10 text-blue-400/50 mx-auto mb-4 animate-pulse" />
      <p className="text-white font-semibold mb-1">Дані оновлюються</p>
      <p className="text-slate-500 text-sm">Дані для цього періоду ще оновлюються. Спробуйте пізніше.</p>
    </div>
  );
}

// ── Main Client Component ──────────────────────────────────────────────────────

export default function ReportClient({ rows, contacts }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(rows.length > 0 ? rows.length - 1 : 0);

  const current = rows[selectedIdx] ?? null;
  const prev = rows[selectedIdx - 1];

  // Chart data sorted chronologically (rows come in sheet order = chronological)
  const chartRows = useMemo(() => rows, [rows]);

  return (
    <div className="space-y-10">
      {/* Period selector + subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-slate-400 text-sm">
          {rows.length > 0
            ? `${rows.length} ${rows.length === 1 ? "запис" : rows.length < 5 ? "записи" : "записів"} в архіві`
            : "Даних ще немає"}
        </p>
        {rows.length > 1 && (
          <PeriodSelector rows={rows} selectedIdx={selectedIdx} onChange={setSelectedIdx} />
        )}
      </div>

      {/* Metric cards */}
      {current ? (
        <MetricCards current={current} prev={prev} />
      ) : (
        <DataUpdating />
      )}

      {/* Trend charts */}
      {chartRows.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-5">Тренди</p>
          <TrendCharts rows={chartRows} />
        </section>
      )}

      {/* Work plan */}
      {current?.planText && <WorkPlan text={current.planText} />}

      {/* Contacts */}
      <Contacts contacts={contacts} />
    </div>
  );
}
