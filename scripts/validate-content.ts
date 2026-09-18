import { portfolio } from "../lib/portfolio";
import { validateContent } from "../lib/validate-content";
import { validateHomeContent } from "../lib/validate-home-content";
import { site } from "../data/site";
import { domains } from "../data/domains";
const errors = [...validateContent(portfolio), ...validateHomeContent(portfolio, site, domains)];
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Content: 13 repositories, 4 details and evidence references verified.");
