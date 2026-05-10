import Link from "next/link";
import { BarChart3, ArrowRight, Calendar } from "lucide-react";
import reports from "@/data/reports.json";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 50%, #0a0a0f 100%)" }}>
      {/* Header */}
      <header className="border-b border-white/5 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">PPC Reports</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="mb-12">
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">Звіти по клієнтах</p>
          <h1 className="text-4xl font-bold text-white mb-4">Google Ads Dashboard</h1>
          <p className="text-slate-400 text-lg">Аналітика та рекомендації по рекламних кампаніях</p>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Link
              key={report.slug}
              href={`/report/${report.slug}`}
              className="glass rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">{report.client}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 text-sm">{report.period}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex gap-6">
                  {report.metrics.slice(0, 2).map((m) => (
                    <div key={m.label} className="text-right">
                      <p className="text-xs text-slate-500 mb-0.5">{m.label}</p>
                      <p className="text-white font-semibold text-sm">{m.value}</p>
                    </div>
                  ))}
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
