# PHASE 1 — Portfolio Strategy & Information Architecture

## 0. 結論・対象・証拠の扱い

**提案: Webアプリケーションの実装を中心に、AI・医療の題材をツールに落とし込み、設計・品質・セキュリティの学習をコードとともに示すポートフォリオとする。** Featured Worksは4件、Knowledge & Deep Studiesは6件、Secondaryは3件。Homeで概要を理解し、Featuredの詳細から実装根拠へ進む二層構造を採用する。

| Featured表示順 | Repository | 主に伝えること |
|---|---|---|
| 1 | Multi-Vendor-E-Commerce | 複数店舗の商品・注文・権限・決済に関する実装 |
| 2 | Comparison-of-LLMs | Pythonのデータ収集とWebの料金計算をつなぐ構成 |
| 3 | Medical-Studies | PROMの計算・記録・出力の責務分割 |
| 4 | The-Wild-Oasis-For-Admin | 宿泊施設の管理操作とSPAの画面・データ処理の分割 |

技術的根拠は§1と§2に対応付ける。この表示順と分類は編集上の提案であり、能力の実測順位ではない。

- 要件: [prompt.md](../prompt.md) のPHASE 1、§1〜8、§13、§15（`USER_PROVIDED`）。今回の「PHASE 1の対応を進めて」という依頼を開始の承認として扱う。
- 証拠: [Phase 0監査](phase-0-repository-evidence-audit.md) の2026-09-16 JST取得スナップショット。13件の対象SHAと証拠の分類・状態を引き継ぎ、最新のGitHub状態を再監査したとは扱わない。
- 本書の技術的事実は、リンク先の証拠行における `REPOSITORY_VERIFIED / VERIFIED` の範囲に限定する。未確認事項には元の状態を引き継ぐ。
- ポジショニング、採点、掲載順、UXは**設計判断（提案）**。リポジトリから検証された事実や本人の経歴として扱わない。`INFERRED / UNVERIFIED` の情報を公開用の技術的事実へ変換しない。
- 本Phaseの成果物は戦略・情報設計。公開コピー、配色・コンポーネント、技術選定、アプリ実装の確定は各後続Phaseで行う。

## 1. Portfolio Positioning（1-1）

### Engineering Identity

設計上の中心は「Webアプリケーションを作り、領域知識と設計・品質の学習を実装につなげるエンジニア」。肩書きより、何を実装し、どのコードを確認できるかを先に伝える。サイト名にAIを含める場合も、LLMの学習・推論基盤を開発したという意味を付与しない。

| 要素 | 提案する位置付け | 確認済みの根拠 | 言える範囲 |
|---|---|---|---|
| Primary Strength 1 | 商品・予約・業務操作をデータ処理までつなぐ実装 | [R01-F01](phase-0-repository-evidence-audit.md#r01-f01)、[R01-F02](phase-0-repository-evidence-audit.md#r01-f02)、[R02-F01](phase-0-repository-evidence-audit.md#r02-f01)、[R03-F01](phase-0-repository-evidence-audit.md#r03-f01)、[R04-F01](phase-0-repository-evidence-audit.md#r04-f01)、[R05-F01](phase-0-repository-evidence-audit.md#r05-f01) | 確認済み経路の実装。本番運用・利用者数・業務効果は含まない |
| Primary Strength 2 | データの取得・検証・計算・保存を分けて扱う実装 | [R06-A01](phase-0-repository-evidence-audit.md#r06-a01)、[R06-F01](phase-0-repository-evidence-audit.md#r06-f01)、[R12-A01](phase-0-repository-evidence-audit.md#r12-a01)、[R12-F01](phase-0-repository-evidence-audit.md#r12-f01) | 料金比較とPROM記録のコード構成。料金の現時点での正確性や医学的妥当性は含まない |
| Primary Strength 3 | テスト・型検査・CIを検討可能な形で配置 | [R01-Q01](phase-0-repository-evidence-audit.md#r01-q01)、[R01-Q02](phase-0-repository-evidence-audit.md#r01-q02)、[R02-Q01](phase-0-repository-evidence-audit.md#r02-q01)、[R06-Q01](phase-0-repository-evidence-audit.md#r06-q01)、[R12-Q01](phase-0-repository-evidence-audit.md#r12-q01) | 各証拠が示すテスト／設定の存在。成功実績やcoverageは未確認 |
| Differentiation | アプリ実装と、複数領域の学習資料を扱うWebの双方を提示 | [R07-A01](phase-0-repository-evidence-audit.md#r07-a01)、[R08-A01](phase-0-repository-evidence-audit.md#r08-a01)、[R09-A01](phase-0-repository-evidence-audit.md#r09-a01)、[R10-A01](phase-0-repository-evidence-audit.md#r10-a01)、[R11-A01](phase-0-repository-evidence-audit.md#r11-a01)、[R13-A01](phase-0-repository-evidence-audit.md#r13-a01) | この13件の組み合わせをサイトの特徴として扱う。他者より優れているという比較はしない |

### Core Domainsと3つの柱

「掲載階層」は閲覧優先度、「領域」は内容、「BUILD / STUDY / ENGINEER」は取り組みの切り口として分ける。一つのRepositoryに複数の切り口を付けられるが、主掲載先は一つにする。

| Core Domain | 位置付け | 主なRepository | 柱と根拠 |
|---|---|---|---|
| Web Applications / Software Engineering | 最初に見せる実装の中心 | R01〜R05 | BUILD — Products & Applications。上の機能・データ処理の証拠 |
| AI / LLM | 料金比較・収集ツールと学習の題材 | R06 | BUILD / STUDY。[R06-A01](phase-0-repository-evidence-audit.md#r06-a01)、[R06-F02](phase-0-repository-evidence-audit.md#r06-f02) |
| Medical / Healthcare | PROM記録ツールと医療教育資料の題材 | R12 | BUILD / STUDY。[R12-A01](phase-0-repository-evidence-audit.md#r12-a01)、Phase 0のRepository Identity。臨床専門性を表さない |
| Architecture / Quality Assurance / Security | 学習と、個別実装における設計・検査の確認先 | R08・R07・R11、Featuredの該当コード | ENGINEER — Architecture, Quality & Security。[R08-A01](phase-0-repository-evidence-audit.md#r08-a01)、[R07-Q01](phase-0-repository-evidence-audit.md#r07-q01)、[R11-A02](phase-0-repository-evidence-audit.md#r11-a02) |
| Cloud Infrastructure / Networks | 学習領域 | R10 | STUDY — Research & Knowledge。[R10-A01](phase-0-repository-evidence-audit.md#r10-a01)。AWS／GCP運用経験の根拠ではない |
| Algorithms / Data Structures / Math / SQL | 基礎学習とコード例 | R13 | STUDY。[R13-A01](phase-0-repository-evidence-audit.md#r13-a01)、[R13-F01](phase-0-repository-evidence-audit.md#r13-f01)。SQLの名称からDB運用を推定しない |
| Project Management / Team Building | 学習領域 | R09 | STUDY。[R09-A01](phase-0-repository-evidence-audit.md#r09-a01)、Phase 0のRepository Identity。管理職経験・資格取得を示さない |

Homeでは各領域に「アプリ実装」「学習資料」の補足を付ける。9領域のロゴや専門家の肩書きを同列に並べず、実装の中心と学習の広がりを読み分けられるようにする。

### Engineering Philosophy

`Learn → Build → Engineer → Improve` は [prompt.md](../prompt.md) §1の本人指定の方針（`USER_PROVIDED`）として採用する。Learnは資料・例題、Buildは機能コード、Engineerは責務分割・検査設定へリンクする。Improveは改善を続ける方針として扱い、変更履歴・測定根拠が揃うまで「性能を改善した」「品質を向上させた」という成果に置き換えない。

本人の表示名、職歴、役割、担当範囲、制作背景、資格、連絡先は未提供。GitHubアカウント名から本名や経歴を生成しない。

## 2. Portfolio Hierarchy（1-2）

### 2.1 評価方法

6項目を5段階で評価する。ただし**点数は、Phase 0で得られた証拠から紹介できる範囲を評価した編集判断**であり、品質保証や客観的な能力測定ではない。学習サイトは、その用途に対する機能の揃い方で評価する。機能の多さだけで優先度を決めない。

| 評価項目 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| T: Technical Complexity | 単独の資料・処理 | 索引・検索等の限定経路 | UI・状態・データ層など複数責務 | 複数処理系・外部連携・整合性制御 | 複数ロール・取引・決済を横断する経路 |
| P: Product Completeness | 目的だけ確認 | 機能の一部を確認 | 主な利用経路をコードで追跡可能 | 主経路・異常系の動作を確認 | 公開環境の動作・運用まで確認 |
| A: Architecture Depth | 単一処理 | 画面とデータを区分 | 複数責務の分離を説明可能 | 境界を跨ぐデータフロー・制約を説明可能 | 採用理由・代替案・検証結果まで追跡可能 |
| D: Demonstrability | 説明のみ | ソースの断片を提示可能 | 入力から結果までコードを説明可能 | 対象版で再現可能な動作を確認 | 公開デモと対象版の対応を確認 |
| O: Originality | 独自の追加・変更の根拠が未確認 | 元教材・基盤と変更箇所を特定 | 独自の問題設定と変更を対応付け | 独自の設計判断と実装を追跡可能 | 独自の工夫の効果まで検証可能 |
| Q: Documentation Quality | 説明資料の所在が未確認 | README・資料の所在と対象を確認 | 導入・構成・制約を説明する内容を確認 | 手順の再現性と設計理由を確認 | 再現・変更・制約の追跡を検証可能 |

Oの全件 `1*` は**独自性の実評価を保留した暫定値**。元教材との比較・本人の追加範囲が `NOT_VERIFIED` のためであり、「独自性がない」という事実を意味しない。クローンという名称だけでも制作背景は断定しない。

Qの全件 `2*` は**文書品質の詳細比較を保留した暫定値**。Phase 0のI01はREADMEの存在を確認しているが、説明の十分性・導入手順の再現性を評価していない。ルートREADMEがないR06・R12もサブディレクトリのREADMEを同じ基準で扱う。未調査の内容を加点しない。

P・Dは全件3を上限とする。Phase 0では実行確認をしていないため、設定やhomepageだけで4以上にしない。暫定値を含む単純合計で順位を作らず、T・A・説明可能性と、4件を並べたときの役割の違いを選定に用いる。

### 2.2 全13件の評価と主掲載先

| ID | Repository | T | P | A | D | O | Q | 主掲載先 |
|---|---|---|---|---|---|---|---|---|
| R01 | Multi-Vendor-E-Commerce | 5 | 3 | 4 | 3 | 1* | 2* | Featured Works |
| R02 | The-Wild-Oasis-For-Admin | 3 | 3 | 3 | 3 | 1* | 2* | Featured Works |
| R03 | The-Wild-Oasis-For-User | 3 | 3 | 4 | 3 | 1* | 2* | Secondary |
| R04 | AirbnbCloneApp | 4 | 3 | 4 | 3 | 1* | 2* | Secondary |
| R05 | Next-Store | 4 | 3 | 3 | 3 | 1* | 2* | Secondary |
| R06 | Comparison-of-LLMs | 4 | 3 | 4 | 3 | 1* | 2* | Featured Works |
| R07 | Quality-Assurance-Studies | 2 | 3 | 3 | 3 | 1* | 2* | Knowledge & Deep Studies |
| R08 | Software-Design-and-Architecture | 2 | 3 | 3 | 3 | 1* | 2* | Knowledge & Deep Studies |
| R09 | Management-Team-Building-Studies | 2 | 3 | 3 | 3 | 1* | 2* | Knowledge & Deep Studies |
| R10 | Cloud-Infrastructure-and-Network-Studies | 2 | 3 | 3 | 3 | 1* | 2* | Knowledge & Deep Studies |
| R11 | Security_Studies | 3 | 3 | 3 | 3 | 1* | 2* | Knowledge & Deep Studies |
| R12 | Medical-Studies | 4 | 3 | 4 | 3 | 1* | 2* | Featured Works |
| R13 | Algorithm-DataStructures-Math-SQL | 2 | 3 | 3 | 3 | 1* | 2* | Knowledge & Deep Studies |

### 2.3 Featured選定理由・入口で示す証拠

| 表示順 / Repository | 選定理由と採点根拠 | 詳細で扱う主要経路 | 紹介上の制約 |
|---|---|---|---|
| 1 / R01 | 店舗・商品・注文とロール／所有者確認、複数の決済処理がありT5・A4。アプリ実装の中心を説明できる。[A01](phase-0-repository-evidence-audit.md#r01-a01)、[A02](phase-0-repository-evidence-audit.md#r01-a02)、[F01](phase-0-repository-evidence-audit.md#r01-f01)、[F02](phase-0-repository-evidence-audit.md#r01-f02)、[F03](phase-0-repository-evidence-audit.md#r01-f03) | チェックアウト → 所有者確認 → 注文トランザクション。決済作成・Webhookは別経路として対応付ける | 本番URLは監査範囲でNOT_FOUND。決済成功・運用規模・認可の十分性は未検証 |
| 2 / R06 | Python収集とWeb、JSONの検証、料金計算を分けて説明できT4・A4。AI領域への関心を具体的なツールで見せる。[A01](phase-0-repository-evidence-audit.md#r06-a01)、[F01](phase-0-repository-evidence-audit.md#r06-f01)、[F02](phase-0-repository-evidence-audit.md#r06-f02) | scraper → pricing.json → Webの検証 → 入力値に応じた費用計算 | fallbackがある。「常に最新」「LLMの性能比較」「モデル開発」は主張しない |
| 3 / R12 | 計算・記録・出力と公開時制限を分離しておりT4・A4。医療の題材を実装として説明できる。[A01](phase-0-repository-evidence-audit.md#r12-a01)、[F01](phase-0-repository-evidence-audit.md#r12-f01)、[F02](phase-0-repository-evidence-audit.md#r12-f02)、[F03](phase-0-repository-evidence-audit.md#r12-f03) | フォーム → 回答検証・計算 → StorageAdapter → 記録／exporter | 臨床的有効性は監査対象外。Sheets接続成功・全質問票の公開利用を断定しない |
| 4 / R02 | 画面・フック・サービスの分割とSupabase操作がT3・A3。管理操作とReact SPAを示し、Featured全体の構成に幅を持たせる。[A01](phase-0-repository-evidence-audit.md#r02-a01)、[F01](phase-0-repository-evidence-audit.md#r02-f01)、[F02](phase-0-repository-evidence-audit.md#r02-f02) | 客室作成フォーム → hook → service → データ・画像保存。チェックインは別操作として説明 | DBのRLS・実環境の権限は未確認。R03と同一DB／統合運用であるとは断定しない |

上記の利用経路のコード追跡をP3・D3の根拠とする。Qは各Repositoryの [R01-I01](phase-0-repository-evidence-audit.md#r01-i01)、[R06-I01](phase-0-repository-evidence-audit.md#r06-i01)、[R12-I01](phase-0-repository-evidence-audit.md#r12-i01)、[R02-I01](phase-0-repository-evidence-audit.md#r02-i01) に限定する。Oは全件共通で未検証。

**4件とする理由:** 商品取引、データ収集・計算、領域固有の記録、管理操作という4つの説明を揃える。5件目の予約アプリ追加は、最初に読む情報量と既存2件との機能の重なりが増すため見送る。R04はT・AでR02を上回るが、R02は管理側の操作とSPAの構成を追加できる。これは編集上の選択であり、R04の品質が劣るという判定ではない。

### 2.4 Knowledge & Deep Studiesの掲載順

HomeのSelected Studiesで先にR08・R07・R11を示し、同セクションの「すべての学習を見る」からR10・R13・R09を展開する。全6件を同じHome内に置く。R06・R12はFeaturedを主掲載先とし、ここに同じカードを重複配置しない。

| 順位 / ID | 選定理由とT・P・A・Dの根拠 | Qの根拠 | 学習内容と実装を分ける要点 |
|---|---|---|---|
| 1 / R08 | カタログと公開／準備中の分岐を説明できる。設計学習への入口。[A01](phase-0-repository-evidence-audit.md#r08-a01)、[F01](phase-0-repository-evidence-audit.md#r08-f01) | [I01](phase-0-repository-evidence-audit.md#r08-i01) | 教材内のアーキテクチャを実装アプリの採用方式と呼ばない |
| 2 / R07 | 検索とカテゴリ別表示の経路を説明できる。品質の学習とサイト自体のテストを確認可能。[A01](phase-0-repository-evidence-audit.md#r07-a01)、[F01](phase-0-repository-evidence-audit.md#r07-f01)、[Q01](phase-0-repository-evidence-audit.md#r07-q01) | [I01](phase-0-repository-evidence-audit.md#r07-i01) | 学習用に紹介するツールとサイトの採用ツールを混同しない |
| 3 / R11 | MDXから索引生成・静的JSON検索への構成とCSP付与コードがありT3。他の学習サイトとの実装差を説明できる。[A01](phase-0-repository-evidence-audit.md#r11-a01)、[A02](phase-0-repository-evidence-audit.md#r11-a02)、[F01](phase-0-repository-evidence-audit.md#r11-f01) | [I01](phase-0-repository-evidence-audit.md#r11-i01) | 検索モーダルの入力元は静的JSON。CSPの配信・効果は未検証 |
| 4 / R10 | 試験カタログと閲覧履歴の保存を説明できる。[A01](phase-0-repository-evidence-audit.md#r10-a01)、[F01](phase-0-repository-evidence-audit.md#r10-f01) | [I01](phase-0-repository-evidence-audit.md#r10-i01) | クラウドの題材や資格名を運用・取得実績に変換しない |
| 5 / R13 | コード例とPythonによる索引生成を説明できる。[A01](phase-0-repository-evidence-audit.md#r13-a01)、[F01](phase-0-repository-evidence-audit.md#r13-f01) | [I01](phase-0-repository-evidence-audit.md#r13-i01) | 計算性能や正解率は未測定。テスト依存宣言をテスト実体と呼ばない |
| 6 / R09 | ページ・カタログ・検索の分離と検索経路を説明できる。[A01](phase-0-repository-evidence-audit.md#r09-a01)、[F01](phase-0-repository-evidence-audit.md#r09-f01) | [I01](phase-0-repository-evidence-audit.md#r09-i01) | 資料の存在からチームを率いた経験を推定しない |

### 2.5 Archive / Secondaryの掲載順

公開上の見出しは「その他の制作 / More Work」。Archiveという語から、開発終了や非推奨という状態を推定させない。

| 順位 / ID | 採点根拠・主な内容 | Featuredにしない理由 | 将来の再選定条件 |
|---|---|---|---|
| 1 / R04 | 予約トランザクション、認証・Storage・決済連携でT4・A4、機能経路からP3・D3。[A01](phase-0-repository-evidence-audit.md#r04-a01)、[F01](phase-0-repository-evidence-audit.md#r04-f01)、[F02](phase-0-repository-evidence-audit.md#r04-f02)、文書は[I01](phase-0-repository-evidence-audit.md#r04-i01) | R01の取引処理、R02の宿泊領域と重なる。詳細候補として最優先の次点 | 元教材等に対する追加範囲や、予約処理の検証結果が説明できれば入れ替え候補 |
| 2 / R03 | ページ・Actions・service、認証と予約所有確認でT3・A4、予約経路からP3・D3。[A01](phase-0-repository-evidence-audit.md#r03-a01)、[A02](phase-0-repository-evidence-audit.md#r03-a02)、[F01](phase-0-repository-evidence-audit.md#r03-f01)、文書は[I01](phase-0-repository-evidence-audit.md#r03-i01) | R02の関連制作として案内すると理解しやすい。名称の関連だけで統合システムにまとめない | 管理側との設計比較や個別の追加機能の根拠が揃うこと |
| 3 / R05 | 商品・カート・注文・外部決済の経路でT4・P3・D3、Actions等の区分でA3。[A01](phase-0-repository-evidence-audit.md#r05-a01)、[F01](phase-0-repository-evidence-audit.md#r05-f01)、[F02](phase-0-repository-evidence-audit.md#r05-f02)、文書は[I01](phase-0-repository-evidence-audit.md#r05-i01) | R01のECと重なる。監査範囲ではテスト実体・CIがNOT_FOUNDで、品質面を説明する材料も限られる | 追加実装・テスト・設計判断など、R01と異なる見どころを証拠付きで示せること |

## 3. Information Architecture（1-3）

### 3.1 サイトマップと経路

HomeとFeatured4ページを基本とする。Studies、Secondary、Contactの独立ページは設けない。以下は計画するURLであり、現在実装済みのルートではない。

```text
/  Home
├─ #top                   Hero / Identity
├─ #selected-work         Featured 4件
├─ #domains               Engineering Domains + Build / Study / Engineer
├─ #studies               Selected Studies + 残りの学習を展開
├─ #more-work             Secondary 3件
├─ #philosophy            Learn → Build → Engineer → Improve
└─ #contact               Contact / GitHub

/projects/multi-vendor-e-commerce
/projects/comparison-of-llms
/projects/medical-studies
/projects/the-wild-oasis-for-admin

外部: 各GitHub Repository / SHA固定のソース・設定・テスト
```

主ナビゲーションは「制作」「学習」「考え方」「連絡先」、外部GitHubリンクとする。領域はHome内の見出しとして置き、同じ情報へのナビ項目を増やさない。詳細ページからも各Homeアンカーへ直接戻れるようにする。

### 3.2 Homeの情報の順序

| 順序 | 区画 | ここで理解すること・次の行き先 |
|---|---|---|
| 1 | Hero | 本人指定の表示名（未提供）、Webアプリ実装を中心にする位置付け、AI・医療・設計／品質の広がり。「制作を見る」でSelected Workへ、GitHubから実物へ |
| 2 | Selected Work | 4件それぞれの用途・主な確認済み機能・構成の違い。「詳細を見る」→個別ページ、Repositoryリンク→GitHub |
| 3 | Engineering Domains | 実装の中心と学習領域の対応。BUILD / STUDY / ENGINEERは日本語と英語の補足付きで統合。各領域から該当Featured／Studyへ |
| 4 | Selected Studies | 設計・QA・Securityを先に見せ、残り3件を展開。題材とサイト自体の実装を分けて読み、GitHubの資料へ進む |
| 5 | More Work | Secondary3件を比較し、関連する実装の補足またはGitHubへ進む |
| 6 | Engineering Philosophy | 本人指定の方針と対応する制作・資料。抽象的な標語だけで終わらせず、実装・検査設定への入口を置く |
| 7 | Contact / GitHub | 公開可能な連絡手段とGitHub。連絡先未提供時の扱いは§6に従う |

基本案のEngineering DomainsとBuild / Study / Engineerは統合する。別々の大きなセクションにすると同じRepository・領域説明が繰り返されるため。GitHubも単独の一覧セクションにせず、ナビ・各制作・末尾に目的別のリンクを置く。13件すべてへの到達性は維持する。

### 3.3 30秒以内の理解を支える構造

| 設計上の目安 | 閲覧者が答えられる問い | 必要な情報 |
|---|---|---|
| 0〜5秒 | 誰で、何を作る人か | 表示名、位置付け、制作への入口 |
| 5〜15秒 | どんなアプリを作っているか | Featuredの用途と代表機能。Repository名だけにしない |
| 15〜25秒 | どこに特徴があるか | 料金比較・PROM記録・業務操作の違い、実装／学習の区別 |
| 25〜30秒 | 実物をどこで確認できるか | 各詳細とGitHubへの明示的なリンク |

これは時間の実測結果ではなく設計目標。Heroに全技術・全領域を詰め込まず、Selected Workを直後に置く。小さい画面でも同じ読み順とし、横スワイプしないと作品が見つからない構造は採用しない。理解時間の確認はPhase 5で行う。

## 4. User Flow（1-4）

5段階は情報の深さを表す。全員に順番通りのクリックを強制せず、どの段階からもGitHub／Contactへ進める。

| 閲覧者 | Landing | Understanding | Evidence | Deep Dive | GitHub / Contact |
|---|---|---|---|---|---|
| Recruiter | Hero | Webアプリ実装と領域の広がりを把握 | Selected Workで用途と実装内容を確認 | 興味のある1件の概要。技術節は任意 | 制作のGitHub、連絡先へ |
| Hiring Manager | Hero → Selected Work | EC・データ収集・記録・管理操作の違いを比較 | R01／R02の機能と検査設定を確認 | 構成・未検証範囲・担当範囲の記載有無を読む | 実装を確認し、公開連絡先があれば連絡へ |
| Engineer | Homeの制作リンク、または詳細への直リンク | 冒頭の目的と確認済み構成を把握 | 主要データフローとソース参照 | 認可・トランザクション・検証・テスト等の該当コード | SHA固定の証拠、Repository全体へ |
| CTO | Hero → Featuredを比較 | 実装領域と学習領域、紹介できる範囲を把握 | R01／R06／R12の境界・制約を確認 | 設計の選択と未確認事項。判断理由は根拠がある場合のみ | コード確認から、担当範囲・制作背景の会話へ |

HomeからFeatured詳細までは1回のリンク操作、詳細冒頭または技術節から証拠までさらに1回を基本にする。Studies・SecondaryはHomeのカードからGitHubへ直接進める。展開操作は補足を読みたい場合だけ必要とする。

詳細ページはHome未読でも理解できる概要、Homeへの戻り先、他のFeaturedへのリンクを持つ。ブラウザの戻る操作で元の位置・展開状態を失わないことを後続PhaseのUX要件とする。

## 5. Project Detail Strategy（1-5）

### 5.1 詳細ページを作る対象

§3.1のFeatured4件のみ `/projects/[slug]` を作る提案とする。R06・R12は元の一覧ではStudies側にあるが、監査で確認したアプリ実装をケーススタディの対象にする。名称や元のグループだけで詳細対象を除外しない。

| 詳細内の順序 | 掲載方針 |
|---|---|
| 1. Overview | 対象ユーザー・用途・確認できた主要経路。GitHubと、確認済みの場合だけDemoへの入口。肩書きや業務成果を補わない |
| 2. Scope | 制作背景・担当範囲は本人の提供または明確な証拠がある場合のみ。未提供なら内部ではNOT_VERIFIEDとして保持し、公開欄を無理に作らない |
| 3. Verified Features | 実装経路を数点に絞り、機能ごとにソースへ進める。コードの存在と動作の検証結果を読み分けられる表現にする |
| 4. Architecture | 画面・処理・データ・外部サービスの関係。図を作る場合は証拠で追える矢印に限定し、稼働構成を推定しない |
| 5. Technical Decisions | 確認済みの構造・制約を説明。なぜ採用したか、検討した代替案、トレードオフの判断履歴は本人の説明・ADR等がある場合のみ |
| 6. Quality & Limitations | テスト／CIの配置と実行結果を分ける。データ鮮度、公開時制限、外部接続等、機能の理解に必要な未検証範囲を近接表示 |
| 7. Evidence & Next | 確認時点・参照コミットと関連ソース、Repository、他の制作、Contact |

詳細ではR01の権限・注文処理、R06のJSON境界とfallback、R12のStorageAdapter／exporterと公開時制限、R02の画面／hook／serviceを軸にする。コードにある分割を「保守性のために採用した」と本人の意図に変換しない。改善案を載せる場合も、未実施の提案であることを明示する。

### 5.2 Studies・Secondaryの表示方法

| 方法 | 評価 | 採否 |
|---|---|---|
| Card | 用途・題材・見どころ・GitHubを短く示せる。基本の閲覧に十分 | 全9件の基本表示に採用 |
| Expandable section | 学習テーマとサイト実装を分けた説明、確認済み機能、関連制作などの補足を同じ文脈で読める | 必要なカードと、残りのStudies一覧に採用 |
| Drawer | 9件の短い補足に対して別領域への移動・フォーカス管理が増える。小画面では長文になりやすい | 初期版は見送る |
| Modal | 詳細読解中に背景が使えず、戻り先やスクロールの管理が必要になる。GitHubへの導線には過剰 | 初期版は見送る |
| 独立詳細ページ | ページ数と重複説明が増え、Featuredとの優先度が弱まる | 初期版は作らない |

カードの基本情報とGitHubリンクは折りたたまない。展開操作は見出し付きのボタンとし、開閉状態を支援技術へ伝え、キーボードで操作できることを要件とする。カード全体のリンク内に開閉ボタンを入れない。

領域リンクは該当カードの位置へ移動し、隠れている場合はその区画を開く。Studiesは`/#study-r08`など、Secondaryは`/#work-r04`などの安定したアンカーを設ける計画とする。共有リンクから対象へ到達できるため、DrawerやModalを追加する必要はない。

## 6. 未確認事項と後続Phaseへの引き継ぎ

| 項目 | 現在の状態 | 情報設計での扱い / 次に必要な情報 |
|---|---|---|
| 表示名・肩書き・連絡先 | UNVERIFIED / NOT_VERIFIED | Phase 2で本人提供を反映。架空の氏名・メール・SNSを作らない。未提供の連絡CTAは公開しない |
| 制作背景・担当範囲・独自の変更 | UNVERIFIED / NOT_VERIFIED | Originalityの実評価を保留。本人の説明、元教材・参照元、差分の証拠を得た時点で再評価 |
| Documentation Qualityの詳細 | UNVERIFIED / NOT_VERIFIED | READMEの存在以上の品質を断定しない。導入・設計・制約の記載と再現性を確認したら再評価 |
| Live Demo・公開稼働 | URLの記載があるものも稼働はNOT_VERIFIED | 現段階の主CTAは詳細とGitHub。対象版・公開範囲・動作を確認したものだけLive Demoを追加。URLがない場合はNOT_FOUNDの範囲を維持 |
| 画面キャプチャ・デモ素材 | 本Phaseで利用可能性を確認していない | 実画面を取得して確認するまで実物に見える架空画面を掲載しない。カードはテキストだけでも成立させる |
| テスト成功・coverage・性能・利用実績 | UNVERIFIED / NOT_VERIFIED | 数値・成功バッジを掲載しない。対象SHA・測定条件・実行結果を得てから追加 |
| R06の価格鮮度 | NOT_VERIFIED | 収集・計算コードの紹介に限定。「最新価格保証」や料金の推奨を加えない |
| R12の臨床的妥当性 | NOT_APPLICABLE（Phase 0技術監査の対象外） | 診断・治療効果や臨床利用実績を訴求しない。公開時制限は機能説明に必要な範囲で示す |
| R05のhomepage記述の不整合 | Phase 0のD01にURL記載、M03にhomepageが空との記述が併存 | URLの有無について一方を採用せず、必要時に証拠を再確認。今回の分類・評価はソースに基づき、Demoには利用しない |

本人の連絡先が未提供でも、本PhaseのIAは確定案としてレビュー可能。Contactは条件付きの掲載枠とし、連絡手段が提供されないまま公開する場合はナビのContactを省き、末尾をGitHub導線にする。GitHubプロフィールを問い合わせ機能として表示しない。公開用の文字列・リンクを確定する時点で未解決事項を反映する。

証拠行ID・Source Type・Status・採点表は編集管理用。閲覧者には必要なソースリンク、確認時点、機能に関係する制約を示す。監査ラベルを大量に並べてHomeの理解を妨げない。

## 7. 完了確認と承認対象

- [x] 1-1: Engineering Identity、Differentiation、Core Domains、Primary Strengthsを証拠と対応付けた。
- [x] 1-2: 13件を重複なく主分類し、6項目の5段階評価・暫定値の意味・選定理由を記載した。
- [x] Featured 4件、Knowledge & Deep Studies 6件、Secondary 3件を指定した。
- [x] 1-3: Home構成、計画URL、情報順序、3つの柱、全13件への入口を定義した。
- [x] 1-4: Recruiter、Hiring Manager、Engineer、CTOの5段階の導線を定義した。
- [x] 1-5: Featuredだけを詳細対象とし、残り9件についてCard／展開／Drawer／Modalを比較した。
- [x] 実装の事実と編集判断、未検証の実績・制作背景を区別した。

**Phase 1の提案作成は完了。ユーザー承認は未取得。** 承認対象は、Webアプリ実装を中心にする位置付け、Featured4件と掲載順、Home＋4詳細ページの構成、その他9件をカードと展開で扱う方針。採点のうちOriginality・文書品質の詳細は保留のまま引き継ぐ。

[prompt.md](../prompt.md) の「Phase 1承認後に開始してください」に従い、Phase 2 — Content & Design Systemは承認後に開始する。
