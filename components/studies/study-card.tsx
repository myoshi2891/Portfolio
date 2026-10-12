import { SiteLink } from "../ui/site-link";
import { demoUrls } from "../../data/presentation";
import { ScreenPreview } from "../projects/screen-preview";
import type { Study } from "../../types/portfolio";
import { homeAnchor } from "../../lib/routes";
import { ActionLink } from "../ui/primitives";
import { projectSummaries } from "../../data/project-summaries";
import { StudySummary } from "./study-summary";

export function StudyCard({ study }: { study: Study }) {
  const summary = projectSummaries[study.id];
  return <article className="study-card" data-repository={study.id} aria-labelledby={homeAnchor(study)}>
    <div className="study-hero">
      <div className="study-copy">
        <p className="eyebrow"><span className="study-index">{String(study.order).padStart(2, "0")}</span>Learning collection</p>
        <h3 id={homeAnchor(study)} tabIndex={-1}>{study.title}</h3>
        <p className="study-lead">{study.description.text}</p>
        {demoUrls[study.id] && <ActionLink primary href={demoUrls[study.id]!} label={`${study.name} 公開サイトを見る`}>公開サイトを見る</ActionLink>}
      </div>
      <div className="study-visual">
        <ScreenPreview id={study.id} sizes="(min-width: 960px) 560px, calc(100vw - 4rem)" />
      </div>
    </div>
    {summary && <StudySummary document={summary} />}
    <footer className="study-footer">
      <p className="repo-name">{study.name}</p>
      <SiteLink className="text-link" id={`github-${study.id.toLowerCase()}`} href={study.githubUrl} aria-label={`${study.name} GitHubで資料を見る`}>GitHubで資料を見る <span aria-hidden="true">↗</span></SiteLink>
    </footer>
  </article>;
}
