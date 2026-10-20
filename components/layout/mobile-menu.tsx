"use client";

import { PrimaryNavLinks } from "./primary-nav-links";

import { useEffect, useRef } from "react";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => { if (ref.current) ref.current.open = false; };
  // Taps and focus that land outside close the menu. focusin is used instead of blur because WebKit
  // does not focus a clicked link, so blur would hide the panel before the click lands.
  useEffect(() => {
    const closeOutside = (event: Event) => {
      if (ref.current?.open && event.target instanceof Node && !ref.current.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, []);
  return <details className="mobile-menu" ref={ref} onKeyDown={event => {
    if (event.key === 'Escape') { close(); ref.current?.querySelector('summary')?.focus(); }
  }}><summary aria-label="メニュー">メニュー <span aria-hidden="true">☰</span></summary>
    <nav aria-label="モバイルナビゲーション" onClick={event => { if ((event.target as Element).closest('a')) close(); }}>
      <PrimaryNavLinks />
    </nav>
  </details>;
}
