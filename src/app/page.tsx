import Link from "next/link";
import { BarChart3, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { getAvailableClients } from "@/lib/sheets";

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const clients = await getAvailableClients();
  const missingEnv =
    !process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 50%, #0a0a0f 100%)" }}
    >
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
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">
            Звіти по клієнтах
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Google Ads Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Аналітика та рекомендації по рекламних кампаніях
          </p>
        </div>

        {/* Env vars not configured */}
        {missingEnv && (
          <div className="glass rounded-2xl border border-yellow-500/30 p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm mb-1">
                Налаштування не виконані
              </p>
              <p className="text-slate-400 text-sm">
                Додайте змінні <code className="text-yellow-300">GOOGLE_SHEET_ID</code> та{" "}
                <code className="text-yellow-300">GOOGLE_SERVICE_ACCOUNT_KEY</code> у Vercel → Settings → Environment Variables.
              </p>
            </div>
          </div>
        )}

        {/* Client list */}
        {clients.length === 0 && !missingEnv ? (
          <div className="glass rounded-2xl border border-white/8 p-10 text-center">
            <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium mb-1">Клієнтів поки немає</p>
            <p className="text-slate-600 text-sm">
              Додайте лист із назвою клієнта у Google Таблицю — він з'явиться тут автоматично.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <Link
                key={client.slug}
                href={`/report/${client.slug}`}
                className="glass rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">{client.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400 text-sm">/report/{client.slug}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
