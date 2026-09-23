"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const slides = [
  {
    file: "cost-calculator-overview.png",
    title: "AIモデル 時間別コスト計算機",
    alt: "AIモデルの時間別コスト計算機。利用シナリオと期間を選択する画面",
  },
  {
    file: "claude-code-spec-driven-development-guide.png",
    title: "Claude Code 仕様駆動開発ガイド",
    alt: "Claude Codeで始めるAI仕様駆動開発のMarkdownガイド画面",
  },
  {
    file: "antigravity-agent-skills-guide.png",
    title: "Agent Skills 実践ガイド",
    alt: "Antigravity IDEにおけるAgent Skills実践ガイド画面",
  },
  {
    file: "openai-codex-best-practices-guide.png",
    title: "OpenAI Codex ベストプラクティス",
    alt: "OpenAI Codexベストプラクティスガイド画面",
  },
  {
    file: "github-copilot-spec-driven-development-guide.png",
    title: "GitHub Copilot 仕様駆動開発ガイド",
    alt: "GitHub CopilotによるAI仕様駆動開発のベストプラクティス画面",
  },
  {
    file: "coderabbit-best-practices-guide.png",
    title: "CodeRabbit 実践ガイド",
    alt: "CodeRabbitの設定と自動レビューを解説する実践ガイド画面",
  },
  {
    file: "llm-evaluation-observability-guide.png",
    title: "LLM評価・オブザーバビリティ",
    alt: "LLM評価、ベンチマーク、オブザーバビリティのベストプラクティス画面",
  },
  {
    file: "ai-engineering-introduction-guide.png",
    title: "AI Engineering 入門ガイド",
    alt: "AI Engineeringを17セクションで解説する入門ガイド画面",
  },
  {
    file: "whats-new-guides.png",
    title: "What's New",
    alt: "新着および最近更新されたAIガイドの一覧画面",
  },
] as const;

export function LlmStudiesSlideshow() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visualIndexRef = useRef(1);
  const pausedRef = useRef(false);
  const manualPausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const visualSlides = [slides.at(-1)!, ...slides, slides[0]!];

  const syncPaused = () => {
    pausedRef.current = manualPausedRef.current || hoveredRef.current || focusedRef.current;
  };

  const positionTrack = useCallback((index: number, animate: boolean) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const target = track?.children.item(index) as HTMLElement | null;
    if (!viewport || !track || !target) return;
    const offset = viewport.clientWidth / 2 - target.offsetLeft - target.offsetWidth / 2;
    if (!animate) track.style.transition = "none";
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    if (!animate) requestAnimationFrame(() => { track.style.transition = ""; });
  }, []);

  useLayoutEffect(() => {
    positionTrack(visualIndexRef.current, false);
    const observer = new ResizeObserver(() => positionTrack(visualIndexRef.current, false));
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [positionTrack]);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const updateTimer = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      if (motionPreference.matches) return;
      timer = window.setInterval(() => {
        if (pausedRef.current || document.hidden) return;
        const next = visualIndexRef.current + 1;
        visualIndexRef.current = next;
        setActive((next - 1 + slides.length) % slides.length);
        positionTrack(next, true);
      }, 5000);
    };
    updateTimer();
    motionPreference.addEventListener("change", updateTimer);
    return () => {
      motionPreference.removeEventListener("change", updateTimer);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [positionTrack]);

  const settleLoop = () => {
    if (visualIndexRef.current === 0) {
      visualIndexRef.current = slides.length;
      positionTrack(slides.length, false);
    } else if (visualIndexRef.current === slides.length + 1) {
      visualIndexRef.current = 1;
      positionTrack(1, false);
    }
  };
  const slide = slides[active]!;

  return <figure
    className="project-slideshow"
    aria-label="LLM Studiesの画面ギャラリー"
    aria-roledescription="カルーセル"
    onMouseEnter={() => { hoveredRef.current = true; syncPaused(); }}
    onMouseLeave={() => { hoveredRef.current = false; syncPaused(); }}
    onFocusCapture={() => { focusedRef.current = true; syncPaused(); }}
    onBlurCapture={(event) => {
      if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
      focusedRef.current = false;
      syncPaused();
    }}
  >
    <div className="slideshow-browser-bar" aria-hidden="true"><span>● ● ●</span><span>LLM Studies / Gallery</span><span>{String(active + 1).padStart(2, "0")}</span></div>
    <div className="slideshow-viewport" ref={viewportRef}>
      <div className="slideshow-track" ref={trackRef} onTransitionEnd={settleLoop}>
        {visualSlides.map((item, index) => {
          const isClone = index === 0 || index === visualSlides.length - 1;
          const originalIndex = (index - 1 + slides.length) % slides.length;
          const isActive = !isClone && originalIndex === active;
          return <div className={`slideshow-slide${isActive ? " is-active" : ""}`} key={`${item.file}-${index}`} aria-hidden={!isActive}>
            <Image
              src={`/images/llm-studies/${item.file}`}
              alt={isActive ? item.alt : ""}
              fill
              sizes="(min-width: 1200px) 1040px, 84vw"
              priority={index === 1}
              loading={index === 1 ? "eager" : "lazy"}
              unoptimized
            />
          </div>;
        })}
      </div>
    </div>
    <div className="slideshow-meta">
      <figcaption><strong>{slide.title}</strong><span>{active + 1} / {slides.length}</span></figcaption>
      <button
        className="slideshow-toggle"
        type="button"
        aria-label={isPaused ? "スライドショーを再生" : "スライドショーを一時停止"}
        aria-pressed={isPaused}
        onClick={() => {
          manualPausedRef.current = !manualPausedRef.current;
          setIsPaused(manualPausedRef.current);
          syncPaused();
        }}
      >{isPaused ? "再生" : "一時停止"}</button>
      <div className="slideshow-dots" aria-hidden="true">
        {slides.map((item, index) => <span key={item.file} className={index === active ? "is-active" : undefined} />)}
      </div>
    </div>
  </figure>;
}
