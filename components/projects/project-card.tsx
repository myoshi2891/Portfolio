import type { Project } from "../../types/portfolio";
import { homeAnchor, projectPath } from "../../lib/routes";
import { ActionLink, Disclosure, EvidenceLinks } from "../ui/primitives";

export function ProjectCard({ project }: { project: Project }) {
  const featured = project.type === "featured";
  const id = homeAnchor(project);
  return <article className={featured ? "project-row" : "secondary-row"} data-repository={project.id}>
    {featured && <span className="project-number" aria-hidden="true">{String(project.order).padStart(2, "0")}</span>}
    <div className="project-copy"><p className="repo-name">{project.name}</p><h3 id={id} tabIndex={-1}>{featured ? <a href={projectPath(project.slug)}>{project.title}</a> : project.title}</h3><p>{project.description.text}</p>
      {featured && <ul className="badges" aria-label="実装技術">{project.technologies.slice(0, 3).map(t => <li key={t.text}>{t.text}</li>)}</ul>}
      {!featured && <Disclosure id={`note-${project.id.toLowerCase()}`} label="実装の補足">{project.highlights.map(h => <p key={h.text}>{h.text}</p>)}<EvidenceLinks ids={project.description.evidenceIds} /></Disclosure>}
    </div>
    <div className="project-aside">{featured && <><p className="eyebrow">構成の見どころ</p><p className="highlight">{project.highlights[0]?.text}</p><ActionLink href={projectPath(project.slug)} label={`${project.title}の実装と構成を見る`}>実装と構成を見る</ActionLink></>}
      <a className="text-link" id={`github-${project.id.toLowerCase()}`} href={project.githubUrl} aria-label={`${project.name} ${featured ? "GitHub" : "GitHubでコードを見る"}`}>{featured ? "GitHub" : "GitHubでコードを見る"} <span aria-hidden="true">↗</span></a>
    </div>
  </article>;
}
