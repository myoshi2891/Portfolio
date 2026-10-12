import type { Project } from "../../types/portfolio";
import { demoUrls } from "../../data/presentation";
import { projectSummaries } from "../../data/project-summaries";
import { homeAnchor } from "../../lib/routes";
import { MarkdownDocumentContent } from "../content/markdown-document";
import { ActionLink } from "../ui/primitives";
import { ScreenPreview } from "./screen-preview";

export function SecondaryProjectCard({ project }: { project: Extract<Project, { type: "secondary" }> }) {
  const summary = projectSummaries[project.id];
  return <article className="secondary-row" data-repository={project.id} aria-labelledby={homeAnchor(project)}>
    <div className="secondary-visual">
      <ScreenPreview id={project.id} sizes="(min-width: 960px) 560px, calc(100vw - 4rem)" />
    </div>
    <div className="secondary-copy">
      <p className="eyebrow"><span className="secondary-index">{String(project.order).padStart(2, "0")}</span>Related project</p>
      <h3 id={homeAnchor(project)} tabIndex={-1}>{project.title}</h3>
      <p className="secondary-lead">{project.description.text}</p>
      {summary && <div className="secondary-summary"><MarkdownDocumentContent document={summary} /></div>}
      <div className="secondary-actions">
        {demoUrls[project.id] && <ActionLink primary href={demoUrls[project.id]!} label={`${project.name} 公開サイトを試す`}>公開サイトを試す</ActionLink>}
        <ActionLink id={`github-${project.id.toLowerCase()}`} href={project.githubUrl} label={`${project.name} GitHubでコードを見る`}>GitHubでコードを見る</ActionLink>
      </div>
      <p className="repo-name">{project.name}</p>
    </div>
  </article>;
}
