import { SiteLink } from "../../../components/ui/site-link";
import { demoUrls } from "../../../data/presentation";
import { DetailContents } from "../../../components/projects/detail-contents";
import { ScreenPreview } from "../../../components/projects/screen-preview";
import { notFound } from "next/navigation";
import { featuredProjects, getFeatured, portfolio } from "../../../lib/portfolio";
import { homeAnchor, projectPath } from "../../../lib/routes";
import { ActionLink } from "../../../components/ui/primitives";
import { pageMetadata } from "../../../lib/metadata";
import { BreadcrumbJsonLd } from "../../../components/seo/json-ld";
import { site } from "../../../data/site";
import { formatJapaneseDate } from "../../../lib/dates";
import { ProjectSlideshow } from "../../../components/projects/project-slideshow";
import { projectGalleries } from "../../../data/galleries";
import type { ProjectGallery } from "../../../types/portfolio";
import { DocumentedProjectDetail } from "../../../components/projects/documented-project-detail";

const galleries: Readonly<Record<string, ProjectGallery>> = projectGalleries;

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
  const documentation = portfolio.documentation[slug];
  const gallery = galleries[slug];
  if (!project || !documentation || !gallery) notFound();
  const next = featuredProjects[(featuredProjects.indexOf(project) + 1) % featuredProjects.length]!;
  const demoUrl = demoUrls[project.id];
  return <main id="main" tabIndex={-1} className={`container detail-page ${documentation.pageClassName}`}>
    <BreadcrumbJsonLd project={project} />
    <nav className="breadcrumbs" aria-label="パンくず"><SiteLink href="/">Home</SiteLink><span aria-hidden="true">/</span><SiteLink href={`/#${homeAnchor(project)}`}>代表的な制作</SiteLink><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
    <header id="overview" className="detail-header">
      <p className="eyebrow" lang="en">Selected Work / {String(project.order).padStart(2, "0")}</p>
      <p className="repo-name">{project.name}</p><h1>{project.title}</h1><p className="hero-lead">{project.description.text}</p>
      <p className="detail-updated">画面の最終更新日：<time dateTime={documentation.updatedAt}>{formatJapaneseDate(documentation.updatedAt)}</time></p>
      <ul className="badges" aria-label="実装技術">{project.technologies.map(t => <li key={t.text}>{t.text}</li>)}</ul>
      {demoUrl && <ActionLink primary href={demoUrl}>公開サイトを試す</ActionLink>}
    </header>
    <ProjectSlideshow {...gallery} />
    <div className="detail-grid">
      <DetailContents sections={documentation.sections} />
      <div className="detail-body">
        <DocumentedProjectDetail slug={slug} />
      </div>
    </div>
    <nav className="detail-next" aria-label="次の制作"><p className="eyebrow" lang="en">Next Work</p><ScreenPreview id={next.id} /><h2>{next.title}</h2><p>{next.description.text}</p><ul className="badges">{next.technologies.slice(0, 3).map(t => <li key={t.text}>{t.text}</li>)}</ul><ActionLink href={projectPath(next.slug)}>次の制作を見る</ActionLink></nav>
  </main>;
}
