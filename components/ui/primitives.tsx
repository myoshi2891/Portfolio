import { SiteLink } from "./site-link";
import type { ReactNode } from "react";

export function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true" className="arrow">{external ? "↗" : "→"}</span>;
}
export function ActionLink({ href, children, primary = false, label, id }: { href: string; children: ReactNode; primary?: boolean; label?: string; id?: string }) {
  return <SiteLink id={id} href={href} className={`action ${primary ? "action-primary" : "action-secondary"}`} aria-label={label}>{children}<Arrow external={href.startsWith("https://")} /></SiteLink>;
}
export function SectionHeader({ number, title, english, intro }: { number: string; title: string; english: string; intro?: string }) {
  return <div className="section-header"><p className="eyebrow"><span>{number}</span> {english}</p><h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div>;
}
