import { featuredProjects } from "../lib/portfolio";
import { projectPath } from "../lib/routes";

export default function NotFound() {
  return <main id="main" tabIndex={-1} className="container section"><p className="eyebrow">404 / Not Found</p><h1>ページが見つかりません</h1><p>Homeから制作と学習をご覧いただけます。</p><a className="text-link" href="/">Homeへ戻る</a><ul className="source-links">{featuredProjects.map(p => <li key={p.id}><a href={projectPath(p.slug)}>{p.title}</a></li>)}</ul></main>;
}
