# デザイン・導線・品質の更新

更新日: 2026-09-17 JST。最初の3画像・7公開URLを含む改善は実装・検証済み。追加4画像はRedテストまでで反映待ち。最新の現在地と検証結果は[引き継ぎ](phase-4-handoff.md)を参照。

## 現在の表示

- Homeの抽象的な3D演出・Replayを、所有者提供のLLM実画面へ置換。
- LLMの作品カード・詳細・次の制作、品質保証とクラウドの学習カードに提供画像を配置。画像のない作品に架空のUIを作らない。
- 公開サイト7件へリンク。GitHub・詳細への導線も維持。
- ライト／OS設定に追従するダークテーマ。配色トークンと全レイアウトを`app/globals.css`へ統合し、`app/design.css`は削除。
- モバイルヘッダーはネイティブ`details`のメニュー。JavaScript有効時はリンク選択・Escapeで閉じる。JS無効でも開閉可能。
- 詳細はパンくずとスクロール連動目次を表示。目次は開閉でき、モバイルでは横スクロール、PCでは高さを画面内に制限して追従する。
- コード表はモバイルで縦積み。パスも含め最小0.85rem。制約は中立的な青系コールアウトへ変更。
- 次の制作に要約・技術タグを追加。404にホームボタンと要約・矢印付き作品リンクを追加。
- プロフィールには公開制作・学習内容のみを記載。考え方には既存コードに対応する具体例を追加。経歴・実務年数・担当範囲は未提供のため記載しない。

短い登場演出と上端ラインは本文を隠さない。reduced-motionでは停止する。`app/loading.tsx`は再導入しない。

## 画像と公開URLの編集

`data/presentation.ts`で公開URLを管理。以下は2026-09-17に所有者が提供したURLで、読み取り時にHTTP 200とページの内容を確認した。ログイン・購入・外部書き込み等の動作確認は行っていない。

| ID | 対象 | 公開サイト |
|---|---|---|
| R06 | Comparison-of-LLMs | https://comparison-of-llms.netlify.app/ |
| R07 | Quality-Assurance-Studies | https://quality-assurance-studies.netlify.app/ |
| R10 | Cloud-Infrastructure-and-Network-Studies | https://cloud-infrastructure-studies.netlify.app/ |
| R11 | Security_Studies | https://security-studies.netlify.app/ |
| R13 | Algorithm-DataStructures-Math-SQL | https://algorithm-datastructures-math-studies.netlify.app/ |
| R03 | The-Wild-Oasis-For-User | https://thewildoasisnextdemo-myoshizumis-projects.vercel.app/ |
| R05 | Next-Store | https://nextstore-sable-pi.vercel.app/ |

Wild Oasisは「Welcome to paradise.」の宿泊者向けサイト。管理者向けR02に誤って紐付けない。公開版と監査対象の固定コミットが同じとは保証していない。

`components/projects/screen-preview.tsx`が画像・代替文・ブラウザ枠を表示する。提供画像は`public/images`のPNGを原本として保持。LLM画像とR06の対応は所有者に確認済み。表示用WebPは次で再生成する。

```sh
bun run images:generate
```

`public/images/optimized`の640／1280／1854pxをコミットする。`picture`のsrcsetで表示幅に応じて選択し、PNGをfallbackにする。幅・高さを予約、下部の画像は遅延読込、ヒーローは優先読込。新しい画面を追加する場合は生成スクリプトの対応表も更新する。

## フォントとスタイル

日本語の`fonts.css`はInterとの二重読込ではない。Noto Sans JP用の定義を、現在の`app`・`components`・`data`内の文字に絞って生成する。WOFF2本体は変更せず、400／500／600を維持する。

```sh
bun run fonts:generate
```

`dev`起動前と`build`時にも自動生成する。開発中に新しい文字を追加した場合もこのコマンドで再生成する。`app/fonts.css`は生成物としてコミットし、直接編集しない。対象に含まれない動的コンテンツは現在なく、今後追加する際は文字収集範囲を見直す。

- フォントCSS: 305,603 → 34,318 bytes（88.8%削減）。
- LLM画像: PNG 666,454 bytes → WebP 19,290／55,682／89,070 bytes。
- 画面サイズに応じた配信で転送量を抑える。元PNGや未使用のフォントファイルは静的出力に残るが、通常表示時に全件転送しない。

## アンカーと履歴の修正

Firefoxのキーボード操作失敗は、アンカー移動後の2回目のrequestAnimationFrameやフォント完了時の移動が、後から選んだフォーカスを奪うことが原因。アプリ自身の移動と次のfocusinを区別し、後者で未完了の位置調整を無効にする。

WebKitの戻る・進む失敗は、フォント完了時の移動が最初のフレームより先に実行され、履歴に古いfocusIdが残る競合。移動後すぐにフォーカスと位置を保存するよう統一した。待機の水増しやテスト削除で回避していない。

詳細のアンカーはsmooth、reduced-motionではauto。Homeは保存位置・履歴復元を優先するためautoを維持する。全体にsmoothを指定すると履歴の位置保存と干渉するため、レビュー案をそのまま適用しない。

## 機能説明の根拠

`data/feature-guides.ts`の8機能について、紹介理由・HTMLの処理図・参照コード表を維持。説明と具体例は[Phase 0の監査](phase-0-repository-evidence-audit.md)に基づく。参照URL・固定SHAは変更していない。

## 追加画像の反映待ち

Medical Studies（R12）、Management Studies（R09）、Next-Store（R05）、The Wild Oasis宿泊者向け（R03）の原本4枚を追加受領。目視確認とRedテストは済んでいるが、対応表追加・Secondaryへの表示・WebP生成は未実施。画像対応表の共通化も次の作業。

## 追加情報が必要な項目

- EC、Wild Oasis管理者向けなど未提供の実画面。医学質問票を含む追加4枚は提供済みで反映待ち。作品別の不足一覧は[引き継ぎ](phase-4-handoff.md)を参照。
- 掲載する肩書き・経歴・各作品の担当範囲、公開可能なメールやSNS。
- ポートフォリオ本体の公開URLとホスト。制作物のデモURLとは別。

本番公開前の実機・支援技術・Lighthouse・実ユーザー性能の検証、CIのリモート実行、push・デプロイは未実施。
