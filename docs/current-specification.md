# 現行仕様 — 2026年10月2日

この文書は、このセッションで確定したポートフォリオの表示・編集・検証仕様をまとめます。Phase 0のリポジトリ監査は2026年9月16日の記録として保持し、紹介対象アプリの再監査・テスト再実行とは区別します。旧Phase文書の設計案と食い違う場合は、この現行仕様を優先します。

## ページと情報源

Home、代表的な制作4詳細、404を維持します。掲載分類はFeatured 4件、Studies 6件、Secondary 3件。static export、末尾スラッシュ、SPA内部遷移、パンくず、現在節の目次、履歴復元、公開URL7件の管理を維持します。

Homeの説明・技術タグ・掲載順は既存のTypeScriptデータと証拠で管理します。詳細の説明は以下の資料を読み、画面向けに編集したMarkdownをServer Componentsで描画します。資料をそのまま自動同期する仕組みではなく、資料更新時は編集本文も見直します。

| 詳細slug | 基準資料（`docs/PROJECT-DETAILS/`） | 表示用本文 | 描画 |
|---|---|---|---|
| `multi-vendor-e-commerce` | `PROJECT_DOCUMENTATION-Multi-Vendor-E-Commerce.md` | `data/multi-vendor-detail.md` | `MultiVendorDetail` |
| `comparison-of-llms` | `PROJECT_DETAILS-LLM-Studies.md` | `data/llm-studies-detail.md` | `DocumentedProjectDetail` |
| `medical-studies` | `project-overview-medical-studies.md` | `data/medical-studies-detail.md` | `DocumentedProjectDetail` |
| `the-wild-oasis-for-admin` | `technical-documentation-The-Wild-Oasis.md` | `data/wild-oasis-detail.md` | `DocumentedProjectDetail` |

共通レンダラーの対応表は`data/project-documentation.ts`。各詳細コンポーネントはslugを渡すラッパーです。Multi Vendorは注文・決済の独立節を持つため専用レンダラーを使用します。`data/project-details.ts`・`data/feature-guides.ts`に残る旧データを編集しても、現在の4詳細本文には反映されません。既存データの整合性検査は維持します。

| 対象 | 目次・節ID（表示順） |
|---|---|
| Multi Vendor | `overview` → `features` → `orders` → `architecture` → `decisions` → `quality` → `documentation` |
| その他3詳細 | `overview` → `features` → `architecture` → `decisions` → `quality` → `documentation` |

概要には用途・Repository名・技術タグ・画面の最終更新日（2026年10月2日）を表示し、提供済みの公開URLだけCTAを表示します。本文は主要機能、処理の流れ、技術の責務、構成と制約、品質と継続課題、説明の基準を具体的に説明します。担当範囲・制作背景を推測で補いません。

資料の調査日とテスト統計日を区別します。Multi Vendorの資料は9月18日、品質統計は9月4日、coverageは9月3日。LLM・Medical・Wild Oasisの資料基準は9月18日です。資料内の件数はその時点の記録であり、ポートフォリオで再実行した結果や現在の外部サービスの保証として表示しません。採用理由が資料にない場合は構造と制約を説明します。

## GitHubリンクの表示範囲

| 表示先 | 現行仕様 |
|---|---|
| 代表作4詳細 | GitHubへのリンクをすべて非表示。概要CTA、本文のコード参照・行番号リンク、対象コミット欄、末尾プロフィール導線を削除 |
| `/projects/`配下の共通ヘッダー | `HeaderGithubLink`がpathnameを判定しGitHubリンクを描画しない。未知projectの404でも同じ |
| Home | ヘッダー、Hero、制作・学習カード、末尾のGitHub導線を維持 |
| 証拠データ・内部監査文書 | 固定SHAと証拠リンクを保持。削除したのは詳細画面上の導線 |

コード更新で参照内容が画面の説明とずれる問題を避け、詳細は資料に基づく説明として完結させます。「説明の基準」では資料名と対象時点を示し、GitHubのソース参照欄へ戻しません。HomeのGitHub導線は今回の削除範囲に含めません。

## MarkdownとMermaid

- 本文は`react-markdown`と`remark-gfm`で描画。表はMarkdownのGFMテーブル、フローチャート・シーケンス図はMermaid。ASCII図解は禁止。
- 各詳細に3図、合計12図。Mermaidは開発依存であり、ブラウザ表示時にMermaidランタイムを読み込みません。
- `scripts/prepare-commerce-diagrams.ts`がローカルMermaidとPlaywright ChromiumでSVGを生成。strict、neutral、HTMLラベルなし、図中文字はすべて`1rem`。
- 図のソースをtrimしSHA-256先頭12桁を使う`diagram-<hash>.svg`に保存。Markdown変更後に生成しないと参照先SVGが存在せず、描画時のファイル読み込みが失敗します。
- 表示幅はSVGのviewBox幅÷16をremで指定し、狭い画面でも図中文字を縮小しません。図専用の横スクロール領域を使い、ページ全体の横スクロールを防ぎます。
- 図のalt・キャプション・スクロール領域の説明を付け、領域はキーボードフォーカス可能。初期HTMLとSVGでJavaScript無効時も図を表示します。

| 対象 | SVG保存先 |
|---|---|
| Multi Vendor | `public/images/multi-vendor-e-commerce/` |
| LLM | `public/images/comparison-of-llms/` |
| Medical | `public/images/Medical-Studies/`（大文字を維持） |
| Wild Oasis管理 | `public/images/the-wild-oasis-for-admin/` |

画像ギャラリーのディレクトリとは異なる場合があります。SVG生成コマンドは通常の`build`に自動では組み込まれていません。

```sh
bunx playwright install chromium
bun run diagrams:generate
bun run diagrams:commerce
# 1プロジェクトだけ更新する場合
bun scripts/prepare-commerce-diagrams.ts medical-studies
```

`diagrams:generate`は全4詳細、`diagrams:commerce`はMulti Vendorのみ。生成SVGは本文と一緒に管理します。不要な旧hash資産は参照がないことを確認して整理します。

## 実画面とギャラリー

PNGの差し替えだけではHomeで優先表示するWebPは更新されません。差し替え後は`bun run images:generate`を実行し、同じファイル名を使う場合は`data/screens.ts`の任意の`revision`も更新します。ScreenPreviewはWebPとPNGのURLへ`?v=<revision>`を付け、古いブラウザーキャッシュの再利用を防ぎます。R01の今回の差し替えは`20261002-2`です。

Homeのプレビューは`data/screens.ts`・`ScreenPreview`で全13リポジトリに対応します。原本PNGを保持し、640／1280／1854の指定幅から生成したWebPを`picture`のsrcsetで選択、PNGをfallbackにします。`withoutEnlargement`のため元画像が指定幅より小さい場合は拡大しません。R01には今回のトップ画像と`r01-*`のWebP3件を追加しました。次の制作でも同じプレビュー定義を使用します。

4詳細は共通`ProjectSlideshow`を使用し、概要の後・目次と本文の前に配置します。

| 詳細 | 枚数 | PNGディレクトリ（`public/images/`） | ギャラリーコンポーネント |
|---|---|---|---|
| Multi Vendor | 10 | `multi-vendor-e-commerce` | `multi-vendor-slideshow.tsx` |
| LLM | 9 | `llm-studies` | `llm-studies-slideshow.tsx` |
| Medical | 11 | `Medical-Studies` | `medical-studies-slideshow.tsx` |
| Wild Oasis管理 | 4 | `The Wild Oasis Admin` | `wild-oasis-slideshow.tsx` |

Medicalのブラウザ風バーには既存の「7 views」表記が残っています。実際の登録・操作カウンターは11枚です。ギャラリーの枚数を確認するときはスライド配列と操作カウンターを基準にします。

### Multi Vendorの画像対応

全10枚を目視確認し、タイムスタンプ名から以下の名前へ変更しました。PNGの内容は変更していません。Homeは先頭のトップ画像を使用します。

| 撮影時刻（2026年10月2日） | 新しいファイル名 | 画面 |
|---|---|---|
| 22.23.27 | `storefront-home-hero.png` | ストアトップ |
| 22.23.44 | `storefront-fortune-section.png` | ブランド紹介・カテゴリ案内 |
| 22.24.08 | `storefront-happiness-section.png` | ブランド紹介 |
| 22.24.22 | `storefront-newsletter-footer.png` | ニュースレターとフッター |
| 22.24.39 | `product-collection.png` | 商品一覧 |
| 22.25.57 | `account-wishlist.png` | お気に入り |
| 22.26.13 | `product-comparison.png` | 商品比較 |
| 22.26.29 | `frequently-asked-questions.png` | FAQ |
| 22.26.45 | `order-tracking.png` | 注文追跡 |
| 22.26.56 | `returns-and-exchange.png` | 返品・交換 |

### ギャラリーの操作契約

前後スライドの端が見える水平移動方式。先頭・末尾クローンでループし、5秒間隔で自動送りします。前へ・次へ・一時停止／再生の操作、タイトル・枚数表示・位置ドットを持ちます。hover・内部フォーカス・非表示タブでは自動送りを抑制し、reduced-motionでは自動送りと移動アニメーションを停止します。手動の前後移動は利用可能です。

初期HTMLには先頭の実画像を含めます。操作ボタンはhydration後に表示し、JavaScript無効時は先頭画像と説明を表示します。全画像の手動閲覧はJavaScript有効時の機能です。現在画像だけに説明altを付け、他スライドとループクローンは読み上げ対象から外します。先頭画像は優先読み込み、他画像は遅延読み込み。ギャラリーは原本PNGを`next/image`の`unoptimized`で表示し、Home用のWebPとは配信方法を分けます。

## 全画面共通のテーマ

| 項目 | 動作 |
|---|---|
| 対象 | Home・全4詳細・404の共通ヘッダー |
| 初期選択 | 有効な保存値があれば優先。未選択時はOSの`prefers-color-scheme`へ追従 |
| 操作 | 切り替え先を「ライト」「ダーク」と表示。動的なaria-label、現在モードのtitle、太陽／月アイコンを付ける |
| 保存 | localStorageの`portfolio-theme`に`light`または`dark`を保存 |
| 適用 | `html[data-theme]`と`color-scheme`、CSS変数・`light-dark()`で全体へ反映 |
| 初期描画 | layoutのhead内インラインスクリプトで保存値を先に適用。`useSyncExternalStore`のSSR時は幅を予約した非表示要素を描画 |
| 遷移・再読み込み | SPA、戻る／進む、直接アクセスとreloadでも選択を維持 |
| OS変更 | 明示選択がない場合のみ見た目が追従 |
| タブ同期 | storageイベントで他タブの選択を反映。保存値の削除・無効値への変更はOS追従へ戻す |
| 保存拒否 | 例外を処理し、そのページでの切り替えを維持。再読み込み後の永続保存は保証しない |
| JavaScript無効 | OSの配色で表示。切り替え操作・保存値の初期適用は動作しない |

実装は`lib/theme.ts`、`components/layout/theme-toggle.tsx`、`app/layout.tsx`、`app/globals.css`。テーマ選択を戻す専用の「自動」ボタンは現時点でありません。CSPをホストへ追加する際は保存値の初期適用に必要なインラインスクリプトも含めて検証します。

## ライトモードの最終デザイン

最終案は白・チャコール・シルバー＋ブルーの一点アクセント。途中で試したアイボリー・インディゴ・ティール・テラコッタの制作別配色、色付きカード・見出し・背景グラデーションは採用しません。本文・制作画像・余白を中心にし、影と罫線で穏やかに階層を付けます。

| トークン | ライト | ダーク |
|---|---|---|
| canvas | `#f7f8fa` | `#0d1420` |
| surface | `#ffffff` | `#151f30` |
| surface-subtle | `#eef0f3` | `#1d2b40` |
| ink | `#20242c` | `#eaf0fa` |
| muted | `#606873` | `#b0bfd5` |
| line | `#dce0e6` | `#384963` |
| accent | `#234bdb` | `#9abbff` |
| accent-hover | `#1638b0` | `#c4d7ff` |
| hero-tint | `#edf1f7` | `#182841` |

ライトの主CTAはチャコール地に白文字、hoverはブルー。見出しはチャコール、本文リンク・現在目次・小さな指標にブルーを使います。白い制作カード、控えめなグレーの補足面、円形の節番号、ニュートラルな表・図の枠を使用します。カードhoverは罫線と影の変化で表現します。

トップのCSS 3Dビジュアルは、ブルーのエナメルを思わせる中央パネル、シルバーの軌道、半透明のニュートラルなノードで構成。10秒周期の光の反射を追加し、右側ノードの配置を調整しました。ヒーローには操作ボタンや作品画像を置かず、画面外・非表示タブで停止、reduced-motionとJavaScript無効時は静止表示します。Mermaidのアプリ処理図と、装飾的なHeroのCSS 3Dは別の役割です。

## 編集と検証

1. 基準資料の更新箇所・日付・制約を読み、対応する`data/*-detail.md`を更新。章数・目次ID・図の説明を揃える。
2. Mermaid変更後は`bun run diagrams:generate`でSVG生成。ギャラリー画像は実内容を確認し、説明的な小文字kebab-caseで配置してスライド配列を更新。
3. Home画像は`data/screens.ts`を更新して`bun run images:generate`。公開URLは`data/presentation.ts`。
4. 本文・alt追加後は`bun run fonts:generate`。収集対象は`app`・`components`・`data`内のTS／TSX／CSS／Markdownで、`docs/`自体は対象外。
5. 型、Lint、単体、内容整合性、対象画面を確認。本文・図・画像の初期HTML、GitHubリンク非表示、前後操作・loop、両テーマ、保存拒否・タブ同期、狭い画面・200%文字拡大を確認。
6. 静的公開前はbuildと全ブラウザE2Eで確認。今回のユーザー実施buildと、エージェントが実行した開発サーバー検証を同一の結果として扱わない。

## このセッションの検証記録

| 検証 | 確認結果・範囲 |
|---|---|
| 単体 | Vitest 9ファイル・34件成功 |
| 型・Lint | `bunx tsc --noEmit`、`bun run lint`成功。Lintツール由来のTSNonNullExpressionメッセージが出るが終了コード0 |
| 内容整合性 | `bun scripts/validate-content.ts`成功（13リポジトリ、4詳細と証拠参照）。Markdownの意味・全画像の内容まで自動検証するものではない |
| テーマ | `e2e/theme.spec.ts`5件成功。選択保持、OS追従、保存拒否、タブ同期、狭いヘッダー・200%・axe |
| 最終ライトデザイン | Chromium 8件成功。全画面直接アクセス・404、テーマ保持・SPA復帰、320／768／1200／1440px・200%・フォント取得失敗等 |
| コントラスト | Home＋4詳細の最終ライト画面でaxe違反0。両モードのテーマ操作も検証 |
| Multi Vendor画像 | Chromium 2件成功。全10枚の読み込み・手動移動・loop、モバイル・ダーク・文字200%・JS無効時の先頭画像と本文・図 |
| Home画像 | 390／1440pxでR01のWebP選択・読み込み・ページ横はみ出しなしを確認 |
| build・全3ブラウザ | このセッションではエージェントによるbuild／全3ブラウザE2Eを実行していない。以前の成功記録はその当時の結果として保持 |

開発サーバーは当初localhost:3000、画像追加と最終デザインの確認はlocalhost:3001を使用しました。これは検証時のポートであり公開URLの仕様ではありません。Lighthouse・実機・スクリーンリーダー・実ユーザー性能・リモートCIは今回未確認。push・デプロイ・このセッションのコミットは実施していません。
