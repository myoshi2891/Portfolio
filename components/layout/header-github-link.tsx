"use client";

import { usePathname } from "next/navigation";
import { SiteLink } from "../ui/site-link";

export function HeaderGithubLink({ href, hiddenPaths }: { href: string; hiddenPaths: readonly string[] }) {
  const pathname = usePathname();
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (hiddenPaths.includes(normalized)) return null;
  return <SiteLink className="github-nav" href={href}>GitHub <span aria-hidden="true">↗</span></SiteLink>;
}
