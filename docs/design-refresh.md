# デザイン・導線・品質の更新

更新日: 2026-10-02 JST。現在の表示・仕様は[現行仕様](current-specification.md)、実行した検証と限界は[引き継ぎ](phase-4-handoff.md)を参照。

## 現在の表示

- Homeの全13リポジトリに代表プレビュー、4詳細に資料から編集した説明と実画面ギャラリー（10／9／11／4枚）を配置。
- 詳細にはMarkdown表とMermaid SVG各3図。図中文字は1rem、縮小せず図の領域内を横スクロール。ASCII図解は使用しない。
- 詳細のGitHubリンクは共通ヘッダーを含めすべて削除。HomeのGitHub・公開URL7件への導線は維持。
- 全画面のヘッダーでライト／ダークを切り替え。選択保存をOSより優先し、未選択ならOS追従。SPA・reload・タブ同期・保存拒否に対応。
- 最終ライトは白・チャコール・シルバーを基調にブルー一点。Heroのブルーの立体パネルとシルバーの軌道、10秒周期の反射が特徴。途中の制作別多色パレットは廃止。
- Heroは学習・制作・設計・改善をCSS 3Dで表現し、作品画像と操作ボタンを置かない。画面外・非表示タブで停止、reduced-motionとJS無効時は静止。
- モバイルはネイティブdetailsメニュー、詳細はパンくずと現在節の目次。内部ページ遷移はSPA、通常アンカーはsmooth、履歴・ページ切替・共有hash初回はinstant。
- 肩書き・経歴・担当範囲・連絡先は未提供のため補わない。作品画像を架空のUIで代用しない。

## 詳細本文・図の編集

[基準資料・編集本文・節IDの対応表](current-specification.md#ページと情報源)に従い、`data/*-detail.md`を更新します。資料更新日・品質統計日・画面更新日を分け、資料の結果を現在の保証へ置き換えません。旧`data/project-details.ts`・`data/feature-guides.ts`の編集は現在の4詳細本文へ反映されません。

`DocumentedProjectDetail`はLLM・Medical・Wild Oasisの共通描画、Multi Vendorは注文節を持つ専用描画。react-markdownとremark-gfmで本文・表を表示し、Mermaidソースを生成済みSVGへ置き換えます。章数と目次、図の説明を合わせて更新してください。

```sh
bunx playwright install chromium
bun run diagrams:generate
# Multi Vendorだけ更新
bun run diagrams:commerce
bun run fonts:generate
```

生成スクリプトはローカルMermaidを使い、ソースhashをファイル名に含めます。変更後にSVGを生成しないと表示時の読み込みが失敗します。通常buildはSVG生成を自動実行しません。表示時にMermaidをブラウザへ配信せず、図の文字サイズはviewBoxから求めたrem幅で維持します。

## 画像の編集

PNGの差し替えだけではHomeで優先表示するWebPは更新されません。差し替え後は`bun run images:generate`を実行し、同じファイル名を使う場合は`data/screens.ts`の任意の`revision`も更新します。ScreenPreviewはWebPとPNGのURLへ`?v=<revision>`を付け、古いブラウザーキャッシュの再利用を防ぎます。R01の今回の差し替えは`20261002-2`です。

Homeの代表画像は`data/screens.ts`にfile・alt・titleを登録し、`ScreenPreview`と画像生成スクリプトで共用します。PNG原本は保持し、WebPを生成します。

```sh
bun run images:generate
```

生成先は`public/images/optimized`、指定幅640／1280／1854、原本を拡大しない設定です。pictureのsrcsetで選び、PNGをfallbackにします。今回のR01は`multi-vendor-e-commerce/storefront-home-hero.png`、WebPは`r01-640.webp`・`r01-1280.webp`・`r01-1854.webp`です。

詳細ギャラリーは各`components/projects/*-slideshow.tsx`の配列に画像・タイトル・altを登録します。Home用の対応表への登録だけではギャラリーに追加されません。保存先・枚数・Multi Vendor10枚の旧名と新名は[現行仕様の画像一覧](current-specification.md#実画面とギャラリー)を参照してください。

共通ギャラリーは水平移動とloop、5秒自動送り、前後・一時停止／再生操作を持ちます。hover・フォーカス・非表示タブ・reduced-motionで自動送りを抑制。初期HTMLは先頭画像を表示、操作ボタンはhydration後に提供します。JS無効時に全画像を切り替えられるとは記載しません。

## 公開URL

`data/presentation.ts`で7件を管理します。以下は2026-09-17に提供・読み取り確認したURLで、公開版と固定SHAの一致、認証・購入・外部書き込みは検証していません。

| ID | 対象 | 公開サイト |
|---|---|---|
| R06 | Comparison-of-LLMs | https://comparison-of-llms.netlify.app/ |
| R07 | Quality-Assurance-Studies | https://quality-assurance-studies.netlify.app/ |
| R10 | Cloud-Infrastructure-and-Network-Studies | https://cloud-infrastructure-studies.netlify.app/ |
| R11 | Security_Studies | https://security-studies.netlify.app/ |
| R13 | Algorithm-DataStructures-Math-SQL | https://algorithm-datastructures-math-studies.netlify.app/ |
| R03 | The-Wild-Oasis-For-User | https://thewildoasisnextdemo-myoshizumis-projects.vercel.app/ |
| R05 | Next-Store | https://nextstore-sable-pi.vercel.app/ |

Wild Oasisの公開URLは宿泊者向けR03。管理者向けR02へ流用しません。

## フォントとテーマ

フォントCSSは`app`・`components`・`data`内のTS／TSX／CSS／Markdownから日本語文字を集めて生成します。`docs/`の仕様書変更だけでは画面フォントの再生成は不要です。Noto Sans JPの400／500／600とWOFF2原本を維持し、CSS定義を必要範囲へ絞ります。Interはローカル配信です。

```sh
bun run fonts:generate
```

dev起動前とbuild時にも生成。表示本文やaltを変更したら再実行し、`app/fonts.css`を管理します。このセッションの生成結果は50,863 bytes。過去の35,860 bytesは当時の本文に対する結果です。

配色は`app/globals.css`に統合。`lib/theme.ts`とThemeToggleが選択保存・OS追従・タブ同期を扱い、layoutの初期スクリプトが保存値を適用します。全トークン・保存拒否・JS無効時の契約は[現行仕様のテーマ](current-specification.md#全画面共通のテーマ)を参照。

## 従来の改善と継続事項

2026-09-17のSPA・スムーズスクロール・履歴復元改善を維持します。NavigationControllerはpathnameごとにDOMを更新し、同一ページアンカーをcaptureで処理してNextのスクロールと二重実行しません。次の入力・focusで未完了の移動を中断し、cleanupから移動先の履歴を上書きしません。Firefox／WebKitの履歴・フォーカス修正は当時検証済みで、今回の全3ブラウザ再実行とは区別します。

Medicalのブラウザ風バーの「views」表記はスライド件数から算出し、操作カウンターと同じ11枚を示す。その他の未提供URL、経歴・担当範囲・連絡先、本体の公開先、実機・支援技術・性能・リモートCIは引き続き確認が必要です。
