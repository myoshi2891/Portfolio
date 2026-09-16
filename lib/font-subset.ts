// Reduce CSS declarations only; the original OFL font files remain unchanged.
export function subsetFontCss(source: string, content: string): string {
  const points = [...new Set([...content].map(char => char.codePointAt(0)!))].sort((a, b) => a - b);
  return [...source.matchAll(/@font-face\s*\{([^}]+)\}/g)].flatMap(([block, declarations]) => {
    const range = declarations!.match(/unicode-range:\s*([^;]+);/);
    const file = declarations!.match(/url\(\.\/files\/([^)]*\.woff2)\)/);
    if (!range || !file) return [];
    const intervals = range[1]!.split(',').map(part => {
      const [start, end] = part.trim().replace(/^U\+/i, '').split('-');
      return [parseInt(start!, 16), parseInt(end ?? start!, 16)] as const;
    });
    const used = points.filter(point => intervals.some(([start, end]) => point >= start && point <= end));
    if (!used.length) return [];
    return [block.replace(/src:[^;]+;/, `src: url(/fonts/${file[1]}) format('woff2');`)
      .replace(/unicode-range:[^;]+;/, `unicode-range: ${used.map(point => `U+${point.toString(16).toUpperCase()}`).join(',')};`)];
  }).join('\n\n') + '\n';
}
