// Formats a validated YYYY-MM-DD string without Date so the build time zone cannot shift the day.
export function formatJapaneseDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}
