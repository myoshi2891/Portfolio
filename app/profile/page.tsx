import Image from "next/image";
import { ActionLink } from "../../components/ui/primitives";
import { SectionReveal } from "../../components/ui/section-reveal";
import { SiteLink } from "../../components/ui/site-link";
import { certifications, profileLinks } from "../../data/profile";
import { site } from "../../data/site";
import { pageMetadata } from "../../lib/metadata";
import { SiteJsonLd } from "../../components/seo/json-ld";
import "./profile.css";

export function generateMetadata() {
  return pageMetadata("/profile/", `プロフィール — ${site.name}`, "myoshi2891のプロフィール。保有資格・スコア、GitHubの制作・学習資料、X、LeetCode、AWS認定バッジを紹介します。");
}

export default function Profile() {
  return <main id="main" tabIndex={-1} className="container profile-page">
    <SiteJsonLd />
    <SectionReveal selector=".profile-page [data-reveal]" />
    <SiteLink className="text-link profile-back" href="/#about"><span aria-hidden="true">←</span> ホームの紹介へ</SiteLink>
    <section className="profile-intro" aria-labelledby="profile-title">
      <div className="profile-copy">
        <p className="eyebrow" lang="en">About me</p>
        <h1 id="profile-title" tabIndex={-1}>プロフィール</h1>
        <p className="profile-name"><span aria-hidden="true">@</span>{site.name}</p>
        <p className="profile-lead">Webアプリケーションの制作と、設計・品質・セキュリティの学習資料を公開しています。</p>
        <ul className="profile-focus" role="list" aria-label="学習・制作のテーマ"><li>Web開発</li><li>設計・品質</li><li>クラウド・AI</li></ul>
        <div className="profile-actions">
          <ActionLink primary href="/#selected-work">制作を見る</ActionLink>
          <SiteLink className="text-link" href="#certifications">保有資格・スコアへ <span aria-hidden="true">↓</span></SiteLink>
        </div>
      </div>
      <figure className="profile-portrait">
        <div className="profile-portrait-frame">
          {/* Static export uses the supplied portrait's pre-sized WebP. */}
          <Image src="/images/optimized/profile-720.webp" alt="myoshi2891のモノクロの肖像画" width={720} height={964} sizes="(max-width: 767px) 240px, 300px" unoptimized loading="eager" fetchPriority="high" />
        </div>
        <figcaption lang="en">Learn. Build. Keep improving.</figcaption>
      </figure>
    </section>
    <section id="activity" className="section profile-activity" aria-labelledby="activity-title">
      <div className="profile-section-heading" data-reveal>
        <div><p className="eyebrow" lang="en"><span>01</span> Activity &amp; Connections</p><h2 id="activity-title">制作と学習の発信</h2></div>
      </div>
      <div className="profile-social-grid">
        <article className="profile-social-card" aria-labelledby="profile-github-title" data-reveal>
          <p className="eyebrow" lang="en">Build &amp; Learn</p>
          <div className="profile-social-title"><h3 id="profile-github-title">GitHub</h3><span>@{site.name}</span></div>
          <p>Webアプリのソースコードと、設計・品質・アルゴリズムの学習資料を公開しています。</p>
          <ActionLink primary href={site.githubUrl}>GitHubでフォロー</ActionLink>
        </article>
        <article className="profile-social-card" aria-labelledby="profile-x-title" data-reveal>
          <p className="eyebrow" lang="en">Stay connected</p>
          <div className="profile-social-title"><h3 id="profile-x-title">X</h3><span>@{site.name}</span></div>
          <p>制作や学習の更新を通じて、つながるためのプロフィールです。</p>
          <ActionLink href={profileLinks.x}>Xでフォロー</ActionLink>
        </article>
      </div>
    </section>
    <section id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="profile-section-heading" data-reveal>
        <div><p className="eyebrow" lang="en"><span>02</span> Certifications &amp; Scores</p><h2 id="certifications-title">保有資格・スコア</h2><p className="profile-section-description">取得済みの資格とTOEICスコアを紹介します。各項目には、認定分野や知識・技能の概要を添えています。</p></div>
        <ActionLink href={profileLinks.aws}>認定バッジを見る</ActionLink>
      </div>
      <ol className="profile-certifications" role="list">
        {certifications.map((certificate, index) => <li key={certificate.name} data-reveal>
          <span className="profile-certification-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p className="profile-certification-category">{certificate.category}</p>
            <h3>{certificate.name}</h3>
            <p className="profile-certification-description">{certificate.description}</p>
          </div>
        </li>)}
      </ol>
    </section>
    <section className="profile-learning-link" aria-labelledby="profile-learning-title" data-reveal>
      <div><p className="eyebrow" lang="en">Problem solving / myoshizumi</p><h2 id="profile-learning-title">LeetCodeプロフィール</h2><p className="profile-section-description">アルゴリズムとデータ構造の学習記録。</p></div>
      <ActionLink href={profileLinks.leetcode}>LeetCodeを見る</ActionLink>
    </section>
  </main>;
}
