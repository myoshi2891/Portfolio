import type { ReactNode } from "react";
import { portfolio } from "../../lib/portfolio";

export function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true" className="arrow">{external ? "↗" : "↗"}</span>;
}
export function ActionLink({ href, children, primary = false, label, id }: { href: string; children: ReactNode; primary?: boolean; label?: string; id?: string }) {
  return <a id={id} href={href} className={`action ${primary ? "action-primary" : "action-secondary"}`} aria-label={label}>{children}<Arrow /></a>;
}
export function SectionHeader({ number, title, english, intro }: { number: string; title: string; english: string; intro?: string }) {
  return <div className="section-header"><p className="eyebrow"><span>{number}</span> {english}</p><h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div>;
}
export function EvidenceLinks({ ids }: { ids: readonly string[] }) {
  const sources = ids.flatMap(id => {
    const e = portfolio.evidence[id];
    return e?.sourceType === "REPOSITORY_VERIFIED" ? e.sources : [];
  }).filter((s, i, all) => all.findIndex(other => other.url === s.url) === i);
  return <ul className="source-links" aria-label="参照コード">{sources.map(s => <li key={s.url}><a href={s.url}>{s.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul>;
}
export function Disclosure({ id, children, label = "資料サイトの実装" }: { id: string; children: ReactNode; label?: string }) {
  return <details id={id} className="disclosure"><summary id={`${id}-toggle`}>{label}</summary><div className="disclosure-content">{children}</div></details>;
}
