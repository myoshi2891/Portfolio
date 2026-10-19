// subset-font は型定義を同梱しないため、scripts/prepare-fonts.ts が使う範囲だけを宣言する。
declare module 'subset-font' {
  type Options = { targetFormat?: 'sfnt' | 'woff' | 'woff2' };
  export default function subsetFont(font: Buffer, text: string, options?: Options): Promise<Buffer>;
}
