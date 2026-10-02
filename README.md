# Engineering Portfolio

myoshi2891の制作・学習を紹介する日本語ポートフォリオ。Next.js App RouterでHomeと代表作の詳細4ページを静的生成します。Homeの13リポジトリの掲載情報は固定コミットの証拠と編集データ、4詳細の本文は`docs/PROJECT-DETAILS/`の基準資料と画面向けMarkdownで管理します。

2026-10-02更新: 全13件のHomeプレビュー、4詳細の実画面ギャラリー（10／9／11／4枚）、資料に基づく本文・Markdown表・Mermaid図12件、全画面共通のライト／ダーク切り替えを実装。詳細画面のGitHubリンクはすべて削除しました。ライトモードは白・チャコール・シルバーを基調に、ブルーの3Dパネルと光の反射をアクセントにしています。

単体34件成功。最新デザインのChromium画面テスト8件、Multi Vendorギャラリー2件とHome画像のPC・モバイル表示を確認しました。このセッションではエージェントによるbuild・全3ブラウザE2Eを実行していません。[現行仕様](docs/current-specification.md)、[編集手順](docs/design-refresh.md)、[検証結果と残作業](docs/phase-4-handoff.md)を参照してください。

## ローカル起動

Bun **1.3.12**とNode.js **22.23.2**を使用します（`.bun-version`、`.node-version`、`package.json`）。

```sh
bun install --frozen-lockfile
bun run dev
```

開発サーバーは通常 `http://localhost:3000`。ポート使用中は起動ログで実際のポートを確認します（このセッションの最終確認は3001）。静的生成したサイトを確認する場合は以下を実行します。

```sh
bun run build
bun run preview
```

プレビューは `http://127.0.0.1:4173` で`out/`を配信します。未知のパスは実際のHTTP 404を返します。`next start`は使用しません。

## コマンド

| コマンド | 内容 |
|---|---|
| `bun run dev` | フォント定義を生成して開発サーバーを起動 |
| `bun run typecheck` | Next.jsのルート型生成とTypeScript検査 |
| `bun run lint` | ESLint |
| `bun run test` | Vitestの単体・描画・データ境界テスト |
| `bun run build` | データ・参照整合性検査、フォント定義生成、静的生成 |
| `bun run preview` | 静的出力をローカル配信 |
| `bun run test:e2e` | 静的出力を3ブラウザで検証。必要に応じてプレビューを自動起動 |
| `bun run fonts:generate` | 現在の本文に必要な日本語フォント定義を再生成 |
| `bun run images:generate` | Homeの提供PNGから表示幅別のWebPを再生成 |
| `bun run diagrams:generate` | 全4詳細のMermaidソースから静的SVGを生成（Playwright Chromiumが必要） |
| `bun run diagrams:commerce` | Multi VendorのMermaid SVGのみ生成 |
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

- `data/`: 掲載順・文案・証拠・未検証範囲。Featured 4件、Studies 6件、Secondary 3件。4詳細本文は`*-detail.md`、共通対応表は`project-documentation.ts`。
- `docs/PROJECT-DETAILS/`: 詳細説明の基準資料。資料と表示用Markdownの対応は[現行仕様](docs/current-specification.md#ページと情報源)。
- `app/`: Home、Featured詳細、404、Metadata、sitemap、robots。
- `components/home/navigation-controller.tsx`: 全ページのスムーズなアンカー移動・開閉・履歴・フォーカス復元を担当するClient Component。
- `components/layout/mobile-menu.tsx`・`components/projects/detail-contents.tsx`: モバイルメニューと詳細目次のClient Component。
- `components/ui/site-link.tsx`: 内部リンクをNext.js LinkでSPA遷移、外部リンクを通常のアンカーで表示。
- `components/home/hero-scene.tsx`: 学習・制作・設計・改善の循環を表すCSS 3Dアニメーション。画像や操作ボタンを使わず、画面外停止・reduced-motionに対応。
- `components/projects/screen-preview.tsx`・`data/screens.ts`・`data/presentation.ts`: 全13件のHomeプレビュー・代替文と7件の公開サイトの導線。
- `components/projects/documented-project-detail.tsx`・`multi-vendor-detail.tsx`: Markdown本文・表・生成済みMermaid SVGをサーバー描画。旧`project-details.ts`・`feature-guides.ts`は現在の4詳細本文の編集先ではありません。
- `components/projects/project-slideshow.tsx`・各`*-slideshow.tsx`: 全4詳細の共通画像ギャラリー。
- `lib/theme.ts`・`components/layout/theme-toggle.tsx`: OS追従・保存・タブ同期を持つ全画面共通テーマ切り替え。
- `components/layout/header-github-link.tsx`: `/projects/`配下で共通ヘッダーのGitHubリンクを非表示。hydration中は事前生成HTMLと同じ判定（実在する詳細のみ）を使い、未知projectの404は hydration 後に隠す。Homeの導線は維持。
- `app/globals.css`: 配色トークン、保存選択／OS連動テーマ、3Dの反射演出、全コンポーネントのスタイル。
- `app/fonts.css`: `fonts:generate`で再生成する日本語フォントのCSS。
- `public/images/`: 原本PNG、Home用WebP、詳細用Mermaid SVG。Home画像は`data/screens.ts`、ギャラリーは対応するスライド配列を更新。生成物も管理。
- `lib/`: 取得、URL生成、データ検証、保存値の検証、公開設定。
- `assets/fonts/`・`public/fonts/`: InterとNoto Sans JP、400／500／600のローカルWOFF2。各ディレクトリにライセンス・出典・ファイル一覧。
- `public/og/portfolio.png`: サイト用OG画像。制作アプリのスクリーンショットではありません。

図のソースを変更した場合は、build前に`bun run diagrams:generate`を実行して生成SVGを更新します。図中文字は1remを維持し、狭い画面では図の領域内で横スクロールできます。ASCII図解は使用しません。

本文はServer Componentsで生成し、追加の学習・補足も初期HTMLに含めます。JavaScriptが無効でも`details`で手動展開できます。通常のアンカー移動はsmooth、履歴復元とページ切替はinstantです。OSのreduced-motion設定時は移動・3D演出を抑制します。

テーマはlocalStorageの`portfolio-theme`へ保存し、未選択時はOSへ追従します。JavaScript無効時はOS配色とギャラリーの先頭画像を表示し、テーマ切り替え・ギャラリー操作は提供しません。

履歴の補助保存はsessionStorageの直近20件までで、保存拒否・破損時も基本操作を維持します。

依存導入後のbuildと表示はGitHub API・Google Fonts通信に依存しません。未提供の担当範囲・連絡先は表示していません。公開URL・画像の提供状況と対応表は[デザイン更新記録](docs/design-refresh.md)を参照してください。

## CIと検証範囲

[CI設定](.github/workflows/ci.yml)は依存導入→型・Lint・単体→build→静的出力E2Eを実行します。最新のローカル結果と検証範囲は[引き継ぎ](docs/phase-4-handoff.md)に集約しています。GitHub Actions上の実行結果はまだありません。

検証はこのポートフォリオに対するものです。紹介対象13リポジトリのテスト成功・性能・外部連携の成功を意味しません。実機・支援技術・Lighthouse・実ユーザー性能は未測定です。

## 設計・作業ルール

[Phase 0: 証拠](docs/phase-0-repository-evidence-audit.md) → [Phase 1: 情報設計](docs/phase-1-portfolio-strategy-and-information-architecture.md) → [Phase 2: 文案・デザイン](docs/phase-2-content-and-design-system.md) → [Phase 3: 技術設計](docs/phase-3-technical-architecture.md) → [Phase 4: 実装記録](docs/phase-4-implementation.md)。

開発は[マスタープロンプト](prompt.md)、[TDD・段階コミット](.claude/rules/tdd-commit-workflow.md)、[パス記載ルール](.claude/rules/no-absolute-paths.md)に従います。
