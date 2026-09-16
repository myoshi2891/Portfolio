import type { ProjectDetail } from "../types/portfolio";
import type { FeaturedSlug } from "./projects";
import type { EvidenceId } from "./evidence";
import type { LimitationId } from "./limitations";

export const projectDetails = {
  "multi-vendor-e-commerce": { sections: {
    features: { claims: [
      { text: "商品フォームから商品更新処理を呼び出し、店舗・商品・バリアントを管理します。", evidenceIds: ["R01-F01"] },
      { text: "チェックアウトではカート・配送先の所有者を確認し、トランザクション内で注文を作成します。", evidenceIds: ["R01-F02"] },
    ], limitationIds: [] },
    architecture: { claims: [{ text: "画面、Server Actions、Prismaによるデータベース処理を分けた構成です。Clerkを利用したロール・店舗所有者の確認を実装しています。", evidenceIds: ["R01-A01", "R01-A02"] }], limitationIds: [] },
    decisions: { claims: [{ text: "Stripe・PayPalの決済作成と、Stripe Webhookによる支払状態更新の処理を実装しています。", evidenceIds: ["R01-F03"] }], limitationIds: ["R01-M02"] },
    quality: { claims: [{ text: "Jest・Playwrightの設定と、lint・テスト・build等のCI定義を確認しています。", evidenceIds: ["R01-Q01", "R01-Q02"] }], limitationIds: ["R01-M03"] },
  } },
  "comparison-of-llms": { sections: {
    features: { claims: [
      { text: "入力・出力トークン数と期間から、APIの利用費用を計算します。", evidenceIds: ["R06-F01"] },
      { text: "Pythonの収集処理が料金ページのテキストを取得します。取得失敗時には既存値やfallbackを利用する経路があります。", evidenceIds: ["R06-F02"] },
    ], limitationIds: [] },
    architecture: { claims: [{ text: "Pythonが料金JSONを書き出してWeb側へ複製します。Web側のServer ComponentはJSONを検証し、画面へ渡します。", evidenceIds: ["R06-A01"] }], limitationIds: [] },
    decisions: { claims: [{ text: "紹介対象は料金収集・費用計算のコードです。LLMの性能比較ではありません。", evidenceIds: ["R06-F01", "R06-F02"] }], limitationIds: ["R06-M01"] },
    quality: { claims: [{ text: "WebとPythonのテスト実体、Playwright設定、型検査、CIの検査定義を確認しています。", evidenceIds: ["R06-Q01"] }], limitationIds: ["R06-M04"] },
  } },
  "medical-studies": { sections: {
    features: { claims: [
      { text: "質問票フォームの回答を検証してスコアを計算し、localStorageへ記録します。JSONでの入出力にも対応しています。", evidenceIds: ["R12-F01"] },
      { text: "CSV・Google Sheets向けの出力処理を持ちます。", evidenceIds: ["R12-F02"] },
    ], limitationIds: ["R12-M02"] },
    architecture: { claims: [{ text: "画面、計算、StorageAdapter、exporterを分けた構成です。保存と出力の責務を別のモジュールで扱います。", evidenceIds: ["R12-A01"] }], limitationIds: [] },
    decisions: { claims: [{ text: "公開時に利用を制限する質問票があります。フォームのゲートと公開環境の読み込み処理で制限を扱います。", evidenceIds: ["R12-F03"] }], limitationIds: ["R12-M03"] },
    quality: { claims: [{ text: "Vitest・型検査・lintと、CIの検査定義を確認しています。", evidenceIds: ["R12-Q01"] }], limitationIds: ["R12-M05"] },
  } },
  "the-wild-oasis-for-admin": { sections: {
    features: { claims: [
      { text: "客室作成フォームからフック、サービスを経て、客室データと画像を保存します。", evidenceIds: ["R02-F01"] },
      { text: "チェックイン操作は予約の状態を更新します。メール・パスワードによるログインを実装しています。", evidenceIds: ["R02-F02"] },
    ], limitationIds: [] },
    architecture: { claims: [{ text: "画面・フック・サービスとSupabaseクライアントを分けたSPA構成です。認証・データベース・Storageへの操作コードを確認しています。", evidenceIds: ["R02-A01"] }], limitationIds: [] },
    decisions: { claims: [{ text: "管理画面からサービスを通じて、客室保存・画像アップロード・予約更新を呼び出します。", evidenceIds: ["R02-F01", "R02-F02"] }], limitationIds: ["R02-M02"] },
    quality: { claims: [{ text: "Vitestの単体テスト、Playwrightの認証E2E、CIの検査定義を配置しています。", evidenceIds: ["R02-Q01"] }], limitationIds: ["R02-M03"] },
  } },
} as const satisfies Record<FeaturedSlug, ProjectDetail<EvidenceId, LimitationId>>;
