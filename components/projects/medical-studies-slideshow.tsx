import { ProjectSlideshow, type ProjectSlide } from "./project-slideshow";

const slides = [
  { file: "prom-checker-dashboard.png", title: "PROM統合チェッカー", alt: "頭痛PROMチェッカーの統合ダッシュボード。頭痛日誌、PROM評価、疼痛強度、レポート出力を選べる" },
  { file: "anatomy-cervical-spine-viewer.png", title: "3D解剖アトラス — 骨・頸椎", alt: "頸椎の3DモデルとMRIスライスを並べて学べる解剖アトラス画面" },
  { file: "headaches-tension-type-guide.png", title: "疾患別ガイド — 緊張型頭痛", alt: "緊張型頭痛の定義、疫学、診断、治療を扱う教育ガイド画面" },
  { file: "treatment-migraine-prevention-guide.png", title: "治療ガイド — 片頭痛予防", alt: "片頭痛予防治療の適応判断と薬効群を解説する教育ガイド画面" },
  { file: "blocks-superior-cervical-ganglion-guide.png", title: "神経ブロック — 上頸神経節", alt: "上頸神経節ブロックの解剖、適応、禁忌、手技を解説する教育ガイド画面" },
  { file: "therapies-headache-acupoints-guide.png", title: "非薬物療法 — 頭痛と経穴", alt: "肩井、肩外兪、膏肓、風池、天柱と頭痛の関係を扱う教育ガイド画面" },
  { file: "prom-hit6-reference-guide.png", title: "PROM解説 — HIT-6", alt: "HIT-6の背景、構造、採点、解釈を扱うリファレンスガイド画面" },
] as const satisfies readonly ProjectSlide[];

export function MedicalStudiesSlideshow() {
  return <ProjectSlideshow slides={slides} imageDirectory="Medical-Studies" label="Medical Studiesの画面ギャラリー" browserTitle="Medical Studies / 7 views" />;
}
