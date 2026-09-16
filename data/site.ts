export const site = {
  name: "myoshi2891",
  title: "myoshi2891 — Engineering Portfolio",
  githubUrl: "https://github.com/myoshi2891",
  hero: "学びを、仕組みにする。",
  description: "EC・宿泊管理のWebアプリから、LLM料金の比較、医療の質問票の計算・記録まで。制作したコードと、設計・品質・セキュリティの学習を紹介します。",
  heroEvidenceIds: ["R01-F01", "R01-F02", "R02-F01", "R06-F01", "R12-F01", "R08-F01", "R07-F01", "R11-F01"],
  philosophy: [
    { title: "Learn", text: "品質保証の資料では、検索とカテゴリ別の一覧から学習ガイドをたどれます。", label: "学習資料を見る", href: "/#studies" },
    { title: "Build", text: "ECアプリでは、商品フォームから商品・バリアントを保存する処理までをつなげています。", label: "制作を見る", href: "/#selected-work" },
    { title: "Engineer", text: "LLM料金ツールでは、Pythonの収集処理とWeb側の費用計算を分け、それぞれの検査設定を置いています。", label: "構成と検査設定を見る", href: "/projects/comparison-of-llms/#quality" },
    { title: "Improve", text: "質問票ツールでは、回答の検証・計算・保存・出力の役割を分けて確認できます。", label: "処理の分け方を見る", href: "/projects/medical-studies/#features" },
  ],
} as const;
