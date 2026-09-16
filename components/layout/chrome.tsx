import { MobileMenu } from "./mobile-menu";
import { site } from "../../data/site";
export function Navigation() {
  return <><a className="skip-link" href="#main">本文へ移動</a><header className="container masthead"><a className="wordmark" href="/#top" aria-label="myoshi2891 ホーム"><span className="brand-mark" aria-hidden="true">m<span>.</span></span><span>{site.name}</span></a><nav className="desktop-nav" aria-label="メインナビゲーション"><a href="/#selected-work">制作</a><a href="/#studies">学習</a><a href="/#philosophy">考え方</a></nav><a className="github-nav" href={site.githubUrl}>GitHub <span aria-hidden="true">↗</span></a><MobileMenu /></header></>;
}
export function Footer() {
  return <footer className="container footer"><a className="wordmark" href="/#top">{site.name}<span className="muted">Engineering Portfolio</span></a><nav aria-label="フッターナビゲーション"><a href="/#selected-work">制作</a><a href="/#studies">学習</a><a href="/#top">ページ先頭へ ↑</a></nav></footer>;
}
