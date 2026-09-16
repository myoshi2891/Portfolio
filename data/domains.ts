export const domains = [
  { title: "BUILD", english: "Products & Applications", subtitle: "アプリを作る", description: "商品・注文・予約・記録を扱うWebアプリケーション。", links: [
    { label: "Webアプリ", anchor: "work-r01" }, { label: "宿泊管理", anchor: "work-r02" },
  ] },
  { title: "STUDY", english: "Research & Knowledge", subtitle: "領域を学ぶ", description: "AI・医療の題材と、クラウド・アルゴリズム・マネジメントの学習。", links: [
    { label: "AI / LLM", anchor: "work-r06" }, { label: "Medical / Healthcare", anchor: "work-r12" },
    { label: "Cloud", anchor: "study-r10" }, { label: "Algorithms", anchor: "study-r13" }, { label: "Management", anchor: "study-r09" },
  ] },
  { title: "ENGINEER", english: "Architecture, Quality & Security", subtitle: "設計と品質を考える", description: "設計・品質保証・セキュリティの資料と、制作の構成・検査設定。", links: [
    { label: "Architecture", anchor: "study-r08" }, { label: "Quality Assurance", anchor: "study-r07" }, { label: "Security", anchor: "study-r11" },
  ] },
] as const;
