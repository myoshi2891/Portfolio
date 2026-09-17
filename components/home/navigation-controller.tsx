"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { HISTORY_KEY, parseNavigationState, readBackup, withNavigationState, writeBackup, type NavigationState } from "../../lib/navigation-state";

export function NavigationController() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);
  useEffect(() => {
    const routePath = location.pathname;
    const routeChanged = previousPath.current !== null;
    previousPath.current = pathname;
    const disclosures = [...document.querySelectorAll<HTMLDetailsElement>("main details[id]")];
    // Reassign generated IDs on each route, including persistent header/footer links.
    document.querySelectorAll<HTMLElement>("a, summary, button").forEach((el, i) => {
      if (!el.id || el.dataset.navigationId) { el.id = `return-${i}`; el.dataset.navigationId = "true"; }
    });
    const title = document.querySelector<HTMLElement>("main h1");
    if (title && !title.id) { title.id = "page-title"; title.tabIndex = -1; }
    document.querySelectorAll<HTMLElement>("main section[id]").forEach(section => {
      const heading = section.querySelector<HTMLElement>("h1, h2, h3");
      if (heading && !heading.id) { heading.id = `${section.id}-heading`; heading.tabIndex = -1; }
    });
    const allowed = new Set([...document.querySelectorAll<HTMLElement>("[id]")].map(el => el.id));
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    let entryId = crypto.randomUUID() as string;
    let restoring = false;
    let moving = false;
    let smoothScrolling = false;
    let generation = 0;
    let active = true;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let settleFrame = 0;
    let userRevision = 0;

    function read(): NavigationState | null {
      const value: unknown = history.state?.[HISTORY_KEY];
      const state = parseNavigationState(value, allowed);
      if (state) return state;
      if (value && typeof value === "object" && "id" in value && typeof value.id === "string") {
        try { return readBackup(sessionStorage, value.id, allowed); } catch { /* Access can throw. */ }
      }
      return null;
    }
    function snapshot(): NavigationState {
      const focusId = document.activeElement?.id;
      return { version: 1, id: entryId, openIds: disclosures.filter(el => el.open).map(el => el.id), scrollY: Math.max(0, window.scrollY), focusId: focusId && allowed.has(focusId) ? focusId : null };
    }
    function save() {
      if (!active || restoring || location.pathname !== routePath) return;
      const state = snapshot();
      try { history.replaceState(withNavigationState(history.state, state), ""); } catch { /* Native navigation still works if history writes are denied. */ }
      try { writeBackup(sessionStorage, state, allowed); } catch { /* Access can throw. */ }
    }
    function afterLayout(action: () => void, correctLayout = true) {
      function move() {
        moving = true;
        try { action(); } finally { moving = false; }
      }
      restoring = true;
      const revision = userRevision;
      const current = ++generation;
      cancelAnimationFrame(frame); cancelAnimationFrame(settleFrame);
      frame = requestAnimationFrame(() => {
        if (!active || current !== generation) return;
        if (revision === userRevision) move();
        restoring = false;
        save();
        if (correctLayout) settleFrame = requestAnimationFrame(() => {
          if (active && current === generation && revision === userRevision) {
            restoring = true; move(); restoring = false; save();
          }
        });
      });
      if (correctLayout) void document.fonts.ready.then(() => {
        if (active && current === generation && revision === userRevision) { restoring = true; move(); restoring = false; save(); }
      });
    }
    function restore(state: NavigationState) {
      entryId = state.id;
      restoring = true;
      for (const el of disclosures) {
        const open = state.openIds.includes(el.id);
        if (!open && el.open && el.contains(document.activeElement)) el.querySelector("summary")?.focus({ preventScroll: true });
        el.open = open;
      }
      afterLayout(() => {
        const focus = state.focusId ? document.getElementById(state.focusId) : null;
        if (focus?.getClientRects().length) focus.focus({ preventScroll: true });
        window.scrollTo({ top: state.scrollY, behavior: "instant" });
      });
    }
    function hashTarget(hash: string) {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
      return allowed.has(id) ? document.getElementById(id) : null;
    }
    function reveal(target: HTMLElement, focus: boolean, smooth = false) {
      restoring = true;
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      const heading = target.matches("h1, h2, h3, main, summary, a") ? target : target.querySelector<HTMLElement>("h1, h2, h3") ?? target;
      if (!heading.hasAttribute("tabindex") && !heading.matches("a, summary")) heading.tabIndex = -1;
      // Section headings need a stable ID when their enclosing section owns the anchor.
      if (!heading.id) { heading.id = `${target.id}-heading`; allowed.add(heading.id); }
      const behavior = smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant";
      // A smooth move must start once. Repeating it on font readiness or the next
      // frame cancels/restarts the browser animation and saves intermediate positions.
      afterLayout(() => { smoothScrolling = behavior === "smooth"; target.scrollIntoView({ block: "start", behavior }); if (focus) heading.focus({ preventScroll: true }); }, !smooth);
    }
    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      save();
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      const target = hashTarget(url.hash);
      if (!target) return;
      event.preventDefault();
      if (url.hash !== location.hash) {
        entryId = crypto.randomUUID();
        try { history.pushState(withNavigationState(history.state, snapshot()), "", url); }
        catch { location.assign(url); return; }
      }
      reveal(target, true, true);
    }
    function pop() {
      // Next commits the destination DOM before the new route effect restores it.
      if (location.pathname !== routePath) return;
      clearTimeout(scrollTimer);
      scrollTimer = undefined;
      const state = read();
      if (state) restore(state);
      else { entryId = crypto.randomUUID(); const target = hashTarget(location.hash); if (target) reveal(target, false); else save(); }
    }
    function pageshow(event: PageTransitionEvent) {
      if (!event.persisted) return;
      history.scrollRestoration = "manual";
      entryId = read()?.id ?? entryId;
      restoring = false;
      save();
    }
    function scroll() {
      if (restoring || scrollTimer) return;
      scrollTimer = setTimeout(() => { scrollTimer = undefined; save(); }, 150);
    }
    function stopSmoothScroll() {
      if (!smoothScrolling) return;
      smoothScrolling = false;
      window.scrollTo({ top: window.scrollY, behavior: "instant" });
    }
    function interact() { userRevision++; stopSmoothScroll(); }
    function scrollend() { smoothScrolling = false; save(); }
    function focusin() {
      // A later focus choice cancels every outstanding layout/font correction.
      if (!moving) interact();
      save();
    }
    // Capture before Next Link's click handler, so same-page anchors have one owner.
    document.addEventListener("click", click, true);
    document.addEventListener("toggle", save, true);
    document.addEventListener("focusin", focusin);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("scrollend", scrollend);
    window.addEventListener("popstate", pop);
    window.addEventListener("pagehide", save);
    window.addEventListener("pageshow", pageshow);
    for (const name of ["pointerdown", "keydown", "wheel", "touchstart"]) window.addEventListener(name, interact, { passive: true });

    const state = read();
    if (state) restore(state);
    else {
      const target = hashTarget(location.hash);
      if (target) reveal(target, routeChanged);
      else if (routeChanged) afterLayout(() => { window.scrollTo({ top: 0, behavior: "instant" }); title?.focus({ preventScroll: true }); });
      else save();
    }

    return () => {
      // The URL may already belong to the destination: never save old DOM here.
      active = false; generation++;
      clearTimeout(scrollTimer); cancelAnimationFrame(frame); cancelAnimationFrame(settleFrame);
      history.scrollRestoration = oldRestoration;
      document.removeEventListener("click", click, true);
      document.removeEventListener("toggle", save, true);
      document.removeEventListener("focusin", focusin);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("scrollend", scrollend);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("pageshow", pageshow);
      for (const name of ["pointerdown", "keydown", "wheel", "touchstart"]) window.removeEventListener(name, interact);
    };
  }, [pathname]);
  return null;
}
