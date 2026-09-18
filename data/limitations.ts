import type { Limitation } from "../types/portfolio";

export const limitations = {
  "R01-M02": { repoId: "R01", auditId: "R01-M02", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "決済成功や、実環境での認可の十分性は未検証です。" },
  "R01-M03": { repoId: "R01", auditId: "R01-M03", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "テスト・CIの実行結果とcoverageは未確認です。" },
  "R06-M01": { repoId: "R06", auditId: "R06-M01", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "料金の取得成功率・正確性・定期更新の運用は未確認です。価格の鮮度は保証しません。" },
  "R06-M04": { repoId: "R06", auditId: "R06-M04", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "Web・PythonのテストとCIの実行結果は未確認です。" },
  "R12-M02": { repoId: "R12", auditId: "R12-M02", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "Google Sheetsへの接続成功は未確認です。" },
  "R12-M03": { repoId: "R12", auditId: "R12-M03", status: "NOT_APPLICABLE", sourceType: "USER_PROVIDED", text: "ここでは計算・記録の実装を紹介しています。臨床的な有効性は検証していません。" },
  "R12-M05": { repoId: "R12", auditId: "R12-M05", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "テスト・型検査・CIの実行結果は未確認です。" },
  "R02-M02": { repoId: "R02", auditId: "R02-M02", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "実環境のアクセス制御と、ゲスト向けアプリとの統合運用は未確認です。" },
  "R02-M03": { repoId: "R02", auditId: "R02-M03", status: "NOT_VERIFIED", sourceType: "UNVERIFIED", text: "テスト・CIの実行結果は未確認です。" },
} as const satisfies Record<string, Limitation>;
export type LimitationId = keyof typeof limitations;
