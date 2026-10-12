import { SiteLink } from "../ui/site-link";
import { ScreenPreview } from "./screen-preview";
import { demoUrls } from "../../data/presentation";
import type { Project } from "../../types/portfolio";
import { homeAnchor, projectPath } from "../../lib/routes";
import { ActionLink } from "../ui/primitives";
import { SecondaryProjectCard } from "./secondary-project-card";

export function ProjectCard({ project }: { project: Project }) {
  if (project.type === "secondary") return <SecondaryProjectCard project={project} />;
  const id = homeAnchor(project);
  return <article className="project-row" data-repository={project.id}>
    <span className="project-number" aria-hidden="true">{String(project.order).padStart(2, "0")}</span>
    <div className="project-copy"><ScreenPreview id={project.id} /><p className="repo-name">{project.name}</p><h3 id={id} tabIndex={-1}><SiteLink href={projectPath(project.slug)}>{project.title}</SiteLink></h3><p>{project.description.text}</p>
      <ul className="badges" aria-label="実装技術">{project.technologies.slice(0, 3).map(t => <li key={t.text}>{t.text}</li>)}</ul>
    </div>
    <div className="project-aside">{demoUrls[project.id] && <ActionLink primary href={demoUrls[project.id]!} label={`${project.name} 公開サイトを試す`}>公開サイトを試す</ActionLink>}<p className="eyebrow">構成の見どころ</p><p className="highlight">{project.highlights[0]?.text}</p><ActionLink href={projectPath(project.slug)} label={`${project.title}の実装と構成を見る`}>実装と構成を見る</ActionLink>
      <SiteLink className="text-link" id={`github-${project.id.toLowerCase()}`} href={project.githubUrl} aria-label={`${project.name} GitHub`}>GitHub <span aria-hidden="true">↗</span></SiteLink>
    </div>
  </article>;
}
