"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type ProjectSlide = { file: string; title: string; alt: string };

export function ProjectSlideshow({ slides, imageDirectory, label, browserTitle }: {
  slides: readonly ProjectSlide[];
  imageDirectory: string;
  label: string;
  browserTitle: string;
}) {
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

  const syncPaused = () => { pausedRef.current = manualPausedRef.current || hoveredRef.current || focusedRef.current; };
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
        // transitionend が発火せず末尾クローンに留まった場合、実スライド先頭へ戻してから進める
        if (visualIndexRef.current === slides.length + 1) {
          visualIndexRef.current = 1;
          positionTrack(1, false);
        }
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
  }, [positionTrack, slides.length]);

  const settleLoop = () => {
    if (visualIndexRef.current === 0) {
      visualIndexRef.current = slides.length;
      positionTrack(slides.length, false);
    } else if (visualIndexRef.current === slides.length + 1) {
      visualIndexRef.current = 1;
      positionTrack(1, false);
    }
  };
  const step = (delta: 1 | -1) => {
    settleLoop();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = visualIndexRef.current + delta;
    const nextActive = (next - 1 + slides.length) % slides.length;
    const target = reduceMotion ? nextActive + 1 : next;
    visualIndexRef.current = target;
    setActive(nextActive);
    positionTrack(target, !reduceMotion);
  };
  const slide = slides[active]!;

  return <figure className="project-slideshow" aria-label={label} aria-roledescription="カルーセル"
    onMouseEnter={() => { hoveredRef.current = true; syncPaused(); }}
    onMouseLeave={() => { hoveredRef.current = false; syncPaused(); }}
    onFocusCapture={() => { focusedRef.current = true; syncPaused(); }}
    onBlurCapture={(event) => {
      if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
      focusedRef.current = false;
      syncPaused();
    }}>
    <div className="slideshow-browser-bar" aria-hidden="true"><span>● ● ●</span><span>{browserTitle}</span><span>{String(active + 1).padStart(2, "0")}</span></div>
    <div className="slideshow-viewport" ref={viewportRef}>
      <div className="slideshow-track" ref={trackRef} onTransitionEnd={settleLoop}>
        {visualSlides.map((item, index) => {
          const isClone = index === 0 || index === visualSlides.length - 1;
          const originalIndex = (index - 1 + slides.length) % slides.length;
          const isActive = !isClone && originalIndex === active;
          return <div className={`slideshow-slide${isActive ? " is-active" : ""}`} key={`${item.file}-${index}`} aria-hidden={!isActive}>
            <Image src={`/images/${imageDirectory}/${item.file}`} alt={isActive ? item.alt : ""} fill sizes="(min-width: 1200px) 1040px, 84vw"
              priority={index === 1} loading={index === 1 ? "eager" : "lazy"} unoptimized />
          </div>;
        })}
      </div>
    </div>
    <div className="slideshow-meta">
      <figcaption><strong>{slide.title}</strong><span>{active + 1} / {slides.length}</span></figcaption>
      <button className="slideshow-toggle" type="button" aria-label="前のスライド" onClick={() => step(-1)}>前へ</button>
      <button className="slideshow-toggle" type="button" aria-label="次のスライド" onClick={() => step(1)}>次へ</button>
      <button className="slideshow-toggle" type="button" aria-label={isPaused ? "スライドショーを再生" : "スライドショーを一時停止"} aria-pressed={isPaused}
        onClick={() => { manualPausedRef.current = !manualPausedRef.current; setIsPaused(manualPausedRef.current); syncPaused(); }}>
        {isPaused ? "再生" : "一時停止"}
      </button>
      <div className="slideshow-dots" aria-hidden="true">{slides.map((item, index) => <span key={item.file} className={index === active ? "is-active" : undefined} />)}</div>
    </div>
  </figure>;
}
