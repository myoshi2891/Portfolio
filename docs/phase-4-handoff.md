# PHASE 4 — セッション引き継ぎ

更新日: 2026-09-16 JST。現在の実装・検証結果は[Phase 4実装記録](phase-4-implementation.md)を正とする。

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
