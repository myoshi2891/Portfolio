# PHASE 4 — 実装・検証記録

確認日: 2026-09-16 JST。対象はこのポートフォリオ自身。掲載する13リポジトリの稼働・テスト・性能を再検証した記録ではない。

**Phase 4の実装・ローカル受け入れ検証・文書同期は完了。** 単体20件、E2E 46件が成功し、Chromium専用BFCache検証の対象外2件はスキップ。型・Lint・静的buildも成功した。

## 実装範囲

[Phase 3](phase-3-technical-architecture.md)と承認済みのBun構成に基づき、HomeとFeatured詳細4ページを静的生成する。公開先の選定、ホスト固有設定、デプロイ、pushは実施していない。サイト全体の完成判断に必要な総合品質・性能監査はPhase 5に分ける。

| 対象 | 実装 |
|---|---|
| データ・証拠 | Featured 4件、Studies 6件、Secondary 3件。固定SHAの証拠43件と本人指定方針1件。件数・順序・参照・URL・日付・Home導線をビルド前に検査 |
| ページ | Home、Featured詳細4件、404。`generateStaticParams`でFeaturedのみ列挙、`dynamicParams = false`、`output: 'export'`、`trailingSlash: true` |
| 本文 | Server Components。証拠リンク・未検証範囲を掲載。未提供のScope・連絡先・Demo・実画面画像は省略 |
| 見た目 | Phase 2のライトテーマ、色・文字・余白・グリッド。768px／1200pxで切替。ネイティブ開閉、skip link、フォーカス表示、reduced motion |
| フォント | InterとNoto Sans JPの400／500／600をローカル配信。日本語は分割WOFF2と`unicode-range`。ライセンス・出典・ファイル一覧を同梱 |
| Homeの操作 | 共有hash、同じhashの再選択、祖先の開閉、履歴ごとの開閉・位置・フォーカス。sessionStorage補助コピーは直近20件。保存拒否・破損に対応 |
| SEO | ページごとのMetadata、1200×630の静的OG画像、sitemap、robots。既定preview・noindex。productionで有効なHTTPSオリジンがなければビルド停止 |
| プレビュー | `out/`のディレクトリindex・Content-Typeを配信し、未知パスにはHTTP 404を返す |
| CI | Bun固定lockfile導入→型→Lint→単体→build→Chromium／Firefox／WebKitの静的出力E2E。レポートを保存 |

通常のbuildと表示にGitHub API・Google Fontsへの問い合わせはない。OG画像はサイト紹介用であり、掲載アプリのスクリーンショットではない。

## ローカル検証

環境はmacOS、Bun 1.3.12、Node.js 22.23.2。再現用のコマンドは[README](../README.md)を参照。

| 検査 | 実行結果 |
|---|---|
| `bun install --frozen-lockfile` | 成功。393 installs／492 packagesを検査、依存変更なし |
| `bun run test` | 5ファイル・20テスト成功 |
| `bun run typecheck` | 成功。ルート型生成とTypeScript検査 |
| `bun run lint` | 成功 |
| `bun run build` | 成功。Home＋4詳細、404、robots、sitemapを静的出力 |
| `bun run test:e2e`（修正後の全件実行） | 46成功・2スキップ・失敗0。Chromium 16成功、Firefox／WebKitは各15成功・1スキップ |
| production・URL未指定／HTTP URL | それぞれビルドが終了コード1で停止し、SITE_URLのエラーを確認 |
| production・有効なHTTPS URL | テスト用`https://example.com`でビルド成功。5ページのcanonical・OG・index設定、sitemap、robots、404のcanonical省略・noindexを出力から確認 |
| 最終出力 | 公開設定の検証後、preview・SITE_URLなしで再ビルド |

サンドボックス内のTurbopackビルドはコンパイル段階で進行しなかったため、そのプロセスを停止して制約外で再実行した。成功の記録は再実行の結果。ブラウザ起動とローカル配信も制約外で検証した。

`unrs-resolver`のpostinstallはブロックされたまま。現環境で型・Lint・buildが成功しているため、追加の信頼設定は行っていない。GitHub ActionsのLinux環境で同じ結果になることは未確認。

## ブラウザ検証の範囲

既存の48ケースをChromium・Firefox・WebKitで実行した。対象は開発サーバーではなく静的出力。

- Home＋4詳細への直接アクセス、未知・Study・Secondaryの詳細URLのHTTP 404。
- 内部リンク・フラグメントの存在、重複ID、ページ実行エラー、第三者への通信がないこと。
- 共有hash、同一hash再選択、追加学習・補足の開閉、アンカー履歴、詳細との往復、再読込、位置・フォーカスの復元。
- storage拒否・壊れたJSON・不正なhash、既存history.stateの保持。
- JavaScript無効時の開閉と詳細への移動、キーボードのskip link・開閉。
- 5ページのaxe検査。320／768／1200／1440pxではHomeとLLM詳細を対象に、200%文字拡大・フォント遮断・reduced motionを組み合わせてページ横スクロールがないこと。
- previewのnoindex、canonical省略、OG画像の配信、robots、空のsitemap。

BFCacheは、3エンジンで合成`pageshow.persisted`イベントへの応答を検査し、Chromiumでは専用起動設定で実際の`pageshow.persisted=true`を確認する。実BFCacheの専用テストはFirefox・WebKitでスキップする。両エンジンでの実BFCache利用を実証したとは扱わない。

初回の再検証では45成功・1失敗・2スキップ。Firefoxの詳細往復テストで、状態読み取り中に実行コンテキストが置き換わった。`ready`の待機を、値だけでなく読み取り処理も最大5秒間再試行するよう修正した（`0e4f70c`）。該当テストの5回反復はすべて成功。アプリケーションの履歴実装は変更していない。

## 実装履歴

| コミット | 内容 |
|---|---|
| `244373a` | Bun・Vitest・Playwrightの基盤 |
| `c27af49` → `bc9dc94` | データ・証拠検査のRed→Green |
| `108e18f` → `232ed26` | ページ描画・静的ページ・ブラウザ受け入れのRed→Green（途中の構成・部品コミットを含む） |
| `974591c` → `0197dc3` | 履歴・アンカー復元のRed→Green |
| `e840cf2` → `c1c0b40` | 公開設定・SEOのRed→Green |
| `0b90baa` → `f2c7bfc` | Homeの参照・証拠整合性のRed→Green |
| `528d85a` | CI設定 |
| `d42da8e`、`5fc01d3`、`b2cb9d1` | TDDルール・技術設計・READMEのBun同期 |
| `0e4f70c`、`394645b` | FirefoxのE2E待機修正、静的ビルド用の生成型宣言同期 |

本記録と[引き継ぎ資料](phase-4-handoff.md)の更新は、実装・テスト修正と分ける。コミット前にステージ済み追加行の絶対パス・チルダパスと空白を検査する。

## 未検証・後続作業

- Phase 5: 総合的な視覚・UX評価、支援技術、実機・実ブラウザでの追加確認、操作領域の網羅的評価。axeや横スクロール検査だけでアクセシビリティ全体の合格とはしない。
- Phase 5: Lighthouse、LCP・CLS、操作応答、JS／フォント配信量を測定する。現時点で性能値は掲載しない。
- CI: GitHub Actions上の実行は未確認。pushやワークフローの起動は実施していない。
- 公開: ホストと実際のSITE_URLの選定、HTTPS・404・Content-Type・キャッシュ・ヘッダーの配信設定と検証。テスト用オリジンは公開先ではない。
- 掲載対象: Phase 0の固定SHAを根拠とする。13リポジトリの最新状態・外部サービス接続・テスト結果・本番稼働・臨床的有効性の再監査は行っていない。
