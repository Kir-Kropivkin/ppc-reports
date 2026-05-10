import "server-only";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { ReportRow, ContactSettings, ClientData, ClientSummary } from "@/types/report";

// ── Auth ──────────────────────────────────────────────────────────────────────

function getAuth(): JWT {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");

  let key: { client_email: string; private_key: string };
  try {
    key = JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON");
  }

  return new JWT({
    email: key.client_email,
    // Vercel stores \n as \\n — normalize both cases
    key: key.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

async function getDoc(): Promise<GoogleSpreadsheet> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("GOOGLE_SHEET_ID is not set");

  const doc = new GoogleSpreadsheet(sheetId, getAuth());
  await doc.loadInfo();
  return doc;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNum(val: string | undefined | null): number {
  if (!val) return 0;
  // Remove spaces, commas, % signs
  return parseFloat(String(val).replace(/[\s,%]/g, "")) || 0;
}

function parseRow(rawRow: Record<string, string>): ReportRow {
  const spend = parseNum(rawRow["Spend"]);
  const clicks = parseNum(rawRow["Clicks"]);
  const conversions = parseNum(rawRow["Conversions"]);

  return {
    month: rawRow["Month"] ?? "",
    spend,
    cpa: parseNum(rawRow["CPA"]),
    roas: parseNum(rawRow["ROAS"]),
    impressions: parseNum(rawRow["Impressions"]),
    clicks,
    conversions,
    revenue: parseNum(rawRow["Revenue"]),
    planText: rawRow["Plan_Text"] ?? "",
    // Derived
    cpc: clicks > 0 ? spend / clicks : 0,
    cr: clicks > 0 ? (conversions / clicks) * 100 : 0,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** List all client slugs (sheet titles), excluding utility sheets */
export async function getAvailableClients(): Promise<ClientSummary[]> {
  try {
    const doc = await getDoc();
    return Object.values(doc.sheetsByIndex)
      .map((s) => s.title)
      .filter((title) => title !== "Settings_Contacts" && !title.startsWith("_"))
      .map((title) => ({ slug: title.toLowerCase(), title }));
  } catch (err) {
    console.error("[sheets] getAvailableClients:", err);
    return [];
  }
}

/** Fetch all rows for a client slug. Returns null if sheet not found. */
export async function getClientData(slug: string): Promise<ClientData | null> {
  try {
    const doc = await getDoc();

    // Find sheet by slug (case-insensitive)
    const sheet =
      doc.sheetsByTitle[slug] ??
      Object.values(doc.sheetsByIndex).find(
        (s) => s.title.toLowerCase() === slug.toLowerCase()
      );

    if (!sheet) return null;

    const rawRows = await sheet.getRows();
    const rows: ReportRow[] = rawRows
      .map((r) => parseRow(r.toObject() as Record<string, string>))
      .filter((r) => r.month.trim() !== ""); // skip blank rows

    const contacts = await getContactSettings(doc);

    return { slug, rows, contacts };
  } catch (err) {
    console.error(`[sheets] getClientData(${slug}):`, err);
    return null;
  }
}

/** Fetch Settings_Contacts sheet as key→value map */
async function getContactSettings(
  doc: GoogleSpreadsheet
): Promise<ContactSettings> {
  try {
    const sheet = doc.sheetsByTitle["Settings_Contacts"];
    if (!sheet) return {};

    const rows = await sheet.getRows();
    const contacts: Record<string, string> = {};
    for (const row of rows) {
      const obj = row.toObject() as Record<string, string>;
      const key = (obj["Key"] ?? "").toLowerCase().trim();
      const val = (obj["Value"] ?? "").trim();
      if (key && val) contacts[key] = val;
    }
    return contacts as ContactSettings;
  } catch {
    return {};
  }
}
