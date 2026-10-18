"use client";

import { useEffect } from "react";

// Content stays visible in the HTML. Animation is only a progressive enhancement.
export function SectionReveal({ selector }: { selector: string }) {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches || document.hidden || location.hash || entry.target.contains(document.activeElement)) continue;
        const animation = entry.target.animate(
          [{ opacity: .7, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 400, easing: "cubic-bezier(.22, 1, .36, 1)" },
        );
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); };
      }
    }, { threshold: .08 });
    const stop = () => {
      if (preference.matches || document.hidden) {
        for (const animation of animations) animation.cancel();
        animations.clear();
      }
    };
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [selector]);
  return null;
}
