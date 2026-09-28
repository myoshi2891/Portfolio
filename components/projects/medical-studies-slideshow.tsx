import { ProjectSlideshow, type ProjectSlide } from "./project-slideshow";

const slides = [
  { file: "prom-checker-dashboard.png", title: "PROM統合チェッカー", alt: "頭痛PROMチェッカーの統合ダッシュボード。頭痛日誌、PROM評価、疼痛強度、レポート出力を選べる" },
  { file: "prom-checker-headache-diary.png", title: "頭痛日誌 — MOHリスク判定", alt: "頭痛日誌（前向き記録）とMOHリスク判定テーブルを扱うPROMチェッカー画面" },
  { file: "prom-checker-evaluation-report.png", title: "頭痛評価レポート", alt: "医師共有用の頭痛評価レポート。基本サマリーとMOHリスク判定を出力する画面" },
  { file: "anatomy-atlas-top.png", title: "3D解剖アトラス — トップ", alt: "頭痛3D解剖アトラスのトップ画面。7系統・42解剖構造をナビゲーションで探せる" },
  { file: "anatomy-head-neck-interactive-model.png", title: "3D解剖 — 頭頸部の全体像", alt: "頭頸部の全体像インタラクティブモデル。神経・血管・骨・筋を共通座標で表示する画面" },
  { file: "anatomy-cervical-spine-structure-explorer.png", title: "3D解剖 — 頸椎 Structure Explorer", alt: "頸椎のStructure Explorerモーダル。第4頸椎C4の位置・機能・頭痛との関係を日英で解説" },
  { file: "headaches-migraine-guide.png", title: "疾患ガイド — 片頭痛 完全ガイド", alt: "片頭痛（Migraine）の完全ガイド。ICHD-3、SNOOP4、CGRP最新療法を解説する教育画面" },
  { file: "treatment-acute-headache-guide.png", title: "治療ガイド — 頭痛の急性期治療", alt: "頭痛の急性期治療の考え方。薬効群の総論と階層化治療・MOH予防を解説する画面" },
  { file: "blocks-occipital-nerve-guide.png", title: "神経ブロック — 後頭神経ブロック", alt: "後頭神経ブロック（ONB）完全ガイド。解剖・適応・手技・SNOOP4安全管理を扱う教育画面" },
  { file: "therapies-physical-therapy-guide.png", title: "関連療法 — 理学療法 完全ガイド", alt: "頭痛に対する理学療法の完全ガイド。ICHD-3・Cochrane準拠の包括的解説画面" },
  { file: "prom-headache-diary-guide.png", title: "PROMガイド — 頭痛日誌", alt: "頭痛日誌（Headache Diary）完全ガイド。SNOOP4レッドフラッグスクリーニングを解説する画面" },
] as const satisfies readonly ProjectSlide[];

export function MedicalStudiesSlideshow() {
  return <ProjectSlideshow slides={slides} imageDirectory="Medical-Studies" label="Medical Studiesの画面ギャラリー" browserTitle="Medical Studies / 7 views" />;
}
