"use client";

import { SiteLink } from "../ui/site-link";

import { useEffect, useState } from "react";

export function DetailContents({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = Math.min(180, window.innerHeight * .25);
      let current = sections[0]?.id ?? "overview";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= threshold) current = section.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.at(-1)!.id;
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule, { rootMargin: '-15% 0px -65% 0px' });
    sections.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    // Scroll also covers gaps between headings and sections taller than the viewport.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [sections]);

  return <nav className="detail-contents" aria-label="このページの内容"><details open><summary>このページの内容</summary><ul>
    {sections.map(({ id, label }, index) => <li key={id}><SiteLink href={`#${id}`} aria-current={active === id ? 'location' : undefined}><span aria-hidden="true">{String(index).padStart(2, '0')}</span>{label}</SiteLink></li>)}
  </ul></details></nav>;
}
