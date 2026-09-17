"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function HeroScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

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

  return <div className="hero-preview hero-scene" ref={ref} data-paused={paused}>
    <div className="hero-scene-header"><p className="eyebrow">From learning to interface</p><button type="button" className="motion-toggle" aria-label="3Dアニメーションを停止" aria-pressed={paused} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span><span>{paused ? "再生" : "停止"}</span></button></div>
    <div className="hero-scene-stage">
      <div className="hero-scene-orbit" aria-hidden="true" />
      <div className="hero-scene-plane">{children}</div>
    </div>
    <div className="hero-scene-caption"><span className="eyebrow">01 / Featured interface</span><span>Learn → Build</span></div>
  </div>;
}
