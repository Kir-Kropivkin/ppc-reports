export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getClientData } from "@/lib/sheets";
import PrintTrigger from "./PrintTrigger";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString("uk-UA", { maximumFractionDigits: decimals });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function WorkPlanSection({ text }: { text: string }) {
  const lines = text.split(/[\n;]/).map((l) => l.trim()).filter(Boolean);
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">План робіт</p>
      {lines.length > 1 ? (
        <ul className="space-y-1">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0" />
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getClientData(slug);

  if (!data) notFound();

  const clientTitle =
    data.slug.charAt(0).toUpperCase() + data.slug.slice(1);

  return (
    <>
      <style>{`@media print { noscript { display: none !important; } }`}</style>
      <main className="bg-white text-gray-900 min-h-screen p-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {/* Document header */}
        <div className="mb-8 pb-4 border-b border-gray-300">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            PPC Reports
          </p>
          <h1 className="text-3xl font-bold text-gray-900">{clientTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Google Ads — Звіт по всіх періодах
          </p>
        </div>

        {/* One section per month */}
        {data.rows.map((row, index) => (
          <section
            key={index}
            className="mb-10 pb-8 border-b border-gray-200 last:border-0 break-inside-avoid"
          >
            {/* Month header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {row.month}
            </h2>

            {/* Metrics grid — 4 columns */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <MetricCell label="ROAS" value={`${fmt(row.roas)}%`} />
              <MetricCell label="CPA" value={`${fmt(row.cpa)} грн`} />
              <MetricCell label="Бюджет" value={`${fmt(row.spend)} грн`} />
              <MetricCell label="Кліки" value={fmt(row.clicks)} />
              <MetricCell
                label="Конверсії"
                value={fmt(row.conversions, 1)}
              />
              <MetricCell
                label="CPC"
                value={`${fmt(row.cpc, 2)} грн`}
              />
              <MetricCell label="Покази" value={fmt(row.impressions)} />
              <MetricCell label="Дохід" value={`${fmt(row.revenue)} грн`} />
            </div>

            {/* Work plan — only if planText exists */}
            {row.planText.trim() && <WorkPlanSection text={row.planText} />}
          </section>
        ))}

        {/* No-JS fallback — hidden in print */}
        <noscript>
          <p className="text-gray-500 text-sm">
            Будь ласка, увімкніть JavaScript для автоматичного відкриття
            діалогу друку.
          </p>
        </noscript>

        <PrintTrigger />
      </main>
    </>
  );
}
