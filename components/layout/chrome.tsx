import { SiteLink } from "../ui/site-link";
import { MobileMenu } from "./mobile-menu";
import { site } from "../../data/site";
export function Navigation() {
  return <><SiteLink className="skip-link" href="#main">本文へ移動</SiteLink><header className="container masthead"><SiteLink className="wordmark" href="/#top" aria-label="myoshi2891 ホーム"><span className="brand-mark" aria-hidden="true">m<span>.</span></span><span>{site.name}</span></SiteLink><nav className="desktop-nav" aria-label="メインナビゲーション"><SiteLink href="/#selected-work">制作</SiteLink><SiteLink href="/#studies">学習</SiteLink><SiteLink href="/#philosophy">考え方</SiteLink></nav><SiteLink className="github-nav" href={site.githubUrl}>GitHub <span aria-hidden="true">↗</span></SiteLink><MobileMenu /></header></>;
}
export function Footer() {
  return <footer className="container footer"><SiteLink className="wordmark" href="/#top">{site.name}<span className="muted">Engineering Portfolio</span></SiteLink><nav aria-label="フッターナビゲーション"><SiteLink href="/#selected-work">制作</SiteLink><SiteLink href="/#studies">学習</SiteLink><SiteLink href="/#top">ページ先頭へ ↑</SiteLink></nav></footer>;
}
