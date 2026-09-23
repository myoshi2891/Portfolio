import { ProjectSlideshow, type ProjectSlide } from "./project-slideshow";

const slides = [
  { file: "cost-calculator-overview.png", title: "AIモデル 時間別コスト計算機", alt: "AIモデルの時間別コスト計算機。利用シナリオと期間を選択する画面" },
  { file: "claude-code-spec-driven-development-guide.png", title: "Claude Code 仕様駆動開発ガイド", alt: "Claude Codeで始めるAI仕様駆動開発のMarkdownガイド画面" },
  { file: "antigravity-agent-skills-guide.png", title: "Agent Skills 実践ガイド", alt: "Antigravity IDEにおけるAgent Skills実践ガイド画面" },
  { file: "openai-codex-best-practices-guide.png", title: "OpenAI Codex ベストプラクティス", alt: "OpenAI Codexベストプラクティスガイド画面" },
  { file: "github-copilot-spec-driven-development-guide.png", title: "GitHub Copilot 仕様駆動開発ガイド", alt: "GitHub CopilotによるAI仕様駆動開発のベストプラクティス画面" },
  { file: "coderabbit-best-practices-guide.png", title: "CodeRabbit 実践ガイド", alt: "CodeRabbitの設定と自動レビューを解説する実践ガイド画面" },
  { file: "llm-evaluation-observability-guide.png", title: "LLM評価・オブザーバビリティ", alt: "LLM評価、ベンチマーク、オブザーバビリティのベストプラクティス画面" },
  { file: "ai-engineering-introduction-guide.png", title: "AI Engineering 入門ガイド", alt: "AI Engineeringを17セクションで解説する入門ガイド画面" },
  { file: "whats-new-guides.png", title: "What's New", alt: "新着および最近更新されたAIガイドの一覧画面" },
] as const satisfies readonly ProjectSlide[];

export function LlmStudiesSlideshow() {
  return <ProjectSlideshow slides={slides} imageDirectory="llm-studies" label="LLM Studiesの画面ギャラリー" browserTitle="LLM Studies / Gallery" />;
}
