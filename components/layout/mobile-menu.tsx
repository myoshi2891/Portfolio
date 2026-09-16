"use client";

import { useRef } from "react";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => { if (ref.current) ref.current.open = false; };
  return <details className="mobile-menu" ref={ref} onKeyDown={event => {
    if (event.key === 'Escape') { close(); ref.current?.querySelector('summary')?.focus(); }
  }}><summary aria-label="メニュー">メニュー <span aria-hidden="true">☰</span></summary>
    <nav aria-label="モバイルナビゲーション" onClick={event => { if ((event.target as Element).closest('a')) close(); }}>
      <a href="/#selected-work">制作</a><a href="/#studies">学習</a><a href="/#about">プロフィール</a><a href="/#philosophy">考え方</a>
    </nav>
  </details>;
}
