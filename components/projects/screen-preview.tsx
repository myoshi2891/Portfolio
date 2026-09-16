import Image from "next/image";
import type { RepositoryId } from "../../types/portfolio";

// Screens supplied by the owner. Keep the original capture intact.
const screens: Partial<Record<RepositoryId, { file: string; alt: string; title: string }>> = {
  R06: { file: "LLM Studies.png", alt: "LLM費用計算ツール。利用シナリオとトークン量を選ぶ画面", title: "LLM Studies" },
  R07: { file: "QA_STUDIES.png", alt: "品質保証の学習サイト。レベル別ガイドとキーワード検索の画面", title: "Quality Assurance Studies" },
  R10: { file: "Cloud Infrastructure Studies.png", alt: "クラウド学習サイト。提供元別の学習ガイドを案内する画面", title: "Cloud Infrastructure Studies" },
};

export function ScreenPreview({ id, priority = false }: { id: RepositoryId; priority?: boolean }) {
  const screen = screens[id];
  if (!screen) return null;
  return <figure className="screen-preview">
    <div className="browser-bar" aria-hidden="true"><span>● ● ●</span><span>{screen.title}</span><span>↗</span></div>
    <Image src={`/images/${encodeURIComponent(screen.file)}`} alt={screen.alt} width={1854} height={917} unoptimized loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
    <figcaption>{screen.title}<span>実画面 / 提供画像</span></figcaption>
  </figure>;
}
