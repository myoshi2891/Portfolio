# noto-sans-jp ローカルフォント

取得元: `@expo-google-fonts/noto-sans-jp`（`bun.lock`で固定、版は[files.json](files.json)）が同梱する分割前のTTF。上流は[Google Fonts](https://github.com/google/fonts)。

ライセンスは[LICENSE.txt](LICENSE.txt)（OFL-1.1）、上流の著作権情報は[metadata.json](metadata.json)、配信ファイル一覧は[files.json](files.json)を参照してください。

400・600のnormalを使用。`bun run fonts:generate`が`subset-font`で、`app`・`components`・`data`の本文に含まれる文字だけを残したWOFF2をウェイトごとに1ファイル生成します（フォント名は変更しません）。`app/fonts.css`から読み込み、preloadはしません。本文を変えたら再生成し、生成物もコミットします。
