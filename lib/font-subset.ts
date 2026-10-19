// Noto Sans JP is served as one subset per weight; the files hold only the characters the content uses.
export const notoWeights = [400, 600] as const;

export function notoFontFile(weight: number): string {
  return `noto-sans-jp-${weight}.woff2`;
}

export function usedText(content: string): string {
  const points = new Set<number>();
  for (const char of content) {
    const point = char.codePointAt(0);
    if (point !== undefined && point >= 0x20) points.add(point);
  }
  return String.fromCodePoint(...[...points].sort((a, b) => a - b));
}

export function fontFaceCss(weights: readonly number[]): string {
  return weights.map(weight => `@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-display: swap;
  font-weight: ${weight};
  src: url(/fonts/${notoFontFile(weight)}) format('woff2');
}`).join('\n\n') + '\n';
}
