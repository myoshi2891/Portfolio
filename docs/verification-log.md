# 検証記録

件数・日付・環境を含むローカルの検証結果は、この文書だけに記録します。README・現行仕様・引き継ぎには結果を書かず、ここへリンクします。新しい記録を上に追加します。CI の実行結果は GitHub Actions を参照してください。

検証はこのポートフォリオに対するものです。紹介対象13リポジトリのテスト成功・性能・外部連携の成功を意味しません。実機・支援技術・実ユーザー性能は未測定です。Lighthouseはローカルのラボ計測（モバイルのシミュレーション）です。

## 2026-10-19 — 改善計画 B1（日本語フォントのサブセット化）

環境: macOS、Bun 1.3.12、Node.js 24.21.0。

| 検査 | 結果 |
| --- | --- |
| `tsc --noEmit`・`bun run lint` | エラー0件 |
| `bun run test` | 27ファイル・100件成功 |
| `bun audit`（braces を除外） | 勧告0件（`subset-font` 2.9.0・`@expo-google-fonts/noto-sans-jp` 0.4.4 追加後） |
| `bun run build` | 成功。build の後に追跡対象の差分なし（サブセットの出力は決定論的） |
| `bun run test:e2e` | 3ブラウザで235件成功・2件スキップ |
| `bun run lighthouse` | 予算内（転送量 2.0MB 以下に変更後）。中央値は Home 68（LCP 7.3秒、1.22MB）、プロフィール 74（5.6秒、1.20MB）、Multi Vendor 70〜71（6.5〜6.8秒、1.51MB）。同条件で再計測した変更前は Home 75（6.1秒、1.69MB）、プロフィール 80（5.0秒、1.47MB）、Multi Vendor 75（6.7秒、2.24MB）。Accessibility・Best Practices・SEO は100 |

未確認: 実機での日本語の表示（ウェイト 500 を 400・600 に置き換えた箇所の見た目）、実ユーザーの LCP。

## 2026-10-19 — 改善計画フェーズ3（B3・B2・C3・C4・C5・D1・D3・F6・B4）

環境: macOS、Bun 1.3.12、Node.js 22.23.2。

| 検査 | 結果 |
| --- | --- |
| `tsc --noEmit`・`bun run lint` | エラー0件 |
| `bun run test` | 30ファイル・94件成功 |
| `bun audit`（braces を除外） | 勧告0件（`lighthouse` 13.5.0 追加後）。`@lhci/cli` 0.15.1 では high 5件を含む8件となったため不採用 |
| `bun run build` | 成功。build の後に追跡対象の差分なし |
| `bun run test:e2e` | 3ブラウザで235件成功・2件スキップ。ギャラリー通知の E2E は `--repeat-each=3` でも成功 |
| `bun run lighthouse` | 予算内。中央値は Home 69〜70（LCP 7.0〜7.3秒、1.69MB）、プロフィール 79〜80（4.8〜5.0秒、1.47MB）、Multi Vendor 79〜81（5.0〜5.3秒、2.24MB）。Accessibility・Best Practices・SEO は100 |
| 本番相当の build（`SITE_URL` あり） | Home・プロフィールに WebSite＋Person、詳細に BreadcrumbList の JSON-LD を出力し、JSON として解析できる |
| 本番のヘッダー（`curl -I`） | HTML・フォント・画像は `max-age=0, must-revalidate`（B3 の反映前）、`/_next/static` は `immutable`。末尾スラッシュなしは308 |
| `bun scripts/check-external-links.ts` | 外部リンク26件、切れ0件、自動確認不可0件 |

未確認: GitHub Actions 上での Lighthouse の実行時間とスコアのばらつき、B3 のヘッダーのデプロイ後の値、週次ワークフローの初回実行。

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
