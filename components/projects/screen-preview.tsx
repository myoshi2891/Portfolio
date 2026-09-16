import Image from "next/image";
import type { RepositoryId } from "../../types/portfolio";

// Screens supplied by the owner. Keep the original capture intact.
const screens: Partial<Record<RepositoryId, { file: string; alt: string; title: string }>> = {
  R06: { file: "LLM Studies.png", alt: "LLM費用計算ツール。利用シナリオとトークン量を選ぶ画面", title: "LLM Studies" },
  R07: { file: "QA_STUDIES.png", alt: "品質保証の学習サイト。レベル別ガイドとキーワード検索の画面", title: "Quality Assurance Studies" },
  R10: { file: "Cloud Infrastructure Studies.png", alt: "クラウド学習サイト。提供元別の学習ガイドを案内する画面", title: "Cloud Infrastructure Studies" },
};

export function ScreenPreview({ id, priority = false, sizes = "(min-width: 768px) 50vw, 100vw" }: { id: RepositoryId; priority?: boolean; sizes?: string }) {
  const screen = screens[id];
  if (!screen) return null;
  return <figure className="screen-preview">
    <div className="browser-bar" aria-hidden="true"><span>● ● ●</span><span>{screen.title}</span><span>↗</span></div>
    <picture><source type="image/webp" srcSet={[640, 1280, 1854].map(width => `/images/optimized/${id.toLowerCase()}-${width}.webp ${width}w`).join(', ')} sizes={sizes} />
    <Image src={`/images/${encodeURIComponent(screen.file)}`} alt={screen.alt} width={1854} height={917} unoptimized loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /></picture>
    <figcaption>{screen.title}<span>実画面 / 提供画像</span></figcaption>
  </figure>;
}
