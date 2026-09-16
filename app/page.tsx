import { site } from "../data/site";
import { domains } from "../data/domains";
import { studies } from "../data/studies";
import { featuredProjects, secondaryProjects } from "../lib/portfolio";
import { ProjectCard } from "../components/projects/project-card";
import { StudyCard } from "../components/studies/study-card";
import { ActionLink, SectionHeader } from "../components/ui/primitives";

export default function Home() {
  return <main id="main" tabIndex={-1} className="container">
    <section className="hero" aria-labelledby="top"><p className="eyebrow hero-eyebrow"><span className="blue-dot" />Engineering Portfolio</p><h1 id="top" tabIndex={-1}>{site.hero}</h1><p className="hero-lead">{site.description}</p><div className="hero-actions"><ActionLink primary href="/#selected-work">制作を見る</ActionLink><a href={site.githubUrl} className="text-link">GitHubを見る <span aria-hidden="true">↗</span></a></div><div className="hero-foot"><p>Learn <span>→</span> Build <span>→</span> Engineer <span>→</span> Improve</p><a href="#selected-work" aria-label="代表的な制作へ">Selected Work <span aria-hidden="true">↓</span></a></div></section>
    <section id="selected-work" className="section" aria-label="代表的な制作"><SectionHeader number="01" english="Selected Work" title="代表的な制作" intro="用途と実装の異なる4つの制作を、コードと構成から紹介します。" /><div>{featuredProjects.map(p => <ProjectCard key={p.id} project={p} />)}</div></section>
    <section id="domains" className="section" aria-label="制作と学習の領域"><SectionHeader number="02" english="Engineering Domains" title="制作と学習の領域" intro="アプリを作ること、領域を学ぶこと、設計と品質を考えること。" /><div className="domain-grid">{domains.map(d => <article className="domain-card" key={d.title}><p className="domain-label">{d.title}</p><p className="domain-english">{d.english}</p><h3>{d.subtitle}</h3><p>{d.description}</p><ul>{d.links.map(l => <li key={l.anchor}><a className="text-link" href={`/#${l.anchor}`}>{l.label} <span aria-hidden="true">↗</span></a></li>)}</ul></article>)}</div></section>
    <section id="studies" className="section" aria-label="学習と技術資料"><SectionHeader number="03" english="Selected Studies" title="学習と技術資料" intro="設計・品質・セキュリティを中心に、学習テーマと資料をまとめています。" /><div className="study-grid">{studies.slice(0, 3).map(s => <StudyCard key={s.id} study={s} />)}</div><details id="more-studies" className="more-studies"><summary id="more-studies-toggle"><span className="when-closed">すべての学習を見る（残り3件）</span><span className="when-open">追加の3件を閉じる</span></summary><div className="study-grid">{studies.slice(3).map(s => <StudyCard key={s.id} study={s} />)}</div></details></section>
    <section id="more-work" className="section" aria-label="その他の制作"><SectionHeader number="04" english="More Work" title="その他の制作" intro="予約やオンラインストアなど、関連する制作のコードも公開しています。" />{secondaryProjects.map(p => <ProjectCard key={p.id} project={p} />)}</section>
    <section id="philosophy" className="section philosophy" aria-label="学び、作り、見直す"><SectionHeader number="05" english="Engineering Philosophy" title="学び、作り、見直す" /><div className="philosophy-grid">{site.philosophy.map((p, i) => <article key={p.title}><p className="eyebrow">{String(i + 1).padStart(2, "0")}</p><h3>{p.title}<span aria-hidden="true">{i < 3 ? " →" : " ↗"}</span></h3><p>{p.text}</p><a className="text-link" href={p.href}>{p.label} <span aria-hidden="true">↗</span></a></article>)}</div></section>
    <section id="contact" className="contact section" aria-label="GitHub"><p className="eyebrow">Explore the source</p><h2>GitHubで<br className="mobile-break" />制作と学習を見る</h2><p>各リポジトリで、実装コードと学習資料を確認できます。</p><ActionLink primary href={site.githubUrl}>GitHubプロフィールを見る</ActionLink></section>
  </main>;
}
