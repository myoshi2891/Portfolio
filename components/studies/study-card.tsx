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
  const disclosureId = `study-details-${study.id.toLowerCase()}`;
  return <article className="study-card" data-repository={study.id} aria-labelledby={homeAnchor(study)}>
    <div className="study-hero">
      <div className="study-visual">
        <ScreenPreview id={study.id} sizes="(min-width: 1340px) 560px, (min-width: 960px) 44vw, calc(100vw - 4rem)" />
      </div>
      <div className="study-copy">
        <p className="eyebrow"><span className="study-index">{String(study.order).padStart(2, "0")}</span>Learning collection</p>
        <h3 id={homeAnchor(study)} tabIndex={-1}>{study.title}</h3>
        <p className="study-lead">{study.description.text}</p>
      </div>
    </div>
    <footer className="study-footer">
      {demoUrls[study.id] && <ActionLink primary href={demoUrls[study.id]!} label={`${study.name} 公開サイトを見る`}>公開サイトを見る</ActionLink>}
      <SiteLink className="text-link" id={`github-${study.id.toLowerCase()}`} href={study.githubUrl} aria-label={`${study.name} GitHubで資料を見る`}>GitHubで資料を見る <span aria-hidden="true">↗</span></SiteLink>
    </footer>
    {summary && <details className="study-details" id={disclosureId}>
      <summary id={`${disclosureId}-toggle`}><span>詳しい内容を見る<span className="study-toggle-context">：{study.title}</span></span><span className="disclosure-mark" aria-hidden="true" /></summary>
      <StudySummary document={summary} />
    </details>}
  </article>;
}
