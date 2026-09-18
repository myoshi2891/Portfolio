# PHASE 2 — Content & Design System

## 0. 決定案・対象・証拠の扱い

**用途が伝わる日本語の見出しと、実装へ進めるリンクを中心にした、明るい編集記事型のポートフォリオを提案する。** オフホワイトと墨色を基調に、操作箇所に青を使う。Featuredは横長の4行、学習は簡潔なカード、詳細は読み幅を絞った記事とし、文字の大きさ・余白・罫線で階層を作る。

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
| Navigation | 目的の区画へ直接進む | 表示名、制作・学習・考え方、GitHub。連絡先は提供時のみ | P0 | `/#selected-work`、`/#studies`、`/#philosophy`、GitHubプロフィール |
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
| 03 / R12 / Medical-Studies | **質問票の計算・記録ツール** — 患者報告アウトカム（PROM）の回答検証、スコア計算、記録保存、データ出力を扱うWebアプリの構成を紹介します。 | 計算・保存・出力の責務分割 / Next.js・TypeScript・React | [T01](phase-0-repository-evidence-audit.md#r12-t01)、[A01](phase-0-repository-evidence-audit.md#r12-a01)、[F01](phase-0-repository-evidence-audit.md#r12-f01)、[F02](phase-0-repository-evidence-audit.md#r12-f02) |
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

全4ページに共通の節順と安定したアンカーを使う。概要とGitHubはページ先頭に置き、根拠リンクは本文の主張の近くにも置く。Scope・Technical Decisionsのために本人の説明を作らない。

| 節 / アンカー | Purpose / Information | Priority | CTA |
|---|---|---|---|
| Overview / `#overview` | §1.4の用途見出しと説明を再利用。Repository名、確認済みの構成を添える | P0 | GitHub、Homeの元カードへ戻る |
| Scope / `#scope`（条件付き） | 本人提供の制作背景・担当範囲があるときだけ掲載 | P1 | 元教材・差分等の根拠がある場合のみリンク |
| Features / `#features` | 下表の主要処理を2〜3項目で示す | P0 | 「注文作成のコード」など対象が分かるソースリンク |
| Architecture / `#architecture` | 確認済みの処理境界とデータフローを説明。外部サービスは接続成功と区別 | P1 | 対応するソース・設定 |
| Structure & Constraints / `#decisions` | 公開見出しは「構成と制約」。本人の採用理由が未提供のTechnical Decisionsをこの説明で扱う | P1 | 構造を確認できるコード。理由・代替案は根拠を得てから追加 |
| Quality & Limitations / `#quality` | テストや検査設定の所在と、機能を理解するための未検証範囲 | P1 | テスト・CI定義へのリンク |
| Evidence & Next / `#evidence` | 「参照コードの確認日：2026-09-16」、対象コミット、関連ファイル | P2 | 固定コミット、GitHub、次のFeatured、Home末尾 |

以下を詳細本文の基本原稿とする。各欄の証拠は§1.4と下表のQuality参照に対応する。表示する構成図を後続Phaseで作る場合も、この範囲から矢印を追加しない。

| ID | Features / Architectureの文案 | 構成と制約・Qualityの文案 |
|---|---|---|
| R01 | 商品フォームから商品更新処理を呼び出します。チェックアウトではカート・配送先の所有者を確認し、トランザクション内で注文を作成します。画面、Server Actions、PrismaによるDB処理を分けた構成です。 | ロール・店舗所有者の確認と、決済作成・Webhookの処理を実装しています。決済成功や認可の十分性は未検証です。Jest・Playwrightの設定と、lint・テスト・build等のCI定義を確認しています。実行結果・coverageは未確認です。[Q01](phase-0-repository-evidence-audit.md#r01-q01)、[Q02](phase-0-repository-evidence-audit.md#r01-q02) |
| R06 | Pythonの収集処理が料金JSONを書き出し、Web側へ複製します。Web側はJSONを検証して画面へ渡し、入力・出力トークン数と期間から費用を計算します。 | 取得失敗時には既存値やfallbackを利用する経路があるため、価格の鮮度は保証しません。紹介対象は料金収集・計算のコードで、LLMの性能比較ではありません。WebとPythonのテスト実体・CI定義を確認しています。実行結果は未確認です。[Q01](phase-0-repository-evidence-audit.md#r06-q01) |
| R12 | 質問票フォームの回答を検証してスコアを計算し、localStorageへ記録します。画面、計算、StorageAdapter、exporterを分け、JSON入出力とCSV・Google Sheets向けの出力処理を持ちます。 | 公開時に利用を制限する質問票があります。Google Sheetsへの接続成功は未確認です。ここでは計算・記録の実装を紹介し、臨床的な有効性は検証していません。Vitest・型検査・lint・CI定義を確認しています。実行結果は未確認です。[F03](phase-0-repository-evidence-audit.md#r12-f03)、[Q01](phase-0-repository-evidence-audit.md#r12-q01) |
| R02 | 客室作成フォームからフック、サービスを経て客室データと画像を保存します。チェックイン操作は予約の状態を更新します。画面・フック・サービスとSupabaseクライアントを分けたSPA構成です。 | 認証・DB・Storageへの操作コードを確認しています。実環境のアクセス制御とゲスト向けアプリとの統合運用は未確認です。Vitestの単体テスト、Playwrightの認証E2E、CIの検査定義を配置しています。実行結果は未確認です。[Q01](phase-0-repository-evidence-audit.md#r02-q01) |

編集用の証拠ID・Source Type・Statusは本書で管理する。公開画面の根拠リンクはPhase 0の対応行が持つSHA固定のファイルURLを使い、監査資料を経由しなくてもソースへ到達できるようにする。短縮SHAの表示は可、リンク先には完全なSHAを使う。

### 1.8 未提供情報・空状態・表現の制約

| 項目 | 状態 | 公開時の扱い |
|---|---|---|
| 本人指定の表示名・肩書き・連絡先 | UNVERIFIED / NOT_VERIFIED | 暫定表示はmyoshi2891。肩書き、メール、SNS、履歴書、採用可否の表示は省略。情報提供後に置換 |
| 担当範囲・制作背景・独自の変更 | UNVERIFIED / NOT_VERIFIED | Scope欄を省略。「独自開発」「全工程を担当」等を書かない |
| Live Demo・本番稼働 | NOT_VERIFIED。URLが監査範囲でNOT_FOUNDのものもある | Demo CTAを省略し、詳細とGitHubで成立させる。無効ボタンや架空URLを置かない |
| 実画面画像 | 利用可能性はNOT_VERIFIED | 画像枠ごと省略。実アプリに見える生成画像を代用しない |
| テスト成功・性能・coverage・利用規模 | UNVERIFIED / NOT_VERIFIED | 成功バッジ・スコア・数値を載せない。「設定を確認」と実行結果を区別 |
| R05のhomepage | Phase 0に記述の不整合が残る | Demo導線には使用しない。必要になった時点で再確認 |
| 臨床的有効性 | NOT_APPLICABLE（技術監査の対象外） | 診断・治療効果・臨床実績の訴求をしない |

「Production-ready」「Enterprise-grade」「高性能」「安全な設計」「常に最新」は根拠が得られるまで掲載しない。これは公開コピーの編集条件であり、画面に警告一覧を置く指定ではない。

## 2. Visual Direction（2-2）

**余白のある技術記事を読み進める方向**を採る。主役は用途を表す見出しとコードへの入口。Linear・Vercel・Stripe・Raycast・Appleは `prompt.md` が挙げる明快さ・整列・節度という抽象的な参考に留め、各社の画面・文案・ブランド資産は流用しない。

| 要素 | 方針 |
|---|---|
| Hero | 左揃え。短いH1と本文、CTAを縦に配置。全画面高に固定せず、その下にSelected Workが続くと分かる余白 |
| Selected Work | 画像のない横長4行。小さな通し番号、用途見出し、説明、構成の見どころを罫線で区切る。4件の順番で編集上の優先度を示す |
| Studies | 簡潔な白い面のカード。技術ロゴではなく、学習テーマを見出しにする |
| More Work | さらに簡潔な罫線付きのリスト。Featuredと同じ大きさの見出しにしない |
| 詳細 | 冒頭に用途・GitHub、続いて記事。広い画面のみ横に節ナビ。図は確認済み構造を説明するときだけ使用 |
| 面・線 | 原則影なし。白い面と細い罫線、角丸は小さく統一。区切りを過剰な箱の入れ子にしない |
| 画像・装飾 | 初期版は画像なしで成立。実画面の利用が確認できた場合だけキャプションとともに追加 |
| 動き | 色・下線の状態変化を中心とする。スクロール出現、パララックス、カーソル追従、粒子、3Dは使わない |
| テーマ | 初期版はライトのみ。ダーク切替は要件・検証対象を増やすため採用しない |

見た目の差はカードを大量に並べることで作らず、Hero → 制作の横長行 → 領域の3枠 → 学習カード → 記事的な方針説明という情報の形で作る。

## 3. Color（2-3）

### 3.1 セマンティックトークン

以下は実装言語に依存しない値の仕様。アクセントは青1色の濃淡のみ。カテゴリや検証状態に別の色相を足さない。

| Token | 値 | 用途 |
|---|---|---|
| color.canvas | `#F7F7F2` | ページ全体のオフホワイト |
| color.surface | `#FFFFFF` | カード・ボタン文字の白 |
| color.surface-subtle | `#ECEDE8` | 補足面、hoverのニュートラル背景、技術ラベル背景 |
| color.text | `#191C20` | 見出し・本文・主ナビ |
| color.text-muted | `#555B64` | Repository名、補足、日付。薄すぎる灰色にしない |
| color.line | `#D9DCD6` | 装飾的な区切り線のみ |
| color.control-border | `#737B86` | 操作部品の識別に必要な枠線 |
| color.accent | `#2457C5` | 主CTA、本文リンク、フォーカス |
| color.accent-hover | `#1D469F` | 主CTA・リンクのhover |
| color.accent-active | `#17377D` | 押下中の主CTA・リンク |

基本の組み合わせ以外で半透明化しない。disabledは`surface-subtle`と`text-muted`、枠線に`control-border`を使い、必要な場合だけ非活性を文言でも示す。初期コンテンツに欠けたリンクは非活性ボタンにせず省略する。

### 3.2 色の組み合わせ確認

通常の文字は4.5:1以上、操作識別とフォーカスは3:1以上を本設計の下限とする。下表はsRGB値を線形化し、相対輝度の比 `(明るい方 + 0.05) / (暗い方 + 0.05)` を計算した値。画面実装の適合判定ではない。

| 前景 / 背景 | 比率 | 指定用途 |
|---|---|---|
| text / canvas | 15.91:1 | 見出し・本文 |
| text-muted / canvas | 6.37:1 | 補足文 |
| text-muted / surface-subtle | 5.82:1 | 技術ラベル |
| accent / canvas | 6.02:1 | 本文リンク・フォーカス |
| surface / accent | 6.47:1 | 主CTAの白文字 |
| surface / accent-hover | 8.65:1 | 主CTA hover |
| surface / accent-active | 11.18:1 | 主CTA active |
| control-border / canvas | 3.98:1 | 操作部品の枠 |
| control-border / surface | 4.28:1 | 白い面の操作部品の枠 |
| accent / surface-subtle | 5.50:1 | 補足面上のリンク・フォーカス |

`line`は操作部品を識別する唯一の手掛かりに使わない。リンクは下線、選択中の節は文字の太さと線を併用する。focus-visibleは外側2pxのaccentリング、3pxのオフセットを基本とし、背景との間を空ける。青いボタンも外側にリングを出す。実装時に切れ・重なりを確認する。

## 4. Typography（2-4）

### 4.1 書体

候補から**Inter（英数字）＋Noto Sans JP（日本語）**を採用する設計案とする。本文・見出しは同じ組み合わせとし、Geistとの併用はしない。フォールバックはsystem-ui、Hiragino Kaku Gothic ProN、Yu Gothic、sans-serifの順。コード・SHAのみui-monospace系のシステム書体を使う。

ウェイトは400（本文）、500（ラベル・ナビ）、600（見出し・CTA）の3つ。読めることを優先し、日本語は通常字間。短い英語の補助ラベルに限り0.06emまで字間を広げる。本文を大文字化しない。フォントの取得・配信・サブセット化はPhase 3で検討し、読み込み失敗時にも内容が読めることを要件とする。

### 4.2 文字サイズと読み幅

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

本文の最大幅は42rem（672px）、Hero本文は40rem。長い英数字のRepository名とURLは折り返しを許可する。日本語は句読点の禁則を尊重し、手動改行は意味の切れ目だけにする。見出し・ボタン・ナビの高さを固定して折り返しを切らない。日本語だけの見出し幅を英字の`ch`単位で管理しない。

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
| L | 1200px〜 | 最小48 / 32px、最大内容幅1200px | 12列 | Featuredは番号1＋概要7＋見どころ・CTA4列、Studies・Domainsは3列 |

Lでは幅から外側余白96pxを引いた領域と1200pxの小さい方を使い、全体を中央に置く。詳細の本文はグリッド内でも最大42remを守る。Lの詳細節ナビは本文の横、S／Mでは概要直後の「このページの内容」という縦リストへ移す。

Homeのセクション間隔はS＝64px、M＝96px、L＝128px。Heroの上下はS＝64px、M＝96px、L＝128px／96px。Heroの高さを100vhに固定しない。狭い画面ほど空白だけの領域を減らす。

ナビは通常フローに置き、初期版は固定しない。Sでは表示名とGitHubを1行目、制作・学習・考え方を2行目に折り返す。追加される連絡先も自然に折り返す。メニューを閉じたまま隠す方式は採用しない。

Featured・Studiesの読み順とフォーカス順はDOM順と視覚順を一致させる。モバイルで横カルーセルに変えない。320px幅、200%文字拡大でも本文・CTAが切れず、ページ全体の横スクロールが出ないことを後続Phaseの確認条件とする。長いコードは専用領域内でスクロール可とし、図には文章の説明を併設する。

## 6. Component System（2-6）

### 6.1 共通仕様と状態

遷移はリンク、開閉など現在の画面への操作はボタンとする。すべての操作をhoverだけに依存させない。外部リンクは原則同じタブで開き、矢印アイコンだけでリンク先を表現しない。アイコンはテキストに添え、装飾の場合は読み上げ対象から外す。

| 状態 | 表現・挙動 |
|---|---|
| Default | 本文リンクに下線。主CTAはaccent＋白文字、補助CTAは透明背景＋text＋control-border |
| Hover | 主CTA・リンクはaccent-hover。補助CTAはsurface-subtle。カード自体を浮かせず、操作対象の状態だけ変える |
| Focus-visible | §3の外側リング。Tab／Shift+Tabで所在が分かり、枠のoverflowで切れない |
| Active | 主CTA・リンクはaccent-active。押下でサイズや位置を動かさない |
| Expanded | 開閉文言と記号が変化し、開閉状態を支援技術へ通知。展開内容は文書の読み順に挿入 |
| Disabled / unavailable | 実行先のないCTAは省略。必要なdisabled操作は理由を隣接表示。初期版の通常導線には使わない |
| Reduced motion | 動きの低減設定時は遷移アニメーションを止め、移動・展開を即時にする |

通常の色の変化は120ms、背景の変化は160msを上限の目安とする。スクロールは既定で即時。コンテンツを透明な状態で待機させない。展開に高さのアニメーションを使わない。

### 6.2 採用コンポーネント

| Component | 内容 / Variant | 操作・セマンティクス | S / M / Lでの扱い |
|---|---|---|---|
| Navigation | 表示名、3つのHomeリンク、GitHub。連絡先は条件付き | nav、先頭に「本文へ移動」リンク。詳細でもHomeアンカーへ遷移 | §5.2の折り返し。ハンバーガーメニューは不要 |
| Button / ActionLink | primary・secondary・text。移動と開閉の意味で要素を選ぶ | 独立操作は最小44px高、左右16px以上。アクセシブル名に対象制作名を含める | 固定幅なし。狭い幅で折り返し、必要ならCTAを縦積み |
| Badge | 技術名・「学習テーマ」等の非操作ラベル | span等の通常テキスト。状態の成功・保証を表さない。Tab対象にしない | 横に並べて自然に折り返す |
| ProjectCard | featured＝横長行、secondary＝簡潔な行。用途、Repository名、説明、見どころ、CTA | articleと見出し。タイトルのリンクとGitHubを分離し、カード全体をリンクにしない | §5.2のFeatured構成。secondaryは全幅の一覧 |
| StudyCard | 題材、説明、GitHub、任意の実装補足 | article。題材と実装を明示的に分ける | Sは1列、Mは2列、Lは3列 |
| DomainCard | BUILD / STUDY / ENGINEER、日英補足、領域リンク | 見出しとリンクのリスト。カード全体のクリックを要求しない | S／Mは1列、Lは3列 |
| SectionHeader | 日本語見出し、英語補助、任意の導入1文 | Homeの節はH2、カードはH3。英語ラベルを別の見出しとして重複させない | 日本語を優先し自然改行 |
| Disclosure | 学習の追加3件、各カードの任意補足 | ネイティブの開閉要素またはbutton＋aria-expanded＋aria-controls。リンクと操作を入れ子にしない | 展開するとページの流れの中で高さが増える |
| EvidenceLink | 「注文作成のコード」「検査設定」等、確認日・コミット | 通常のリンク。確認日とプロジェクトの更新日を混同しない | 長いパス・SHAを折り返す |
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
| ThemeToggle | ライトのみのため不要 |
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

本書の静的確認では、ローカル文書リンク50件の参照先、うち証拠アンカー44件の存在と `REPOSITORY_VERIFIED / VERIFIED` 分類、対象13件の記載、2-1〜2-6の網羅、ローカル絶対パスの不在を機械照合した。証拠アンカー数は重複参照を含む。配色比率は指定値から計算した。アプリのテスト・build、GitHubの再取得、画面の動作検証は行っていない。

Phase 3へ引き継ぐのは、掲載内容と証拠の対応、トークン値、コンポーネントの責務、条件付き表示、開閉・復元の要件、フォント配信の検討事項。ライブラリ・データ型・取得方式の選定は本書では確定しない。

**Phase 2の提案作成は完了。Phase 2成果物の承認は未取得。** 承認対象は公開文案、明るい記事型のデザイン方向、配色・文字・余白の値、コンポーネントと操作仕様。[prompt.md](../prompt.md) のPhase進行制御に従い、ここで停止し、Phase 3 — Technical Architectureは承認後に開始する。
