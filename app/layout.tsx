import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SiteAnalytics from "@/components/site-analytics";

export const metadata: Metadata = {
  title: "CCUS Edu — Explore, Learn, Discover",
  description:
    "Platform edukasi Carbon Capture, Utilization, and Storage. Belajar teknologi CCUS secara mudah, interaktif, dan menyenangkan.",
};

export const viewport: Viewport = {
  themeColor: "#f4fbf8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <SiteAnalytics />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
