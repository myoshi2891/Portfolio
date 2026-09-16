import { notFound } from "next/navigation";
import { featuredProjects, getFeatured, portfolio } from "../../../lib/portfolio";
import { homeAnchor, projectPath } from "../../../lib/routes";
import { ActionLink, EvidenceLinks } from "../../../components/ui/primitives";
import type { DetailSectionId } from "../../../types/portfolio";
import { pageMetadata } from "../../../lib/metadata";
import { site } from "../../../data/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return featuredProjects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getFeatured(slug);
  if (!project) notFound();
  return pageMetadata(projectPath(slug), `${project.title} — ${site.name}`, project.description.text);
}
const sectionNames: Record<DetailSectionId, string> = {
  features: "主な機能", architecture: "アーキテクチャ", decisions: "構成と制約", quality: "品質と未検証の範囲",
};

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getFeatured(slug);
  const detail = portfolio.details[slug];
  if (!project || !detail) notFound();
  const sections = Object.entries(detail.sections) as [DetailSectionId, (typeof detail.sections)[DetailSectionId]][];
  const evidenceIds = [...new Set([
    ...project.description.evidenceIds, ...project.technologies.flatMap(t => t.evidenceIds),
    ...sections.flatMap(([, section]) => section.claims.flatMap(c => c.evidenceIds)),
    ...(detail.scope?.flatMap(c => c.evidenceIds) ?? []),
  ])];
  const audit = evidenceIds.map(id => portfolio.evidence[id]).find(e => e?.sourceType === "REPOSITORY_VERIFIED");
  const next = featuredProjects[(featuredProjects.indexOf(project) + 1) % featuredProjects.length]!;
  return <main id="main" tabIndex={-1} className="container detail-page">
    <a className="text-link" href={`/#${homeAnchor(project)}`}>← 代表的な制作へ戻る</a>
    <header id="overview" className="detail-header">
      <p className="eyebrow">Selected Work / {String(project.order).padStart(2, "0")}</p>
      <p className="repo-name">{project.name}</p><h1>{project.title}</h1><p className="hero-lead">{project.description.text}</p>
      <ul className="badges" aria-label="実装技術">{project.technologies.map(t => <li key={t.text}>{t.text}</li>)}</ul>
      <ActionLink primary href={project.githubUrl}>GitHubでコードを見る</ActionLink>
    </header>
    <div className="detail-grid">
      <nav className="detail-contents" aria-label="このページの内容"><h2>このページの内容</h2><ul>
        <li><a href="#overview">概要</a></li>
        {detail.scope && <li><a href="#scope">制作背景・担当範囲</a></li>}
        {sections.map(([id]) => <li key={id}><a href={`#${id}`}>{sectionNames[id]}</a></li>)}
        <li><a href="#evidence">参照コード</a></li>
      </ul></nav>
      <div className="detail-body">
        {detail.scope && <section id="scope"><h2>制作背景・担当範囲</h2>{detail.scope.map(c => <div key={c.text}><p>{c.text}</p><EvidenceLinks ids={c.evidenceIds} /></div>)}</section>}
        {sections.map(([id, section]) => <section key={id} id={id}><h2>{sectionNames[id]}</h2>
          {section.claims.map(c => <div className="claim" key={c.text}><p>{c.text}</p><EvidenceLinks ids={c.evidenceIds} /></div>)}
          {section.limitationIds.map(id => <p className="limitation" key={id}>{portfolio.limitations[id]?.text}</p>)}
        </section>)}
        <section id="evidence"><h2>参照コード</h2>
          {audit?.sourceType === "REPOSITORY_VERIFIED" && <p>参照コードの確認日：<time dateTime={audit.checkedAt}>{audit.checkedAt}</time><br />対象コミット：<a href={`${project.githubUrl}/tree/${audit.commit}`}><code>{audit.commit.slice(0, 12)}</code></a></p>}
          <EvidenceLinks ids={evidenceIds} />
        </section>
      </div>
    </div>
    <nav className="detail-next" aria-label="次の制作"><p className="eyebrow">Next Work</p><h2>{next.title}</h2><ActionLink href={projectPath(next.slug)}>次の制作を見る</ActionLink><a className="text-link" href="/#contact">GitHubプロフィールへ</a></nav>
  </main>;
}
