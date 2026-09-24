import Image from "next/image";
import type { RepositoryId } from "../../types/portfolio";
import { screens, screenWidths } from "../../data/screens";

export function ScreenPreview({ id, priority = false, sizes = "(min-width: 768px) 50vw, 100vw" }: { id: RepositoryId; priority?: boolean; sizes?: string }) {
  const screen = screens[id];
  if (!screen) return null;
  const imagePath = screen.file.split("/").map(encodeURIComponent).join("/");
  return <figure className="screen-preview">
    <div className="browser-bar" aria-hidden="true"><span>● ● ●</span><span>{screen.title}</span><span>↗</span></div>
    <picture><source type="image/webp" srcSet={screenWidths.map(width => `/images/optimized/${id.toLowerCase()}-${width}.webp ${width}w`).join(', ')} sizes={sizes} />
    <Image src={`/images/${imagePath}`} alt={screen.alt} width={1854} height={917} unoptimized loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /></picture>
    <figcaption>{screen.title}<span>実画面 / 提供画像</span></figcaption>
  </figure>;
}
