import { getAvailableClients } from "@/lib/sheets";
import Sidebar from "@/components/Sidebar";
import type { ClientSummary } from "@/types/report";

export default async function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let clients: ClientSummary[] = [];
  try {
    clients = await getAvailableClients();
  } catch {
    // env vars may not be set in dev — fall back to empty list
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 50%, #0a0a0f 100%)",
      }}
    >
      <Sidebar clients={clients} />
      <div className="flex-1 min-w-0 lg:pl-56">{children}</div>
    </div>
  );
}
