import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '../app/page';
import Detail from '../app/projects/[slug]/page';
import NotFound from '../app/not-found';
import { existsSync } from 'node:fs';

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
it('renders the Multi-Vendor E-Commerce gallery and documented case study', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'multi-vendor-e-commerce' }) }));
  expect(html).toContain('class="container detail-page multi-vendor-detail-page"');
  expect(html).toContain('顧客・販売者・管理者を、1つの市場でつなぐ');
  expect(html).toContain('2026年9月18日');
  expect(html).toContain('2026年10月2日');
  const caseStudy = html.split('<nav class="detail-next"')[0] ?? '';
  expect(caseStudy).not.toContain('class="screen-preview"');
  expect(caseStudy).toContain('class="project-slideshow"');
  expect(caseStudy).toContain('storefront-home-hero.png');
  expect(caseStudy.match(/class="slideshow-dots"[\s\S]*?<\/div>/)?.[0].match(/<span/g)).toHaveLength(10);
  const screenshots = [...caseStudy.matchAll(/src="(\/images\/multi-vendor-e-commerce\/[^"/]+\.png)"/g)].map(match => match[1]);
  expect(new Set(screenshots).size).toBe(10);
  for (const path of screenshots) expect(existsSync(`public${path}`)).toBe(true);
  expect(html).not.toContain('Multi-Vendor-E-Commerce/blob/');
  expect(html).not.toContain('GitHubでコードを見る');
  expect(html).not.toContain('参照コード');
  expect(html).toContain('id="orders"');
  expect(html).toContain('id="documentation"');
  expect(html.match(/class="commerce-mermaid"/g)).toHaveLength(3);
  for (const match of html.matchAll(/src="(\/images\/multi-vendor-e-commerce\/diagram-[^"]+\.svg)"/g)) {
    expect(existsSync(`public${match[1]}`)).toBe(true);
  }
});
it('renders the LLM Studies gallery and its full-width detail layout', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'comparison-of-llms' }) }));
  expect(html).toContain('class="container detail-page llm-detail-page documented-detail-page"');
  expect(html).toContain('aria-roledescription="カルーセル"');
  expect(html).toContain('cost-calculator-overview.png');
  expect(html.match(/class="slideshow-dots"[\s\S]*?<\/div>/)?.[0].match(/<span/g)).toHaveLength(9);
  // 操作ボタンはハイドレーション完了まで出力しない（JS なしで無反応なボタンを残さない）
  expect(html.match(/class="project-slideshow"[\s\S]*?<\/figure>/)?.[0]).not.toContain('<button');
  expect(html).not.toContain('Comparison-of-LLMs/blob/main/');
});
it('provides a prominent home recovery action on the 404 page', () => {
  const html = renderToStaticMarkup(<NotFound />);
  expect(html).toMatch(/class="[^"]*action-primary/);
  expect(html).toContain('トップページに戻る');
});

it('places additional captures on the matching featured, study and secondary entries', async () => {
  const html = renderToStaticMarkup(<Home />);
  for (const [id, file] of [['R03', 'The%20Wild%20Oasis.png'], ['R05', 'Next-Store.png'], ['R09', 'Management%20Studies.png'], ['R12', 'Medical-Studies/prom-checker-dashboard.png']]) {
    const article = html.split(`data-repository="${id}"`)[1]?.split('</article>')[0];
    expect(article?.includes(file!), id).toBe(true);
  }
  const medical = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'medical-studies' }) }));
  expect(medical.includes('Medical-Studies/prom-checker-dashboard.png')).toBe(true);
});

it('renders the Medical Studies documented case study and its supplied views', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'medical-studies' }) }));
  expect(html).toContain('class="container detail-page medical-detail-page documented-detail-page"');
  expect(html).toContain('Medical Studiesの画面ギャラリー');
  for (const file of [
    'prom-checker-dashboard.png', 'prom-checker-headache-diary.png', 'prom-checker-evaluation-report.png',
    'anatomy-atlas-top.png', 'anatomy-head-neck-interactive-model.png', 'anatomy-cervical-spine-structure-explorer.png',
    'headaches-migraine-guide.png', 'treatment-acute-headache-guide.png', 'blocks-occipital-nerve-guide.png',
    'therapies-physical-therapy-guide.png', 'prom-headache-diary-guide.png',
  ]) expect(html).toContain(file);
  expect(html).toContain('Medical Studies / 11 views');
  expect(html).toContain('2026年9月18日');
  expect(html).toContain('2026年10月2日');
  expect(html).not.toContain('github.com');
  expect(html).toContain('localStorage');
});

it('renders the Wild Oasis documented case study and its supplied admin views', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'the-wild-oasis-for-admin' }) }));
  expect(html).toContain('class="container detail-page wild-oasis-detail-page documented-detail-page"');
  expect(html).toContain('The Wild Oasis管理画面ギャラリー');
  for (const file of ['dashboard-overview.png', 'bookings-management.png', 'dashboard-analytics-charts.png', 'cabins-management.png']) {
    expect(html).toContain(file);
  }
  expect(html).toContain('2026年9月18日');
  expect(html).toContain('2026年10月2日');
  expect(html).toContain('71');
  expect(html).not.toContain('github.com');
  expect(html).toContain('キャッシュを無効化');
});
