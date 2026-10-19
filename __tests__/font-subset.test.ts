import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fontFaceCss, notoFontFile, notoWeights, usedText } from '../lib/font-subset';

describe('font subset generation', () => {
  it('collects each used character once in code point order without control characters', () => {
    // Arrange
    const content = 'いあい\nAa一\tあ';
    // Act
    const text = usedText(content);
    // Assert
    expect(text).toBe('Aaあい一');
  });

  it('declares one subset file per weight instead of unicode-range slices', () => {
    // Act
    const css = fontFaceCss([400, 600]);
    // Assert
    expect(css.match(/@font-face/g)).toHaveLength(2);
    for (const weight of [400, 600]) {
      expect(css).toContain(`font-weight: ${weight};`);
      expect(css).toContain(`src: url(/fonts/${notoFontFile(weight)}) format('woff2');`);
    }
    expect(css).toContain("font-display: swap;");
    expect(css).not.toMatch(/unicode-range|\.woff\)/);
  });
});

describe('delivered fonts', () => {
  const woff2 = (directory: string) => readdirSync(directory).filter(name => name.endsWith('.woff2')).sort();
  const stylesheets = (directory: string): string[] => readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter(path => path.endsWith('.css') && !path.endsWith('fonts.css')).map(path => join(directory, path));

  it('serves Noto Sans JP as one file per weight for 400 and 600 only', () => {
    // Arrange
    const css = readFileSync('app/fonts.css', 'utf8');
    // Act
    const weights = [...css.matchAll(/font-weight: (\d+);/g)].map(match => Number(match[1]));
    // Assert
    expect(notoWeights).toEqual([400, 600]);
    expect(weights).toEqual([400, 600]);
    expect(woff2('public/fonts')).toEqual(notoWeights.map(notoFontFile));
    expect(JSON.parse(readFileSync('public/fonts/files.json', 'utf8')).files).toEqual(notoWeights.map(notoFontFile));
  });

  it('keeps Inter on the same weights so Latin and Japanese text match', () => {
    // Assert
    expect(woff2('assets/fonts')).toEqual(['inter-latin-400-normal.woff2', 'inter-latin-600-normal.woff2']);
    expect(readFileSync('app/layout.tsx', 'utf8')).not.toContain('inter-latin-500');
  });

  it('uses no font weight that the delivered fonts lack', () => {
    // Arrange
    const sources = stylesheets('app').map(path => [path, readFileSync(path, 'utf8')] as const);
    // Act
    const unsupported = sources.flatMap(([path, css]) => [...css.matchAll(/font-weight:\s*(\d+)/g)]
      .filter(match => !notoWeights.includes(Number(match[1]) as (typeof notoWeights)[number])).map(match => `${path}: ${match[0]}`));
    // Assert
    expect(unsupported).toEqual([]);
  });
});
