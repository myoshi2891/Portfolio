# Phase 4 — セッション引き継ぎ

更新日: 2026-09-17 JST。追加4画像・3Dヒーロー・スムーズスクロール・SPA遷移まで実装・検証済み。

## 現在地

**`data/screens.ts`で追跡する画像資産12枚（R02〜R13）をすべて反映。`data/presentation.ts`の公開デモURLは7件。今回依頼されたアプリ内遷移とスクロール、3Dヒーローの改善は完了。** 未提供の素材・プロフィール情報と、本番公開に関する作業を以下に整理する。

- ブランチ: `dev`。ローカルコミット済み。push・デプロイは未実施。
- 画像反映: `0920fa3`。旧Redテスト`c7046c0`は成功へ移行。
- SPA・スクロール・3Dの再現テスト: `a1b5b3f`。修正前の4件の失敗を確認済み。
- 初回SPA・スクロール・3D実装: `9b7a874`。画像を使わない3Dヒーローへの更新: `c0c2ef2`。
- 単体テスト: **30成功、失敗0**。型チェック・Lint（警告0）・静的build成功。
- 全E2E: **75件中73成功・2対象外、失敗0**（`bun run test:e2e --workers=1`）。
- 静的プレビューは既存の`http://127.0.0.1:4173`を利用。ユーザーの開発サーバーは停止していない。

## 今回の変更

### 画像

`data/screens.ts`へ画像・代替文・タイトル・出力幅を共通化し、表示コンポーネントと生成スクリプトの対応表重複を解消。原本は維持し、追跡対象の全12枚（R02〜R13）に640／1280／1854pxのWebPを生成した。

| 原本 | 対応 | 表示先 |
|---|---|---|
| `The Wild Oasis Admin/dashboard-overview.png` | R02 / The-Wild-Oasis-For-Admin | 代表作・詳細・次の制作 |
| `The Wild Oasis.png` | R03 / The-Wild-Oasis-For-User | その他の制作カード |
| `AirbnbCloneApp.png` | R04 / AirbnbCloneApp | その他の制作カード |
| `Next-Store.png` | R05 / Next-Store | その他の制作カード |
| `LLM Studies.png` | R06 / Comparison-of-LLMs | 代表作・詳細・次の制作 |
| `QA_STUDIES.png` | R07 / Quality-Assurance-Studies | 学習カード |
| `Software-Design-and-Architecture.png` | R08 / Software-Design-and-Architecture | 学習カード |
| `Management Studies.png` | R09 / Management-Team-Building-Studies | 追加学習カード |
| `Cloud Infrastructure Studies.png` | R10 / Cloud-Infrastructure-and-Network-Studies | 追加学習カード |
| `Security Studies.png` | R11 / Security_Studies | 学習カード |
| `Medical-Studies/prom-checker-dashboard.png` | R12 / Medical-Studies | 代表作・医学詳細・次の制作 |
| `Algorithm-DataStructures-Math-SQL.png` | R13 / Algorithm-DataStructures-Math-SQL | 追加学習カード |

**Wild Oasisの画像・Vercel URLは宿泊者向けR03。管理者向けR02に流用しない。** LLM画像とR06の対応は所有者確認済み。

### ヒーロー

ユーザーの最新依頼に合わせて、画像の3D浮遊を廃止し、ポートフォリオの構造そのものをCSS 3Dで表現した。中央のLEARNからBUILD／STUDY／ENGINEER／IMPROVEへ接続する構成で、軌道・接続線・カードの奥行きが緩やかに動く。追加依存なし。

- ヒーロー内に画像・停止／再生ボタンを置かない。
- 操作を要求せず自動再生し、画面外・非表示タブでは自動停止。
- reduced-motionでは静止した3D構成を表示し、JS無効時も構成と本文を表示。
- 4領域の件数・設計対象を短いラベルで示し、装飾だけでなくサイトの情報設計を伝える。

### スクロール・SPA

原因はHomeの`scroll-behavior: auto`と、内部遷移にも通常の`<a>`を使用していたこと。既存の複数フレーム・フォント完了時の位置補正も、smooth指定だけではアニメーションを再起動するため修正した。

- `SiteLink`で内部リンクをNext.js Linkへ統一。詳細・次の制作・パンくず・ヘッダー・フッター・モバイルメニュー・404復帰をSPA化。
- 共通layoutに`NavigationController`を配置。通常の同一ページ内アンカーはsmooth、ページ切替・共有アンカー初期表示・戻る／進むの位置復元はinstant。
- 同一ページのクリックをcaptureで扱い、Nextのスクロールと二重処理しない。
- 次の入力やフォーカス選択で残った移動を中断し、スクロール完了時も履歴位置を保存する。
- SPAで戻った場合の開閉・位置・フォーカス復元を維持。移動元cleanupから移動先の履歴を上書きしない。
- JS無効時は通常のリンクとして利用可能。外部リンク・修飾キー操作も維持。

編集手順と判断の詳細は[デザイン更新記録](design-refresh.md)。

## 追加で必要な素材・情報

| ID | 作品 | 画像 | 公開URL |
|---|---|---|---|
| R01 | Multi-Vendor-E-Commerce | **未提供（優先）** | **未提供** |
| R02 | The-Wild-Oasis-For-Admin | 掲載済み | **未提供** |
| R03 | The-Wild-Oasis-For-User | 掲載済み | 掲載済み |
| R04 | AirbnbCloneApp | 掲載済み | **未提供** |
| R05 | Next-Store | 掲載済み | 掲載済み |
| R06 | Comparison-of-LLMs | 掲載済み | 掲載済み |
| R07 | Quality-Assurance-Studies | 掲載済み | 掲載済み |
| R08 | Software-Design-and-Architecture | 掲載済み | **未提供** |
| R09 | Management-Team-Building-Studies | 掲載済み | **未提供** |
| R10 | Cloud-Infrastructure-and-Network-Studies | 掲載済み | 掲載済み |
| R11 | Security_Studies | 掲載済み | 掲載済み |
| R12 | Medical-Studies | 掲載済み | **未提供** |
| R13 | Algorithm-DataStructures-Math-SQL | 掲載済み | 掲載済み |

画像は代表作で唯一未提供のR01を優先し、主画面と代表操作の画面があるとよい。公開可能なデモがない場合はURL未掲載でよい。未提供のURL・画面を推測して補完しない。

サイト全体で必要な情報:

- 掲載する肩書き・経歴・各作品の担当範囲。
- 公開可能なメールアドレスやSNS等の連絡先。
- **ポートフォリオ本体**の公開先とHTTPS URL（作品のデモURLとは別）。

## 検証の記録と限界

- `bun run test`: 9ファイル・30件成功。
- `bun run typecheck`・`bun run lint`・`bun run build`: 成功。
- Chromium／Firefox／WebKitの全E2E: 73成功。Chromium専用BFCache検証の他2ブラウザーは対象外。
- アンカー履歴の回帰は3ブラウザー×3反復の9件も成功。
- Homeと詳細4ページのaxe、JS無効、内部リンク、画像デコード、reduced-motion、320／768／1200／1440px・文字200%・フォント取得失敗、保存拒否・破損、履歴往復を検証。
- 新規E2Eはドキュメントが維持されるSPA遷移、スクロール中間位置、画像・操作ボタンを含まない自動3Dとreduced-motionを検証。
- PC／モバイル／ダークの画面を目視確認。追加のChromiumダークHome・モバイルHomeのaxeも違反0。
- Firefoxでは計測からクリックまでにレイアウト／スクロールアンカリングが位置を変えるケースを確認。テストの計測とクリックを同一タスクにし、実際の移動直前の位置を検証するよう修正。
- BFCacheテストはSPAリンクとは別に明示的なドキュメント移動を実行して維持。
- スクリーンショットは一時ディレクトリへ保存。永続成果物には含めていない。
- **Lighthouse・LCP・CLS・INP・実機・スクリーンリーダーは未測定。** リモートCIの実行結果も未確認。
- 既存の公開URL7件は前回の読み取り時にHTTP 200と内容を確認済み。認証・購入・外部書き込みや掲載情報の正確性まで検証したわけではない。

## 維持する仕様と次の作業

- Bun 1.3.12、Node.js 22.23.2。`bun run test`はVitest。
- Home＋Featured詳細4ページのstatic export。13リポジトリの掲載順と固定SHAの証拠を維持。
- 初期HTMLで本文を読める。`app/loading.tsx`は再導入しない。
- SEOは`SITE_URL`と`DEPLOYMENT_ENV`で切替。本体公開URLが決まったら本番設定で再ビルドする。previewのnoindexは意図した仕様。
- 新しい画像は`data/screens.ts`へ追加し、`bun run images:generate`。文言追加後は`bun run fonts:generate`。公開URLは`data/presentation.ts`へ追加。
- 素材・プロフィールを受領したら反映し、本番公開前に実機・支援技術・性能を確認する。push・デプロイは今回実施していない。
- `next-env.d.ts`には着手前からの生成差分があり、build／typegenでも更新される。今回のコミットから除外して残した。
