import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '../app/page';
import Detail from '../app/projects/[slug]/page';
import NotFound from '../app/not-found';

it('shows supplied study screenshots with descriptive alternatives in the initial HTML', () => {
  const html = renderToStaticMarkup(<Home />);
  expect(html).toContain('QA_STUDIES.png');
  expect(html).toContain('Cloud%20Infrastructure%20Studies.png');
  expect(html).toMatch(/alt="[^"]*品質[^"]*"/);
  expect(html).toContain('id="about"');
  expect(html).not.toContain('layer-stack');
});
it('adds breadcrumb context and a meaningful preview of the next project', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'multi-vendor-e-commerce' }) }));
  expect(html).toContain('aria-label="パンくず"');
  expect(html).toContain('aria-current="page"');
  expect(html).toContain('Pythonによる料金データ');
});
it('provides a prominent home recovery action on the 404 page', () => {
  const html = renderToStaticMarkup(<NotFound />);
  expect(html).toMatch(/class="[^"]*action-primary/);
  expect(html).toContain('トップページに戻る');
});
