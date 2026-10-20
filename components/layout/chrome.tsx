import Image from "next/image";
import { SiteLink } from "../ui/site-link";
import { MobileMenu } from "./mobile-menu";
import { PrimaryNavLinks } from "./primary-nav-links";
import { HeaderGithubLink } from "./header-github-link";
import { ThemeToggle } from "./theme-toggle";
import { site } from "../../data/site";
import { featuredProjects } from "../../lib/portfolio";
import { projectPath } from "../../lib/routes";

// 404.html を任意のURLで配信しても hydration が一致するよう、実在する詳細ページだけを対象にする
const projectDetailPaths = featuredProjects.map(({ slug }) => projectPath(slug));
export function Navigation() {
  return <>
    <SiteLink className="skip-link" href="#main">本文へ移動</SiteLink>
    <header className="masthead"><div className="container masthead-inner">
      <SiteLink className="wordmark" href="/#top" aria-label="myoshi2891 ホーム"><Image className="brand-logo" src="/images/optimized/myoshi-logo-96.webp" alt="" width={40} height={40} unoptimized /><span>{site.name}</span></SiteLink>
      <nav className="desktop-nav" aria-label="メインナビゲーション"><PrimaryNavLinks /></nav>
      <HeaderGithubLink href={site.githubUrl} hiddenPaths={projectDetailPaths} />
      <ThemeToggle />
      <MobileMenu />
    </div></header>
  </>;
}
export function Footer() {
  return <footer className="container footer">
    <SiteLink className="wordmark" href="/#top">{site.name}<span className="muted" lang="en">Engineering Portfolio</span></SiteLink>
    <nav aria-label="フッターナビゲーション">{site.footerNavigation.map(({ label, href }) => <SiteLink key={href} href={href}>{label}</SiteLink>)}</nav>
  </footer>;
}
