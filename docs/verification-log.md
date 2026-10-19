# 検証記録

件数・日付・環境を含むローカルの検証結果は、この文書だけに記録します。README・現行仕様・引き継ぎには結果を書かず、ここへリンクします。新しい記録を上に追加します。CI の実行結果は GitHub Actions を参照してください。

検証はこのポートフォリオに対するものです。紹介対象13リポジトリのテスト成功・性能・外部連携の成功を意味しません。実機・支援技術・Lighthouse・実ユーザー性能は未測定です。

## 2026-10-19 — 改善計画フェーズ2（F1・A3・A1・A2・D4・G3・G1）

環境: macOS、Bun 1.3.12。既定の実行は Node.js 22.23.2。G3 の確認のため、型・単体・build は Node.js 24.21.0（`npx -p node@24.21.0`）でも実行しました。

| 検査 | 結果 |
| --- | --- |
| `bun run typecheck` 相当（`tsc --noEmit`） | エラー0件（Node.js 22・24） |
| `bun run lint` | 終了コード0、メッセージ0件 |
| `bun run test` | 22ファイル・77件成功（Node.js 22・24） |
| `bun run build` | 成功。内容検査「13 repositories, 4 details」。build の後に追跡対象の差分なし（F1 の確認と同じ条件） |
| `bun run test:e2e` | 3ブラウザで232件成功・2件スキップ（Node.js 22） |
| Multi Vendor 詳細の HTML | A2 の前後で `<main>` が図のクラス名を除いて同一 |

未確認: Node.js 24 での E2E と、Vercel 上の Node.js 24 でのデプロイ。

## 2026-10-19 — 改善計画フェーズ1

型・Lint・単体（72件）・build・E2E（3ブラウザ232件）が通過しました。項目ごとの結果は [改善計画](improvement-plan.md#進捗2026-10-19) を参照してください。

## それ以前

2026-10-02 以前の検証結果は [引き継ぎ](phase-4-handoff.md) と [実装記録](phase-4-implementation.md) にあります（当時の記録として保持）。
