# noto-sans-jp ローカルフォント

取得元: `@fontsource/noto-sans-jp@5.3.0`（`bun.lock`で固定）。上流は[Google Fonts](https://github.com/google/fonts)。Fontsource同梱のWOFF2を改変せず配置しています。

ライセンスは[LICENSE.txt](LICENSE.txt)（OFL-1.1）、上流のバージョン・著作権情報は[metadata.json](metadata.json)、配信ファイル一覧は[files.json](files.json)を参照してください。

400・500・600のnormalを使用。日本語は元のWOFF2分割を維持し、`bun run fonts:generate`で現在の本文に必要な文字へunicode-rangeを絞ります。`app/fonts.css`から必要なファイルを読み込みます。WOFF fallbackのみ省き、全ファイルのpreloadはしません。
