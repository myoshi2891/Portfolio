import type { FeaturedSlug } from "./projects";
import type { ProjectGallery, ProjectSlide } from "../types/portfolio";

const multiVendorSlides = [
  { file: "storefront-home-hero.webp", title: "ストアトップ — Luxuries for Happiness", alt: "深いグリーンとゴールドを基調に、立体的な宝石とブランドメッセージを表示するストアのトップ画面" },
  { file: "storefront-fortune-section.webp", title: "ストア紹介 — A little fortune", alt: "緑色の宝石と、ジュエリーや時計などのカテゴリへの案内を表示するストア紹介画面" },
  { file: "storefront-happiness-section.webp", title: "ストア紹介 — Make room for happiness", alt: "金色の宝石とブランドメッセージ、商品を探すリンクを表示するストア紹介画面" },
  { file: "storefront-newsletter-footer.webp", title: "ニュースレターとフッター", alt: "メールアドレスの登録欄と、商品カテゴリ・アカウント・カスタマーケアへのリンクを表示するフッター" },
  { file: "product-collection.webp", title: "商品一覧 — The collection", alt: "商品コレクションの紹介と、検索条件や並べ替えで商品を探す一覧画面" },
  { file: "account-wishlist.webp", title: "アカウント — お気に入り", alt: "アカウントメニューと、お気に入りに保存した商品の一覧を表示する画面" },
  { file: "product-comparison.webp", title: "商品比較", alt: "比較対象に選んだ商品の状態と、商品一覧への案内を表示する商品比較画面" },
  { file: "frequently-asked-questions.webp", title: "よくある質問 — FAQ", alt: "購入に関するよくある質問を案内するFAQ画面" },
  { file: "order-tracking.webp", title: "注文の追跡", alt: "注文番号とメールアドレスを入力して配送状況を確認する注文追跡画面" },
  { file: "returns-and-exchange.webp", title: "返品・交換", alt: "返品・交換についての説明と、注文番号などを入力する申請フォームを表示する画面" },
] as const satisfies readonly ProjectSlide[];

const llmStudiesSlides = [
  { file: "cost-calculator-overview.webp", title: "AIモデル 時間別コスト計算機", alt: "AIモデルの時間別コスト計算機。利用シナリオと期間を選択する画面" },
  { file: "claude-code-spec-driven-development-guide.webp", title: "Claude Code 仕様駆動開発ガイド", alt: "Claude Codeで始めるAI仕様駆動開発のMarkdownガイド画面" },
  { file: "antigravity-agent-skills-guide.webp", title: "Agent Skills 実践ガイド", alt: "Antigravity IDEにおけるAgent Skills実践ガイド画面" },
  { file: "openai-codex-best-practices-guide.webp", title: "OpenAI Codex ベストプラクティス", alt: "OpenAI Codexベストプラクティスガイド画面" },
  { file: "github-copilot-spec-driven-development-guide.webp", title: "GitHub Copilot 仕様駆動開発ガイド", alt: "GitHub CopilotによるAI仕様駆動開発のベストプラクティス画面" },
  { file: "coderabbit-best-practices-guide.webp", title: "CodeRabbit 実践ガイド", alt: "CodeRabbitの設定と自動レビューを解説する実践ガイド画面" },
  { file: "llm-evaluation-observability-guide.webp", title: "LLM評価・オブザーバビリティ", alt: "LLM評価、ベンチマーク、オブザーバビリティのベストプラクティス画面" },
  { file: "ai-engineering-introduction-guide.webp", title: "AI Engineering 入門ガイド", alt: "AI Engineeringを17セクションで解説する入門ガイド画面" },
  { file: "whats-new-guides.webp", title: "What's New", alt: "新着および最近更新されたAIガイドの一覧画面" },
] as const satisfies readonly ProjectSlide[];

const medicalStudiesSlides = [
  { file: "prom-checker-dashboard.webp", title: "PROM統合チェッカー", alt: "頭痛PROMチェッカーの統合ダッシュボード。頭痛日誌、PROM評価、疼痛強度、レポート出力を選べる" },
  { file: "prom-checker-headache-diary.webp", title: "頭痛日誌 — MOHリスク判定", alt: "頭痛日誌（前向き記録）とMOHリスク判定テーブルを扱うPROMチェッカー画面" },
  { file: "prom-checker-evaluation-report.webp", title: "頭痛評価レポート", alt: "医師共有用の頭痛評価レポート。基本サマリーとMOHリスク判定を出力する画面" },
  { file: "anatomy-atlas-top.webp", title: "3D解剖アトラス — トップ", alt: "頭痛3D解剖アトラスのトップ画面。7系統・42解剖構造をナビゲーションで探せる" },
  { file: "anatomy-head-neck-interactive-model.webp", title: "3D解剖 — 頭頸部の全体像", alt: "頭頸部の全体像インタラクティブモデル。神経・血管・骨・筋を共通座標で表示する画面" },
  { file: "anatomy-cervical-spine-structure-explorer.webp", title: "3D解剖 — 頸椎 Structure Explorer", alt: "頸椎のStructure Explorerモーダル。第4頸椎C4の位置・機能・頭痛との関係を日英で解説" },
  { file: "headaches-migraine-guide.webp", title: "疾患ガイド — 片頭痛 完全ガイド", alt: "片頭痛（Migraine）の完全ガイド。ICHD-3、SNOOP4、CGRP最新療法を解説する教育画面" },
  { file: "treatment-acute-headache-guide.webp", title: "治療ガイド — 頭痛の急性期治療", alt: "頭痛の急性期治療の考え方。薬効群の総論と階層化治療・MOH予防を解説する画面" },
  { file: "blocks-occipital-nerve-guide.webp", title: "神経ブロック — 後頭神経ブロック", alt: "後頭神経ブロック（ONB）完全ガイド。解剖・適応・手技・SNOOP4安全管理を扱う教育画面" },
  { file: "therapies-physical-therapy-guide.webp", title: "関連療法 — 理学療法 完全ガイド", alt: "頭痛に対する理学療法の完全ガイド。ICHD-3・Cochrane準拠の包括的解説画面" },
  { file: "prom-headache-diary-guide.webp", title: "PROMガイド — 頭痛日誌", alt: "頭痛日誌（Headache Diary）完全ガイド。SNOOP4レッドフラッグスクリーニングを解説する画面" },
] as const satisfies readonly ProjectSlide[];

const wildOasisSlides = [
  { file: "dashboard-overview.webp", title: "日次業務ダッシュボード", alt: "The Wild Oasisの管理ダッシュボード。予約数、売上、チェックイン数、稼働率、本日のアクティビティを表示" },
  { file: "bookings-management.webp", title: "予約一覧とステータス管理", alt: "The Wild Oasisの予約一覧。ゲスト、宿泊日、予約ステータス、金額を表示" },
  { file: "dashboard-analytics-charts.webp", title: "売上・滞在日数の分析", alt: "The Wild Oasisの分析画面。滞在日数の分布と90日間の売上推移をグラフで表示" },
  { file: "cabins-management.webp", title: "客室と料金の管理", alt: "The Wild Oasisの客室一覧。定員、料金、割引、客室画像を表示" },
] as const satisfies readonly ProjectSlide[];

// imageDirectory is a folder under public/images/; URLs are encoded per segment by publicImagePath.
export const projectGalleries = {
  "multi-vendor-e-commerce": { slides: multiVendorSlides, imageDirectory: "multi-vendor-e-commerce", label: "Multi-Vendor E-Commerceの画面ギャラリー", browserTitle: `Multi-Vendor E-Commerce / ${multiVendorSlides.length} views` },
  "comparison-of-llms": { slides: llmStudiesSlides, imageDirectory: "llm-studies", label: "LLM Studiesの画面ギャラリー", browserTitle: "LLM Studies / Gallery" },
  "medical-studies": { slides: medicalStudiesSlides, imageDirectory: "Medical-Studies", label: "Medical Studiesの画面ギャラリー", browserTitle: `Medical Studies / ${medicalStudiesSlides.length} views` },
  "the-wild-oasis-for-admin": { slides: wildOasisSlides, imageDirectory: "The Wild Oasis Admin", label: "The Wild Oasis管理画面ギャラリー", browserTitle: "The Wild Oasis / Admin" },
} satisfies Record<FeaturedSlug, ProjectGallery>;
