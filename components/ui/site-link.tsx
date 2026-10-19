import Link from "next/link";
import type { ComponentProps } from "react";

// The navigation controller owns anchor scrolling and history restoration.
// Next handles route loading, prefetching and native modifier-key behavior.
const newTabNotice = "（新しいタブで開きます）";

export function SiteLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href" | "scroll"> & { href: string }) {
  const internal = href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"));
  if (internal) return <Link href={href} scroll={false} {...props} />;
  const external = /^(https?:)?\/\//i.test(href);
  if (!external) return <a href={href} {...props} />;
  // Website links always open a new tab, so say so before activation: in the aria-label when one
  // replaces the content, otherwise as visually hidden text.
  const { children, "aria-label": label, ...rest } = props;
  const rel = [props.rel, "noopener", "noreferrer"].filter(Boolean).join(" ");
  if (label !== undefined) return <a href={href} {...rest} aria-label={label + newTabNotice} target="_blank" rel={rel}>{children}</a>;
  return <a href={href} {...rest} target="_blank" rel={rel}>{children}<span className="visually-hidden">{newTabNotice}</span></a>;
}
