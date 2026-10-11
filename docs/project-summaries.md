# カード内の学習資料説明

学習資料カードの概要は `data/studies.ts`、詳しい説明はMarkdownで管理します。学習資料6件は全画面幅で1列に並び、それぞれ「学習内容」「資料の探し方」「活用方法」をカード内に表示します。先頭3件と追加3件の開閉は維持します。

各カードは、見出し・要約・公開サイトへのリンクと実画面の画像を組み合わせた導入、詳しい説明、GitHubへのリンクの順に構成します。960px以上では導入の見出しと画像を左右に配置し、それより狭い画面では縦に並べます。説明は見出しと本文の余白で区切り、Markdown表の枠を控えめにし、「活用方法」はアクセント色を使った背景で強調します。説明は折りたたまず常時表示します。

## 説明を追加する手順

1. 基準となる資料を確認し、`data/evidence.ts` に根拠を登録します。提供された概要資料は `USER_PROVIDED` として扱い、`sourceLocation` に資料のリポジトリ内パスを指定します。
2. `data/` に説明のMarkdownを追加します。カードの見出しがh3なので、説明内の見出しは `####`（h4）とし、「学習内容」「資料の探し方」「活用方法」の順に記述します。機能はMarkdownの表やリストで記述し、ASCII図解は使用しません。
3. `data/project-summaries.ts` にリポジトリIDをキーとして登録します。

| 登録項目 | 用途 |
|---|---|
| `contentPath` | 表示するMarkdownファイル |
| `evidenceIds` | 説明の根拠となる資料・コード |
| `imageDirectory` | `public/images/` 内のMermaid SVG保存先 |
| `diagrams` | Markdown内のMermaid図の出現順に対応する代替説明。図がなければ空配列 |

## 図と検証

フローチャートはMarkdown内の `mermaid` コードブロックで記述します。図を追加・変更した場合は `bun run diagrams:generate R09` のように登録したリポジトリIDを指定してSVGを生成します。図は静的画像として表示されるため、閲覧時のJavaScriptは不要です。

`bun run build` で説明ファイル、根拠資料、図の代替説明とSVGの整合性を検証します。型検査・lint・単体テストに加え、`e2e/study-summaries.spec.ts` で画面幅ごとの表示とJavaScriptなしの閲覧を確認できます。

Markdown表示とMermaid生成は制作アプリの説明にも再利用できます。制作カードへ展開する際は、同じレジストリを参照し、共通の `MarkdownDocumentContent` を配置します。

「その他の制作」の3件も同じレジストリを参照します。概要に加えて、利用者ができることを短いMarkdownの文章で表示し、実装補足の折りたたみは設けません。カードは1列に並べ、960px以上では実画面と説明を左右に、それより狭い画面では縦に配置します。公開URLが登録されているアプリだけ公開サイトへのボタンを表示し、3件ともGitHubへのリンクを表示します。

Managementは `docs/PROJECT-DETAILS/OVERVIEW-Management-Studies.md`、ほかの5件は `docs/phase-0-repository-evidence-audit.md` と各サイトの既存根拠をもとに編集しています。学習サイトの内容や使い方を説明し、資料で確認できない機能は追加しません。
