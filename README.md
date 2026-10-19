# Engineering Portfolio

myoshi2891の制作・学習を紹介する日本語ポートフォリオ。Next.js App RouterでHome、プロフィール、代表作の詳細4ページを静的生成します。Homeの13リポジトリの掲載情報は固定コミットの証拠と編集データ、4詳細の本文は`docs/PROJECT-DETAILS/`の基準資料と画面向けMarkdownで管理します。

Homeは全13件のプレビュー、4詳細は実画面ギャラリー・資料に基づく本文・Markdown表・Mermaid図を持ち、全画面でライト／ダークを切り替えられます。詳細画面にはGitHubリンクを表示しません。ライトモードは白・チャコール・シルバーを基調に、ブルーの3Dパネルと光の反射をアクセントにしています。

件数・日付を含む検証結果は[検証記録](docs/verification-log.md)の1か所にまとめます。[現行仕様](docs/current-specification.md)、[編集手順](docs/design-refresh.md)、[残作業](docs/phase-4-handoff.md)、[改善計画](docs/improvement-plan.md)を参照してください。

## ローカル起動

Bun **1.3.12**とNode.js **24.21.0**（LTS）を使用します（`.bun-version`、`.node-version`、`package.json`）。

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
| `bun run lighthouse` | build後の静的出力をプレビューで配信し、Lighthouseを3回ずつ実行して`lighthouserc.json`の予算を検査（Playwright Chromiumが必要。レポートは`.lighthouseci/`） |
| `bun scripts/check-external-links.ts` | build後の静的出力に含まれる外部リンクの生存を確認 |
| `bun run fonts:generate` | 現在の本文の使用文字から日本語フォントのサブセットと定義を再生成 |
| `bun run images:brand` | `assets/brand/myoshi.jpeg`から、ロゴWebP（`public/images/optimized/`）とfavicon・アイコン（`app/`）を再生成 |
| `bun run images:generate` | `assets/screens/`の提供PNGから、公開用WebP（同じパス）とHome用の表示幅別WebPを再生成。原本PNGがなくなった公開用WebPは削除 |
| `bun run diagrams:generate` | 全4詳細のMermaidソースから静的SVGを生成（Playwright Chromiumが必要） |
| `bun run diagrams:commerce` | Multi VendorのMermaid SVGのみ生成 |
| `bun scripts/generate-og.ts` | 現行トークン・ロゴ・同梱InterでOG画像を再生成（Playwright Chromiumが必要） |

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

URLなしではcanonicalを省略し、sitemapは空、robotsはクロールを拒否します。`production`で有効なURLがなければビルドが停止します。設定変更は再ビルドで反映します。

## Vercelへのデプロイ

[`vercel.json`](vercel.json)でNext.jsプリセット、`bun install --frozen-lockfile`、`bun run build`を指定しています。`output: "export"`の静的出力をそのまま配信し、サーバー機能は使いません。

1. VercelでGitHubリポジトリをImportします。Framework・Install・Buildは`vercel.json`の値が使われ、Root Directoryは既定のままにします。
2. Node.jsは24.xを選択します（`package.json`の`engines`と一致）。
3. 環境変数は不要です。Vercelの`VERCEL_ENV`が`production`のときだけインデックスを許可し、`SITE_URL`の既定値は`VERCEL_PROJECT_PRODUCTION_URL`（独自ドメイン設定時はそのドメイン）です。Preview・Developmentは常にnoindexで、canonicalとsitemapを出力しません。
4. 独自ドメインを明示する場合は、Production環境にのみ`SITE_URL=https://example.com`を設定します。`DEPLOYMENT_ENV`・`SITE_URL`を明示した値はVercelの既定より優先します。

`vercel.json`は全パスにCSP・HSTS・`X-Content-Type-Options`・`X-Frame-Options`・`Referrer-Policy`・`Permissions-Policy`・COOPを付与します。静的出力ではnonceを使えないため、Next.jsのインラインスクリプト、テーマ初期化、到着時スクロール初期化に限り`script-src 'unsafe-inline'`を許可し、外部オリジン・`eval`は許可しません。`bun run preview`も同じヘッダーを返し、E2EでCSP違反がないことを確認します。E2EのFirefoxはCOOPによるブラウジングコンテキスト切替でPlaywrightが初回遷移を見失うため、`playwright.config.ts`でCOOPの適用のみ無効化しています（ヘッダー値は検証対象のまま）。外部オリジンを追加する場合はCSPも更新してください。Preview環境のVercel Toolbarは外部スクリプトのためCSPで読み込まれません。

`/fonts/*`は毎回再検証、`/images/*`は1日キャッシュします（詳細は[現行仕様](docs/current-specification.md#公開アクセシビリティの共通契約)）。

HSTSは`includeSubDomains`・`preload`を付けていません。独自ドメインの全サブドメインがHTTPS対応であることを確認してから追加します。

## 編集と構成

- `data/`: 掲載順・文案・証拠。Featured 4件、Studies 6件、Secondary 3件。4詳細本文は`*-detail.md`、本文・節・ページクラス・更新日のレジストリは`project-documentation.ts`（Featuredの登録漏れは型エラー）。
- `docs/PROJECT-DETAILS/`: 詳細説明の基準資料。資料と表示用Markdownの対応は[現行仕様](docs/current-specification.md#ページと情報源)。
- `app/`: Home、Featured詳細、404、Metadata、sitemap、robots。
- `components/home/navigation-controller.tsx`: 全ページのスムーズなアンカー移動・開閉・履歴・フォーカス復元を担当するClient Component。
- `components/layout/mobile-menu.tsx`・`components/projects/detail-contents.tsx`: モバイルメニューと詳細目次のClient Component。
- `components/ui/site-link.tsx`: 内部リンクをNext.js LinkでSPA遷移、外部リンクを新しいタブで開くアンカーとして表示し、そのことを支援技術へ伝える。
- `components/home/hero-scene.tsx`: 学習・制作・設計・改善の循環を表すCSS 3Dアニメーション。画像を使わず、一時停止／再生ボタンを備え、画面外停止・reduced-motionに対応。
- `components/projects/screen-preview.tsx`・`data/screens.ts`・`data/presentation.ts`: 全13件のHomeプレビュー・代替文と7件の公開サイトの導線。
- `components/projects/documented-project-detail.tsx`: 全4詳細のMarkdown本文・表・生成済みMermaid SVGをサーバー描画。ギャラリーとの対応は`detail-galleries.tsx`。
- `components/projects/project-slideshow.tsx`・各`*-slideshow.tsx`: 全4詳細の共通画像ギャラリー。
- `lib/theme.ts`・`components/layout/theme-toggle.tsx`: OS追従・保存・タブ同期を持つ全画面共通テーマ切り替え。
- `components/layout/header-github-link.tsx`: `/projects/`配下で共通ヘッダーのGitHubリンクを非表示。hydration中は事前生成HTMLと同じ判定（実在する詳細のみ）を使い、未知projectの404は hydration 後に隠す。Homeの導線は維持。
- `app/globals.css`: 配色トークン、保存選択／OS連動テーマ、3Dの反射演出、全コンポーネントのスタイル。
- `app/fonts.css`: `fonts:generate`で再生成する日本語フォントのCSS。
- `assets/screens/`: 表示する提供画像の原本PNG（公開しない）。`assets/unused-screens/`は提供済みで未掲載の原本。
- `assets/brand/`: ロゴ・faviconの原本JPEG（公開しない）。
- `public/images/`: 公開用WebP（`images:generate`の生成物）、Home用の表示幅別WebP、詳細用Mermaid SVG。PNG・JPEGは置きません。Home画像は`data/screens.ts`（原本PNG名）、ギャラリーは対応するスライド配列（WebP名）を更新。生成物も管理。
- `lib/`: 取得、URL生成、データ検証、保存値の検証、公開設定（`site-config.ts`）、配信ヘッダーの照合（`response-headers.ts`）。
- `assets/fonts/`・`public/fonts/`: InterとNoto Sans JP、400／600のローカルWOFF2（CSSも400／600だけを使用）。Noto Sans JPは`fonts:generate`が本文の使用文字だけを含むサブセットをウェイトごとに1ファイル生成。各ディレクトリにライセンス・出典・ファイル一覧。
- `public/og/portfolio.png`: サイト用OG画像。制作アプリのスクリーンショットではありません。

図のソースを変更した場合は、build前に`bun run diagrams:generate`を実行して生成SVGを更新します。図中文字は1remを維持し、狭い画面では図の領域内で横スクロールできます。ASCII図解は使用しません。

本文はServer Componentsで生成し、追加の学習・補足も初期HTMLに含めます。JavaScriptが無効でも`details`で手動展開できます。通常のアンカー移動はsmooth、履歴復元・ページ切替・URLハッシュ付きの直接到着はinstantです（読み込み完了まで`html[data-arrival]`でCSSのsmoothを止めます）。OSのreduced-motion設定時は移動・3D演出を抑制します。

テーマはlocalStorageの`portfolio-theme`へ保存し、未選択時はOSへ追従します。JavaScript無効時はOS配色とギャラリーの先頭画像を表示し、テーマ切り替え・ギャラリー操作は提供しません。

履歴の補助保存はsessionStorageの直近20件までで、保存拒否・破損時も基本操作を維持します。

依存導入後のbuildと表示はGitHub API・Google Fonts通信に依存しません。未提供の担当範囲・連絡先は表示していません。公開URL・画像の提供状況と対応表は[デザイン更新記録](docs/design-refresh.md)を参照してください。

## CIと検証範囲

[CI設定](.github/workflows/ci.yml)は依存導入→脆弱性検査（`bun audit`）→型・Lint・単体→build→生成物の同期確認→Lighthouseの予算検査→静的出力E2Eを実行します。Lighthouseは`@lhci/cli`ではなく`lighthouse`本体を使います（`@lhci/cli`の依存は修正版のない高リスクの勧告を含むため）。外部リンクは[週次ワークフロー](.github/workflows/external-links.yml)で確認し、切れていればIssueを作成（既存のIssueがあればコメント）します。buildが追跡対象の生成物（`app/fonts.css`など）を書き換えた場合は、再生成のコミット漏れとしてCIが失敗します。`bun audit`の除外は修正版のない開発依存の勧告に限り、理由をCI設定に記載します。依存とGitHub Actionsは[Dependabot](.github/dependabot.yml)で週次更新を提案します（Next.js・React系は1つにまとめ、Node.js型・TypeScript・ESLintのメジャー更新は計画的に別途実施）。ローカルの検証結果は[検証記録](docs/verification-log.md)、CIの実行結果はGitHub Actionsを参照してください。

検証はこのポートフォリオに対するものです。紹介対象13リポジトリのテスト成功・性能・外部連携の成功を意味しません。実機・支援技術・実ユーザー性能は未測定です。Lighthouseはローカルのラボ計測（モバイルのシミュレーション）です。

## 設計・作業ルール

[Phase 0: 証拠](docs/phase-0-repository-evidence-audit.md) → [Phase 1: 情報設計](docs/phase-1-portfolio-strategy-and-information-architecture.md) → [Phase 2: 文案・デザイン](docs/phase-2-content-and-design-system.md) → [Phase 3: 技術設計](docs/phase-3-technical-architecture.md) → [Phase 4: 実装記録](docs/phase-4-implementation.md)。

開発は[マスタープロンプト](prompt.md)、[TDD・段階コミット](.claude/rules/tdd-commit-workflow.md)、[パス記載ルール](.claude/rules/no-absolute-paths.md)に従います。
