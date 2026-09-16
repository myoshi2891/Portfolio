# PHASE 4 — セッション引き継ぎ

## 現在の中断地点：デザイン改善（2026-09-16）

**ユーザー指示により作業を中断。デザイン改善は実装済みですが、最終検証とコミット整理は未完了です。** 以下の「Phase 4完了」は以前の実装の記録であり、今回の変更が検証完了したという意味ではありません。

### 今回の依頼と実装

- 読み込み時の演出、3Dアニメーションの検討、ボタン・リンクの洗練、主な機能を紹介する理由と参照先の具体的な説明。
- HomeにCSSの3Dレイヤー表現を追加。4.5秒で静止、Replayで再生。動きを減らす設定に対応。
- 配色・ヒーロー・ナビゲーション・作品カード・ボタン・詳細の目次を刷新。追加CSSは`app/design.css`。
- 代表作4件の主な機能8件に、紹介理由・HTMLフロー図・コードごとの読むポイント表を追加。`data/feature-guides.ts`、`components/projects/feature-story.tsx`を参照。
- 説明は既存のPhase 0監査を根拠に編集。参照URL・固定SHAは変更していない。追加依存なし。
- 仕様と編集方法は`docs/design-refresh.md`（現時点では未追跡）に記載。

### コミットと未コミットの変更

現在のブランチは`dev`。今回作成済みのローカルコミット：

1. `631f28f`：詳細の説明・図表を要求するテスト。Red確認済み。
2. `aef041c`：デザイン、3D演出、機能の説明を実装。単体テスト成功。
3. `d937a44`：全参照リンクの説明対応、動きの停止・再生・reduced-motionの検査を追加。

未コミット：

- `app/design.css`：アニメーション中も文字を薄くしない修正と、小さな補助文字・番号のコントラスト修正。
- `app/loading.tsx`の削除：このファイルを追加すると、静的HTMLのSuspenseフォールバックがJavaScript無効時に残り、本文を読めなくなることを検出。削除により解消。再導入しないこと。読み込み時の演出は`app/layout.tsx`の非遮蔽ラインとCSSの登場演出で維持。
- `README.md`、この文書、未追跡の`docs/design-refresh.md`：説明の追加。
- `next-env.d.ts`：開発サーバー／ビルドによる自動生成差分。作業開始時にも差分があった。今回の手書き実装として一括コミットしない。

push・デプロイはしていません。未コミットの修正を破棄しないでください。

### 確認済みと未完了

- `bun run lint`、`bun run test`（21件）、`bun run typecheck`、静的build成功。最終の配色修正もbuild成功。
- PCのHome・作品一覧・詳細、スマートフォンのHome・詳細をスクリーンショットで確認。
- 3ブラウザーで、3D演出の停止・再生・動きを減らす設定、JavaScript無効時の閲覧、320/768/1200/1440px・文字200%・フォント取得失敗時の横はみ出し検査が成功した実行あり。
- 最終色修正後、Chromiumは全17件成功。Firefoxの全5ページのaxe検査も成功。WebKitの最終色修正後の全ページaxe検査は、中断時点で完了未確認。
- **未解決：Firefoxの`e2e/portfolio.spec.ts`のキーボードテスト。** スキップリンク後に`#more-studies > summary`へfocusしてEnterを押しても`open`属性が付かず失敗。単独3回実行は成功したが、全体実行では再現。`--workers=1`でも再現したため、ブラウザー間のフォーカス競合が原因とは断定できない。初期ハイドレーション、フォーカス移動、既存NavigationControllerのタイミング等は未調査。
- 以前の並列実行ではWebKitの履歴復元テストで`#work-r01`へのfocusが失敗した回もあり、原因未確定。
- 中断したコマンドは`bun run build && bun run test:e2e --workers=1`。51件のうちWebKitに入った時点でユーザー指示を受け、今回のPlaywrightプロセスにSIGINTを送信。**全E2E成功とは記載しないこと。**
- 停止確認済み（終了コード130）。最終集計は39件成功、Firefoxの上記1件失敗、WebKitの実行中1件中断、1件スキップ、9件未実行。WebKitの中断は不具合による失敗として扱わない。
- 失敗の詳細は`test-results/portfolio-keyboard-skip-li-d884c-sure-retain-a-visible-focus-firefox/error-context.md`および同ディレクトリの`trace.zip`。テスト再実行で上書きされる点に注意。

### 再開手順

1. `git status`と上記未コミット差分を読み、現状の実装を維持する。
2. Firefoxのキーボード操作失敗を切り分ける。確認なしに待機の追加やテストの削除で隠さない。
3. 必要な修正後、単体・型・Lint・buildと関連E2Eを確認。最終色修正後のWebKitの全ページaxe検査も完了させる。
4. 結果を`docs/design-refresh.md`とREADMEへ反映し、コードの修正と文書を論理単位でローカルコミット。既存TDD規約・パス検査を継続。

起動済みのユーザーの開発サーバーと既存プレビューサーバーは停止していません。ローカル静的プレビューは通常`http://127.0.0.1:4173`、開発表示は通常`http://localhost:3000`です。

---

更新日: 2026-09-16 JST。現在の実装・検証結果は[Phase 4実装記録](phase-4-implementation.md)を正とする。

その後のユーザー依頼によるデザイン・機能説明の変更は[デザイン更新記録](design-refresh.md)を参照。ライトテーマを継承し、余白・配色・カード・ボタンを更新。CSSの立体演出と再生用Client Componentを追加し、主な機能8件に理由・図・コード参照表を追加しています。以下のPhase 4時点のデザイン・Client Component範囲より、この更新を優先してください。

**Phase 4は完了。** 単体20件・E2E 46件成功、Chromium専用BFCache検証の対象外2件はスキップ。型検査・Lint・静的buildも成功。残る総合品質・性能監査はPhase 5として扱う。

## 再開時に確認するもの

- [マスタープロンプト](../prompt.md)
- [TDD・段階コミット](../.claude/rules/tdd-commit-workflow.md)
- [絶対パス記載禁止](../.claude/rules/no-absolute-paths.md)
- [Phase 0: 証拠](phase-0-repository-evidence-audit.md)
- [Phase 1: 情報設計](phase-1-portfolio-strategy-and-information-architecture.md)
- [Phase 2: 文案・デザイン](phase-2-content-and-design-system.md)
- [Phase 3: 技術設計](phase-3-technical-architecture.md)
- [README: 起動と検証](../README.md)

以前の本書は`a129589`時点のページGreen途中のチェックポイントだった。その後、ページ・履歴復元・SEO・参照整合性・CI・Bun文書同期がコミットされている。旧チェックポイントの「未追跡ファイル」「未実装」「次のRed→Green」は現在の残作業ではない。履歴のreset・既存実装の再作成は不要。

## 維持する決定

- Home＋Featured詳細4ページをNext.js App Routerで静的生成。`output: 'export'`、`trailingSlash: true`、Featuredのみ`generateStaticParams`で列挙。
- Featured順: R01、R06、R12、R02。Studies順: R08、R07、R11、R10、R13、R09。Secondary順: R04、R03、R05。
- Bun 1.3.12・Node.js 22.23.2。`bun.lock`を管理し、依存導入は`bun install --frozen-lockfile`。`bun run test`はVitestであり、Bun組み込みの`bun test`へ変更しない。
- 日本語本文、表示名`myoshi2891`。未提供の本名・肩書き・担当範囲・連絡先・Demo・実画面画像は補完しない。
- Phase 2のライトテーマ、色・余白・グリッド、768px／1200pxの切替を継承。Inter・Noto Sans JPの400／500／600をローカル配信。
- GitHub API補足は初期版に含めず、監査の固定SHA・確認日を根拠とする。
- 詳細本文はServer Components。Homeのアンカー・開閉・履歴だけをClient Componentで補助。ネイティブ`details`でJS無効時も閲覧可能。
- 履歴ごとの開閉・位置・フォーカス、20件までのsessionStorage補助コピー。新規URLはhash、戻る・進むは保存状態を優先。
- `SITE_URL`・`DEPLOYMENT_ENV`でSEO設定。既定preview・noindex。URLなしではcanonical省略・空sitemap。productionで有効なHTTPSオリジンがなければビルド停止。
- 承認済み範囲はローカルで検証可能なサイトとGitHub ActionsのCI設定。公開先選定・ホスト固有設定・デプロイ・pushは含めない。

## この再開作業での変更

- Firefoxの履歴往復E2Eで、遷移中に状態読み取りが失敗する競合を確認。最大5秒の再試行へ修正し、対象テストの5回反復が成功（`0e4f70c`）。アプリの履歴処理は変更していない。
- 静的ビルドで生成される型宣言へ同期（`394645b`）。開発サーバーを起動するとNext.jsが参照先を再生成する場合がある。
- productionのURL不足・HTTP URLでのビルド停止、有効なHTTPS URLでのMetadata出力を検証。生成物は最後に通常のpreviewへ戻した。
- READMEとPhase 3から参照されていた実装記録を追加し、本書を現状へ更新。

## 後続作業

Phase 5で総合的な視覚・UX・アクセシビリティ監査と性能測定を行う。既存E2Eの合格範囲と、実機・支援技術・性能の未測定範囲を区別する。Firefox・WebKitの実BFCache利用は未実証で、専用テストの実行対象はChromiumのみ。

GitHub Actions上の実行結果はまだない。ローカル成功をCI成功と記載しない。公開先と実URLは未決定であり、テスト用オリジンを設定に残さない。13リポジトリの最新状態・テスト成功・外部接続を推測しない。

新しい機能や不具合の実装はTDD・段階コミットを継続する。全コミット前にステージ済み追加行の絶対パス・チルダパスを検査し、テスト・本番実装・文書を論理的な単位で分ける。
