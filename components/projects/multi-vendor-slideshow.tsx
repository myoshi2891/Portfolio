import { ProjectSlideshow, type ProjectSlide } from "./project-slideshow";

const slides = [
  { file: "storefront-home-hero.png", title: "ストアトップ — Luxuries for Happiness", alt: "深いグリーンとゴールドを基調に、立体的な宝石とブランドメッセージを表示するストアのトップ画面" },
  { file: "storefront-fortune-section.png", title: "ストア紹介 — A little fortune", alt: "緑色の宝石と、ジュエリーや時計などのカテゴリへの案内を表示するストア紹介画面" },
  { file: "storefront-happiness-section.png", title: "ストア紹介 — Make room for happiness", alt: "金色の宝石とブランドメッセージ、商品を探すリンクを表示するストア紹介画面" },
  { file: "storefront-newsletter-footer.png", title: "ニュースレターとフッター", alt: "メールアドレスの登録欄と、商品カテゴリ・アカウント・カスタマーケアへのリンクを表示するフッター" },
  { file: "product-collection.png", title: "商品一覧 — The collection", alt: "商品コレクションの紹介と、検索条件や並べ替えで商品を探す一覧画面" },
  { file: "account-wishlist.png", title: "アカウント — お気に入り", alt: "アカウントメニューと、お気に入りに保存した商品の一覧を表示する画面" },
  { file: "product-comparison.png", title: "商品比較", alt: "比較対象に選んだ商品の状態と、商品一覧への案内を表示する商品比較画面" },
  { file: "frequently-asked-questions.png", title: "よくある質問 — FAQ", alt: "購入に関するよくある質問を案内するFAQ画面" },
  { file: "order-tracking.png", title: "注文の追跡", alt: "注文番号とメールアドレスを入力して配送状況を確認する注文追跡画面" },
  { file: "returns-and-exchange.png", title: "返品・交換", alt: "返品・交換についての説明と、注文番号などを入力する申請フォームを表示する画面" },
] as const satisfies readonly ProjectSlide[];

export function MultiVendorSlideshow() {
  return <ProjectSlideshow slides={slides} imageDirectory="multi-vendor-e-commerce" label="Multi-Vendor E-Commerceの画面ギャラリー" browserTitle={`Multi-Vendor E-Commerce / ${slides.length} views`} />;
}
