# アプリケーション全体の改善計画

作成日: 2026-10-18 ／ 対象: `dev` ブランチ（`9647616`）と、同日にビルドした静的出力 `out/`

## 1. 目的と前提

- 2026-09-17 のレビュー（[critical-review-and-improvements.md](critical-review-and-improvements.md)）で挙がった主な課題（実画面、公開URL、プロフィール、テーマ、目次、モバイルメニュー、404 など）は対応済みです。本書は、その後のコードベース全体を対象に残りの改善点を洗い出し、優先度と実施順序を決めます。
- 表示・編集の契約は [現行仕様](current-specification.md) を優先します。仕様の変更を伴う提案や、オーナーの判断が必要な提案には「要判断」と付けます。
- 実装は [TDD・段階コミット](../.claude/rules/tdd-commit-workflow.md) と [パス記載ルール](../.claude/rules/no-absolute-paths.md) に従います。
- 紹介対象の事実（公開URL、経歴、担当範囲など）は推測で補いません（[マスタープロンプト](../prompt.md) の Fact > Inference）。

### 調査方法と範囲

- `app/`・`components/`・`lib/`・`data/`・`scripts/`・各設定・CI を精読し、Next.js 16 に同梱のドキュメント（`node_modules/next/dist/docs/`）と照合しました。
- `out/` を実測しました（JS・CSS・HTML のサイズ、Tailwind が生成した内容、フォント参照数の推定）。
- `bunx tsc --noEmit --incremental false` はエラー0件。`bunx eslint .` は終了コード0（ただし jsx-ast-utils のメッセージが2件出る）。`bun outdated` で依存の更新状況を確認しました。
- Vitest・Playwright・build はこの調査では実行していません。数値は既存の `out/` から計測したものです。

## 2. 維持すべき強み

- 証拠モデル（`data/evidence.ts`）とビルド時の内容検査（`lib/validate-*.ts`）で、掲載内容の根拠を機械的に確認できる。
- 静的出力だけで構成し、第三者への通信がない。CSP などのヘッダーを preview と E2E で検証している（`scripts/preview.ts`、`e2e/security-headers.spec.ts`、`e2e/integrity.spec.ts`）。
- 3ブラウザの E2E（49件）と axe を備え、reduced-motion・JS無効・200%拡大・保存拒否まで検証の観点がそろっている。
- CI のアクションは SHA で固定し、`permissions: contents: read` と `persist-credentials: false` を指定している。
- クライアント JS が小さい（アプリ固有のチャンクは gzip で約12KB）。Markdown 系のライブラリはクライアントに混入していない。

## 3. 優先度サマリー

- 優先度: **P1** すぐ着手（欠陥、規約違反、公式の非推奨への対応で、工数が小さいもの）、**P2** 次の山（構造整理・計測・発見性）、**P3** 継続改善
- 工数: **S** 半日以内、**M** 1〜3日、**L** それ以上

| ID | 項目 | 区分 | 優先度 | 工数 | フェーズ |
| --- | --- | --- | --- | --- | --- |
| C1 | 表示文字とアクセシブルネームの不一致 | アクセシビリティ | P1 | S | 1 |
| C2 | 英語の語句に `lang="en"` を付ける | アクセシビリティ | P1 | S | 1 |
| A4 | Home 導線の検査を実際の節IDに合わせる | 正確性 | P1 | S | 1 |
| G2 | スキル定義を現行仕様に合わせる | 開発運用 | P1 | S | 1 |
| G6 | 非nullアサーション（`!`）を除去する | 品質 | P1 | S | 1 |
| B5 | ブランド原本 JPEG を公開しない | 性能・規約 | P1 | S | 1 |
| B6 | `next/image` の `priority` 非推奨に対応する | 保守性 | P1 | S | 1 |
| D2 | Xカードを大判にする | SEO・共有 | P1 | S | 1 |
| F2 | `next-env.d.ts` を追跡対象から外す | 開発運用 | P1 | S | 1 |
| E2 | 依存の自動更新と脆弱性検査 | セキュリティ | P1 | S | 1 |
| G4 | パッチ・マイナー更新 | 保守性 | P1 | S | 1 |
| A3 | 旧詳細データと未使用のコード・CSSを整理する | 保守性 | P2 | M（要判断） | 2 |
| A1 | 詳細ページの登録情報をレジストリに集約する | 保守性 | P2 | M | 2 |
| A2 | Multi Vendor 専用レンダラーを共通化する | 保守性 | P2 | M | 2 |
| D4 | 詳細の更新日をデータ化し sitemap に反映する | SEO・正確性 | P2 | S | 2 |
| F1 | 生成物の同期チェック | CI | P2 | S | 2 |
| G1 | 古くなったドキュメントの更新と再編 | ドキュメント | P2 | M | 2 |
| G3 | Node.js 24 LTS へ移行する | 基盤 | P2 | S〜M | 2 |
| B4 | 性能のベースラインを測り、予算を決める | 性能 | P2 | M（要判断） | 3 |
| B1 | 日本語 Web フォントの配信を見直す | 性能 | P2 | M〜L（要判断） | 3 |
| B3 | Vercel の配信設定を確認する（キャッシュ・末尾スラッシュ） | 性能・SEO | P2 | S | 3 |
| B2 | Tailwind の自動ソース走査を止める | 性能・保守性 | P2 | S | 3 |
| C3 | 新しいタブで開くリンクを事前に知らせる | アクセシビリティ | P2 | S | 3 |
| C4 | ギャラリー操作時に状態を通知する | アクセシビリティ | P2 | S | 3 |
| C5 | 文字サイズの下限を決める | アクセシビリティ | P2 | S | 3 |
| D1 | 構造化データ（JSON-LD） | SEO | P2 | S〜M | 3 |
| D3 | OG 画像を現行デザインにする | SEO・共有 | P2 | S〜M | 3 |
| F6 | 外部リンクを定期的に監視する | 運用 | P2 | S〜M（要判断） | 3 |
| A5 | ギャラリー定義のデータ化と画像パスの正規化 | 保守性 | P3 | S〜M | 4 |
| A6 | Home と共通レイアウトをコンポーネントに分割する | 保守性 | P3 | S〜M | 4 |
| A7 | Markdown・SVG の重複読み込みをなくす | ビルド効率 | P3 | S | 4 |
| A8 | NavigationController を段階的に分割する | 保守性 | P3 | M | 4 |
| C6 | 支援技術と強制カラーで実機確認する | アクセシビリティ | P3 | M | 4 |
| E1 | CSP の `'unsafe-inline'` を縮小する | セキュリティ | P3 | M〜L（要判断） | 4 |
| F3 | CI の重複実行をなくし、キャッシュを使う | CI | P3 | S | 4 |
| F4 | 単体テストを壊れにくくする | テスト | P3 | M（要判断） | 4 |
| F5 | モバイル端末相当の E2E | テスト | P3 | S〜M | 4 |
| G5 | TypeScript 7・ESLint 10 を評価する | 基盤 | P3 | M | 4 |
| H1 | テーマを「OSに従う」へ戻せるようにする | UX | P3 | S〜M（仕様変更） | 4 |
| H2 | ナビゲーションの小改善 | UX | P3 | S | 4 |
| H3 | 印刷用スタイル | UX | P3 | S〜M | 4 |

## 4. 改善項目の詳細

### A. アーキテクチャ・保守性

#### A1. 詳細ページの登録情報をレジストリに集約する〔P2 / M〕

- **現状**: `app/projects/[slug]/page.tsx:36-53` で、slug ごとのフラグと三項演算子の連鎖によってギャラリー・目次・本文・ページクラスを切り替えています。`components/projects/{llm-studies,medical-studies,wild-oasis}-detail.tsx` は slug を渡すだけのラッパーです。
- **問題**: 代表作を追加・入れ替えるたびに約10か所（`data/projects.ts`、`data/evidence.ts`、`lib/validate-content.ts` の期待値、`data/project-documentation.ts`、`data/project-details.ts`、ラッパーとスライドショー、page.tsx の4か所など）をそろえる必要があり、一部の漏れは型で検出できません。
- **改善案**: `data/project-documentation.ts` を、Multi Vendor を含む4件すべてのレジストリにします。各項目に `sections`・`diagrams`・`gallery`・`pageClassName`・`updatedAt` を持たせ、page.tsx は `projectDocumentation[slug]` を引くだけにします。ラッパー3ファイルは削除し、`satisfies Record<FeaturedSlug, …>` で登録漏れを型エラーにします。
- **完了条件**: page.tsx に slug の比較が残らない。既存の単体テストと E2E（HTML構造、目次ID、ギャラリー枚数）が通る。

#### A2. Multi Vendor 専用レンダラーを共通化する〔P2 / M〕

- **現状**: `components/projects/multi-vendor-detail.tsx` は、`lib/markdown-document.ts`（図パスの算出と viewBox の検証）と `components/content/markdown-document.tsx`（Markdown 要素の対応表）の内容を複製しています。モジュールの読み込み時に `readFileSync` を実行し（18行）、viewBox を `!` で取り出すため（37行）、検証も弱くなっています。CSS も `.commerce-mermaid` 系と `.detail-mermaid` 系が同じ内容で重複しています（`app/globals.css:251-263`）。
- **問題**: 図や表の描画仕様を変えるたびに2か所を直す必要があります。他の3詳細との違いは「節が1つ多い（`orders`）」ことだけです。
- **改善案**: `DocumentedProjectDetail` が節の定義をレジストリ（A1）から受け取るようにし、Multi Vendor も共通レンダラーで描画します。図の説明文はレジストリへ移し、CSS は `.detail-mermaid` 系に統一します。
- **完了条件**: `multi-vendor-detail.tsx` と `commerce-*` の CSS を削除できる。`class="commerce-mermaid"` を前提にしたテスト（`__tests__/refinement.test.tsx` など）は Red → Green の手順で更新する。

#### A3. 旧詳細データと未使用のコード・CSSを整理する〔P2 / M・要判断〕

- **現状**:
  - `components/projects/feature-story.tsx` はどこからも使われていません。`data/feature-guides.ts` を参照しているのは、このコンポーネントと `__tests__/feature-guides.test.ts` だけです。
  - `data/project-details.ts` と `data/limitations.ts` は画面に描画されず、詳細ページの存在判定（page.tsx:33-34）と検査にしか使われていません。それでも `satisfies Record<FeaturedSlug, …>`（`data/project-details.ts:43`）があるため、代表作を追加するときは旧データも作る必要があります。
  - CSS のクラスセレクター191件のうち約30件（`commerce-feature`、`llm-role-grid`、`wild-flow` など旧詳細レイアウトのもの。動的に生成される `node-*` は除く）が、TSX・TS から参照されていません。
- **判断事項**: 詳細ページの旧「主張＋証拠」モデルを (a) 廃止するか、(b) 監査用のデータとして残すか。
- **推奨**: (a)。詳細の存在判定は A1 のレジストリへ移し、`FeatureStory`・`feature-guides.ts`・関連テスト・未使用 CSS を削除します。Home カードの証拠検査（`validateContent`）は残します。
- **完了条件**: 未使用クラスの検出（一時スクリプトで可）で残りが0件。`bun run build` の内容検査が通る。

#### A4. Home 導線の検査を実際の節IDに合わせる〔P1 / S〕

- **現状**: `lib/validate-home-content.ts:13` は、旧データの節キーに `evidence`・`scope` を加えたものから有効なリンク先を作っています。一方、実際の詳細ページの節は `overview / features / (orders) / architecture / decisions / quality / documentation` です。
- **問題**: すでに存在しない `#evidence`・`#scope` へのリンクを通し、実在する `#orders`・`#documentation` へのリンクを不正と判定します。実行時には `e2e/integrity.spec.ts` が検出しますが、build 時の検査そのものが誤っています。
- **改善案**: slug ごとに、その slug で選ばれるレンダラーが描画する節だけから有効なアンカーを作ります（現状は Multi Vendor が `multiVendorDetailSections`、他の3件が `documentedDetailSections`。A1 の後はレジストリの `sections`）。両方の節定義を合わせた全体共通の許可リストにはしません。合わせてしまうと、`#orders` を持たない詳細への `#orders` リンクも通ってしまいます。
- **完了条件**: 次の失敗テストを先に追加する。「`#documentation` を許可し、`#evidence` を拒否する」。「`#orders` を、レンダラーにその節がある slug（`multi-vendor-e-commerce`）では許可し、ない slug（`medical-studies` など）では拒否する」。

#### A5. ギャラリー定義のデータ化と画像パスの正規化〔P3 / S〜M〕

- **現状**: スライドの配列が各 `*-slideshow.tsx` に埋め込まれています。ディレクトリ名には空白と大文字が混在しています（`The Wild Oasis Admin`、`Medical-Studies`、`llm-studies`）。`ProjectSlideshow` は `imageDirectory` をエンコードせずに URL を組み立てます（`project-slideshow.tsx:114`）が、`ScreenPreview` はパスの区切りごとにエンコードしています。
- **改善案**: スライド定義を `data/galleries.ts`（または A1 のレジストリ）へ移し、URL の生成を `ScreenPreview` と同じ関数にまとめます。ディレクトリ名の kebab-case 化は任意です。`assets/screens/` の原本・生成物・テストを同時に更新する必要があるため、行う場合は別コミットにします。

#### A6. Home と共通レイアウトをコンポーネントに分割する〔P3 / S〜M〕

- **現状**: `app/page.tsx:34-38` と `components/layout/chrome.tsx:13` は、1行が数百文字の JSX です。ナビゲーション項目は、デスクトップ（chrome.tsx:13）、モバイル（`mobile-menu.tsx:14`）、フッター（chrome.tsx:16）で別々に定義されています。
- **改善案**: セクション単位（Domains、Philosophy、Contact など）でコンポーネントに分け、ナビゲーション項目は `data/site.ts` の配列にまとめます。フォーマッターの一括導入は差分が大きくなるため行わず、触る箇所から分割します。

#### A7. Markdown・SVG の重複読み込みをなくす〔P3 / S〕

- **現状**: `StudySummary` と `DocumentedProjectDetail` が文書を読み込んだあと、分割した章ごとに `MarkdownDocumentContent` がもう一度 `loadMarkdownDocument` を実行し、Markdown とすべての SVG を読み直しています（`components/content/markdown-document.tsx:8`）。
- **改善案**: `loadMarkdownDocument` を React の `cache()` で包むか、読み込んだ結果を子コンポーネントへ渡します。ビルド時だけの処理なので優先度は低めです。

#### A8. NavigationController を段階的に分割する〔P3 / M〕

- **現状**: `components/home/navigation-controller.tsx` は224行で、1つの `useEffect` がスクロール・履歴・フォーカス・開閉状態をすべて管理しています。変更が集中している箇所です（本体8コミット、関連する E2E は `navigation.spec.ts` が11コミット、`spa.spec.ts` が9コミット）。フォーカス復元に使う ID は DOM 順の連番 `return-${i}`（28-30行）です。hydration の後に描画されるボタン（ギャラリー操作、テーマ切替）が増減すると、ID の対応がずれる可能性があります（要検証）。
- **改善案**: 全面的な書き換えはしません。(1) 状態遷移と不変条件を短い設計メモに残す。(2) ハッシュの解決や状態のスナップショットといった純粋関数を `lib/` へ切り出し、単体テストを付ける。(3) 生成 ID を DOM 順に依存しない方式（`data-*` 属性や要素の役割に基づくキー）にする案を、全3ブラウザの E2E を前提に検証する。

### B. パフォーマンス

#### B1. 日本語 Web フォントの配信を見直す〔P2 / M〜L・要判断〕

- **現状**: `public/fonts/` に Noto Sans JP の WOFF2 が372ファイル（8.8MB）あります。`app/fonts.css` は使用文字に絞った `@font-face` を171件（52KB）持ち、全ページ共通の描画ブロック CSS（91.7KB、gzip 13KB）に含まれます。本文と `unicode-range` の重なりから見積もると、1ページで読み込まれうるファイルは Home で最大96件（約1.0MB）、Multi Vendor 詳細で最大123件（約1.4MB）です（3ウェイトすべてを使う前提の上限値）。さらに Inter の3ウェイトを全ページで preload しています（`app/layout.tsx:22-29`）。
- **問題**: 初回表示のリクエスト数と転送量が多く、スライスが届くたびに再描画（FOUT）が起こりえます。参照されない約200ファイルもデプロイされています。
- **選択肢**:
  1. 日本語は OS のフォント（ヒラギノ角ゴ、Yu Gothic、Noto Sans CJK）に任せ、Web フォントは Inter だけにする。転送量はほぼ0になるが、OS によって見た目が変わる。
  2. 使用文字だけを含む WOFF2 をウェイトごとに1ファイル生成する（`fonts:generate` を拡張）。見た目を保ったまま、リクエストを3件程度に減らせる。ビルドの工程は増える。
  3. ウェイトを 400／600 の2種類に減らす（500 の使用箇所を置き換える）。
- **推奨**: B4 で実測してから決めます。見た目を優先するなら 2＋3、速度を最優先するなら 1。どの案でも、参照するファイルだけを `public/fonts/` に出力します。Inter は可変フォント1ファイルにするか、preload を 400 だけにします。
- **完了条件**: フォントのリクエスト数・転送量・LCP・CLS を変更前後で比較して記録する。E2E のフォント取得失敗テストが通る。

#### B2. Tailwind の自動ソース走査を止める〔P2 / S〕

- **現状**: `app/globals.css:1` の `@import "tailwindcss"` が、本文やコードに含まれる単語から `.container{width:100%}`（ブレークポイントごとの max-width 付き）、`.hidden`、`.table`、`.grid`、`.contents` などのユーティリティを生成しています。JSX では Tailwind のユーティリティを使っておらず、独自の `.container` と名前が衝突しています。レイヤー外の独自 CSS が優先されるため、今のところ表示への影響はありません。
- **改善案**: `@import "tailwindcss" source(none);` にして自動走査を止めます。preflight と `@theme` は残します。
- **完了条件**: ビルドした CSS の `@layer utilities` が空になり、`@layer theme` の変数（`--color-*` など）は残っていること。両テーマの画面 E2E と axe が通る。

#### B3. Vercel の配信設定を確認する（キャッシュ・末尾スラッシュ）〔P2 / S〕

- **現状**: `vercel.json` にはセキュリティヘッダーしかありません。`/fonts/*` と `/images/*` のファイル名にはハッシュがなく、ギャラリー画像には `?v=` も付いていません。preview は `/x` と `/x/` の両方に200を返します。
- **改善案**: 本番 URL で `curl -I` を実行し、実際のヘッダーとリダイレクトを確認します。必要なら、`/fonts/(.*)` にキャッシュ指定を追加します。`immutable` を付けた1年の max-age（`Cache-Control: public, max-age=31536000, immutable`）は、フォントの URL にバージョン（ファイル名のハッシュや `?v=`）を付け、内容が変わると URL も変わるようにしてから採用します。URL が変わらずハッシュもない現状のままなら、`Cache-Control: public, max-age=0, must-revalidate` のように毎回再検証する短い指定にします。また、`/images/(.*)` に長めの max-age を追加します（画像を差し替えるときに revision を更新する手順も決めます）。末尾スラッシュなしの URL も200を返して重複する場合は、`vercel.json` に `trailingSlash: true` を設定することを検討します。期待値は `__tests__/vercel-config.test.ts` に追加します。

#### B4. 性能のベースラインを測り、予算を決める〔P2 / M・要判断〕

- **現状**: Lighthouse、LCP、CLS、INP、実ユーザーの性能はまだ測っていません（[引き継ぎ](phase-4-handoff.md)）。
- **改善案**: CI で `bun run preview` に対して Lighthouse CI を実行し、性能・アクセシビリティ・SEO のスコアと転送量に予算を設けます。実ユーザーの指標も必要なら、Vercel Speed Insights を検討します（同一オリジンから配信されるため、現行の CSP と両立します）。
- **判断事項**: どちらも外部依存（npm パッケージまたは GitHub Action）の追加になります。

#### B5. ブランド原本 JPEG を公開しない〔P1 / S〕

- **現状**: `scripts/prepare-brand.ts:4` が入力に使う `public/images/myoshi.jpeg`（2048×2048、981KB）が、`out/images/myoshi.jpeg` として公開されています。README の「`public/images/` に PNG・JPEG を置かない」という方針の例外になっています。
- **改善案**: 原本を `assets/brand/` に移し、スクリプトと画像テストの除外設定を更新します。

#### B6. `next/image` の `priority` 非推奨に対応し、最適化の設定を一元化する〔P1 / S〕

- **現状**: `components/projects/project-slideshow.tsx:114-115` が `priority` を使っています。Next.js 16 で `priority` は非推奨になり、同梱ドキュメントは `loading="eager"` または `fetchPriority="high"` を勧めています（`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` の `preload` と `priority` の節）。また、すべての `Image` に `unoptimized` を個別に指定しています。
- **改善案**: 先頭スライドを `loading="eager" fetchPriority="high"` に置き換えます。`next.config.ts` に `images: { unoptimized: true }` を設定して個別指定を削除し、指定漏れによる export の失敗を防ぎます。

### C. アクセシビリティ

#### C1. 表示文字とアクセシブルネームを一致させる（WCAG 2.5.3、レベルA）〔P1 / S〕

- **現状**: `app/page.tsx:31` の「SCROLL TO EXPLORE」リンクの `aria-label` は「代表的な制作へ」です。ギャラリーの「前へ」「次へ」ボタンの `aria-label` は「前のスライド」「次のスライド」です（`project-slideshow.tsx:123-124`）。
- **問題**: 音声操作で画面に見えている文字を言っても操作できず、読み上げ内容も表示と食い違います。
- **改善案**: アクセシブルネームに表示文字を含めます（`aria-label` を外す、または「前へ（前のスライド）」とする）。ほかの `aria-label` 付き要素も同じ基準で確認します。
- **完了条件**: 「表示文字がアクセシブルネームに含まれること」を確かめるテストを先に追加する。

#### C2. 英語の語句に `lang="en"` を付ける（WCAG 3.1.2、レベルAA）〔P1 / S〕

- **現状**: `html lang="ja"` のページで、「Selected Work」「Featured project」「Learning collection」「SCROLL TO EXPLORE」などの英語の語句に言語が指定されていません（`lang="en"` は0件）。
- **改善案**: `SectionHeader` の `english`（`components/ui/primitives.tsx:11`）など、英語の語句を出す箇所を `<span lang="en">` で囲みます。固有名詞と技術用語は対象外です。

#### C3. 新しいタブで開くリンクを事前に知らせる〔P2 / S〕

- **現状**: `components/ui/site-link.tsx:9` は外部リンクをすべて新しいタブで開きますが、それを示すのは `aria-hidden` の「↗」だけです。
- **改善案**: `SiteLink` の外部リンクに、視覚的には隠したテキスト「（新しいタブで開きます）」を付けます（既存の `.study-toggle-context` と同じ手法）。

#### C4. ギャラリー操作時に状態を通知する〔P2 / S〕

- **現状**: 手動で前後に移動しても、現在のスライド名と位置が支援技術に伝わりません。
- **改善案**: 自動送りを止めている間だけ、`aria-live="polite"` で「タイトル N / M」を通知します（WAI-ARIA APG のカルーセルの指針）。

#### C5. 文字サイズの下限を決める〔P2 / S〕

- **現状**: `app/home.css` で、技術バッジ（97行、.7rem＝11.2px）、「SCROLL TO EXPLORE」（41行、.7rem）、立体図のキャプション（71行、.65rem）など、内容を持つ文字に 12px 未満が指定されています。
- **改善案**: 内容や操作を担う文字は .75rem 以上にそろえます。`aria-hidden` の装飾ラベルは対象外です。

#### C6. 支援技術と強制カラーで実機確認する〔P3 / M〕

- **現状**: スクリーンリーダーと実機ではまだ確認していません。`forced-colors` と `@media print` の指定は0件です。
- **改善案**: VoiceOver（macOS・iOS）と NVDA で主要な導線を確認するチェックリストを作ります。強制カラーモードで立体図・バッジ・フォーカスを判別できるか確認し、必要なら `@media (forced-colors: active)` を追加します。axe の `target-size` ルール（WCAG 2.2）も E2E の対象タグに含めます。

### D. SEO・共有

#### D1. 構造化データ（JSON-LD）〔P2 / S〜M〕

- **現状**: `application/ld+json` は0件です。
- **改善案**: Home とプロフィールに `Person`（`sameAs` に GitHub・X・LeetCode）と `WebSite` を、詳細に `BreadcrumbList` を出力します。JSON-LD は実行されないデータブロックなので、現行の CSP には影響しません。本番 URL（`SITE_URL`）があるときだけ、絶対 URL で出力します。

#### D2. Xカードを大判にする〔P1 / S〕

- **現状**: 自動生成される `twitter:card` が `summary` です。
- **改善案**: `lib/metadata.ts` に `twitter: { card: "summary_large_image" }` を追加し、`__tests__/seo.test.ts` で確認します。

#### D3. OG 画像を現行デザインにする〔P2 / S〜M〕

- **現状**: `scripts/generate-og.ts` は刷新前の配色（`#F7F7F2`、`#2457C5`、`#191C20`）のままで、現行のトークン（`#f7f8fa`、`#234bdb`、`#20242c`）やロゴと一致していません。文字は実行環境の `sans-serif` に依存します。
- **改善案**: 現行のトークン・ロゴ・同梱フォントで作り直します。詳細ページ別の OG 画像は、`opengraph-image` のビルド時生成が静的出力で使えるかを先に検証してから導入します。

#### D4. 詳細の更新日をデータ化し sitemap に反映する〔P2 / S〕

- **現状**: `app/projects/[slug]/page.tsx:45` で、4詳細すべてに「2026年10月2日」を固定で表示しています。`app/sitemap.ts` には `lastModified` がありません。
- **改善案**: レジストリ（A1）に `updatedAt` を持たせ、表示と sitemap の `lastModified` の両方に使います。

### E. セキュリティ

#### E1. CSP の `'unsafe-inline'` を縮小する〔P3 / M〜L・要判断〕

- **現状**: 静的出力では nonce を使えないため、`script-src 'unsafe-inline'` を許可しています（README・`vercel.json`）。Markdown は `rehype-raw` を使わず HTML を無効化しており、利用者の入力もないため、現時点の XSS リスクは低いです。
- **改善案**: build の後、各 HTML のインラインスクリプトの SHA-256 を計算し、ハッシュを入れた `<meta http-equiv="Content-Security-Policy">` を `<head>` の先頭に挿入します。ヘッダーの CSP と併用すると両方の条件を満たす必要があるため、`'unsafe-inline'` は実質的に無効になります。`frame-ancestors` などはヘッダー側に残します。
- **判断事項**: 生成処理を保守するコストに見合うか。導入する場合は、`e2e/security-headers.spec.ts` に CSP 違反0件の確認を追加します。

#### E2. 依存の自動更新と脆弱性検査〔P1 / S〕

- **現状**: SHA で固定したアクションと固定バージョンの依存を手動で更新しています（例: `622d3d5 fix(deps): patch next, …`）。Dependabot・Renovate の設定はありません。
- **改善案**: `.github/dependabot.yml` で `github-actions` と `bun` を週次更新にします（Next.js と React はグループ化）。CI に `bun audit` を追加します。

### F. テスト・CI

#### F1. 生成物の同期チェック〔P2 / S〕

- **現状**: `bun run build` が追跡対象の `app/fonts.css` を再生成するため、コミット済みの内容と食い違っていても CI は通ります（履歴に `chore(fonts): regenerate …` が複数回あります）。
- **改善案**: CI の build の後に `git diff --exit-code` を実行し、生成物の更新漏れを失敗として扱います。

#### F2. `next-env.d.ts` を追跡対象から外す〔P1 / S〕

- **現状**: このファイルは追跡対象で、dev と build のたびに内容が変わるため、更新コミットが5回以上あります。Next.js 16 の同梱ドキュメントは、`.gitignore` に追加して追跡を外すよう勧めています（`node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md` 120行）。
- **改善案**: `.gitignore` に追加し、`git rm --cached` を実行します。型検査では `next typegen` がこのファイルを生成するため、CI には影響しません。

#### F3. CI の重複実行をなくし、キャッシュを使う〔P3 / S〕

- **現状**: `push`（全ブランチ）と `pull_request` の両方で起動するため、PR のブランチでは同じ検証が2回走ります。依存と Playwright ブラウザのキャッシュはありません。
- **改善案**: `push` を `main`・`dev` に限定します。Bun のパッケージキャッシュ（`bun pm cache` で場所を確認できるディレクトリ）と Playwright ブラウザを、lockfile とバージョンをキーにキャッシュします。

#### F4. 単体テストを壊れにくくする〔P3 / M・要判断〕

- **現状**: 単体テストは、`renderToStaticMarkup` の HTML 文字列に対する `toContain` が中心で、クラス名の並び順まで検査しています（例: `class="container detail-page multi-vendor-detail-page"`）。`__tests__/refinement.test.tsx` は14コミットで変更されています。クライアント部品のロジック（ギャラリーの位置計算など）には単体テストがありません。
- **改善案**: HTML を DOM として解析し、ロール・ラベル・属性で検査する補助関数へ移行します（DOM 実装の追加は依存の追加になるため、要判断）。ギャラリーのインデックス計算などは純粋関数に切り出して単体テストを付けます。

#### F5. モバイル端末相当の E2E〔P3 / S〜M〕

- **現状**: Playwright のプロジェクトはデスクトップの3種類だけです（狭い幅はビューポートの変更で確認しています）。
- **改善案**: タッチ操作と高 DPR を含むモバイル端末のプロファイルを1つ追加します。対象はメニュー・ギャラリー・目次のスモークテストに絞り、実行時間を抑えます。

#### F6. 外部リンクを定期的に監視する〔P2 / S〜M・要判断〕

- **現状**: 公開 URL 9件（`data/presentation.ts`）や、GitHub・プロフィールの外部リンクが生きているかは検査していません（E2E が見るのは内部リンクだけです）。
- **改善案**: 週次の `schedule` ワークフローで外部リンクを確認し、失敗したら Issue を作ります。外部の要因で不安定になるため、PR の必須チェックにはしません。

### G. ドキュメント・開発運用

#### G1. 古くなったドキュメントの更新と再編〔P2 / M〕

- **現状**:
  - README が「詳細4ページ」「単体34件成功」（3・7行）、「GitHub Actions上の実行結果はまだありません」（115行）のままです。実際にはプロフィールページがあり、単体テストは17ファイル・約60件あります。
  - `docs/current-specification.md:7` のページ一覧にプロフィールが含まれていません。
  - `docs/phase-4-handoff.md:50` の未提供公開 URL に、2026-10-18 に提供済みの R08・R09 が残っています。
  - README・prompt・現行仕様・引き継ぎ・デザイン更新記録が、それぞれ「このセッションの検証結果」を持っていて、更新漏れが起きやすい構造です。
- **問題**: このリポジトリでは AI エージェントが仕様書を読んで作業するため、古い記述が誤った実装の原因になります。
- **改善案**: README は手順や構成など変わりにくい情報に限ります。件数や日付を含む検証結果は1か所（例: `docs/verification-log.md`）にまとめます。Phase 0〜4 とレビューの文書は、`docs/archive/` へ移すか、冒頭で履歴であることを明示します。

#### G2. スキル定義を現行仕様に合わせる〔P1 / S〕

- **現状**: `.claude/skills/portfolio-project-detail/SKILL.md` は、「節ごとに最大3件のリポジトリリンク」「固定コミットへのリンクを優先」（31-32行）、「`public/images/<slug>/` に配置」（14行）と指示しています。一方、現行仕様は詳細ページの GitHub リンクをすべて非表示にしており、画像ディレクトリ名も slug と一致しません。
- **問題**: スキルに従ったエージェントが、削除済みの GitHub リンクを再び追加するおそれがあります。
- **改善案**: スキルと `references/detail-page-pattern.md` を、現行仕様（Markdown 本文、Mermaid SVG、GitHub リンク非表示、実際のディレクトリ規則）に合わせて更新します。

#### G3. Node.js 24 LTS へ移行する〔P2 / S〜M〕

- **現状**: Node.js 22.23.2 に固定しています（`package.json` の engines、`.node-version`、CI、README）。Node.js 22 はメンテナンス LTS の段階で、2027-04-30 にサポートが終了します。
- **改善案**: 2027年の初めまでに Node.js 24 LTS へ移行します。engines・`.node-version`・CI・Vercel の設定・`@types/node` は同時に更新します。

#### G4. パッチ・マイナー更新〔P1 / S〕

- **現状**（2026-10-18 時点の `bun outdated`）:

  | パッケージ | 現在 | 最新 |
  | --- | --- | --- |
  | next / eslint-config-next | 16.3.8 | 16.4.2 |
  | react / react-dom | 19.3.0 | 19.3.1 |
  | @playwright/test | 1.63.0 | 1.64.1 |
  | vitest | 5.0.1 | 5.0.5 |
  | mermaid | 12.1.0 | 12.2.0 |
  | @axe-core/playwright | 4.13.0 | 4.14.0 |
  | @fontsource/noto-sans-jp | 5.3.0 | 5.3.1 |

- **改善案**: 変更履歴を確認してから更新します。Next.js は同梱ドキュメントの差分も確認します。Playwright を更新したらブラウザを取り直し、mermaid を更新したら図の SVG を再生成して差分を確認します。`overrides` の `source-map-js` がまだ必要かも確認します。

#### G5. TypeScript 7・ESLint 10 を評価する〔P3 / M〕

- **現状**: TypeScript は 5.9.3（最新は 7.0.2）、ESLint は 9.39.5（最新は 10.13.0）です。
- **改善案**: 別ブランチで、Next.js の TypeScript プラグインや `eslint-config-next` と互換性があるかを確かめてから移行します。`@types/node` は実行環境のメジャーバージョン（G3）に合わせます。

#### G6. 非nullアサーション（`!`）を除去する〔P1 / S〕

- **現状**: ESLint の実行時に出る「TSNonNullExpression could not be resolved」というメッセージ2件は、`components/projects/multi-vendor-detail.tsx:44` の `key`・`id` 属性（`multiVendorDetailSections[index + 1]!.id`）が原因です。また、`href={demoUrls[…]!}` が4ファイルにあります（`app/projects/[slug]/page.tsx:47`、`components/projects/project-card.tsx:20`、`components/studies/study-card.tsx:25`、`components/projects/secondary-project-card.tsx:21`）。
- **改善案**: 先にローカル変数で値を絞り込み（例: `const demoUrl = demoUrls[id];`）、その変数を使って描画します。`multi-vendor-detail.tsx` の分は A2 でファイルごと解消されますが、P1 として先に局所的に直してもかまいません。

### H. UX

#### H1. テーマを「OSに従う」へ戻せるようにする〔P3 / S〜M・仕様変更〕

- **現状**: 一度ライトかダークを選ぶと、OS の設定に従う状態へ戻す操作がありません（現行仕様に明記）。
- **改善案**: ライト／ダーク／自動の3状態にするか、保存値を消す操作を追加します。現行仕様のテーマ節の更新が必要です。

#### H2. ナビゲーションの小改善〔P3 / S〕

- **現状**: モバイルメニュー（`components/layout/mobile-menu.tsx`）は、リンクを押すか Esc を押したときしか閉じません。ヘッダーのナビゲーションには現在地の表示（`aria-current`）がありません（例: `/profile/` を表示中）。
- **改善案**: メニューの外側をタップしたときやフォーカスが外れたときにも閉じるようにします。プロフィールページの表示中は、該当するリンクに `aria-current="page"` と現在地のスタイルを付けます。

#### H3. 印刷用スタイル〔P3 / S〜M〕

- **現状**: `@media print` がありません。採用担当者が印刷したり PDF に保存したりすると、ヘッダー・操作ボタン・ギャラリーがそのまま出力されます。
- **改善案**: 印刷時はナビゲーションと操作部品を隠し、`details` の本文を展開し、リンク先 URL を併記します。

### I. コンテンツ（オーナーの提供・判断が必要）

推測では補わず、提供された事実だけを反映します。

| 項目 | 状態・確認事項 |
| --- | --- |
| 未提供の公開 URL | R01（Multi-Vendor-E-Commerce）、R02（The Wild Oasis 管理）、R04（AirbnbCloneApp）、R12（Medical-Studies）。公開してよいか、認証が必要な場合のデモ方針 |
| プロフィール | 肩書き、経歴、担当範囲、連絡手段（メール・LinkedIn など） |
| 資格 | 取得年月を掲載するか |
| 本番の公開先 | `SITE_URL`（独自ドメイン）と公開時期。D1・D3・B3・HSTS の前提になる |
| 英語版 | 海外の採用担当者向けに必要か（必要なら別計画で扱う） |

## 5. 実施ロードマップ

| フェーズ | 目的 | 対象と順序 |
| --- | --- | --- |
| 1. すぐ直す（目安2〜3日） | 欠陥・規約違反・公式の非推奨を解消 | C1、C2、A4、G2、G6、B5、B6、D2、F2、E2、G4 |
| 2. 構造を整理する | 追加・変更のコストを下げ、文書の誤りをなくす | A3（判断）→ A1 → A2 → D4、F1、G1、G3 |
| 3. 測って最適化する | 性能と発見性を数値で改善する | B4（判断）→ B1 → B3、B2、C3、C4、C5、D1、D3、F6 |
| 4. 継続して改善する | 長期的な保守性と品質 | A5〜A8、C6、E1、F3〜F5、G5、H1〜H3 |

- **依存関係**: A1 は A3 の判断の後に行います。A2・D4 は A1 の後です。B1 は B4 の計測の後です。G5 は G3・G4 の後です。
- **期限があるもの**: G3（Node.js 22 のサポートは 2027-04-30 に終了）は、遅くともフェーズ3と並行して進めます。
- **進め方**: 各項目は Red（失敗テストのコミット）→ Green（実装のコミット）→ Refactor（整理と文書同期のコミット）で進めます。フェーズが終わるたびに README と現行仕様を同期します。

### 進捗（2026-10-19）

フェーズ1の11項目は対応済みです（C1・C2 は計画作成時点で対応済み）。全項目で型・Lint・単体（72件）・build・E2E（3ブラウザ232件）が通過しています。

| ID | 結果 |
| --- | --- |
| A4 | 節定義を `data/project-documentation.ts` に集約し、slug ごとに描画される節だけを Home 導線の許可先にした |
| G2 | スキルと参照文書を、Markdown 本文・Mermaid SVG・GitHub リンク非表示・実ディレクトリ規則に更新 |
| G6 | `demoUrls` と Multi Vendor の節の `!` を除去。jsx-ast-utils のメッセージは0件 |
| B5 | 原本を `assets/brand/` へ移動。生成物は変更前と同一 |
| B6 | 先頭スライドを `loading="eager"`・`fetchPriority="high"` に変更。`images.unoptimized` を設定に追加。各 `Image` の `unoptimized` は、単体テストの描画が `next.config` を読まないため残す |
| D2 | `twitter` の card・title・description・images を明示。画像がない preview は `summary` |
| F2 | `.gitignore` へ追加し追跡を解除 |
| E2 | Dependabot（bun・github-actions、週次）と CI の `bun audit` を追加。braces（GHSA-vfj7-8cjw-p6xm）は修正版がなく lint 時の開発依存のみのため個別に除外。依存側の修正版が出たら除外を外す |
| G4 | 表の7系統を更新。mermaid 更新で katex の勧告が解消。`source-map-js` の override は、依存側の範囲が `^1.2.1` のため下限として維持。図の再生成は内部 ID の連番だけが変わったため採用せず |

対応中に見つかった事項:

- axe 4.14 で `label-content-name-mismatch` が既定で有効になった。NFKD 正規化と単語分割で照合するため、「ダークモード」が1語と見なされ、`aria-hidden` の「Ⅱ」も表示文字に数えられる。テーマ切替の aria-label と立体図の記号を変更し、単体テストに同じ照合を追加した。
- React 19 は SSR 時に lazy でない `<img>` を自動で preload するため、詳細ページでは Mermaid の SVG 3枚も `<link rel="preload">` されている。B4 の計測対象に加える。

### 進捗（2026-10-19、フェーズ2）

フェーズ2の7項目は対応済みです。A3 はオーナーの判断で (a) 廃止としました。検証結果は [検証記録](verification-log.md) にあります。

| ID | 結果 |
| --- | --- |
| F1 | CI の build の後に `git diff --exit-code` と未追跡ファイルの確認を追加。A3 で `app/fonts.css` の再生成が必要になり、この確認の対象になることを実際に確かめた |
| A3 | `project-details.ts`・`limitations.ts`・`feature-guides.ts`・`FeatureStory`・slug を渡すだけのラッパー3件・関連テストと、未使用の CSS 約160ルールを削除。未使用クラスの検出を単体テスト（`__tests__/css-usage.test.ts`）にした。単語単位の照合のため、識別子と同じ名前のクラス（例: `.claim`）は検出できない |
| A1 | `data/project-documentation.ts` を4件のレジストリにし、`sections`・`pageClassName`・`updatedAt` を持たせた。page.tsx から slug の比較を除去。ギャラリーは Client Component で、build 時の内容検査を React に依存させないため、`components/projects/detail-galleries.tsx` で対応付ける |
| A2 | `multi-vendor-detail.tsx` と `commerce-*` の CSS を削除。Multi Vendor の `<main>` の HTML は、図のクラス名を除いて変更前と同一 |
| D4 | `updatedAt` を画面の更新日と sitemap の `lastModified` に使用。Home とプロフィールは日付を推測せず出力しない |
| G1 | README から件数・日付を除き、検証結果を `docs/verification-log.md` に集約。現行仕様のページ一覧と描画方式、引き継ぎの未提供 URL、スキルを更新。Phase 0〜3 とレビューの文書は冒頭に履歴の注記が既にあるため移動しない |
| G3 | engines・`.node-version`・CI を Node.js 24.21.0、`@types/node` を 24 に更新。Node.js 24 で型・単体・build を確認。**Vercel のプロジェクト設定（Node.js Version）を 24.x に切り替える作業は手動で残っている** |

### 進捗（2026-10-19、フェーズ3）

フェーズ3の10項目に対応しました。B1 は計測の後、オーナーの判断で「使用文字だけ＋ウェイト削減」（案2＋3）を採用しました。

| ID | 結果 |
| --- | --- |
| B3 | 本番（`https://myoshi2891-portfolio.vercel.app/`）を実測。末尾スラッシュなしの URL は Vercel がすでに308で転送するため、`trailingSlash` は不要。フォントは URL にバージョンがないため、毎回再検証（`max-age=0, must-revalidate`）を明示した。画像は1日（`max-age=86400`）。`/_next/static` は Vercel の既定で `immutable` |
| B2 | `@import "tailwindcss" source(none);` にした。`@layer utilities` が空になり、テーマ変数は維持。共通 CSS は約3.2KB 減少 |
| C3 | 外部リンクに、視覚的に隠した「（新しいタブで開きます）」を付けた。`aria-label` を持つリンクは、その末尾に同じ文言を付ける（隠しテキストは読まれず、label-in-name の照合も崩すため） |
| C4 | キャプションを `aria-live` の領域にし、自動送り中は `off`、操作中・一時停止中・reduced-motion のときは `polite` にした。WebKit はクリックでボタンにフォーカスしないため、手動の前後移動も操作中として扱う |
| C5 | 内容を担う13ルールを .75rem に引き上げた。`aria-hidden` の装飾は対象外。単体テストで下限を検査する |
| D1 | `SITE_URL` があるときだけ、WebSite・Person・BreadcrumbList の JSON-LD を出力。本番相当の build で、出力が JSON として正しいことを確認した |
| D3 | OG 画像を Playwright Chromium で生成するようにし、現行のトークン・ロゴ・同梱 Inter を使った。画素と生成スクリプトを単体テストで確認する |
| F6 | `scripts/check-external-links.ts` で、build 後の HTML に含まれる外部リンク（現在26件）を確認する。週次のワークフローが失敗時に Issue を作成し、既存の Issue があればコメントする。401・403・429 は「自動確認不可」として失敗にしない |
| B1 | `subset-font` で、分割前の TTF（`@expo-google-fonts/noto-sans-jp`）から使用文字（824字）だけの WOFF2 を 400・600 の各1ファイル（計約328KB）生成。`@fontsource/noto-sans-jp` と372ファイルを削除。CSS の 500 は、ラベル・強調を 600、本文に近いもの（text-link、profile-name）を 400 にし、Inter も 400・600 にそろえた。出力は決定論的で、build 後の差分は0件 |
| B4 | `@lhci/cli` 0.15.1 は依存に修正版のない high の勧告5件を持ち込むため採用せず、`lighthouse` 13.5.0 と Playwright Chromium で、Lighthouse CI 互換の `lighthouserc.json` を評価するスクリプトを作った。CI で予算を検査し、レポートを artifact に保存する |

B4 のベースライン（モバイルのシミュレーション、3回の中央値、preview build）:

| ページ | Performance | LCP | 転送量 | Noto Sans JP |
| --- | --- | --- | --- | --- |
| Home | 69〜70 | 7.0〜7.3秒 | 1.69MB | 62ファイル・720KB |
| プロフィール | 79〜80 | 4.8〜5.0秒 | 1.47MB | 43ファイル・520KB |
| Multi Vendor 詳細 | 79〜81 | 5.0〜5.3秒 | 2.24MB | 84ファイル・970KB |

Accessibility・Best Practices・SEO は全ページ100（preview の noindex による `is-crawlable` は除外）。予算は回帰を防ぐための値（Performance 0.6 以上、LCP 8秒以下、転送量 2.5MB 以下、CLS 0.1 以下）としました。

B1 の前後比較（同じマシン・同じ条件で再計測、3回の中央値）:

| ページ | 変更前 Perf／LCP／転送量 | 変更後 Perf／LCP／転送量 |
| --- | --- | --- |
| Home | 75／6.1秒／1.69MB | 68／7.3秒／1.22MB |
| プロフィール | 80／5.0秒／1.47MB | 74／5.6秒／1.20MB |
| Multi Vendor 詳細 | 75／6.7秒／2.24MB | 70〜71／6.5〜6.8秒／1.51MB |

- フォントのリクエストは Home で62件から2件になり、転送量は2〜3割減りました。1ファイルを全ページで共有するため、2ページ目以降はフォントを再取得しません。
- Lighthouse の LCP は Home とプロフィールで悪化しました。LCP 要素は冒頭の説明文（プロフィールは肖像画）で、そのページに必要な文字を含む164KB のファイル2件が届くまでの時間が、シミュレーションの LCP に加わるためです。旧スライス方式では、冒頭の文字を含む小さいファイルだけが先に届いていました。参考として、各ウェイトを4分割した版は Home 69／7.0秒、Noto Sans JP を読み込まない版は Home 79／5.3秒でした。この環境では TBT が30〜840ms の範囲でぶれるため、1秒未満の差は誤差の可能性があります。
- 予算は転送量を 2.0MB に引き締めました（旧スライス方式の 2.24MB に戻ると失敗します）。Performance と LCP は、Home が予算に近くばらつきも大きいため据え置きます。
- 据え置いた LCP 予算（8秒）は、GitHub Actions で Multi Vendor の中央値が 8.05秒となり超過しました。シミュレーションの LCP は同じページでも6.5〜7.9秒とぶれるため、LCP 予算を9秒に変更し、5回の中央値で判定します。テキストの LCP を待たせるフォント（2件で約320KB）を小さくする対策は、別タスクで検討します。

### 進捗（2026-10-19、フェーズ4）

| ID | 結果 |
| --- | --- |
| A7 | `StudySummary` と `DocumentedProjectDetail` が読み込んだ結果を `MarkdownDocumentContent` に `loaded` として渡す。`comparison-of-llms` の読み込みは24回から4回（Markdown 1件＋SVG 3件）になった。React の `cache()` は単体テストの描画（`renderToStaticMarkup`）では効かないため使わない。生成 HTML は Build ID を除いて変更前と同一 |
| F3 | `push` を `main`・`dev` に限定（PR のブランチは `pull_request` で1回だけ検証）。`actions/cache` v6.1.0 で、Bun のパッケージキャッシュ（ランナーのホームの `.bun/install/cache`、キーは `bun.lock` のハッシュ）と Playwright のブラウザ（同じく `.cache/ms-playwright`、キーは Playwright のバージョン）を保存する。ブラウザのキャッシュがあるときは `install-deps` で OS のライブラリだけを入れる。効果は GitHub Actions 上の2回目以降の実行で確認する |
| H2 | ヘッダーとモバイルメニューの項目を `data/site.ts` の `navigation` にまとめ、`PrimaryNavLinks` で描画する（A6 のナビゲーション項目の集約のうち、フッター以外）。表示中のページへのリンクに `aria-current="page"` と現在地のスタイルを付ける。モバイルメニューは、メニュー外の `pointerdown` と `focusin` でも閉じる。WebKit はクリックしたリンクにフォーカスしないため、`blur` では判定しない。E2E は3ブラウザで247件が通過 |
| F5 | Playwright に `mobile-chromium`（`Pixel 7`: タッチ・DPR 2.625）を追加。`e2e/mobile-device.spec.ts` のスモークテスト3件（メニュー、ギャラリーの一時停止と送り、目次への移動）だけを `tap()` で実行し、デスクトップの3ブラウザからは除外する。5回の繰り返しで15件とも通過 |
| A5 | スライド定義を `data/galleries.ts`（`satisfies Record<FeaturedSlug, ProjectGallery>`）に移し、slug を渡すだけのラッパー4件と `detail-galleries.tsx` を削除。URL は `lib/image-path.ts` の `publicImagePath` で区切りごとにエンコードし、`ScreenPreview` と共通にした。Wild Oasis 管理の画像 URL は `The%20Wild%20Oasis%20Admin` になる。全スライドのファイルの存在を単体テストで確認する。ディレクトリ名の kebab-case 化は任意のため行わない |
| A6 | Home の8節を `components/home/home-sections.tsx` に分け、`app/page.tsx` は節を並べるだけにした。ヘッダーとフッターの JSX を要素ごとに改行し、フッターの項目を `data/site.ts` の `footerNavigation` にまとめた（ヘッダーは H2 で対応済み）。全ページの DOM は、`<script>` とアセットのハッシュを除いて変更前と同一 |
| H3 | `@media print` を追加。ライトの配色にそろえ、ナビゲーション・操作部品・Hero の装飾・目次を隠し、外部リンクの URL を併記する。閉じた `details` は `::details-content` で表示し、`open` は変えない（`toggle` で開閉状態を保存する NavigationController に影響させないため）。3ブラウザの E2E（`e2e/print.spec.ts`）と、Chromium で出力した PDF を目視で確認した。PDF で見つかった、カードの枠だけが前ページに残る問題と、塗りつぶしボタンの文字が背景なしで読めない問題も直した |
| A8 | 要検証としていた ID のずれは実際に起きていた。初回の読み込み時にはテーマ切替が `<span>` で連番の対象外だったが、SPA で移動して戻ると `<button>` として数えられ、後ろの ID が1つずつずれていた（例: `return-22` → `return-23`）。そのため履歴で別の要素にフォーカスが戻っていた。ID を要素の種類・`href`・名前のハッシュから作る `returnIds` に変え、ハッシュの解決と同一ページ判定とともに `lib/navigation-ids.ts` へ切り出して単体テストを付けた。再現の E2E は `e2e/navigation-return-ids.spec.ts`。状態遷移と不変条件は [設計メモ](navigation-controller.md) にまとめた。全面的な書き換えはしていない |

対応中に見つかった事項:

- `e2e/navigation.spec.ts` の「actual Chromium BFCache restores …」は、全体を並列で実行すると時々失敗する（A6 の前のコミットでも再現し、単独では6回とも通過）。BFCache からの復元が負荷によって行われないためと考えられる。CI では retries 1回で吸収されているが、継続して失敗するならテストを直列にする。
- `scripts/prepare-fonts.ts` は `app`・`components`・`data` のソースをコメントも含めて走査し、フォントに入れる文字を決める。これらのディレクトリのコメントに新しい日本語を書くとフォントが再生成され、F1 の同期チェックの対象になる。既存のコメントにならい英語で書く。

## 6. 要判断事項

| ID | 判断すること | 推奨 |
| --- | --- | --- |
| A3 | 詳細ページの旧「主張＋証拠」モデルを廃止するか、監査用に残すか | **決定（2026-10-19）**: 廃止。Home の証拠検査は維持 |
| B1 | 日本語フォントを OS に任せるか、使用文字だけの Web フォントにするか | **決定（2026-10-19）**: 使用文字だけのフォント＋ウェイト削減（400・600）。Lighthouse の LCP の悪化は、転送量の削減とページ間のキャッシュ共有を優先して許容 |
| B4 | Lighthouse CI・Speed Insights を追加するか（外部依存） | **決定（2026-10-19）**: Lighthouse を CI に追加。`@lhci/cli` ではなく `lighthouse` 本体を使用 |
| E1 | ハッシュ方式の CSP を導入するか | フェーズ4で費用対効果を評価する |
| F4 | テスト用の DOM 実装を追加するか（外部依存） | 補助関数で済むなら追加しない |
| F6 | 外部リンク監視のアクションを追加するか（外部依存） | **決定（2026-10-19）**: 依存を追加せず、自前のスクリプトを週次で実行 |
| H1 | テーマを3状態にする仕様変更を行うか | 要望があれば行う |

## 7. 共通の検証手順

```sh
bun run typecheck
bun run lint
bun run test
bun run build
bun run test:e2e
```

- 性能に関わる変更は、Lighthouse（B4）と DevTools のネットワーク計測で、変更前後のフォント・画像のリクエスト数と転送量を記録します。
- アクセシビリティに関わる変更は、E2E の axe に加え、該当箇所をキーボードとスクリーンリーダーで確認します。
- SEO に関わる変更は、ビルドした HTML の `<head>` と JSON-LD を確認します（本番 URL がある場合はリッチリザルトテストも使います）。
- コミットの前に、[パス記載ルール](../.claude/rules/no-absolute-paths.md) の差分検査を実行します。

## 付録: 計測値（2026-10-18、`out/`）

| 対象 | 値 |
| --- | --- |
| Home が読み込む JS | 9チャンク、合計約603KB（gzip -9 で約187KB）。アプリ固有のチャンクは約33KB（同 約12KB） |
| 共通 CSS | 91.7KB（gzip 13.0KB、`fonts.css` を含む）＋ Home 専用 18.7KB（gzip 4.1KB） |
| HTML | Home 138KB（gzip 22KB）、Multi Vendor 詳細 76KB（同 19KB）、プロフィール 32KB（同 7KB） |
| Noto Sans JP | 配置372ファイル（8.8MB）、`@font-face` 171件。参照されうるファイルの上限推定は、Home 96件（約1.0MB）、プロフィール 75件（約0.8MB）、Multi Vendor 詳細 123件（約1.4MB） |
| 公開画像 | `public/images/` 6.3MB（ブランド原本 JPEG 981KB を含む） |
| テスト | 単体 17ファイル・約60件、E2E 12ファイル・49件 × 3ブラウザ |
| 静的解析 | `tsc` エラー0件、ESLint 終了コード0（jsx-ast-utils のメッセージ2件、G6） |
