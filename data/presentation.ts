import type { HttpsUrl, RepositoryId } from "../types/portfolio";

// USER_PROVIDED: owner supplied these public URLs on 2026-09-17.
// They do not imply that the live deployment matches the audited commit.
export const demoUrls: Partial<Record<RepositoryId, HttpsUrl>> = {
  R03: "https://thewildoasisnextdemo-myoshizumis-projects.vercel.app/",
  R05: "https://nextstore-sable-pi.vercel.app/",
  R06: "https://comparison-of-llms.netlify.app/",
  R07: "https://quality-assurance-studies.netlify.app/",
  R10: "https://cloud-infrastructure-studies.netlify.app/",
  R11: "https://security-studies.netlify.app/",
  R13: "https://algorithm-datastructures-math-studies.netlify.app/",
};
