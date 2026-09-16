# PHASE 4 — セッション引き継ぎ

更新日: 2026-09-16 JST。実装途中のチェックポイント。**Phase 4は未完了。**

## 次のセッションへの依頼

この文書と下記仕様・ルールを読み、現在の作業ツリーからPHASE 4の実装を継続する。Bun構成と実装計画はユーザー承認済み。再承認を求める必要はない。現在はページ実装のGreen作業中であり、既存のRedコミットから続ける。

- [マスタープロンプト](../prompt.md)
- [TDD・段階コミット](../.claude/rules/tdd-commit-workflow.md)
- [絶対パス記載禁止](../.claude/rules/no-absolute-paths.md)
- [Phase 0: 証拠](phase-0-repository-evidence-audit.md)
- [Phase 1: 情報設計](phase-1-portfolio-strategy-and-information-architecture.md)
- [Phase 2: 文案・デザイン](phase-2-content-and-design-system.md)
- [Phase 3: 技術設計](phase-3-technical-architecture.md)

## 承認済みの範囲と決定

- Home＋Featured詳細4ページをNext.js App Routerで静的生成。`output: 'export'`、`trailingSlash: true`、Featuredのみ`generateStaticParams`で列挙する。
- Featured順: R01、R06、R12、R02。Studies順: R08、R07、R11、R10、R13、R09。Secondary順: R04、R03、R05。
- 今回はローカルで検証可能なサイトとGitHub ActionsのCI設定まで。公開先選定・ホスト固有設定・デプロイ・pushは対象外。
- Bun 1.3.12をパッケージ管理・スクリプト実行に使用。Node.js 22.23.2はツール用に維持する。
- Vitestを使用し、実行は`bun run test`。Bun組み込みの`bun test`へ変更しない。
- `bun.lock`を管理し、CIは`bun install --frozen-lockfile`。README・Phase 3・TDDルール内の自サイト用コマンドをBunへ同期する。Phase 0の他リポジトリの監査事実は書き換えない。
- 日本語本文、表示名`myoshi2891`。未提供の本名・肩書き・担当範囲・連絡先・Demo・実画面画像は補完しない。
- Phase 2の文案・色・余白・グリッドを継承。ライトテーマ、オフホワイト・墨色・青。768pxと1200pxでレイアウトを切り替える。
- Inter・Noto Sans JPをローカル配信。400／500／600、ライセンスと出典を管理。日本語は分割WOFF2＋`unicode-range`。Google Fontsへのビルド時通信を必須にしない。
- GitHub API補足は初期版に実装しない。監査の固定SHA・確認日を根拠とする。
- 詳細本文はServer Components、Homeの開閉・アンカー・履歴のみ小さなClient Componentにする。
- 学習追加3件と補足はネイティブ`details`。履歴ごとに開閉・位置・フォーカスを保存し、sessionStorage補助コピーは20件まで。戻る・進むは保存状態、新規URLはhashを優先。BFCache・保存拒否・値破損・JS無効時にも配慮する。
- SEO設定は`SITE_URL`、`DEPLOYMENT_ENV`。既定preview・noindex。URLなしならcanonical省略・空sitemap。production指定で有効なHTTPS URLがなければビルド停止。
- 総合品質監査・性能測定はPhase 5として区別し、未実測値を掲載しない。

## 完了済みコミット

| コミット | 内容 | 検証 |
|---|---|---|
| `244373a` | Bun・Vitest・Playwright等の依存とテスト基盤 | Bunによる依存導入完了 |
| `c27af49` | データ・証拠・URLのRedテスト | 未実装モジュールによる失敗を確認してコミット |
| `bc9dc94` | データ・証拠・整合性検査・ルート生成のGreen | Vitest 5テスト成功 |
| `108e18f` | ページ描画とブラウザ受け入れテストのRed | 未実装ページ、未実装previewスクリプトによる失敗を確認してコミット |

TDD基盤準備と機能実装を分けている。ページのGreenコミットはまだ作成していない。履歴のreset・squash・既存変更の削除は不要。

### 確定したデータ実装

- `types/portfolio.ts`: Project、Study、Claim、VerifiedEvidence、Limitation、ProjectDetail等。
- `data/projects.ts`、`data/studies.ts`: Phase 2から移した7 Projects＋6 Studies。
- `data/evidence.ts`: 文案で参照する43件のリポジトリ証拠＋本人指定の方針1件。固定SHAのファイルリンク付き。
- `data/project-details.ts`、`data/limitations.ts`: Featured4詳細と未検証範囲。R01の外部サービスはR01-M02、テスト実績はR01-M03を参照する。
- `lib/portfolio.ts`、`lib/routes.ts`、`lib/validate-content.ts`: 取得・ルート生成・件数／順序／重複／証拠／URL／SHA／日付／Scopeの検査。
- `scripts/validate-content.ts`: ビルド前のデータ検査。

## 現在の未コミット変更

以下は**この作業で追加した未追跡ファイル**。ユーザーによる変更ではない。削除せず継続利用する。

- `app/page.tsx`: Homeの全セクション。まだレイアウト・CSS・状態制御と統合していない。
- `components/layout/chrome.tsx`: Navigation、Footer、skip link。
- `components/ui/primitives.tsx`: ActionLink、SectionHeader、EvidenceLinks、Disclosure等。
- `components/projects/project-card.tsx`: Featured／Secondary表示。
- `components/studies/study-card.tsx`: 学習カード。
- `data/site.ts`、`data/domains.ts`: Home文案・領域リンク。
- `tsconfig.json`、`next.config.ts`、`postcss.config.mjs`、`eslint.config.mjs`: アプリ設定。

`app/projects/[slug]`、フォント・OG用ディレクトリは作成したが、必要なファイルはまだない。空ディレクトリはGitに保存されない。

**未追跡の実装は作業ツリーに残している。** 同じワークスペースでのセッション再開ではそのまま利用できる。別のcloneでは復元されないため、この段階の移動は作業ツリー全体を保持すること。Green成功前の本番コードを完了コミットにまとめないための状態である。

## 直近の実行結果・注意点

- 引き継ぎ時の`bun run test`: データ5テスト成功。ページスイートは`app/projects/[slug]/page.tsx`が未作成のため失敗。
- 直前の`bun run test:e2e`: `scripts/preview.ts`未作成で起動失敗。ブラウザテストはまだ一度も成功していない。
- typecheck、lint、Next.js build、実ブラウザ表示は未実行。フォント配置、OG作成、CI、README更新も未実施。
- Vitest 5／Viteの構成で、`vitest.config.ts`の`esbuild.jsx`に対し「oxcが優先される」警告が出る。インストール済み型定義・公式資料を確認してJSX設定を整理する。
- 初回に最新TypeScript／ESLintを入れるとpeer警告が出たため、TypeScript 5.9.3・ESLint 9系へ変更済み。現在の解決バージョンは`bun.lock`が正。
- `package.json`の`eslint`は`"9"`、`@types/node`は`"22"`となっている。lockfileでは固定済みだが、正確な宣言へそろえる場合はlockfileとの整合も更新する。
- `bun pm untrusted`では`unrs-resolver`のpostinstallが1件ブロックされている。Lint等の動作を確認し、必要性を判断する。無差別に全スクリプトを許可しない。
- Bunの依存取得とGitへの書き込みは、この環境ではサンドボックス昇格が必要だった。承認済み範囲でツールの承認手続きを使う。
- データ転記とコミット前チェックには一時スクリプトを使ったが、次セッションでの存在を前提にしない。転記済みTypeScriptと監査文書が正。コミット前のパス検査はルールに従って再実行する。

## 再開時の作業順

1. `git status --short`、コミット履歴、本書を確認。既存変更を保持する。
2. **現在のページGreenを完了**: 詳細4ページ、`generateStaticParams`／`dynamicParams = false`、404、root layout、CSSトークン、ローカルフォント、静的プレビューサーバーを実装する。
3. プレビューサーバーは`out/`を配信し、ディレクトリindexと実際のHTTP 404を扱う。SPAの全パス200 fallbackを使わない。静的出力のブラウザ検証を行う。
4. 単体テスト、型検査、build、lint、既存E2Eを成功させ、ページGreenを独立コミット。未確認の成功は記録しない。
5. **状態復元の新しいRed→Green**: 単体境界テストとE2Eを追加し、未実装の失敗を確認・コミットしてから実装する。現在のE2Eには履歴復元のテストはまだない。
6. **SEO・公開設定の新しいRed→Green**: Metadata、OG、sitemap、robots、環境設定の成功・失敗条件を先にテストする。OGはコードによる文字主体の静的画像でよい。
7. CI設定、文書・ルールのBun同期、実装記録を整える。Home文案・領域リンクを含む参照整合性も点検する。
8. 全チェックを実行し、検証結果と未検証範囲を記録してPhase 4を完了する。デプロイ・pushを行わない。

### 検証の到達目標

- Home＋4詳細、対象外slugの404、証拠リンク、未提供欄の省略。
- Chromium・Firefox・WebKitで直接アクセス、共有hash、同じhash再選択、キーボード、開閉、戻る・進む、BFCache有無、storage拒否／破損。
- 320／768／1200／1440px、200%文字拡大、長いRepository名、フォント失敗、reduced motion、横スクロールなし。
- 現在のE2Eにはaxeによる検査、JS無効、skip link、ネイティブ開閉、画面幅・文字拡大・フォント失敗のテストがある。
- 依存導入後のbuild・表示がGitHub API／Google Fonts通信に依存しないこと。
- CIは依存導入→型・lint・単体→build→静的出力E2E。ローカル成功と実際のGitHub Actions実行結果を区別する。

## コミット運用

機能ごとにRed確認・`test(...)`コミット→Green確認・`feat(...)`／`fix(...)`コミット→整理・文書同期を分離する。全コミット前にステージ済み追加行を機械走査し、絶対パス・チルダパスが混ざっていないことを確認する。今回の引き継ぎは記録用文書のコミットだけとし、途中の本番コードを混ぜない。
