import type { Metadata } from "next";
import { site } from "../data/site";
import { readSiteConfig } from "./site-config";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const { siteUrl, production } = readSiteConfig();
  const image = { url: `${siteUrl}/og/portfolio.png`, width: 1200, height: 630, alt: "myoshi2891 Engineering Portfolio" };
  return {
    title, description,
    robots: { index: production, follow: production },
    ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: siteUrl + path } } : {}),
    openGraph: {
      type: "website", siteName: site.title, locale: "ja_JP", title, description,
      ...(siteUrl ? { url: siteUrl + path, images: [image] } : {}),
    },
    // A large card needs the OG image, which exists only when the site URL is known.
    twitter: { card: siteUrl ? "summary_large_image" : "summary", title, description, ...(siteUrl ? { images: [image] } : {}) },
  };
}
