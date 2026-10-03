"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { SiteLink } from "../ui/site-link";

const subscribeNothing = () => () => {};

export function HeaderGithubLink({ href, hiddenPaths }: { href: string; hiddenPaths: readonly string[] }) {
  const pathname = usePathname();
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  // hydration 中は事前生成HTMLと同じ判定（実在する詳細のみ）を使い、未知projectの404では hydration 後に実URLで隠す
  const hidden = useSyncExternalStore(subscribeNothing, () => normalized.startsWith("/projects/"), () => hiddenPaths.includes(normalized));
  if (hidden) return null;
  return <SiteLink className="github-nav" href={href}>GitHub <span aria-hidden="true">↗</span></SiteLink>;
}
