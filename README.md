# Engineering Portfolio

myoshi2891の制作・学習を紹介する日本語ポートフォリオ。Next.js App RouterでHomeと代表作の詳細4ページを静的生成します。13リポジトリの掲載情報は、固定コミットの証拠と編集データを正としています。

Phase 4の実装・ローカル検証は完了。[実装記録](docs/phase-4-implementation.md)に結果と未検証範囲を記載しています。公開先の選定・デプロイとPhase 5の総合品質・性能監査は別作業です。

## ローカル起動

Bun **1.3.12**とNode.js **22.23.2**を使用します（`.bun-version`、`.node-version`、`package.json`）。

```sh
bun install --frozen-lockfile
bun run dev
```

開発サーバーは通常 `http://localhost:3000`。静的生成したサイトを確認する場合は以下を実行します。

```sh
bun run build
bun run preview
```

プレビューは `http://127.0.0.1:4173` で`out/`を配信します。未知のパスは実際のHTTP 404を返します。`next start`は使用しません。

## コマンド

| コマンド | 内容 |
|---|---|
| `bun run dev` | 開発サーバー |
| `bun run typecheck` | Next.jsのルート型生成とTypeScript検査 |
| `bun run lint` | ESLint |
| `bun run test` | Vitestの単体・描画・データ境界テスト |
| `bun run build` | データ・参照整合性検査と静的生成 |
| `bun run preview` | 静的出力をローカル配信 |
| `bun run test:e2e` | 静的出力を3ブラウザで検証。必要に応じてプレビューを自動起動 |
| `bun scripts/generate-og.ts` | 文字主体のOG画像を再生成 |

`bun run test`はVitestを呼び出します。Bun組み込みの`bun test`へ置き換えないでください。E2E初回はブラウザを導入し、事前にビルドします。

```sh
bunx playwright install chromium firefox webkit
bun run typecheck
bun run lint
bun run test
bun run build
bun run test:e2e
```

LinuxではブラウザのOS依存も必要です。CIと同じ`bunx playwright install --with-deps chromium firefox webkit`で導入できます。

## 環境設定

通常の開発・previewでは環境変数の設定は不要です。必要な場合は`.env.example`を`.env.local`へコピーします。

| 変数 | 設定 |
|---|---|
| `DEPLOYMENT_ENV` | 省略時は`preview`。`production`のみインデックスを許可 |
| `SITE_URL` | 公開先のHTTPSオリジン。認証情報・サブパス・query・hashは不可 |

URLなしではcanonicalを省略し、sitemapは空、robotsはクロールを拒否します。`production`で有効なURLがなければビルドが停止します。設定変更は再ビルドで反映します。公開先とURLは未決定です。

## 編集と構成

- `data/`: 掲載順・文案・証拠・未検証範囲。Featured 4件、Studies 6件、Secondary 3件。
- `app/`: Home、Featured詳細、404、Metadata、sitemap、robots。
- `components/home/navigation-controller.tsx`: Homeの開閉・アンカー・履歴復元を担当するClient Component。
- `lib/`: 取得、URL生成、データ検証、保存値の検証、公開設定。
- `assets/fonts/`・`public/fonts/`: InterとNoto Sans JP、400／500／600のローカルWOFF2。各ディレクトリにライセンス・出典・ファイル一覧。
- `public/og/portfolio.png`: サイト用OG画像。制作アプリのスクリーンショットではありません。

本文はServer Componentsで生成し、追加の学習・補足も初期HTMLに含めます。JavaScriptが無効でも`details`で手動展開できます。履歴の補助保存はsessionStorageの直近20件までで、保存拒否・破損時も基本操作を維持します。

依存導入後のbuildと表示はGitHub API・Google Fonts通信に依存しません。未提供の担当範囲・連絡先・Demo・実画面画像は表示していません。

## CIと検証範囲

[CI設定](.github/workflows/ci.yml)は依存導入→型・Lint・単体→build→静的出力E2Eを実行します。2026-09-16 JSTの再検証で、型・Lint・build、単体20件・E2E 46件が成功しました。Chromium専用BFCache検証のFirefox・WebKitでの2件は対象外です。修正したFirefoxのテスト待機と公開設定の検証結果は[実装記録](docs/phase-4-implementation.md)を参照してください。GitHub Actions上の実行結果はまだありません。

Phase 5では総合的な視覚・UX評価、支援技術、実ブラウザでの追加確認、LCP・CLS・JS／フォント配信量などを測定します。今回の検証結果は、紹介対象13リポジトリのテスト成功や性能を意味しません。

## 設計・作業ルール

[Phase 0: 証拠](docs/phase-0-repository-evidence-audit.md) → [Phase 1: 情報設計](docs/phase-1-portfolio-strategy-and-information-architecture.md) → [Phase 2: 文案・デザイン](docs/phase-2-content-and-design-system.md) → [Phase 3: 技術設計](docs/phase-3-technical-architecture.md) → [Phase 4: 実装記録](docs/phase-4-implementation.md)。

開発は[マスタープロンプト](prompt.md)、[TDD・段階コミット](.claude/rules/tdd-commit-workflow.md)、[パス記載ルール](.claude/rules/no-absolute-paths.md)に従います。
