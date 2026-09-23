import { SiteLink } from "../../../components/ui/site-link";
import { demoUrls } from "../../../data/presentation";
import { DetailContents } from "../../../components/projects/detail-contents";
import { ScreenPreview } from "../../../components/projects/screen-preview";
import { notFound } from "next/navigation";
import { featuredProjects, getFeatured, portfolio } from "../../../lib/portfolio";
import { homeAnchor, projectPath } from "../../../lib/routes";
import { ActionLink } from "../../../components/ui/primitives";
import { pageMetadata } from "../../../lib/metadata";
import { site } from "../../../data/site";
import { LlmStudiesDetail, llmDetailSections } from "../../../components/projects/llm-studies-detail";
import { LlmStudiesSlideshow } from "../../../components/projects/llm-studies-slideshow";
import { MedicalStudiesDetail, medicalDetailSections } from "../../../components/projects/medical-studies-detail";
import { MedicalStudiesSlideshow } from "../../../components/projects/medical-studies-slideshow";
import { MultiVendorDetail, multiVendorDetailSections } from "../../../components/projects/multi-vendor-detail";
import { WildOasisDetail, wildOasisDetailSections } from "../../../components/projects/wild-oasis-detail";
import { WildOasisSlideshow } from "../../../components/projects/wild-oasis-slideshow";

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
export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getFeatured(slug);
  const detail = portfolio.details[slug];
  if (!project || !detail) notFound();
  const next = featuredProjects[(featuredProjects.indexOf(project) + 1) % featuredProjects.length]!;
  const isLlmStudies = project.slug === "comparison-of-llms";
  const isMedicalStudies = project.slug === "medical-studies";
  const isMultiVendor = project.slug === "multi-vendor-e-commerce";
  const isWildOasis = project.slug === "the-wild-oasis-for-admin";
  return <main id="main" tabIndex={-1} className={`container detail-page${isLlmStudies ? " llm-detail-page" : ""}${isMedicalStudies ? " medical-detail-page" : ""}${isMultiVendor ? " multi-vendor-detail-page" : ""}${isWildOasis ? " wild-oasis-detail-page" : ""}`}>
    <nav className="breadcrumbs" aria-label="パンくず"><SiteLink href="/">Home</SiteLink><span aria-hidden="true">/</span><SiteLink href={`/#${homeAnchor(project)}`}>代表的な制作</SiteLink><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
    <header id="overview" className="detail-header">
      <p className="eyebrow">Selected Work / {String(project.order).padStart(2, "0")}</p>
      <p className="repo-name">{project.name}</p><h1>{project.title}</h1><p className="hero-lead">{project.description.text}</p>
      {isLlmStudies && <p className="detail-updated">画面の最終更新日：<time dateTime="2026-09-23">2026年9月23日</time></p>}
      {isMedicalStudies && <p className="detail-updated">画面の最終更新日：<time dateTime="2026-09-24">2026年9月24日</time></p>}
      {isMultiVendor && <p className="detail-updated">画面の最終更新日：<time dateTime="2026-09-24">2026年9月24日</time></p>}
      {isWildOasis && <p className="detail-updated">画面の最終更新日：<time dateTime="2026-09-24">2026年9月24日</time></p>}
      <ul className="badges" aria-label="実装技術">{project.technologies.map(t => <li key={t.text}>{t.text}</li>)}</ul>
      {demoUrls[project.id] && <ActionLink primary href={demoUrls[project.id]!}>公開サイトを試す</ActionLink>}
      <ActionLink primary={!demoUrls[project.id]} href={project.githubUrl}>GitHubでコードを見る</ActionLink>
    </header>
    {isLlmStudies ? <LlmStudiesSlideshow /> : isMedicalStudies ? <MedicalStudiesSlideshow /> : isWildOasis ? <WildOasisSlideshow /> : null}
    <div className="detail-grid">
      <DetailContents sections={isLlmStudies ? [...llmDetailSections] : isMedicalStudies ? [...medicalDetailSections] : isMultiVendor ? [...multiVendorDetailSections] : [...wildOasisDetailSections]} />
      <div className="detail-body">
        {isLlmStudies ? <LlmStudiesDetail /> : isMedicalStudies ? <MedicalStudiesDetail /> : isMultiVendor ? <MultiVendorDetail /> : <WildOasisDetail />}
      </div>
    </div>
    <nav className="detail-next" aria-label="次の制作"><p className="eyebrow">Next Work</p><ScreenPreview id={next.id} /><h2>{next.title}</h2><p>{next.description.text}</p><ul className="badges">{next.technologies.slice(0, 3).map(t => <li key={t.text}>{t.text}</li>)}</ul><ActionLink href={projectPath(next.slug)}>次の制作を見る</ActionLink><SiteLink className="text-link" href="/#contact">GitHubプロフィールへ</SiteLink></nav>
  </main>;
}
