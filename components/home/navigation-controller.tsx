"use client";

import { useEffect } from "react";
import { HISTORY_KEY, parseNavigationState, readBackup, withNavigationState, writeBackup, type NavigationState } from "../../lib/navigation-state";

export function NavigationController() {
  useEffect(() => {
    const disclosures = [...document.querySelectorAll<HTMLDetailsElement>("main details[id]")];
    // Stable IDs also let focus return to navigation links after a document reload.
    document.querySelectorAll<HTMLElement>("a, summary").forEach((el, i) => { if (!el.id) el.id = `return-${i}`; });
    document.querySelectorAll<HTMLElement>("main section[id]").forEach(section => {
      const heading = section.querySelector<HTMLElement>("h1, h2, h3");
      if (heading && !heading.id) { heading.id = `${section.id}-heading`; heading.tabIndex = -1; }
    });
    const allowed = new Set([...document.querySelectorAll<HTMLElement>("[id]")].map(el => el.id));
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    let entryId = crypto.randomUUID() as string;
    let restoring = false;
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
      if (!active || restoring) return;
      const state = snapshot();
      try { history.replaceState(withNavigationState(history.state, state), ""); } catch { /* Native navigation still works if history writes are denied. */ }
      try { writeBackup(sessionStorage, state, allowed); } catch { /* Access can throw. */ }
    }
    function afterLayout(move: () => void) {
      restoring = true;
      const revision = userRevision;
      const current = ++generation;
      cancelAnimationFrame(frame); cancelAnimationFrame(settleFrame);
      frame = requestAnimationFrame(() => {
        if (!active || current !== generation) return;
        if (revision === userRevision) move();
        restoring = false;
        save();
        settleFrame = requestAnimationFrame(() => {
          if (active && current === generation && revision === userRevision) {
            restoring = true; move(); restoring = false; save();
          }
        });
      });
      void document.fonts.ready.then(() => {
        if (active && current === generation && revision === userRevision) { move(); if (!restoring) save(); }
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
        window.scrollTo(0, state.scrollY);
      });
    }
    function hashTarget(hash: string) {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
      return allowed.has(id) ? document.getElementById(id) : null;
    }
    function reveal(target: HTMLElement, focus: boolean) {
      restoring = true;
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      const heading = target.matches("h1, h2, h3, main, summary, a") ? target : target.querySelector<HTMLElement>("h1, h2, h3") ?? target;
      if (!heading.hasAttribute("tabindex") && !heading.matches("a, summary")) heading.tabIndex = -1;
      // Section headings need a stable ID when their enclosing section owns the anchor.
      if (!heading.id) { heading.id = `${target.id}-heading`; allowed.add(heading.id); }
      afterLayout(() => { target.scrollIntoView({ block: "start" }); if (focus) heading.focus({ preventScroll: true }); });
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
      reveal(target, true);
    }
    function pop() {
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
    function interact() { userRevision++; }
    document.addEventListener("click", click);
    document.addEventListener("toggle", save, true);
    document.addEventListener("focusin", save);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("popstate", pop);
    window.addEventListener("pagehide", save);
    window.addEventListener("pageshow", pageshow);
    for (const name of ["pointerdown", "keydown", "wheel", "touchstart"]) window.addEventListener(name, interact, { passive: true });

    const state = read();
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (state && (navigation?.type === "back_forward" || navigation?.type === "reload")) restore(state);
    else { const target = hashTarget(location.hash); if (target) reveal(target, false); else save(); }

    return () => {
      save(); active = false; generation++;
      clearTimeout(scrollTimer); cancelAnimationFrame(frame); cancelAnimationFrame(settleFrame);
      history.scrollRestoration = oldRestoration;
      document.removeEventListener("click", click);
      document.removeEventListener("toggle", save, true);
      document.removeEventListener("focusin", save);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("pageshow", pageshow);
      for (const name of ["pointerdown", "keydown", "wheel", "touchstart"]) window.removeEventListener(name, interact);
    };
  }, []);
  return null;
}
