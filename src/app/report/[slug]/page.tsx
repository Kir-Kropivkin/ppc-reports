import { notFound } from "next/navigation";
import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";
import { getClientData } from "@/lib/sheets";
import ReportClient from "@/components/ReportClient";

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamic = "force-dynamic"; // always fresh on Vercel

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;

  // Guard: env vars not set → show config warning instead of crashing
  if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 50%, #0a0a0f 100%)" }}
      >
        <div className="glass rounded-2xl border border-yellow-500/30 p-10 text-center max-w-md mx-4">
          <BarChart3 className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-400 font-semibold mb-2">Налаштування не виконані</p>
          <p className="text-slate-400 text-sm">
            Додайте <code className="text-yellow-300">GOOGLE_SHEET_ID</code> та{" "}
            <code className="text-yellow-300">GOOGLE_SERVICE_ACCOUNT_KEY</code> у{" "}
            Vercel → Settings → Environment Variables.
          </p>
        </div>
      </main>
    );
  }

  // Fetch data server-side — key never leaves the server
  const data = await getClientData(slug);

  // Sheet not found → 404
  if (!data) notFound();

  const clientTitle = data.rows.length > 0
    ? data.slug.charAt(0).toUpperCase() + data.slug.slice(1)
    : slug;

  const latestPeriod = data.rows.at(-1)?.month ?? "";

  return (
    <main
      className="min-h-screen pb-20"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1f 50%, #0a0a0f 100%)" }}
    >
      {/* ── STICKY HEADER ── */}
      <header
        className="border-b border-white/5 px-6 py-4 sticky top-0 z-50 print:static"
        style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              Всі звіти
            </Link>
            <span className="text-white/20 print:hidden">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">{clientTitle}</span>
            </div>
          </div>
          {latestPeriod && (
            <span className="text-slate-500 text-sm hidden sm:block">{latestPeriod}</span>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-14">
        {/* ── HERO ── */}
        <div>
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Звіт клієнта
          </p>
          <h1 className="text-5xl font-extrabold text-white mb-3 leading-tight">
            {clientTitle}
            <span className="text-blue-500"> /</span>
          </h1>
          <p className="text-slate-400 text-lg">Аналіз ефективності Google Ads кампаній</p>
        </div>

        {/* ── DATA (client component — handles period selector, charts, etc.) ── */}
        {data.rows.length === 0 ? (
          <div className="glass rounded-2xl border border-white/8 p-10 text-center">
            <BarChart3 className="w-10 h-10 text-blue-400/40 mx-auto mb-4 animate-pulse" />
            <p className="text-white font-semibold mb-1">Дані оновлюються</p>
            <p className="text-slate-500 text-sm">
              Дані для цього клієнта ще оновлюються. Спробуйте пізніше.
            </p>
          </div>
        ) : (
          <ReportClient
            slug={data.slug}
            rows={data.rows}
            contacts={data.contacts}
          />
        )}
      </div>
    </main>
  );
}
