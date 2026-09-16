import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '../app/page';
import Detail from '../app/projects/[slug]/page';

it('links all five owner-provided public demos from Home', () => {
  const html = renderToStaticMarkup(<Home />);
  for (const host of ['cloud-infrastructure-studies', 'quality-assurance-studies', 'comparison-of-llms', 'algorithm-datastructures-math-studies', 'security-studies']) {
    expect(html.includes(`href="https://${host}.netlify.app/"`), host).toBe(true);
  }
  expect(html.includes('LLM%20Studies.png')).toBe(true);
});
it('shows the approved LLM screenshot and demo on its detail only', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'comparison-of-llms' }) }));
  expect(html.includes('href="https://comparison-of-llms.netlify.app/"')).toBe(true);
  expect(html.includes('LLM%20Studies.png')).toBe(true);
  const ec = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'multi-vendor-e-commerce' }) }));
  expect(ec.includes('href="https://multi-vendor-e-commerce.netlify.app/"')).toBe(false);
});
