import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '../app/page';
import Detail from '../app/projects/[slug]/page';

it('links all five owner-provided public demos from Home', () => {
  const html = renderToStaticMarkup(<Home />);
  for (const host of ['cloud-infrastructure-studies', 'quality-assurance-studies', 'comparison-of-llms', 'algorithm-datastructures-math-studies', 'security-studies']) {
    expect(html.includes(`href="https://${host}.netlify.app/"`), host).toBe(true);
  }
  expect(html.includes('llm-studies/cost-calculator-overview.png')).toBe(true);
});
it('shows the approved LLM screenshot and demo on its detail only', async () => {
  const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'comparison-of-llms' }) }));
  expect(html.includes('href="https://comparison-of-llms.netlify.app/"')).toBe(true);
  expect(html.includes('llm-studies/cost-calculator-overview.png')).toBe(true);
  const ec = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: 'multi-vendor-e-commerce' }) }));
  expect(ec.includes('href="https://multi-vendor-e-commerce.netlify.app/"')).toBe(false);
});

it('maps the booking demo to the guest project and the shop demo to Next Store', () => {
  const html = renderToStaticMarkup(<Home />);
  const guest = html.split('data-repository="R03"')[1]?.split('</article>')[0];
  const shop = html.split('data-repository="R05"')[1]?.split('</article>')[0];
  const admin = html.split('data-repository="R02"')[1]?.split('</article>')[0];
  expect(guest?.includes('https://thewildoasisnextdemo-myoshizumis-projects.vercel.app/')).toBe(true);
  expect(shop?.includes('https://nextstore-sable-pi.vercel.app/')).toBe(true);
  expect(admin?.includes('thewildoasisnextdemo')).toBe(false);
});
