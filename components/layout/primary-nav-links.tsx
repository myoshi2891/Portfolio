"use client";

import { usePathname } from "next/navigation";
import { SiteLink } from "../ui/site-link";
import { site } from "../../data/site";

// Only page links can be current; section links on Home share the "/" page.
export function PrimaryNavLinks() {
  const pathname = usePathname();
  const current = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return <>{site.navigation.map(({ label, href }) => <SiteLink key={href} href={href} aria-current={href === current ? "page" : undefined}>{label}</SiteLink>)}</>;
}
