"use client";

import { SiteLink } from "../ui/site-link";

import { useRef } from "react";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => { if (ref.current) ref.current.open = false; };
  return <details className="mobile-menu" ref={ref} onKeyDown={event => {
    if (event.key === 'Escape') { close(); ref.current?.querySelector('summary')?.focus(); }
  }}><summary aria-label="メニュー">メニュー <span aria-hidden="true">☰</span></summary>
    <nav aria-label="モバイルナビゲーション" onClick={event => { if ((event.target as Element).closest('a')) close(); }}>
      <SiteLink href="/#selected-work">制作</SiteLink><SiteLink href="/#studies">学習</SiteLink><SiteLink href="/#about">プロフィール</SiteLink><SiteLink href="/#philosophy">考え方</SiteLink>
    </nav>
  </details>;
}
