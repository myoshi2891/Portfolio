import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Navigation, Footer } from "../components/layout/chrome";
import "./globals.css";
import "./fonts.css";
import { site } from "../data/site";
import { pageMetadata } from "../lib/metadata";
import { readSiteConfig } from "../lib/site-config";

export function generateMetadata() {
  const metadata = pageMetadata("/", site.title, site.description);
  // Only real pages supply an indexable canonical; the 404 inherits this fallback.
  delete metadata.alternates;
  if (metadata.openGraph && "url" in metadata.openGraph) delete metadata.openGraph.url;
  metadata.robots = { index: false, follow: false };
  return metadata;
}

const inter = localFont({
  src: [
    { path: "../assets/fonts/inter-latin-400-normal.woff2", weight: "400" },
    { path: "../assets/fonts/inter-latin-500-normal.woff2", weight: "500" },
    { path: "../assets/fonts/inter-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-inter", display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ja" className={inter.variable}><head>
    {!readSiteConfig().siteUrl && <>
      <meta property="og:image" content="/og/portfolio.png" />
      <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="myoshi2891 Engineering Portfolio" />
    </>}
  </head><body><Navigation />{children}<Footer /></body></html>;
}
