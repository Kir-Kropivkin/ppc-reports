import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 50%, #0a0a0f 100%)" }}
    >
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-6xl font-extrabold text-white mb-3">404</h1>
        <p className="text-slate-400 text-lg mb-2">Звіт не знайдено</p>
        <p className="text-slate-600 text-sm mb-8">
          Перевірте правильність посилання або зверніться до менеджера.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          До всіх звітів
        </Link>
      </div>
    </main>
  );
}
