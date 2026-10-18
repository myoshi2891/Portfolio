import type { ProjectDocumentation } from "../types/portfolio";
import type { FeaturedSlug } from "./projects";

export const documentedDetailSections = [
  { id: "overview", label: "概要" },
  { id: "features", label: "主な機能" },
  { id: "architecture", label: "アーキテクチャ" },
  { id: "decisions", label: "構成と制約" },
  { id: "quality", label: "品質と継続課題" },
  { id: "documentation", label: "説明の基準" },
] as const;

export const multiVendorDetailSections = [
  { id: "overview", label: "概要" },
  { id: "features", label: "主な機能" },
  { id: "orders", label: "注文と決済" },
  { id: "architecture", label: "アーキテクチャ" },
  { id: "decisions", label: "構成と制約" },
  { id: "quality", label: "品質と継続課題" },
  { id: "documentation", label: "説明の基準" },
] as const;

// Registry of every featured detail page. Adding a featured project without an entry is a type error.
export const projectDocumentation = {
  "multi-vendor-e-commerce": {
    contentPath: "data/multi-vendor-detail.md",
    imageDirectory: "multi-vendor-e-commerce",
    sections: multiVendorDetailSections,
    pageClassName: "multi-vendor-detail-page",
    diagrams: [
      "一つの注文を店舗A・店舗Bの受注へ分け、バリアント別の明細と支払い情報を保持します。",
      "顧客の注文作成後に決済を行い、署名検証したWebhookで支払いと注文の状態を更新します。",
      "認証した画面からServer Actions、Prisma、PostgreSQLへ進み、決済通知はRoute Handlersで受信します。",
    ],
  },
  "comparison-of-llms": {
    contentPath: "data/llm-studies-detail.md",
    imageDirectory: "comparison-of-llms",
    sections: documentedDetailSections,
    pageClassName: "llm-detail-page documented-detail-page",
    diagrams: [
      "開発者が収集した価格JSONを検証し、Next.jsで静的生成してNetlifyへ配信します。",
      "取得成功時は新しい価格、失敗時は出自と基準価格の改定を確認して既存値か基準価格を採用します。",
      "ページレジストリの情報を検索・ナビゲーション・サイトマップ・RSS・関連ページ・最終確認日へ供給します。",
    ],
  },
  "medical-studies": {
    contentPath: "data/medical-studies-detail.md",
    imageDirectory: "Medical-Studies",
    sections: documentedDetailSections,
    pageClassName: "medical-detail-page documented-detail-page",
    diagrams: [
      "登録された記事を静的生成し、PROMと3D・MRIを対話機能へ分け、記録を端末内に保存します。",
      "利用者の回答を検証・採点して端末内へ保存し、選択時にCSVまたはGoogle Sheetsへ出力します。",
      "選択した記録をシートと行の中間表現へ変換し、CSVとGoogle Sheetsの出力処理へ渡します。",
    ],
  },
  "the-wild-oasis-for-admin": {
    contentPath: "data/wild-oasis-detail.md",
    imageDirectory: "the-wild-oasis-for-admin",
    sections: documentedDetailSections,
    pageClassName: "wild-oasis-detail-page documented-detail-page",
    diagrams: [
      "未確定の予約を支払い確認と朝食選択の後にチェックイン済みへ更新し、退室時にチェックアウト済みへ進めます。",
      "スタッフの画面操作をフック・React Query・サービス層へ渡し、Supabaseの認証・データベース・画像保存へ接続します。",
      "チェックイン操作で予約を更新し、成功後に一覧と詳細のキャッシュを無効化して通知・画面遷移を行います。",
    ],
  },
} as const satisfies Record<FeaturedSlug, ProjectDocumentation>;
