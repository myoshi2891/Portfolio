import Link from "next/link";
import type { ComponentProps } from "react";

// The navigation controller owns anchor scrolling and history restoration.
// Next handles route loading, prefetching and native modifier-key behavior.
export function SiteLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href" | "scroll"> & { href: string }) {
  const internal = href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"));
  const external = /^(https?:)?\/\//i.test(href);
  return internal ? <Link href={href} scroll={false} {...props} /> : <a href={href} {...props} target={external ? "_blank" : props.target} rel={external ? [props.rel, "noopener", "noreferrer"].filter(Boolean).join(" ") : props.rel} />;
}
