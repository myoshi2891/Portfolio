import { expect, it } from 'vitest';
import { subsetFontCss } from '../lib/font-subset';

it('keeps the font mapping for every used character and weight without unused ranges or fallback URLs', () => {
  const source = [400, 600].map(weight => `@font-face { font-family: 'Noto Sans JP'; font-weight: ${weight}; src: url(./files/jp-${weight}.woff2) format('woff2'), url(./files/jp-${weight}.woff) format('woff'); unicode-range: U+3040-309F,U+4E00-4EFF; }`).join('\n') + "@font-face { src: url(./files/unused.woff2); unicode-range: U+AC00-D7FF; }";
  const css = subsetFontCss(source, 'あいう一');
  for (const weight of [400, 600]) expect(css).toContain(`/fonts/jp-${weight}.woff2`);
  expect(css).toContain('U+3042,U+3044,U+3046,U+4E00');
  expect(css).not.toMatch(/unused|\.woff\)|U\+3040/);
  expect(subsetFontCss(source, '한')).toContain('unused.woff2');
});
