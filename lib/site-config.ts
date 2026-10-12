type Environment = {
  DEPLOYMENT_ENV?: string | undefined;
  SITE_URL?: string | undefined;
  VERCEL_ENV?: string | undefined;
  VERCEL_PROJECT_PRODUCTION_URL?: string | undefined;
};
export type SiteConfig = { production: boolean; siteUrl: string | null };

const processEnvironment = (): Environment => ({
  DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV, SITE_URL: process.env.SITE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});

export function readSiteConfig(env: Environment = processEnvironment()): SiteConfig {
  // Explicit settings win; otherwise only Vercel's production deployment is indexable.
  const environment = env.DEPLOYMENT_ENV || (env.VERCEL_ENV === "production" ? "production" : "preview");
  if (environment !== "preview" && environment !== "production") throw new Error("DEPLOYMENT_ENV must be preview or production");
  const production = environment === "production";
  const siteUrl = env.SITE_URL || (production && env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  if (!siteUrl) {
    if (production) throw new Error("Production requires a valid HTTPS SITE_URL");
    return { production, siteUrl: null };
  }
  let url: URL;
  try { url = new URL(siteUrl); } catch { throw new Error("SITE_URL must be a valid HTTPS origin"); }
  // Routes and local assets are rooted at /. Subpath hosting needs a separate design.
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("SITE_URL must be an HTTPS origin without credentials, a subpath, query or fragment");
  }
  return { production, siteUrl: url.origin };
}
