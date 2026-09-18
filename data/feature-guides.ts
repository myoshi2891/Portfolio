import type { EvidenceId } from "./evidence";

export type FeatureGuide = {
  title: string;
  reason: string;
  steps: readonly string[];
  readings: Readonly<Record<string, string>>;
};

// Reading guides summarize the fixed-commit findings in the Phase 0 audit.
export const featureGuides: Partial<Record<EvidenceId, FeatureGuide>> = {
  "R01-F01": {
    title: "店舗と商品の管理",
    reason: "商品登録を画面だけで捉えず、入力を受け取るフォームと、商品・店舗を保存する処理の役割を読み解くために取り上げています。",
    steps: ["商品フォームで入力", "商品更新処理を呼び出す", "商品・バリアントを保存"],
    readings: {
      "src/components/dashboard/forms/product-details.tsx:L266–L292": "入力画面の入口。フォームから商品更新処理を呼ぶ箇所を確認できます。",
      "src/queries/product.ts:L184–L238": "保存側の処理。商品・バリアントをデータベースで扱う箇所です。",
      "src/queries/store.ts:L72–L100": "関連する店舗管理。商品更新とは別に、店舗を作成・更新する処理を確認できます。",
    },
  },
  "R01-F02": {
    title: "所有者を確認して注文を作成",
    reason: "購入ボタンから注文保存までを追い、カートや配送先の所有者をどこで確認するか、複数の書き込みをどこでまとめるかを示すためです。",
    steps: ["チェックアウト画面", "placeOrderを呼び出す", "所有者を確認", "注文をまとめて保存"],
    readings: {
      "src/components/store/checkout-page/container.tsx:L11–L23": "画面の入口。チェックアウト画面が必要なデータを受け取る箇所です。",
      "src/components/store/cards/place-order.tsx:L31–L54": "操作と処理の接点。注文操作からplaceOrderを呼び出す箇所です。",
      "src/queries/user.ts:L608–L650": "注文処理の前半。カート・配送先と利用者の関係を確認する処理を読めます。",
      "src/queries/user.ts:L761–L815": "注文処理の保存部分。トランザクション内で注文を作成する箇所を読めます。",
    },
  },
  "R06-F01": {
    title: "利用量からAPI費用を計算",
    reason: "入力条件、比較表、計算関数のつながりを示すためです。画面に表示された金額を、どの入力と計算処理から得ているか追えます。",
    steps: ["トークン数・期間を入力", "比較表に条件を渡す", "calcApiCostで計算"],
    readings: {
      "web-next/components/HomePage.tsx:L108–L125": "入力条件を画面から比較表へ渡す箇所。費用計算の入口です。",
      "web-next/components/ApiTable.tsx:L63–L75": "比較表と計算関数の接点。受け取った条件で費用を計算する呼び出しを確認できます。",
      "web-next/lib/cost.ts:L33–L65": "計算の本体。入力・出力トークンと期間を費用に反映するロジックを確認できます。",
    },
  },
  "R06-F02": {
    title: "料金の収集と取得失敗時の処理",
    reason: "料金データの出どころと、取得に失敗した場合の振る舞いを説明するためです。既存値やfallbackを使うため、表示値が常に最新とは限りません。",
    steps: ["収集CLIを実行", "料金ページを取得", "取得値・既存値等を採用"],
    readings: {
      "scraper/src/scraper/main.py:L66–L119": "収集の起点。各プロバイダーの収集処理を呼び出す流れを確認できます。",
      "scraper/src/scraper/browser.py:L31–L55": "ページ取得の共通処理。Playwrightを使ってテキストを取得する箇所です。",
      "scraper/src/scraper/providers/openai.py:L195–L220": "プロバイダー別の具体例。取得結果とfallbackを扱う経路を確認できます。",
    },
  },
  "R12-F01": {
    title: "回答の検証・計算・記録",
    reason: "フォーム入力から計算と保存までの責務の分け方を示すためです。ここではコードの構成を説明しており、質問票の医学的妥当性は評価していません。",
    steps: ["質問票に回答", "回答を検証・計算", "ブラウザー内に記録"],
    readings: {
      "web-next/components/prom/views/PromForm.tsx:L50–L95": "回答の入口。フォームからスコア計算を呼び出す流れを確認できます。",
      "web-next/lib/prom/scoring.ts:L41–L62": "計算前の検証。回答を受け取り、検証する処理を確認できます。",
      "web-next/lib/prom/scoring.ts:L126–L131": "スコア計算の呼び出し部分。画面から分離された計算処理を確認できます。",
      "web-next/lib/prom/storage.ts:L38–L79": "記録の保存先。localStorageへの保存とJSON入出力を扱う実装です。",
    },
  },
  "R12-F02": {
    title: "記録をCSV・Google Sheetsへ出力",
    reason: "保存済みの記録を外へ取り出す処理が、画面や計算からどう分離されているかを示すためです。CSV生成と外部APIへの書き込みの違いも確認できます。",
    steps: ["出力処理を選択", "記録を出力形式に変換", "CSV生成 / Sheets書き込み"],
    readings: {
      "web-next/lib/export/registry.ts:L6–L13": "出力方式の登録。CSVとGoogle Sheetsのexporterをまとめる箇所です。",
      "web-next/components/prom/useExporters.ts:L1–L13": "画面側の接点。登録された出力処理を画面で扱うためのフックです。",
      "web-next/lib/export/csv.ts:L36–L60": "ファイル出力。記録からCSVを生成し、ダウンロードする処理です。",
      "web-next/lib/export/google/googleSheetsExporter.ts:L85–L116": "Sheets向け出力。行を更新・追加する処理の流れを確認できます。",
      "web-next/lib/export/google/sheetsClient.ts:L89–L109": "外部APIとの接点。アクセストークンを使うSheetsクライアントの実装です。接続成功の証明ではありません。",
    },
  },
  "R02-F01": {
    title: "客室データと画像を保存",
    reason: "フォーム、フック、サービスを順に読むことで、画面の操作とデータ保存の役割分担がわかるためです。客室データと画像が別の保存処理を持つ点も見どころです。",
    steps: ["客室フォームで入力", "useCreateCabin", "データ保存・画像アップロード"],
    readings: {
      "src/features/cabins/CreateCabinForm.tsx:L11–L23": "入力画面の入口。客室作成用のフックを利用する箇所を確認できます。",
      "src/features/cabins/useCreateCabin.ts:L12–L27": "画面とサービスの仲介。createEditCabinを呼ぶフックです。",
      "src/services/apiCabins.ts:L44–L95": "保存の本体。客室テーブルへの書き込みと画像アップロードを確認できます。",
    },
  },
  "R02-F02": {
    title: "チェックインとログイン",
    reason: "チェックインという業務操作が、予約データの状態更新へどうつながるかを示すためです。ログイン処理は管理画面へのアクセスに関する別の入口として紹介しています。",
    steps: ["チェックイン操作", "updateBookingを呼び出す", "予約の状態を更新"],
    readings: {
      "src/features/check-in-out/useCheckin.ts:L24–L39": "操作の入口。チェックイン操作から予約更新を呼ぶフックです。",
      "src/services/apiBookings.ts:L183–L195": "予約の更新処理。フックから受け取った変更を保存する箇所です。",
      "src/services/apiAuth.ts:L37–L49": "独立したログイン処理。メール・パスワードでSupabaseの認証を呼び出す箇所です。",
    },
  },
};
