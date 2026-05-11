"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import type { ClientSummary } from "@/types/report";

interface SidebarProps {
  clients: ClientSummary[];
}

export default function Sidebar({ clients }: SidebarProps) {
  const pathname = usePathname();

  // Extract slug from /report/[slug] or /report/[slug]/print etc.
  const segments = pathname.split("/");
  const reportIndex = segments.indexOf("report");
  const currentSlug = reportIndex !== -1 ? segments[reportIndex + 1] : "";

  return (
    <aside
      className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-56 lg:flex lg:flex-col border-r border-white/5"
      style={{ background: "#0a0a0f" }}
    >
      {/* Logo area */}
      <div className="pt-6 px-4 pb-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="font-semibold text-sm">PPC Reports</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/5" />

      {/* Client list */}
      <nav className="flex-1 overflow-y-auto pt-4 px-2">
        <p className="px-2 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
          Clients
        </p>
        <ul className="space-y-0.5">
          {clients.map((client) => {
            const isActive = client.slug === currentSlug;
            return (
              <li key={client.slug}>
                <Link
                  href={`/report/${client.slug}`}
                  className={[
                    "flex items-center gap-2 px-2 py-2 rounded text-sm transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 pl-[6px]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent pl-[6px]",
                  ].join(" ")}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{client.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
