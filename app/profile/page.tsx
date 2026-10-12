import Image from "next/image";
import { ActionLink } from "../../components/ui/primitives";
import { SiteLink } from "../../components/ui/site-link";
import { certifications, profileLinks } from "../../data/profile";
import { site } from "../../data/site";
import { pageMetadata } from "../../lib/metadata";

export function generateMetadata() {
  return pageMetadata("/profile/", `プロフィール — ${site.name}`, "myoshi2891のプロフィール。保有資格・スコア、GitHubの制作・学習資料、X、LeetCode、AWS認定バッジを紹介します。");
}

export default function Profile() {
  return <main id="main" tabIndex={-1} className="container profile-page">
    <SiteLink className="text-link" href="/#about">← ホームの紹介へ</SiteLink>
    <section className="profile-intro" aria-labelledby="profile-title">
      <div className="profile-portrait">
        {/* Static export has no image optimizer: ship a pre-sized 2x WebP for the 360px slot. */}
        <Image src="/images/optimized/profile-720.webp" alt="myoshi2891のモノクロの肖像画" width={720} height={964} sizes="(max-width: 360px) 100vw, 360px" unoptimized loading="eager" fetchPriority="high" />
      </div>
      <div className="profile-copy">
        <p className="eyebrow">About me</p>
        <h1 id="profile-title" tabIndex={-1}>プロフィール</h1>
        <p className="profile-name">{site.name}</p>
        <ul className="profile-focus" aria-label="学習・制作のテーマ"><li>Web開発</li><li>設計・品質</li><li>クラウド・AI</li></ul>
        <p className="profile-lead">Webアプリケーションの制作と、設計・品質・セキュリティの学習資料を公開しています。</p>
        <div className="profile-social-grid">
          <article className="profile-social-card">
            <p className="eyebrow">Build &amp; Learn</p>
            <h2>GitHub <span>@myoshi2891</span></h2>
            <p>Webアプリのソースコードと、設計・品質・アルゴリズムの学習資料を公開しています。</p>
            <ActionLink primary href={site.githubUrl}>GitHubでフォロー</ActionLink>
          </article>
          <article className="profile-social-card">
            <p className="eyebrow">Stay connected</p>
            <h2>X <span>@myoshi2891</span></h2>
            <p>制作や学習の更新を通じて、つながるためのプロフィールです。</p>
            <ActionLink href={profileLinks.x}>Xでフォロー</ActionLink>
          </article>
        </div>
      </div>
    </section>
    <section id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="profile-section-heading">
        <div><p className="eyebrow">Certifications &amp; Scores</p><h2 id="certifications-title">保有資格・スコア</h2><p className="profile-section-description">取得済みの資格とTOEICスコアを紹介します。各項目には、認定分野や知識・技能の概要を添えています。</p></div>
        <ActionLink href={profileLinks.aws}>認定バッジを見る</ActionLink>
      </div>
      <ol className="profile-certifications">
        {certifications.map(certificate => <li key={certificate.name}>
          <p className="profile-certification-category">{certificate.category}</p>
          <h3>{certificate.name}</h3>
          <p className="profile-certification-description">{certificate.description}</p>
        </li>)}
      </ol>
      <div className="profile-learning-link">
        <div><p className="eyebrow">Problem solving / myoshizumi</p><h3>LeetCodeプロフィール</h3><p className="profile-section-description">アルゴリズムとデータ構造の学習記録。</p></div>
        <ActionLink href={profileLinks.leetcode}>LeetCodeを見る</ActionLink>
      </div>
    </section>
  </main>;
}
