"use client";

import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeTheme } from "../../lib/theme";

const serverTheme = () => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, serverTheme);
  if (theme === null) return <span className="theme-toggle theme-toggle-placeholder" aria-hidden="true">表示切替</span>;
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? "ライト" : "ダーク";
  return <button className="theme-toggle" type="button" aria-label={`${label}モードに切り替える`}
    title={`現在は${theme === "light" ? "ライト" : "ダーク"}モード`} onClick={() => setTheme(next)}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {next === "light" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.7 13A9 9 0 0 1 11 3.3 9 9 0 1 0 20.7 13Z" />}
    </svg>
    <span>{label}</span>
  </button>;
}
