"use client";

import { useEffect, useRef } from "react";

const facets = [
  { key: "build", index: "01", label: "BUILD", detail: "04 PRODUCTS" },
  { key: "study", index: "02", label: "STUDY", detail: "06 COLLECTIONS" },
  { key: "engineer", index: "03", label: "ENGINEER", detail: "DESIGN · QUALITY · SECURITY" },
  { key: "improve", index: "04", label: "IMPROVE", detail: "TEST · REFINE · REPEAT" },
] as const;

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    let visible = true;
    const update = () => { scene.dataset.active = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; update(); });
    observer.observe(scene);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  return <div className="hero-scene" ref={ref} role="img" aria-label="学びを起点に、制作・設計・改善へ循環するポートフォリオ">
    <div className="hero-scene-header" aria-hidden="true"><p className="eyebrow">Portfolio architecture</p><span><i />System in motion</span></div>
    <div className="hero-scene-stage" aria-hidden="true">
      <div className="hero-scene-aura" />
      <div className="hero-scene-world">
        <div className="hero-scene-ring ring-one" /><div className="hero-scene-ring ring-two" />
        <svg className="hero-scene-links" viewBox="0 0 600 420" preserveAspectRatio="none">
          <path d="M300 210 C214 202 156 138 92 92 M300 210 C394 188 454 128 516 82 M300 210 C210 238 150 292 88 338 M300 210 C390 238 452 294 520 340" />
          <circle cx="92" cy="92" r="4" /><circle cx="516" cy="82" r="4" /><circle cx="88" cy="338" r="4" /><circle cx="520" cy="340" r="4" />
        </svg>
        <div className="hero-scene-core"><span>m<span>.</span></span><small>LEARN</small><b>→</b></div>
        {facets.map(facet => <div className={`hero-scene-node node-${facet.key}`} key={facet.key}><span>{facet.index}</span><strong>{facet.label}</strong><small>{facet.detail}</small></div>)}
        <div className="hero-scene-axis axis-x" /><div className="hero-scene-axis axis-y" />
      </div>
    </div>
    <div className="hero-scene-caption" aria-hidden="true"><span>Evidence → Interface</span><span>Code · Decisions · Learning</span></div>
  </div>;
}
