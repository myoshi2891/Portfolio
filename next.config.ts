import type { NextConfig } from "next";
import { readSiteConfig } from "./lib/site-config";
readSiteConfig();
const config: NextConfig = { output: "export", trailingSlash: true, poweredByHeader: false };
export default config;
