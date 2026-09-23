import { ProjectSlideshow, type ProjectSlide } from "./project-slideshow";

const slides = [
  { file: "dashboard-overview.png", title: "日次業務ダッシュボード", alt: "The Wild Oasisの管理ダッシュボード。予約数、売上、チェックイン数、稼働率、本日のアクティビティを表示" },
  { file: "bookings-management.png", title: "予約一覧とステータス管理", alt: "The Wild Oasisの予約一覧。ゲスト、宿泊日、予約ステータス、金額を表示" },
  { file: "dashboard-analytics-charts.png", title: "売上・滞在日数の分析", alt: "The Wild Oasisの分析画面。滞在日数の分布と90日間の売上推移をグラフで表示" },
  { file: "cabins-management.png", title: "客室と料金の管理", alt: "The Wild Oasisの客室一覧。定員、料金、割引、客室画像を表示" },
] as const satisfies readonly ProjectSlide[];

export function WildOasisSlideshow() {
  return <ProjectSlideshow slides={slides} imageDirectory="The Wild Oasis Admin" label="The Wild Oasis管理画面ギャラリー" browserTitle="The Wild Oasis / Admin" />;
}
