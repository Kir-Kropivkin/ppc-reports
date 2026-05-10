export interface ReportRow {
  month: string;
  spend: number;
  cpa: number;
  roas: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  planText: string;
  // Derived metrics
  cpc: number;   // spend / clicks
  cr: number;    // (conversions / clicks) * 100
}

export interface ContactSettings {
  name?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  website?: string;
}

export interface ClientData {
  slug: string;
  rows: ReportRow[];
  contacts: ContactSettings;
}

export interface ClientSummary {
  slug: string;
  title: string;
}
