import Image from "next/image";
import type { RepositoryId } from "../../types/portfolio";
import { screens, screenWidths } from "../../data/screens";
import { publicImagePath } from "../../lib/image-path";

export function ScreenPreview({ id, priority = false, sizes = "(min-width: 768px) 50vw, 100vw" }: { id: RepositoryId; priority?: boolean; sizes?: string }) {
  const screen = screens[id];
  if (!screen) return null;
  // data/screens.ts names the PNG original; the deployed fallback is its WebP derivative.
  const imagePath = publicImagePath(screen.file.replace(/\.png$/, ".webp"));
  const revision = screen.revision ? `?v=${encodeURIComponent(screen.revision)}` : "";
  return <figure className="screen-preview">
    <div className="browser-bar" aria-hidden="true"><span>● ● ●</span><span>{screen.title}</span><span>↗</span></div>
    <picture><source type="image/webp" srcSet={screenWidths.map(width => `/images/optimized/${id.toLowerCase()}-${width}.webp${revision} ${width}w`).join(', ')} sizes={sizes} />
    <Image src={`${imagePath}${revision}`} alt={screen.alt} width={1854} height={917} unoptimized loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /></picture>
    <figcaption>{screen.title}<span>実画面 / 提供画像</span></figcaption>
  </figure>;
}
