# PPC Reports — Architecture

## Overview

Next.js 15 (App Router) dashboard for Google Ads PPC reporting.  
Data source: Google Sheets (one sheet per client).  
Deploy: Vercel (ISR + force-dynamic).  
API keys never leave the server.

---

## Google Sheets Structure

### Client sheets (one per client)

Sheet name = client slug (e.g. `amtex`, `client2`).  
The URL `/report/amtex` reads the sheet named `amtex` (case-insensitive).

| Column | Header | Type | Description |
|--------|--------|------|-------------|
| A | `Month` | string | Period label, e.g. `Квітень 2026` |
| B | `Spend` | number | Ad spend (UAH / USD) |
| C | `CPA` | number | Cost per acquisition |
| D | `ROAS` | number | Return on ad spend |
| E | `Impressions` | number | Ad impressions |
| F | `Clicks` | number | Clicks |
| G | `Conversions` | number | Conversions |
| H | `Revenue` | number | Revenue attributed |
| I | `Plan_Text` | string | Work plan text (lines separated by `\n` or `;`) |

- Row 1 must be the header row (exact column names as above).
- Each subsequent row = one reporting period.
- Blank rows (empty `Month`) are skipped automatically.
- **Latest row** is shown by default; older periods are available via the dropdown.

### `Settings_Contacts` sheet

Special utility sheet with contact info for each client.  
Two columns: `Key` and `Value`.

| Key | Value example | Description |
|-----|---------------|-------------|
| `name` | `Valerii Barsyk` | Contact person name |
| `email` | `hello@example.com` | Email |
| `phone` | `+380 XX XXX XX XX` | Phone |
| `telegram` | `@username` | Telegram handle |
| `website` | `https://example.com` | Website URL |

- Sheet name must be exactly `Settings_Contacts`.
- Sheets starting with `_` are hidden from the client list.

---

## Environment Variables

Set in **Vercel → Project → Settings → Environment Variables**:

| Variable | Description |
|----------|-------------|
| `GOOGLE_SHEET_ID` | The Google Spreadsheet ID (from the URL: `docs.google.com/spreadsheets/d/<ID>/`) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Full JSON of the service account key (the entire content of the downloaded `.json` file) |

> The service account must have **Viewer** access to the spreadsheet  
> (Share → add service account email → Viewer).

The private key's `\n` newlines are normalized automatically — paste the JSON as-is.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home: lists all clients (Server Component)
│   ├── report/[slug]/page.tsx    # Report page (Server Component, ISR + force-dynamic)
│   ├── not-found.tsx             # Custom 404
│   └── globals.css               # Tailwind base + glass utility + @media print A4
├── components/
│   └── ReportClient.tsx          # Interactive dashboard (Client Component)
│       ├── PeriodSelector        # Dropdown: pick reporting period
│       ├── MetricCards           # 6 KPI cards with delta vs previous period
│       ├── TrendCharts           # 4 Recharts line charts (ROAS, CPA, CPC, CR)
│       ├── WorkPlan              # Renders Plan_Text as bullet list
│       └── Contacts              # Renders Settings_Contacts data
├── lib/
│   └── sheets.ts                 # Google Sheets API (server-only, keys never reach client)
└── types/
    └── report.ts                 # Shared TypeScript interfaces
```

---

## Data Flow

```
Google Sheets
      │
      ▼ (google-spreadsheet + JWT auth)
src/lib/sheets.ts          ← server-only, runs on Vercel Edge/Node
      │
      ▼ props (serializable JSON)
app/report/[slug]/page.tsx ← Server Component (revalidate=3600, force-dynamic)
      │
      ▼ rows[], contacts{}
ReportClient.tsx           ← Client Component (useState for period selection)
      │
      ▼
Browser (no API keys, no secrets)
```

---

## Adding a New Client

1. Open the Google Spreadsheet.
2. Create a new sheet — name it with the client slug (e.g. `newclient`).
3. Add header row: `Month | Spend | CPA | ROAS | Impressions | Clicks | Conversions | Revenue | Plan_Text`
4. Add data rows (one per month).
5. The client appears automatically at `/report/newclient` on next deploy/revalidation.

No code changes needed.

---

## Deployment

- **Platform:** Vercel (Next.js preset)
- **GitHub repo:** `https://github.com/Kir-Kropivkin/ppc-reports`
- **Auto-deploy:** every `git push origin main` triggers a new Vercel build
- **Cache:** `revalidate = 3600` — pages are regenerated every hour in the background
- **Fresh data:** `dynamic = "force-dynamic"` — each request hits Google Sheets (no stale cache on cold start)

---

## Security

- `import "server-only"` in `sheets.ts` — TypeScript/bundler error if imported from a Client Component
- Service account has read-only scope (`spreadsheets.readonly`)
- All routes are `noindex` via `X-Robots-Tag` header in `vercel.json`
- No auth on the dashboard — URLs are the access control (share only with the client)
