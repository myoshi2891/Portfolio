import type { RepositoryId } from "../types/portfolio";

// Owner-provided captures. Originals stay intact; display and generation share this map.
export const screenWidths = [640, 1280, 1854] as const;
export const screens: Partial<Record<RepositoryId, { file: string; alt: string; title: string }>> = {
  R03: { file: "The Wild Oasis.png", alt: "The Wild Oasis宿泊者向けサイト。山と客室の写真から宿泊施設を探すトップ画面", title: "The Wild Oasis · Guest" },
  R05: { file: "Next-Store.png", alt: "Next-Store。商品検索と家具の紹介、注目商品を表示するストアのトップ画面", title: "Next-Store" },
  R06: { file: "LLM Studies.png", alt: "LLM費用計算ツール。利用シナリオとトークン量を選ぶ画面", title: "LLM Studies" },
  R07: { file: "QA_STUDIES.png", alt: "品質保証の学習サイト。レベル別ガイドとキーワード検索の画面", title: "Quality Assurance Studies" },
  R09: { file: "Management Studies.png", alt: "マネジメント学習ライブラリ。資格・書籍・テーマから学習ガイドを探す画面", title: "Management Studies" },
  R10: { file: "Cloud Infrastructure Studies.png", alt: "クラウド学習サイト。提供元別の学習ガイドを案内する画面", title: "Cloud Infrastructure Studies" },
  R12: { file: "Medical Studies.png", alt: "頭痛PROMチェッカー。頭痛日誌・PROM評価・疼痛強度・レポート出力を選ぶダッシュボード", title: "Medical Studies" },
};
