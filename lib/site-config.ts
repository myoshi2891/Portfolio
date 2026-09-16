type Environment = { DEPLOYMENT_ENV?: string | undefined; SITE_URL?: string | undefined };
export type SiteConfig = { production: boolean; siteUrl: string | null };

export function readSiteConfig(env: Environment = { DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV, SITE_URL: process.env.SITE_URL }): SiteConfig {
  const environment = env.DEPLOYMENT_ENV ?? "preview";
  if (environment !== "preview" && environment !== "production") throw new Error("DEPLOYMENT_ENV must be preview or production");
  const production = environment === "production";
  if (!env.SITE_URL) {
    if (production) throw new Error("Production requires a valid HTTPS SITE_URL");
    return { production, siteUrl: null };
  }
  let url: URL;
  try { url = new URL(env.SITE_URL); } catch { throw new Error("SITE_URL must be a valid HTTPS origin"); }
  // Routes and local assets are rooted at /. Subpath hosting needs a separate design.
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("SITE_URL must be an HTTPS origin without credentials, a subpath, query or fragment");
  }
  return { production, siteUrl: url.origin };
}
