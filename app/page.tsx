import { ScreenPreview } from "../components/projects/screen-preview";
import { site } from "../data/site";
import { domains } from "../data/domains";
import { studies } from "../data/studies";
import { featuredProjects, secondaryProjects } from "../lib/portfolio";
import { ProjectCard } from "../components/projects/project-card";
import { StudyCard } from "../components/studies/study-card";
import { ActionLink, SectionHeader } from "../components/ui/primitives";
import { NavigationController } from "../components/home/navigation-controller";
import { pageMetadata } from "../lib/metadata";

export function generateMetadata() { return pageMetadata("/", site.title, site.description); }

export default function Home() {
  return <main id="main" tabIndex={-1} className="container">
    <NavigationController />
    <section className="hero" aria-labelledby="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="blue-dot" />Engineering Portfolio <span className="edition">/ 2026</span></p>
          <h1 id="top" tabIndex={-1} aria-label={site.hero}>学びを、<br /><span>仕組みにする。</span></h1>
          <p className="hero-lead">{site.description}</p>
          <div className="hero-actions"><ActionLink primary href="/#selected-work">制作を見る</ActionLink><ActionLink href={site.githubUrl}>GitHubを見る</ActionLink></div>
          <div className="hero-index"><span><strong>04</strong> <a href="/#work-r01">Featured projects</a></span><span><strong>06</strong> Learning collections</span></div>
        </div>
        <div className="hero-preview"><p className="eyebrow">From learning to interface</p><ScreenPreview id="R06" priority /><a className="text-link" href="/projects/comparison-of-llms/">LLMの費用計算、その仕組みを見る <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="hero-foot"><p>Learn <span>→</span> Build <span>→</span> Engineer <span>→</span> Improve</p><a href="#selected-work" aria-label="代表的な制作へ">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="selected-work" className="section" aria-label="代表的な制作"><SectionHeader number="01" english="Selected Work" title="代表的な制作" intro="用途と実装の異なる4つの制作を、コードと構成から紹介します。" /><div>{featuredProjects.map(p => <ProjectCard key={p.id} project={p} />)}</div></section>
    <section id="domains" className="section" aria-label="制作と学習の領域"><SectionHeader number="02" english="Engineering Domains" title="制作と学習の領域" intro="アプリを作ること、領域を学ぶこと、設計と品質を考えること。" /><div className="domain-grid">{domains.map(d => <article className="domain-card" key={d.title}><p className="domain-label">{d.title}</p><p className="domain-english">{d.english}</p><h3>{d.subtitle}</h3><p>{d.description}</p><ul>{d.links.map(l => <li key={l.anchor}><a className="text-link" href={"href" in l ? l.href : `/#${l.anchor}`}>{l.label} <span aria-hidden="true">↗</span></a></li>)}</ul></article>)}</div></section>
    <section id="studies" className="section" aria-label="学習と技術資料"><SectionHeader number="03" english="Selected Studies" title="学習と技術資料" intro="設計・品質・セキュリティを中心に、学習テーマと資料をまとめています。" /><div className="study-grid">{studies.slice(0, 3).map(s => <StudyCard key={s.id} study={s} />)}</div><details id="more-studies" className="more-studies"><summary id="more-studies-toggle"><span className="when-closed">すべての学習を見る（残り3件）</span><span className="when-open">追加の3件を閉じる</span></summary><div className="study-grid">{studies.slice(3).map(s => <StudyCard key={s.id} study={s} />)}</div></details></section>
    <section id="more-work" className="section" aria-label="その他の制作"><SectionHeader number="04" english="More Work" title="その他の制作" intro="予約やオンラインストアなど、関連する制作のコードも公開しています。" />{secondaryProjects.map(p => <ProjectCard key={p.id} project={p} />)}</section>
    <section id="about" className="section about" aria-label="プロフィール"><p className="eyebrow">About / {site.name}</p><h2>コードと学習の、<br />両側から。</h2><div><p>Webアプリケーションの制作と、設計・品質・セキュリティの学習資料を公開しています。</p><p>このサイトでは、操作からデータ処理までの流れと、実装上の選択を紹介します。気になる機能から、対応するコードまでたどれます。</p><a className="text-link" href={site.githubUrl}>GitHubで活動を見る <span aria-hidden="true">↗</span></a></div></section>
    <section id="philosophy" className="section philosophy" aria-label="学び、作り、見直す"><SectionHeader number="05" english="Engineering Philosophy" title="学び、作り、見直す" /><div className="philosophy-grid">{site.philosophy.map((p, i) => <article key={p.title}><p className="eyebrow">{String(i + 1).padStart(2, "0")}</p><h3>{p.title}<span aria-hidden="true">{i < 3 ? " →" : " ↗"}</span></h3><p>{p.text}</p><a className="text-link" href={p.href}>{p.label} <span aria-hidden="true">↗</span></a></article>)}</div></section>
    <section id="contact" className="contact section" aria-label="GitHub"><p className="eyebrow">Explore the source</p><h2>GitHubで<br className="mobile-break" />制作と学習を見る</h2><p>各リポジトリで、実装コードと学習資料を確認できます。</p><ActionLink primary href={site.githubUrl}>GitHubプロフィールを見る</ActionLink></section>
  </main>;
}
