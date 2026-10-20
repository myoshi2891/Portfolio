# NavigationController の設計メモ

`components/home/navigation-controller.tsx` は、全ページの同一ページ内アンカー移動、履歴ごとのスクロール・開閉・フォーカスの保存と復元、ルート変更時のフォーカス移動を担当します。このメモは、変更する前に守るべき状態と不変条件をまとめたものです。純粋な処理は `lib/navigation-state.ts`（状態の検証と保存）と `lib/navigation-ids.ts`（ID の生成、ハッシュの解決、同一ページ判定）にあり、単体テストがあります。

## 保存する状態

`NavigationState`（`version`・`id`・`openIds`・`scrollY`・`focusId`）を、`history.state.portfolioNavigation` と `sessionStorage` の `portfolio.navigation.v1`（最新20件）の両方に保存します。読み込むときは `parseNavigationState` で検証し、現在のページに存在しない ID を含む状態は捨てます。

## エフェクトの開始時（ルートごと）

1. `a`・`summary`・`button` のうち ID がないもの（または前回生成したもの）に、`returnIds` で ID を付けます。ID は要素の種類・`href`・アクセシブルな名前から決まり、DOM の順番には依存しません。hydration の後に現れる操作部品（テーマ切替、ギャラリーのボタン）が増えても、他の要素の ID は変わりません。
2. `main h1` と、`main section[id]` の見出しに ID と `tabIndex=-1` を付けます。
3. ページ内の全 ID を `allowed` にします。保存・復元・ハッシュ解決は、この集合の ID だけを扱います。
4. 状態を読み込めたら復元します。読み込めなければハッシュの対象を表示し、ルート変更ならページ先頭と `h1` へ移動します。

## イベントと遷移

| 契機 | 動作 |
| --- | --- |
| 同一ページのアンカーをクリック（修飾キーなし、主ボタン） | 現在の状態を保存し、ハッシュが変わるなら新しい `entryId` で `pushState` する。対象を含む `details` を開き、見出しにフォーカスしてからスクロールする |
| `popstate` | 同じルートなら状態を復元する。状態がなければハッシュの対象を表示する |
| `toggle`・`focusin`・`scrollend`・`pagehide` | 保存する |
| `scroll` | 150ms 間引いて保存する |
| `pageshow`（BFCache から復元） | `scrollRestoration` を `manual` に戻し、保存し直す |
| `pointerdown`・`keydown`・`wheel`・`touchstart` | 利用者の操作として `userRevision` を進め、実行中のスムーズスクロールを止める |

## 不変条件

- **復元中は保存しない**: `restoring` が真の間の `save()` は何もしません。復元途中の位置で状態を上書きしないためです。
- **利用者の操作が優先**: `afterLayout` の補正（次のフレーム、フォント読み込み後）は、予約した時点から `userRevision` が変わっていれば実行しません。
- **スムーズスクロールは1回だけ始める**: スムーズに移動するときは補正を予約しません。開始し直すと、ブラウザのアニメーションが止まり、途中の位置が保存されるためです。
- **フォーカスはスクロールより先**: スクロールの後に `focus()` を呼ぶと、`preventScroll` を付けてもスムーズな移動が止まることがあります。
- **後片付けでは保存しない**: エフェクトの後片付けの時点で、URL はすでに遷移先のものになっていることがあります。古い DOM を新しい URL の状態として保存しないよう、`active` を偽にします。
- **同一ページのアンカーの担当は1つ**: Next.js の `Link` より先に、キャプチャ段階でクリックを処理します。
- **印刷は開閉状態を変えない**: `toggle` で保存するため、印刷用の CSS は `open` を変えずに `details::details-content` で中身を表示します。

## 変更するとき

- 純粋な処理は `lib/` に置き、単体テストを付けます。
- 復元やフォーカスの変更は、3ブラウザの E2E（`e2e/navigation.spec.ts`・`e2e/spa.spec.ts`・`e2e/navigation-return-ids.spec.ts`）で確認します。WebKit はクリックしたボタンやリンクにフォーカスしないこと、Firefox は履歴の移動中に実行コンテキストを入れ替えることがある点に注意します。
