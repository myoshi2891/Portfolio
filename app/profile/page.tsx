import Image from "next/image";
import { ActionLink } from "../../components/ui/primitives";
import { SiteLink } from "../../components/ui/site-link";
import { certifications, profileLinks } from "../../data/profile";
import { site } from "../../data/site";
import { pageMetadata } from "../../lib/metadata";

export function generateMetadata() {
  return pageMetadata("/profile/", `プロフィール — ${site.name}`, "myoshi2891のプロフィール。資格、GitHubの制作・学習資料、X、LeetCode、AWS認定バッジを紹介します。");
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
        <p className="eyebrow">Profile / {site.name}</p>
        <h1 id="profile-title" tabIndex={-1}>プロフィール</h1>
        <p className="profile-name">{site.name}</p>
        <p className="profile-lead">Webアプリケーションの制作と、設計・品質・セキュリティの学習資料を公開しています。</p>
        <div className="profile-social-grid">
          <article className="profile-social-card">
            <p className="eyebrow">Build &amp; Learn</p>
            <h2>GitHub <span>@myoshi2891</span></h2>
            <p>Webアプリの実装から、設計・品質・アルゴリズムの学習資料まで。気になる制作を見つけたら、フォローして次の更新も。</p>
            <ActionLink primary href={site.githubUrl}>GitHubでフォロー</ActionLink>
          </article>
          <article className="profile-social-card">
            <p className="eyebrow">Stay connected</p>
            <h2>X <span>@myoshi2891</span></h2>
            <p>プロフィールの先でも、つながりませんか。</p>
            <ActionLink href={profileLinks.x}>Xでフォロー</ActionLink>
          </article>
        </div>
      </div>
    </section>
    <section id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="profile-section-heading">
        <div><p className="eyebrow">Certifications</p><h2 id="certifications-title">資格</h2></div>
        <ActionLink href={profileLinks.aws}>認定バッジを見る</ActionLink>
      </div>
      <ol className="profile-certifications">
        {certifications.map(certificate => <li key={certificate.name}>
          <h3>{certificate.name}</h3>
          <time dateTime={certificate.date}>{certificate.label}</time>
        </li>)}
      </ol>
      <div className="profile-learning-link">
        <div><p className="eyebrow">Problem solving / myoshizumi</p><h3>LeetCodeプロフィール</h3></div>
        <ActionLink href={profileLinks.leetcode}>LeetCodeを見る</ActionLink>
      </div>
    </section>
  </main>;
}
