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

it('expresses the portfolio itself as the hero 3D scene without image controls', () => {
  const html = renderToStaticMarkup(<Home />);
  const hero = html.split('class="hero"')[1]?.split('</section>')[0] ?? '';
  expect(hero).toContain('aria-label="学びを起点に、制作・設計・改善へ循環するポートフォリオ"');
  for (const label of ['BUILD', 'STUDY', 'ENGINEER', 'IMPROVE']) expect(hero).toContain(label);
  expect(hero).not.toContain('<img');
  expect(hero).not.toContain('<button');
  expect(hero).not.toContain('LLM Studies');
});
it('adds breadcrumb context and a meaningful preview of the next project', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'multi-vendor-e-commerce' }) }));
  expect(html).toContain('aria-label="パンくず"');
  expect(html).toContain('aria-current="page"');
  expect(html).toContain('Pythonによる料金データ');
});
it('renders the LLM Studies gallery and its full-width detail layout', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'comparison-of-llms' }) }));
  expect(html).toContain('class="container detail-page llm-detail-page"');
  expect(html).toContain('aria-roledescription="カルーセル"');
  expect(html).toContain('cost-calculator-overview.png');
  expect(html.match(/class="slideshow-dots"[\s\S]*?<\/div>/)?.[0].match(/<span/g)).toHaveLength(9);
  expect(html.match(/class="project-slideshow"[\s\S]*?<\/figure>/)?.[0]).toContain('aria-label="スライドショーを一時停止"');
});
it('provides a prominent home recovery action on the 404 page', () => {
  const html = renderToStaticMarkup(<NotFound />);
  expect(html).toMatch(/class="[^"]*action-primary/);
  expect(html).toContain('トップページに戻る');
});

it('places additional captures on the matching featured, study and secondary entries', async () => {
  const html = renderToStaticMarkup(<Home />);
  for (const [id, file] of [['R03', 'The%20Wild%20Oasis.png'], ['R05', 'Next-Store.png'], ['R09', 'Management%20Studies.png'], ['R12', 'Medical%20Studies.png']]) {
    const article = html.split(`data-repository="${id}"`)[1]?.split('</article>')[0];
    expect(article?.includes(file!), id).toBe(true);
  }
  const medical = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'medical-studies' }) }));
  expect(medical.includes('Medical%20Studies.png')).toBe(true);
});
