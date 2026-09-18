import { SiteLink } from "../../../components/ui/site-link";
import { demoUrls } from "../../../data/presentation";
import { DetailContents } from "../../../components/projects/detail-contents";
import { ScreenPreview } from "../../../components/projects/screen-preview";
import { FeatureStory } from "../../../components/projects/feature-story";
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
    <nav className="breadcrumbs" aria-label="パンくず"><SiteLink href="/">Home</SiteLink><span aria-hidden="true">/</span><SiteLink href={`/#${homeAnchor(project)}`}>代表的な制作</SiteLink><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
    <header id="overview" className="detail-header">
      <p className="eyebrow">Selected Work / {String(project.order).padStart(2, "0")}</p>
      <p className="repo-name">{project.name}</p><h1>{project.title}</h1><p className="hero-lead">{project.description.text}</p>
      <ul className="badges" aria-label="実装技術">{project.technologies.map(t => <li key={t.text}>{t.text}</li>)}</ul>
      {demoUrls[project.id] && <ActionLink primary href={demoUrls[project.id]!}>公開サイトを試す</ActionLink>}
      <ActionLink primary={!demoUrls[project.id]} href={project.githubUrl}>GitHubでコードを見る</ActionLink>
    </header>
    <ScreenPreview id={project.id} priority sizes="(min-width: 1336px) 1240px, 100vw" />
    <div className="detail-grid">
      <DetailContents sections={[{ id: "overview", label: "概要" }, ...(detail.scope ? [{ id: "scope", label: "制作背景・担当範囲" }] : []), ...sections.map(([id]) => ({ id, label: sectionNames[id] })), { id: "evidence", label: "参照コード" }]} />
      <div className="detail-body">
        {detail.scope && <section id="scope"><h2>制作背景・担当範囲</h2>{detail.scope.map(c => <div key={c.text}><p>{c.text}</p><EvidenceLinks ids={c.evidenceIds} /></div>)}</section>}
        {sections.map(([id, section]) => <section key={id} id={id}><h2>{sectionNames[id]}</h2>
          {id === "features" && <p className="section-intro feature-intro">操作の入口からデータの処理まで。取り上げる理由と、コードを読むポイントを機能ごとにまとめました。</p>}
          {section.claims.map((c, index) => id === "features"
            ? <FeatureStory key={c.text} claim={c} index={index} />
            : <div className="claim" key={c.text}><p>{c.text}</p><EvidenceLinks ids={c.evidenceIds} /></div>)}
          {section.limitationIds.map(id => <p className="limitation" key={id}>{portfolio.limitations[id]?.text}</p>)}
        </section>)}
        <section id="evidence"><h2>参照コード</h2>
          {audit?.sourceType === "REPOSITORY_VERIFIED" && <p>参照コードの確認日：<time dateTime={audit.checkedAt}>{audit.checkedAt}</time><br />対象コミット：<SiteLink href={`${project.githubUrl}/tree/${audit.commit}`}><code>{audit.commit.slice(0, 12)}</code></SiteLink></p>}
          <EvidenceLinks ids={evidenceIds} />
        </section>
      </div>
    </div>
    <nav className="detail-next" aria-label="次の制作"><p className="eyebrow">Next Work</p><ScreenPreview id={next.id} /><h2>{next.title}</h2><p>{next.description.text}</p><ul className="badges">{next.technologies.slice(0, 3).map(t => <li key={t.text}>{t.text}</li>)}</ul><ActionLink href={projectPath(next.slug)}>次の制作を見る</ActionLink><SiteLink className="text-link" href="/#contact">GitHubプロフィールへ</SiteLink></nav>
  </main>;
}
