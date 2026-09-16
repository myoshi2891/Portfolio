export const domains = [
  { title: "BUILD", english: "Products & Applications", subtitle: "アプリを作る", description: "商品・注文・予約・記録を扱うWebアプリケーション。", links: [
    { label: "ECの実装と構成", anchor: "work-r01", href: "/projects/multi-vendor-e-commerce/" }, { label: "宿泊管理の実装", anchor: "work-r02", href: "/projects/the-wild-oasis-for-admin/" },
  ] },
  { title: "STUDY", english: "Research & Knowledge", subtitle: "領域を学ぶ", description: "AI・医療の題材と、クラウド・アルゴリズム・マネジメントの学習。", links: [
    { label: "AI / LLMの実装", anchor: "work-r06", href: "/projects/comparison-of-llms/" }, { label: "質問票ツールの実装", anchor: "work-r12", href: "/projects/medical-studies/" },
    { label: "Cloud", anchor: "study-r10" }, { label: "Algorithms", anchor: "study-r13" }, { label: "Management", anchor: "study-r09" },
  ] },
  { title: "ENGINEER", english: "Architecture, Quality & Security", subtitle: "設計と品質を考える", description: "設計・品質保証・セキュリティの資料と、制作の構成・検査設定。", links: [
    { label: "Architecture", anchor: "study-r08" }, { label: "Quality Assurance", anchor: "study-r07" }, { label: "Security", anchor: "study-r11" },
  ] },
] as const;
