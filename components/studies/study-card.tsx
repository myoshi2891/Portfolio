import { demoUrls } from "../../data/presentation";
import { ScreenPreview } from "../projects/screen-preview";
import type { Study } from "../../types/portfolio";
import { homeAnchor } from "../../lib/routes";
import { ActionLink, Disclosure, EvidenceLinks } from "../ui/primitives";
export function StudyCard({ study }: { study: Study }) {
  return <article className="study-card" data-repository={study.id}><ScreenPreview id={study.id} /><p className="eyebrow">学習テーマ <span className="study-index">{String(study.order).padStart(2, "0")}</span></p><h3 id={homeAnchor(study)} tabIndex={-1}>{study.title}</h3><p>{study.description.text}</p><p className="repo-name">{study.name}</p>{demoUrls[study.id] && <ActionLink primary href={demoUrls[study.id]!} label={`${study.name} 公開サイトを見る`}>公開サイトを見る</ActionLink>}<a className="text-link" id={`github-${study.id.toLowerCase()}`} href={study.githubUrl} aria-label={`${study.name} GitHubで資料を見る`}>GitHubで資料を見る <span aria-hidden="true">↗</span></a><Disclosure id={`note-${study.id.toLowerCase()}`}>{study.implementationNotes.map(n => <p key={n.text}>{n.text}</p>)}<EvidenceLinks ids={study.description.evidenceIds} /></Disclosure></article>;
}
