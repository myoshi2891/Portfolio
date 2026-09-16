export const site = {
  name: "myoshi2891",
  title: "myoshi2891 — Engineering Portfolio",
  githubUrl: "https://github.com/myoshi2891",
  hero: "学びを、仕組みにする。",
  description: "EC・宿泊管理のWebアプリから、LLM料金の比較、医療の質問票の計算・記録まで。制作したコードと、設計・品質・セキュリティの学習を紹介します。",
  heroEvidenceIds: ["R01-F01", "R01-F02", "R02-F01", "R06-F01", "R12-F01", "R08-F01", "R07-F01", "R11-F01"],
  philosophy: [
    { title: "Learn", text: "領域の知識を、資料とコード例で学ぶ。", label: "学習資料を見る", href: "/#studies" },
    { title: "Build", text: "学んだ題材を、操作とデータを持つアプリにする。", label: "制作を見る", href: "/#selected-work" },
    { title: "Engineer", text: "処理の分割と検査の仕組みを、コードから確かめる。", label: "構成と検査設定を見る", href: "/projects/comparison-of-llms/#quality" },
    { title: "Improve", text: "作ったものを見直し、次の学びと改善につなげる。", label: "実装を見返す", href: "/#selected-work" },
  ],
} as const;
