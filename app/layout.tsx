import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Navigation, Footer } from "../components/layout/chrome";
import "./globals.css";
import "./fonts.css";
import { site } from "../data/site";

export const metadata = { title: site.title, description: site.description };

const inter = localFont({
  src: [
    { path: "../assets/fonts/inter-latin-400-normal.woff2", weight: "400" },
    { path: "../assets/fonts/inter-latin-500-normal.woff2", weight: "500" },
    { path: "../assets/fonts/inter-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-inter", display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ja" className={inter.variable}><body><Navigation />{children}<Footer /></body></html>;
}
