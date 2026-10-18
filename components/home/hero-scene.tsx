"use client";

import { useEffect, useRef, useState } from "react";

const facets = [
  { key: "build", index: "01", label: "BUILD", detail: "04 PRODUCTS" },
  { key: "study", index: "02", label: "STUDY", detail: "06 COLLECTIONS" },
  { key: "engineer", index: "03", label: "ENGINEER", detail: "DESIGN · QUALITY · SECURITY" },
  { key: "improve", index: "04", label: "IMPROVE", detail: "TEST · REFINE · REPEAT" },
] as const;

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 768px)");
    let visible = false;
    const update = () => { scene.dataset.active = String(visible && !document.hidden && !motion.matches && desktop.matches && !paused); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; update(); });
    observer.observe(scene);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    desktop.addEventListener("change", update);
    scene.dataset.ready = "true";
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, [paused]);

  return <div className="hero-scene" ref={ref}>
    <div className="hero-scene-header"><p className="eyebrow" lang="en">Portfolio architecture</p><span aria-hidden="true">01 — 04</span></div>
    <div className="hero-scene-stage" role="img" aria-label="学びを起点に、制作・設計・改善へ循環するポートフォリオ">
      <div className="hero-scene-aura" />
      <div className="hero-scene-world" aria-hidden="true">
        <div className="hero-scene-orbits"><div className="hero-scene-ring ring-one" /><div className="hero-scene-ring ring-two" /></div>
        <svg className="hero-scene-links" viewBox="0 0 600 420" preserveAspectRatio="none">
          <path d="M300 210 C214 202 156 138 92 92 M300 210 C394 188 454 128 516 82 M300 210 C210 238 150 292 88 338 M300 210 C390 238 452 294 520 340" />
          <circle cx="92" cy="92" r="4" /><circle cx="516" cy="82" r="4" /><circle cx="88" cy="338" r="4" /><circle cx="520" cy="340" r="4" />
        </svg>
        <div className="hero-scene-core"><span>m<span>.</span></span><small>LEARN</small></div>
        {facets.map(facet => <div className={`hero-scene-node node-${facet.key}`} key={facet.key}><span>{facet.index}</span><strong>{facet.label}</strong><small>{facet.detail}</small></div>)}
      </div>
    </div>
    <div className="hero-scene-caption"><span lang="en">Learn. Build. Keep improving.</span><button type="button" className="scene-toggle" aria-label={paused ? "立体図のアニメーションを再生" : "立体図のアニメーションを一時停止"} aria-pressed={paused} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? "▷" : "‖"}</span>{paused ? "再生" : "一時停止"}</button></div>
  </div>;
}
