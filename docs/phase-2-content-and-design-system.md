> 2026-10-02更新: 詳細・配色・テーマ・画像・図の現行契約を同期しました。歴史的な文案・承認記録は当時の状態です。現在の画面・編集先・操作仕様は[現行仕様](current-specification.md)を優先します。

# PHASE 2 — Content & Design System

## 0. 決定案・対象・証拠の扱い

**用途が伝わる日本語の見出しと、実装へ進めるリンクを中心にした、明るい編集記事型のポートフォリオを提案する。** オフホワイトと墨色を基調に、操作箇所に青を使う。Featuredは横長の4行、学習は簡潔なカード、詳細は本文カラムの幅を使った記事とし、文字の大きさ・余白・罫線で階層を作る。

- 要件: [prompt.md](../prompt.md) のPHASE 2（2-1〜2-6）。今回の「PHASE 2の対応を進めて」をPhase 1案に基づく開始承認として扱う。
- 継承: [Phase 1](phase-1-portfolio-strategy-and-information-architecture.md) のFeatured 4件、学習6件、その他3件、Home＋Featured詳細4ページ、掲載順・アンカー・条件付きContact。
- 技術的事実: [Phase 0](phase-0-repository-evidence-audit.md) の2026-09-16 JST取得スナップショットを使う。以下の証拠リンクは `REPOSITORY_VERIFIED / VERIFIED` の該当範囲を継承し、現在のGitHub状態を再監査したものではない。
- 文案・表示順・配色・寸法・コンポーネントは**設計提案**。本人の職歴、実績、設計意図を確認した事実として扱わない。
- 本書はレビュー可能なコンテンツ・デザイン仕様。技術選定、データ型、アプリ・CSSの実装は後続Phaseで扱う。

## 1. Content Strategy（2-1）

### 1.1 読み手・言語・情報量

Homeは採用担当者が用途と制作の違いを把握できる文章、詳細は技術者が処理・構成・制約を追える文章にする。本文は日本語を主とし、英語はセクションの補助見出し、固有名、技術名に使う。初期版では英語全文ページや言語切替を設けない。

用途見出し → 短い説明 → 見どころ → 技術名 → CTAの順に読む。Repository名を用途の代わりにしない。本文中の略語は初出で説明し、技術名はHomeで1件につき最大3つ。残りは詳細へ置く。見出しは概ね24字、カード説明は概ね80字を編集時の目安とし、表示上の行数制限で重要情報を切らない。

優先度はP0＝最初に理解・操作する情報、P1＝違いや根拠を理解する情報、P2＝任意の補足。これは非表示の指定ではない。

### 1.2 Homeのセクション定義

| Section / 計画アンカー | Purpose | Information | Priority | CTA / 遷移 |
|---|---|---|---|---|
| Navigation | 目的の区画へ直接進む | 表示名、制作・学習・考え方、テーマ切り替え。HomeのみGitHub。連絡先は提供時のみ | P0 | `/#selected-work`、`/#studies`、`/#philosophy`、GitHubプロフィール |
| Hero / `#top` | 誰の、何を紹介するサイトか伝える | 表示名、Webアプリ制作を中心とする説明、AI・医療・設計／品質の題材 | P0 | 「制作を見る」→ `/#selected-work`、「GitHubを見る」→ プロフィール |
| Selected Work / `#selected-work` | 代表作4件の用途と違いを見せる | 用途、Repository名、説明、構成の見どころ、技術3つ | P0 | 「実装と構成を見る」→ 各詳細、「GitHub」→ 各Repository |
| Engineering Domains / `#domains` | 実装の中心と学習の広がりを区別する | BUILD / STUDY / ENGINEERと日本語補足、対象領域、対応する制作・学習 | P1 | 各制作・学習のHomeアンカー |
| Selected Studies / `#studies` | 学習題材と資料の入口を示す | R08・R07・R11、展開後にR10・R13・R09。題材とサイト実装を分ける | P1 | 各「GitHubで資料を見る」、「すべての学習を見る（残り3件）」 |
| More Work / `#more-work` | 追加の制作を比較できる | R04・R03・R05の用途・主な機能 | P2 | 各「GitHubでコードを見る」、任意の「実装の補足」展開 |
| Engineering Philosophy / `#philosophy` | 制作と学習の方針を具体物へつなぐ | Learn → Build → Engineer → Improve、対応する資料・コード | P1 | 学習、Featured、検査設定へのリンク |
| Contact / GitHub / `#contact` | 次に確認する場所を示す | 現時点ではGitHubプロフィール。公開連絡先の提供後に連絡手段を追加 | P1 | 現時点は「GitHubプロフィールを見る」。提供後は明示された連絡手段 |
| Footer | サイト内で迷わず戻れる | 表示名、制作・学習・ページ先頭へのリンク | P2 | 「ページ先頭へ」→ `/#top` |

GitHubプロフィールURLは `https://github.com/myoshi2891`（[prompt.md](../prompt.md) の対象Repository所有者から作る導線）。連絡先がない間はナビに「連絡先」を出さず、末尾の見出しを「GitHubで制作と学習を見る」とする。`#contact` は将来の連絡先追加に備えて維持する。

### 1.3 Hero・共通セクションの掲載文案

| 箇所 | 公開用文案 | 根拠 / 扱い |
|---|---|---|
| 表示名 | myoshi2891 | 提供されたRepository URLのアカウント表記。本名・正式な表示名は未提供のため暫定 |
| Hero補助ラベル | Engineering Portfolio | サイトの種類を示す編集ラベル。職業・役職の断定ではない |
| Hero H1 | 学びを、仕組みにする。 | 編集コピー。学習と実装をつなぐ位置付けを表す |
| Hero本文 | EC・宿泊管理のWebアプリから、LLM料金の比較、医療の質問票の計算・記録まで。制作したコードと、設計・品質・セキュリティの学習を紹介します。 | 下記R01・R02・R06・R12、学習R08・R07・R11の証拠。担当範囲・独自性の主張は含めない |
| Selected Work | 代表的な制作 / Selected Work | 「用途と実装の異なる4つの制作を、コードと構成から紹介します。」 |
| Domains | 制作と学習の領域 / Engineering Domains | 「アプリを作ること、領域を学ぶこと、設計と品質を考えること。」 |
| Studies | 学習と技術資料 / Selected Studies | 「設計・品質・セキュリティを中心に、学習テーマと資料をまとめています。」 |
| More Work | その他の制作 / More Work | 「予約やオンラインストアなど、関連する制作のコードも公開しています。」対象の公開取得はPhase 0参照 |
| Philosophy | 学び、作り、見直す / Engineering Philosophy | 「Learn → Build → Engineer → Improve」。[prompt.md](../prompt.md) §1の本人指定方針（`USER_PROVIDED`） |
| 末尾 | GitHubで制作と学習を見る | 「各リポジトリで、実装コードと学習資料を確認できます。」 |

Homeに監査ステータス、評価点、全依存一覧を並べない。技術の具体的な制約は対応する詳細の機能説明と隣接させる。Heroに年数・資格・採用企業・成果の数値を補わない。

### 1.4 Featured 4件の掲載文案

表の技術名は依存宣言と実装構成の紹介に限定する。最新バージョンや実環境での稼働を示すバッジにはしない。

| 順 / ID / Repository | 用途見出し・説明文 | 見どころ / 技術ラベル | 証拠 |
|---|---|---|---|
| 01 / R01 / Multi-Vendor-E-Commerce | **複数店舗の商品・注文管理** — 店舗・商品管理、注文作成、決済連携を扱うECアプリ。ロールと所有者の確認、注文処理の構成を紹介します。 | 所有者確認と注文トランザクション / Next.js・TypeScript・Prisma | [T01](phase-0-repository-evidence-audit.md#r01-t01)、[A01](phase-0-repository-evidence-audit.md#r01-a01)、[A02](phase-0-repository-evidence-audit.md#r01-a02)、[F01](phase-0-repository-evidence-audit.md#r01-f01)、[F02](phase-0-repository-evidence-audit.md#r01-f02)、[F03](phase-0-repository-evidence-audit.md#r01-f03) |
| 02 / R06 / Comparison-of-LLMs | **LLM料金の収集と費用計算** — Pythonによる料金データの収集と、入力・出力トークン数や期間に応じた費用計算を組み合わせたWebツールです。 | 収集データとWebの検証境界 / Python・Next.js・TypeScript | [T01](phase-0-repository-evidence-audit.md#r06-t01)、[A01](phase-0-repository-evidence-audit.md#r06-a01)、[F01](phase-0-repository-evidence-audit.md#r06-f01)、[F02](phase-0-repository-evidence-audit.md#r06-f02) |
| 03 / R12 / Medical-Studies | **頭痛医療教育・記録プラットフォーム** — 頭痛の教育コンテンツ、3D解剖アトラス、患者報告アウトカム（PROM）の自己記録を統合したWebアプリの設計と公開上の制約を紹介します。 | 計算・保存・出力の責務分割 / Next.js・TypeScript・React | [T01](phase-0-repository-evidence-audit.md#r12-t01)、[A01](phase-0-repository-evidence-audit.md#r12-a01)、[F01](phase-0-repository-evidence-audit.md#r12-f01)、[F02](phase-0-repository-evidence-audit.md#r12-f02) |
| 04 / R02 / The-Wild-Oasis-For-Admin | **宿泊施設の管理アプリ** — 客室登録、画像保存、予約のチェックインを扱う管理アプリ。画面・フック・データ処理の分割を紹介します。 | 管理操作からデータ保存まで / React・TypeScript・Supabase | [T01](phase-0-repository-evidence-audit.md#r02-t01)、[A01](phase-0-repository-evidence-audit.md#r02-a01)、[F01](phase-0-repository-evidence-audit.md#r02-f01)、[F02](phase-0-repository-evidence-audit.md#r02-f02) |

各行のアンカーは順に `#work-r01`、`#work-r06`、`#work-r12`、`#work-r02`。詳細URLはPhase 1の `/projects/multi-vendor-e-commerce`、`/projects/comparison-of-llms`、`/projects/medical-studies`、`/projects/the-wild-oasis-for-admin`。Repositoryリンクは `https://github.com/myoshi2891/` に表のRepository名をつなぐ。タイトルとCTAは同じ詳細へ進み、GitHubは別リンクとする。

### 1.5 学習6件・その他3件の掲載文案

学習カードには「学習テーマ」と「資料サイトの実装」を別のラベルで置く。後者は補足展開内に置いてよいが、題材・概要・GitHubリンクはカード内で読めるようにする。最初の3件を常時表示し、残り3件は一覧展開後に表示する。

| 順 / ID / Repository / アンカー | 学習テーマ・概要 | 資料サイトの実装（補足） / 証拠 |
|---|---|---|
| 1 / R08 / Software-Design-and-Architecture / `#study-r08` | **ソフトウェア設計とアーキテクチャ** — 設計・アーキテクチャの学習資料を、カテゴリからたどるガイドです。 | 資料とWebアプリを併置し、公開済み・準備中をカタログで管理。[A01](phase-0-repository-evidence-audit.md#r08-a01)、[F01](phase-0-repository-evidence-audit.md#r08-f01) |
| 2 / R07 / Quality-Assurance-Studies / `#study-r07` | **テストと品質保証** — 品質保証の学習ガイドを、検索とカテゴリ別の一覧から探せます。 | 入力クエリによるガイド絞り込みとカテゴリ表示。[A01](phase-0-repository-evidence-audit.md#r07-a01)、[F01](phase-0-repository-evidence-audit.md#r07-f01) |
| 3 / R11 / Security_Studies / `#study-r11` | **セキュリティ** — セキュリティの学習資料を、文書と検索から参照するサイトです。 | MDX文書から索引を生成し、静的JSONを使って検索。[A01](phase-0-repository-evidence-audit.md#r11-a01)、[F01](phase-0-repository-evidence-audit.md#r11-f01) |
| 4 / R10 / Cloud-Infrastructure-and-Network-Studies / `#study-r10` | **クラウドとネットワーク** — クラウド・ネットワークの試験カタログから、学習ガイドをたどれます。 | 提供元別のカタログ表示と閲覧履歴の保存。[A01](phase-0-repository-evidence-audit.md#r10-a01)、[F01](phase-0-repository-evidence-audit.md#r10-f01) |
| 5 / R13 / Algorithm-DataStructures-Math-SQL / `#study-r13` | **アルゴリズム・データ構造・数学・SQL** — 基礎学習の資料とコード例をまとめたリポジトリです。 | Pythonによる静的索引生成、検索、GCD／LCMのコード例。[A01](phase-0-repository-evidence-audit.md#r13-a01)、[F01](phase-0-repository-evidence-audit.md#r13-f01)。SQLはリポジトリの題材表記であり、稼働DBの説明ではない |
| 6 / R09 / Management-Team-Building-Studies / `#study-r09` | **マネジメントとチームビルディング** — マネジメントの学習ガイドを、カタログと検索から参照できます。 | ガイドのカタログと検索を分離し、複数語の検索を実装。[A01](phase-0-repository-evidence-audit.md#r09-a01)、[F01](phase-0-repository-evidence-audit.md#r09-f01) |

| 順 / ID / Repository / アンカー | 用途見出し・説明文 | 補足 / 証拠 |
|---|---|---|
| 1 / R04 / AirbnbCloneApp / `#work-r04` | **物件検索と予約** — 物件の登録・検索、予約、お気に入り、レビューを扱うWebアプリです。 | 予約作成のトランザクションと決済連携コード。[A01](phase-0-repository-evidence-audit.md#r04-a01)、[F01](phase-0-repository-evidence-audit.md#r04-f01)、[F02](phase-0-repository-evidence-audit.md#r04-f02)。決済成功の確認は含まない |
| 2 / R03 / The-Wild-Oasis-For-User / `#work-r03` | **ゲスト向け宿泊予約** — 客室の予約作成・変更・削除を扱うWebアプリ。予約操作時の所有者確認を実装しています。 | ページ・Server Actions・データ処理の分割。[A01](phase-0-repository-evidence-audit.md#r03-a01)、[F01](phase-0-repository-evidence-audit.md#r03-f01)。R02との統合運用は未確認 |
| 3 / R05 / Next-Store / `#work-r05` | **商品販売とカート管理** — 商品検索、レビュー、お気に入り、カート更新、注文作成を扱うオンラインストアです。 | Server ActionsとDB処理。[A01](phase-0-repository-evidence-audit.md#r05-a01)、[F01](phase-0-repository-evidence-audit.md#r05-f01)。未確認の公開URLは使わない |

全9件のGitHubリンクも、Repository名をそのまま `https://github.com/myoshi2891/` につなぐ。架空の詳細ページや、準備中のリンク先を作らない。

### 1.6 Domains・Philosophyの掲載文案

Domainsは3枠にまとめ、各枠に具体的な領域リンクを置く。同一制作を複数の切り口から参照できるが、ProjectCard自体は再掲しない。根拠は§1.4・§1.5の対応する制作・学習の証拠を継承する。

| 枠 | 公開用の説明 | 領域リンク |
|---|---|---|
| BUILD — Products & Applications / アプリを作る | 商品・注文・予約・記録を扱うWebアプリケーション。 | Webアプリ → `/#work-r01`、宿泊管理 → `/#work-r02` |
| STUDY — Research & Knowledge / 領域を学ぶ | AI・医療の題材と、クラウド・アルゴリズム・マネジメントの学習。 | AI / LLM → `/#work-r06`、Medical / Healthcare → `/#work-r12`、Cloud → `/#study-r10`、Algorithms → `/#study-r13`、Management → `/#study-r09` |
| ENGINEER — Architecture, Quality & Security / 設計と品質を考える | 設計・品質保証・セキュリティの資料と、制作の構成・検査設定。 | Architecture → `/#study-r08`、Quality Assurance → `/#study-r07`、Security → `/#study-r11` |

Philosophyは次の4項目を順に示す。Improveの文章は方針であり、実測された改善成果の説明ではない。

| 項目 | 文案 | CTA |
|---|---|---|
| Learn | 領域の知識を、資料とコード例で学ぶ。 | 「学習資料を見る」→ `/#studies` |
| Build | 学んだ題材を、操作とデータを持つアプリにする。 | 「制作を見る」→ `/#selected-work` |
| Engineer | 処理の分割と検査の仕組みを、コードから確かめる。 | 「構成と検査設定を見る」→ `/projects/comparison-of-llms#quality`（[R06-Q01](phase-0-repository-evidence-audit.md#r06-q01)） |
| Improve | 作ったものを見直し、次の学びと改善につなげる。 | 「実装を見返す」→ `/#selected-work` |

### 1.7 Featured詳細のコンテンツ仕様

全4詳細は資料から編集したMarkdown本文と実画面ギャラリーで構成します。概要CTA・本文・共通ヘッダー・末尾を含め、詳細画面にGitHubリンクを置きません。HomeのGitHub導線は維持します。Scopeは未提供のため省略します。

| 節 | 表示内容・導線 |
|---|---|
| `#overview` | 用途、Repository名、技術タグ、画面更新日、提供済み公開サイト、パンくず |
| ギャラリー | Multi Vendor 10枚、LLM 9枚、Medical 11枚、Wild Oasis管理4枚 |
| `#features` | 利用者の役割・具体的な機能・操作 |
| `#orders` | Multi Vendorのみ。店舗別注文と決済の流れ |
| `#architecture` | 責務・データフロー・Mermaid図 |
| `#decisions` | 技術の役割、構成と制約。根拠のない採用理由を作らない |
| `#quality` | 基準資料の検証時点・結果・継続課題。現在の保証と区別 |
| `#documentation` | 基準資料名と調査日、品質統計日、画面更新日 |
| 次の制作 | プレビュー、要約、技術タグ、次の詳細へのリンク |

本文の対応表・資料名・目次IDは[現行仕様のページと情報源](current-specification.md#ページと情報源)に記載。テーブルはGFM Markdown、フローとシーケンスはMermaid。ASCII図解は禁止、図中文字は1rem。詳細本文と概要の説明は利用できるカラム幅へ広げ、図は専用領域内で横スクロールします。

### 1.8 未提供情報の扱い

肩書き・経歴・担当範囲・連絡先を補わない方針を維持します。Homeは全13件に実画面プレビューを掲載、4詳細に提供画像のギャラリーを配置します。提供済み公開URLは7件、その他はCTAごと省略します。紹介対象アプリの品質数値は基準資料の記録として日付と範囲を明記し、現在の実行結果・安全性・医学的有効性・価格鮮度の保証へ変換しません。

## 2. Visual Direction（2-2）

**余白のある技術記事を読み進める方向**を採る。主役は用途を表す見出し・実画面・資料に基づく具体的な説明。Linear・Vercel・Stripe・Raycast・Appleは `prompt.md` が挙げる明快さ・整列・節度という抽象的な参考に留め、各社の画面・文案・ブランド資産は流用しない。

| 要素 | 方針 |
|---|---|
| Hero | 左揃え。短いH1と本文、CTAを縦に配置。全画面高に固定せず、その下にSelected Workが続くと分かる余白 |
| Selected Work | 実画面プレビュー付きの横長4行。小さな通し番号、用途見出し、説明、構成の見どころを罫線で区切る。4件の順番で編集上の優先度を示す |
| Studies | 簡潔な白い面のカード。技術ロゴではなく、学習テーマを見出しにする |
| More Work | さらに簡潔な罫線付きのリスト。Featuredと同じ大きさの見出しにしない |
| 詳細 | 冒頭に用途・画面更新日、続いてギャラリーと資料ベースの記事。広い画面のみ横に節ナビ。図は確認済み構造を説明するときだけ使用 |
| 面・線 | 白い面と細い罫線、控えめな影、穏やかな角丸で階層を作る。区切りを過剰な箱の入れ子にしない |
| 画像・装飾 | 提供済み実画面をキャプション・altとともに掲載。HomeはWebP、詳細はPNGギャラリー。架空のUIは作らない |
| 動き | 色・下線の状態変化を中心とする。HeroのCSS 3D軌道と10秒周期の光の反射、ギャラリーの水平移動を使用。画面外停止・reduced-motionを尊重 |
| テーマ | 全画面共通のライト／ダーク切り替え。保存値優先、未選択時はOS追従。SPA・reload・タブ間で同期 |

見た目の差はカードを大量に並べることで作らず、Hero → 制作の横長行 → 領域の3枠 → 学習カード → 記事的な方針説明という情報の形で作る。

## 3. Color（2-3）

### 3.1 セマンティックトークン

最終ライト案は白・チャコール・シルバーを基調にブルーをアクセントとします。途中のアイボリーと制作別多色パレットは廃止しました。現在のライト／ダークの正確なトークン表は[現行仕様](current-specification.md#ライトモードの最終デザイン)と`app/globals.css`を参照してください。

- ライトのcanvas `#f7f8fa`、surface `#ffffff`、ink `#20242c`、muted `#606873`、accent `#234bdb`。
- 主CTAはチャコール＋白文字、hoverでブルー。リンク・現在目次・小さなラベルにブルーを配置。
- カード、技術バッジ、表、図はニュートラルな面と罫線で統一。制作ごとの色分けはしない。
- Heroのみブルーのエナメルパネル・シルバーの軌道・ガラスを思わせる面と穏やかな反射で見せ場を作る。

### 3.2 コントラストと状態

最終ライトのHome＋4詳細でaxe違反0を確認。両テーマの操作も検証しています。旧配色の計算比率を現在の検証値へ流用しません。リンクの下線、目次の現在地・左線、focus-visibleの3pxリング＋4pxオフセットなど、色以外の識別を維持します。実機・支援技術での確認は未実施です。

## 4. Typography（2-4）

### 4.1 書体

候補から**Inter（英数字）＋Noto Sans JP（日本語）**を採用する設計案とする。本文・見出しは同じ組み合わせとし、Geistとの併用はしない。フォールバックはsystem-ui、Hiragino Kaku Gothic ProN、Yu Gothic、sans-serifの順。コード・SHAのみui-monospace系のシステム書体を使う。

ウェイトは400（本文）、500（ラベル・ナビ）、600（見出し・CTA）の3つ。読めることを優先し、日本語は通常字間。短い英語の補助ラベルに限り0.06emまで字間を広げる。本文を大文字化しない。フォントの取得・配信・サブセット化はPhase 3で検討し、読み込み失敗時にも内容が読めることを要件とする。

### 4.2 文字サイズと読み幅

以下のS／M／L数値は初期設計の目安です。現行CSSでは見出しにclampを使用し、実際の値はapp/globals.cssを優先します。今回確定したMermaid図中文字はすべて1remです。

数値は標準文字サイズ16pxを基準とした設計値。実装ではrem等で文字拡大を尊重する。S／M／Lは§5の画面区分。

| Role | S / M / Lのサイズ | 行高 | Weight | 用途 |
|---|---|---|---|---|
| display | 36 / 48 / 64px | 1.3 | 600 | Hero H1。日本語見出しを縮小して1行に押し込まない |
| page-title | 30 / 40 / 48px | 1.4 | 600 | 詳細H1 |
| section-title | 28 / 32 / 36px | 1.4 | 600 | Home H2・詳細主要節 |
| item-title | 22 / 24 / 28px | 1.5 | 600 | Featured用途見出し |
| card-title | 20 / 20 / 22px | 1.5 | 600 | 学習・その他の見出し |
| lead | 18 / 18 / 20px | 1.8 | 400 | Hero本文 |
| body | 16 / 16 / 16px | 1.9 | 400 | 日本語の説明・記事 |
| label | 14 / 14 / 14px | 1.6 | 500 | Repository名・技術名・補助ラベル |
| action | 16 / 16 / 16px | 1.5 | 600 | ボタン・主要リンク |
| code | 14 / 14 / 14px | 1.7 | 400 | パス・SHA・コード |

Homeの説明は最大42rem、Hero本文は40rem。4詳細の概要・記事の説明は詳細カラム幅を使う。長い英数字のRepository名とURLは折り返しを許可する。日本語は句読点の禁則を尊重し、手動改行は意味の切れ目だけにする。見出し・ボタン・ナビの高さを固定して折り返しを切らない。日本語だけの見出し幅を英字の`ch`単位で管理しない。

## 5. Spacing & Grid（2-5）

### 5.1 Spacing・形状

| Token | 値 | 用途 |
|---|---|---|
| space.1 / .2 / .3 | 4 / 8 / 12px | アイコンと文字、ラベル間、説明内の小間隔 |
| space.4 / .6 / .8 | 16 / 24 / 32px | 段落、カード内側、カラムの間隔 |
| space.12 / .16 | 48 / 64px | 見出しと一覧、Sのセクション余白 |
| space.24 / .32 | 96 / 128px | M／Lのセクション余白、LのHero上部 |
| radius.control / .surface | 6 / 12px | ボタン・ラベル／学習カード・補足面 |
| border.default | 1px | 罫線・枠 |
| icon.default | 20px | 矢印・展開記号。単独の操作対象にする場合は44px以上の領域 |
| target.min | 44 × 44px | ナビ・ボタン・展開など独立操作の目標サイズ |

本文中のインラインリンクは行高と下線で識別し、隣接リンクを詰め込まない。コンポーネント内の余白はSで16px、M／Lで24〜32px。余白のためだけの任意値を各部品へ追加しない。

### 5.2 Gridとレスポンシブ

| 区分 | 想定幅 | 外側余白 / gutter | グリッド | 主要な並び |
|---|---|---|---|---|
| S | 320〜767px | 16 / 16px | 4列 | 本文・カードは全幅、Featured内も1列、CTAは折り返す |
| M | 768〜1199px | 32 / 24px | 8列 | Featuredは番号1＋本文7列、Studiesは2列、Domainsは縦並び |
| L | 1200px〜 | 32 / 32px、最大内容幅1240px | 12列 | Featuredは番号1＋概要7＋見どころ・CTA4列、Studies・Domainsは3列 |

768px以上では幅から外側余白64pxを引いた領域と1240pxの小さい方を使い、全体を中央に置く。4詳細の本文はグリッドのカラム幅を使う。Lの詳細節ナビは本文の横、S／Mでは概要直後の「このページの内容」という縦リストへ移す。

Homeのセクション間隔はS＝64px、M＝96px、L＝128px。Heroの上下はS＝64px、M＝96px、L＝128px／96px。Heroの高さを100vhに固定しない。狭い画面ほど空白だけの領域を減らす。

ヘッダーはsticky。Sでは表示名・テーマ切り替え・ネイティブdetailsのメニューを表示し、制作・学習・考え方はメニュー内へ配置。詳細のヘッダーではGitHubを表示しない。

Featured・Studiesの読み順とフォーカス順はDOM順と視覚順を一致させる。Homeの制作・学習一覧をモバイルで横カルーセルに変えない。詳細の画像だけは水平ギャラリーを使用する。320px幅、200%文字拡大でも本文・CTAが切れず、ページ全体の横スクロールが出ないことを後続Phaseの確認条件とする。長いコードは専用領域内でスクロール可とし、図には文章の説明を併設する。

## 6. Component System（2-6）

### 6.1 共通仕様と状態

遷移はリンク、開閉など現在の画面への操作はボタンとする。すべての操作をhoverだけに依存させない。外部リンクは原則同じタブで開き、矢印アイコンだけでリンク先を表現しない。アイコンはテキストに添え、装飾の場合は読み上げ対象から外す。

| 状態 | 表現・挙動 |
|---|---|
| Default | 本文リンクに下線。ライトの主CTAはチャコール＋白文字、ダークはaccent＋on-accent、補助CTAは透明背景＋text＋control-border |
| Hover | 主CTA・リンクはaccent-hover。補助CTAはsurface-subtle。カード自体を浮かせず、操作対象の状態だけ変える |
| Focus-visible | §3の外側リング。Tab／Shift+Tabで所在が分かり、枠のoverflowで切れない |
| Active | 主CTA・リンクはaccent-active。押下でサイズや位置を動かさない |
| Expanded | 開閉文言と記号が変化し、開閉状態を支援技術へ通知。展開内容は文書の読み順に挿入 |
| Disabled / unavailable | 実行先のないCTAは省略。必要なdisabled操作は理由を隣接表示。初期版の通常導線には使わない |
| Reduced motion | 動きの低減設定時は遷移アニメーションを止め、移動・展開を即時にする |

通常の色の変化は120ms、背景の変化は160msを上限の目安とする。通常アンカーはsmooth、履歴復元・ページ切替・reduced-motion時はinstant。コンテンツを透明な状態で待機させない。展開に高さのアニメーションを使わない。

### 6.2 採用コンポーネント

| Component | 内容 / Variant | 操作・セマンティクス | S / M / Lでの扱い |
|---|---|---|---|
| Navigation | 表示名、3つのHomeリンク、全画面テーマ切り替え。HomeのみGitHub | nav、先頭に「本文へ移動」リンク。詳細でもHomeアンカーへ遷移 | stickyヘッダー。モバイルはdetailsメニュー |
| Button / ActionLink | primary・secondary・text。移動と開閉の意味で要素を選ぶ | 独立操作は最小44px高、左右16px以上。アクセシブル名に対象制作名を含める | 固定幅なし。狭い幅で折り返し、必要ならCTAを縦積み |
| Badge | 技術名・「学習テーマ」等の非操作ラベル | span等の通常テキスト。状態の成功・保証を表さない。Tab対象にしない | 横に並べて自然に折り返す |
| ProjectCard | featured＝横長行、secondary＝簡潔な行。用途、Repository名、説明、見どころ、CTA | articleと見出し。タイトルのリンクとGitHubを分離し、カード全体をリンクにしない | §5.2のFeatured構成。secondaryは全幅の一覧 |
| StudyCard | 題材、説明、GitHub、任意の実装補足 | article。題材と実装を明示的に分ける | Sは1列、Mは2列、Lは3列 |
| DomainCard | BUILD / STUDY / ENGINEER、日英補足、領域リンク | 見出しとリンクのリスト。カード全体のクリックを要求しない | S／Mは1列、Lは3列 |
| SectionHeader | 日本語見出し、英語補助、任意の導入1文 | Homeの節はH2、カードはH3。英語ラベルを別の見出しとして重複させない | 日本語を優先し自然改行 |
| Disclosure | 学習の追加3件、各カードの任意補足 | ネイティブの開閉要素またはbutton＋aria-expanded＋aria-controls。リンクと操作を入れ子にしない | 展開するとページの流れの中で高さが増える |
| EvidenceLink | Homeの補足・監査データ用。4詳細では表示しない | 固定SHAの内部証拠を維持 | Homeの長いパスは折り返す |
| ThemeToggle | ライト／ダーク、動的aria-label・現在モードのtitle | button。localStorage保存・OS追従・タブ同期 | 最小44pxの操作領域 |
| ProjectSlideshow | 全4詳細の実画面ギャラリー | 前後・停止／再生、5秒自動送り、loop、alt | 前後の端が見える水平移動、reduced-motion時は静止 |
| DetailContents | 詳細節のアンカー一覧 | ラベル付きnav。現在節を示す場合は色だけに依存しない | Lは横、S／Mは概要の下 |
| Footer | 表示名、制作・学習、ページ先頭 | footer。GitHub末尾区画は直前の独立section | 1列から横並びへ。長い表示名でも切らない |

FeaturedのCTA可視ラベルは「実装と構成を見る」、読み上げ名は「複数店舗の商品・注文管理の実装と構成を見る」等にする。可視ラベルの文字列を読み上げ名にも残す。同じ「GitHub」リンクが続く場所も対象Repository名を補う。

### 6.3 Disclosure・アンカーの挙動

- 一覧の閉状態は「すべての学習を見る（残り3件）」、開状態は「追加の3件を閉じる」。基本3件と追加3件の合計は6件のまま変わらない。
- 各カードの補足は「資料サイトの実装」または「実装の補足」。GitHubリンクはそのカードが表示されていれば常に操作できる。
- 領域リンクや共有URLで `/#study-r10` 等へ移動した場合は、対象を含む一覧を開いてから対象へ移動する。リンク操作では対象見出しへフォーカスを移し、初回のURL読み込みでは不必要なフォーカス移動を避ける。
- 展開・折りたたみ操作後のフォーカスは開閉操作に残す。非表示になる内部要素にフォーカスがある場合は開閉操作へ戻す。
- 戻る操作で元のスクロール位置・展開状態を復元することを要件とする。復元方法はPhase 3で決める。JavaScriptが利用できない場合も追加3件へ手動展開等で到達できるようにする。

### 6.4 初期版で採用しないもの

| Component | 判断 |
|---|---|
| FilterBar | Featured4件・学習6件は掲載順と見出しで把握できる。初期版に検索・フィルタ状態・0件表示を追加しない |
| Drawer | 短い補足は同じ文脈で展開する。別領域とフォーカス管理を追加する必要がない |
| Modal | 作品の説明・GitHub導線に不要。背景を操作できない閲覧構造を追加しない |
| ContactForm | 連絡先・送信先・運用要件が未提供。架空の送信完了表示を作らない |

## 7. 完了確認と後続Phaseへの引き継ぎ

- [x] 2-1: Home・詳細のPurpose、Information、Priority、CTAを定義した。
- [x] Hero・共通セクション・Featured4件・学習6件・その他3件の掲載文案を用意し、技術的主張から監査証拠へ参照できるようにした。
- [x] 2-2: 文字・罫線・余白を中心にする方向、画像なしで成立する構成、レスポンシブ方針を定義した。
- [x] 2-3: ニュートラル＋青1色のトークンを定義し、主要な配色のコントラスト比を計算した。
- [x] 2-4: 日本語・英数字の書体、サイズ、行高、ウェイト、読み幅、折り返しを定義した。
- [x] 2-5: 余白、グリッド、画面区分、コンポーネント配置を定義した。
- [x] 2-6: 必要な部品、状態、キーボード操作、フォーカス、開閉・アンカー挙動、採用しない部品を定義した。
- [x] 表示名・連絡先・画像・Demo・実績の未確認事項と、情報がない状態での表示を明記した。

このチェックは仕様作成の完了を示す。理解時間、実画面のレスポンシブ・文字組み・アクセシビリティ・操作性はまだ実測していない。Phase 4／5で320・768・1200・1440px程度の幅、文字拡大、キーボード、長いRepository名、フォント未読込、共有アンカー、戻る操作、動きの低減設定を確認する。

初期作成時の静的確認では、ローカル文書リンク50件の参照先、うち証拠アンカー44件の存在と `REPOSITORY_VERIFIED / VERIFIED` 分類、対象13件の記載、2-1〜2-6の網羅、ローカル絶対パスの不在を機械照合した。証拠アンカー数は重複参照を含む。配色比率は指定値から計算した。アプリのテスト・build、GitHubの再取得、画面の動作検証は行っていない。

Phase 3へ引き継ぐのは、掲載内容と証拠の対応、トークン値、コンポーネントの責務、条件付き表示、開閉・復元の要件、フォント配信の検討事項。ライブラリ・データ型・取得方式の選定は本書では確定しない。

**以下は初期Phase 2の承認待ち記録。2026-10-02の現行デザイン・操作はユーザー依頼に基づき実装済みです。** 承認対象は公開文案、明るい記事型のデザイン方向、配色・文字・余白の値、コンポーネントと操作仕様。[prompt.md](../prompt.md) のPhase進行制御に従い、ここで停止し、Phase 3 — Technical Architectureは承認後に開始する。
