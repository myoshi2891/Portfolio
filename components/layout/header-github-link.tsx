"use client";

import { usePathname } from "next/navigation";
import { SiteLink } from "../ui/site-link";

export function HeaderGithubLink({ href }: { href: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/projects/")) return null;
  return <SiteLink className="github-nav" href={href}>GitHub <span aria-hidden="true">↗</span></SiteLink>;
}
