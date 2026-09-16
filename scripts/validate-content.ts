import { portfolio } from "../lib/portfolio";
import { validateContent } from "../lib/validate-content";
const errors = validateContent(portfolio);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Content: 13 repositories, 4 details and evidence references verified.");
