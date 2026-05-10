import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPC Reports | Google Ads Dashboard",
  description: "Звіти по рекламних кампаніях Google Ads",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
