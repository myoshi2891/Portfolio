# Phase 4 — セッション引き継ぎ

更新日: 2026-09-17 JST。ユーザーの「引き継ぎをして」により実装作業を中断。

## 最優先の現在地

**最初の3画像・7公開URLとUI改善は実装・検証済み。追加4画像は原本確認とRedテストまでで、まだ表示されない。** 次はこの4画像を反映するGreen実装から再開する。

- ブランチ: `dev`。push・デプロイは未実施。
- 改善実装の確定コミット: `b5b3011`。
- 追加画像のRedテスト: `c7046c0`（`__tests__/refinement.test.tsx`）。
- 現在の単体テスト: **28成功・1失敗**。失敗は追加4画像がまだ表示されないことを確認する意図したRed。削除・スキップしない。
- 最終の静的出力E2E: **61成功・2対象外、失敗0**（`bun run test:e2e --workers=1`）。追加4画像の実装前にビルドしたサイトに対する結果。
- 引き継ぎ時点でテスト・ビルドの実行中プロセスはない。今回起動した静的プレビューは`http://127.0.0.1:4173`で稼働。ユーザーの開発サーバーは停止していない。

## 今回の依頼と合意

1. 本書と[改善レビュー](critical-review-and-improvements.md)を確認し、残作業とブラッシュアップを実施。
2. 所有者が提供した画像・公開URLを反映。
3. `LLM Studies.png`はComparison-of-LLMs（R06）の画面として使用してよいと確認済み。
4. 画像・リンクは今後も随時追加予定。**最後に残りの必要素材・情報を一覧にして伝えること。**
5. 経歴・肩書き・担当範囲・連絡先はまだ提供されていない。推測して埋めない。

## 完了した改善

- 抽象的な3DスタックとReplayを削除し、ヒーローにLLMの実画面を配置。
- R06のカード・詳細・次の制作、R07とR10の学習カードに画像を表示。
- 所有者提供の公開サイト7件を`data/presentation.ts`で管理し、カード・該当詳細からリンク。
- `app/design.css`を削除、`app/globals.css`へスタイルを統合。OS設定に追従するダークテーマとフォーカスリングを整備。
- モバイルメニュー、詳細のパンくず、スクロール連動目次、スマートフォンのコード表の縦積み、読みやすい文字サイズ、制約の中立的な色、404と次の制作の導線を改善。
- 公開内容に基づくプロフィールと、コードに対応した考え方の具体例を追加。個人の経歴や成果は創作しない。
- Firefoxのキーボード操作失敗を修正。遅れたアンカー位置調整が後から選んだフォーカスを奪うことを防止。
- WebKitの履歴復元を修正。フォント完了時の移動後に古いfocusIdが履歴に残る競合を解消。
- フォントCSSを305,603→34,318 bytesへ縮小。日本語用でありInterの重複ではないため、削除ではなく必要文字の定義を生成する方式。
- 最初の3画像に640／1280／1854pxのWebPを生成。LLM原本666,454 bytesに対し、配信用は19,290／55,682／89,070 bytes。原本は維持。

編集方法・判断の詳細は[デザイン更新記録](design-refresh.md)。

## 再開する追加画像

すべて1854×917pxの原本を目視確認済み。以下の4枚は保存済みだが、画面への紐付け・WebP生成は未実施。

| 原本 | 対応 | 確認した画面 | 次の表示先 |
|---|---|---|---|
| `public/images/Medical Studies.png` | R12 / Medical-Studies | 頭痛PROMのダッシュボード | Home代表作・医学詳細・次の制作 |
| `public/images/Management Studies.png` | R09 / Management-Team-Building-Studies | マネジメント学習ライブラリ | 追加学習カード |
| `public/images/Next-Store.png` | R05 / Next-Store | 商品ストアのトップ | その他の制作カード |
| `public/images/The Wild Oasis.png` | R03 / The-Wild-Oasis-For-User | Welcome to paradise. / Cabins・Guest area | その他の制作カード |

**Wild Oasisの画像・Vercel URLは宿泊者向けR03。管理者向けR02に流用しない。**

### 次の具体的な作業

1. `git status`と本書を読み、`bun run test __tests__/refinement.test.tsx`でRedの内容を確認。
2. 画像対応表を追加する。現状は`components/projects/screen-preview.tsx`と`scripts/prepare-images.ts`で対応表が重複している。今後の追加に備え、`data/screens.ts`等へ共通化する案をユーザーへ伝えているが、**まだ実装していない**。
3. `ProjectCard`は現在`featured && <ScreenPreview ... />`なので、SecondaryのR03・R05にも表示するよう変更。`StudyCard`と詳細はID対応表を追加すれば既存の表示経路を使える。
4. `bun run images:generate`で追加分のWebPを生成。代替文と画像サイズを設定し、原本を変更しない。
5. `bun run fonts:generate`、単体、型、Lint、build、画像読込・はみ出し・axe・履歴を含む関連E2Eを検証。新しい画像を含むPC／モバイルの実画面も確認。
6. Green実装をローカルコミットし、README・本書・design-refreshの画像件数と結果を更新する。段階コミットとステージ済み差分のパス検査を継続。

## 素材・リンクの残タスク一覧

「画像未提供」と「提供済みだが反映待ち」を区別する。未提供の公開URLを推測しない。

| ID | 作品 | 画像 | 公開URL |
|---|---|---|---|
| R01 | Multi-Vendor-E-Commerce | **未提供** | **未提供** |
| R02 | The-Wild-Oasis-For-Admin | **未提供** | **未提供** |
| R03 | The-Wild-Oasis-For-User | 提供済み・反映待ち | 掲載済み |
| R04 | AirbnbCloneApp | **未提供** | **未提供** |
| R05 | Next-Store | 提供済み・反映待ち | 掲載済み |
| R06 | Comparison-of-LLMs | 掲載済み | 掲載済み |
| R07 | Quality-Assurance-Studies | 掲載済み | 掲載済み |
| R08 | Software-Design-and-Architecture | **未提供** | **未提供** |
| R09 | Management-Team-Building-Studies | 提供済み・反映待ち | **未提供** |
| R10 | Cloud-Infrastructure-and-Network-Studies | 掲載済み | 掲載済み |
| R11 | Security_Studies | **未提供** | 掲載済み |
| R12 | Medical-Studies | 提供済み・反映待ち | **未提供** |
| R13 | Algorithm-DataStructures-Math-SQL | **未提供** | 掲載済み |

画像はまず代表作のR01・R02を優先。主画面と代表操作の画面があるとよい。公開可能なデモがない場合はそのまま未掲載でよく、URLを作ることを必須にしない。

サイト全体として必要な情報:

- 掲載する肩書き・経歴・各作品の担当範囲。
- 公開できるメールアドレスやSNS等の連絡先。
- **ポートフォリオ本体**の公開先とHTTPS URL（制作物のデモURLとは別）。

## 検証の記録と限界

- 追加4画像のRedを加える前: 単体28件成功、型・Lint・静的build成功。
- 追加4画像のRed追加後: 単体28成功・1失敗。型・Lintも引き継ぎ直前に成功。
- 最終E2E: 63件中61成功、Chromium専用BFCache検証のFirefox／WebKit 2件は対象外。
- Firefox／WebKitの回帰と320px・文字200%の関連E2Eは、3ブラウザー×3反復で27件成功。
- 2worker実行ではFirefoxモーションテストのブラウザー接続が一度停止（`Object with guid ... was not bound`）。単独3反復成功後、1workerの全件実行も成功。アプリの既知失敗としては残っていないが、同時実行環境の制約は未特定。
- Homeと詳細4ページのaxeは3ブラウザーで成功。追加でChromiumのPC・モバイルHome、ライト／ダークHome、モバイル／ダーク詳細、ダーク404を検査して違反0。
- JavaScript無効、内部リンク、画像のデコード、reduced-motion、320／768／1200／1440px・文字200%・フォント取得失敗、保存拒否・破損、履歴往復を検証。
- ローカル画面キャプチャは一時ディレクトリに保存したが、永続成果物には含めていない。
- WebPとフォントCSSのファイルサイズのみ計測。**Lighthouse、LCP、CLS、INP、実機、スクリーンリーダーは未測定。**
- GitHub Actionsのリモート結果は未確認。ローカル成功をCI成功と書かない。
- 公開URL7件は読み取り時のHTTP 200と画面内容を確認。認証・購入・外部書き込み・掲載情報の正確性まで検証したわけではない。

## 維持する仕様

- Bun 1.3.12、Node.js 22.23.2。`bun run test`はVitest。追加依存なし。
- Home＋Featured詳細4ページのstatic export。13リポジトリの掲載順と固定SHAの証拠を維持。
- 初期HTMLで本文を読める。`app/loading.tsx`を再導入しない。
- `SITE_URL`と`DEPLOYMENT_ENV`でSEOを切替。previewのnoindexは意図した仕様。本番の実URLがない状態で無条件にindexを許可しない。
- Homeのスクロールは履歴保存との整合のためauto、詳細はsmooth。reduced-motionではauto。
- 未提供の経歴・担当範囲・連絡先・運用実績を補完しない。
- 元レビューの誤認と対応判断は`critical-review-and-improvements.md`冒頭に補足済み。

## 未コミット差分について

引き継ぎ文書と追加画像の原本・Redテストはローカルコミットして保存する。`next-env.d.ts`の`.next/dev/types`→`.next/types`はbuild／typegenによる自動生成差分。手書き実装に混ぜず、そのまま残している。`git status`で再確認し、破棄・一括コミットしない。
