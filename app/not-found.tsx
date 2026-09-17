import { SiteLink } from "../components/ui/site-link";
import { featuredProjects } from "../lib/portfolio";
import { projectPath } from "../lib/routes";
import { ActionLink } from "../components/ui/primitives";

export default function NotFound() {
  return <main id="main" tabIndex={-1} className="container not-found">
    <div className="not-found-intro"><p className="error-number" aria-hidden="true">404<span>.</span></p><p className="eyebrow">A little off the path</p><h1>ページが見つかりません</h1><p>URLが変更されたか、ページが存在しないようです。<br />制作一覧から、気になるプロジェクトを探してみてください。</p><ActionLink primary href="/">トップページに戻る</ActionLink></div>
    <nav aria-label="代表的な制作" className="recovery-grid">{featuredProjects.map((p, i) => <SiteLink key={p.id} href={projectPath(p.slug)}><span className="eyebrow">0{i + 1} / Selected Work</span><h2>{p.title} <span aria-hidden="true">→</span></h2><p>{p.description.text}</p></SiteLink>)}</nav>
  </main>;
}
