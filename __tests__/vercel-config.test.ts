import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { headersFor, type HeaderRule } from "../lib/response-headers";

const config = JSON.parse(readFileSync("vercel.json", "utf8")) as { framework: string; installCommand: string; buildCommand: string; headers: HeaderRule[] };

function directives(policy: string) {
  return new Map(policy.split(";").map(part => part.trim().split(/\s+/)).filter(([name]) => name).map(([name, ...values]) => [name, values]));
}

describe("Vercel deployment configuration", () => {
  it("builds the static export with the pinned Bun toolchain", () => {
    expect(config).toMatchObject({ framework: "nextjs", installCommand: "bun install --frozen-lockfile", buildCommand: "bun run build" });
  });

  it("sends hardened security headers on every path", () => {
    for (const path of ["/", "/profile/", "/projects/medical-studies/", "/_next/static/chunks/app.js", "/missing-page/"]) {
      const headers = headersFor(path, config.headers);
      expect(headers["Strict-Transport-Security"], path).toMatch(/^max-age=(\d+)/);
      expect(Number(/max-age=(\d+)/.exec(headers["Strict-Transport-Security"] ?? "")![1])).toBeGreaterThanOrEqual(31_536_000);
      expect(headers).toMatchObject({
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cross-Origin-Opener-Policy": "same-origin",
      });
      expect(headers["Permissions-Policy"]).toContain("camera=()");
      expect(headers["Content-Security-Policy"], path).toBeDefined();
    }
  });

  it("limits the content security policy to same-origin resources", () => {
    const csp = directives(headersFor("/", config.headers)["Content-Security-Policy"] ?? "");
    expect(csp.get("default-src")).toEqual(["'self'"]);
    expect(csp.get("object-src")).toEqual(["'none'"]);
    expect(csp.get("base-uri")).toEqual(["'self'"]);
    expect(csp.get("form-action")).toEqual(["'self'"]);
    expect(csp.get("frame-ancestors")).toEqual(["'none'"]);
    for (const [name, values] of csp) {
      // A static export cannot carry nonces, so inline scripts are the only allowed exception.
      expect(values.filter(value => /^(https?:|\*|data:|blob:|'unsafe-eval')/.test(value)), name).toEqual([]);
    }
  });

  it("revalidates unversioned fonts and caches images for a day", () => {
    // フォントのURLは内容が変わっても同じため、immutableにせず毎回再検証する
    expect(headersFor("/fonts/noto-sans-jp-0-400.woff2", config.headers)["Cache-Control"]).toBe("public, max-age=0, must-revalidate");
    expect(headersFor("/images/llm-studies/whats-new-guides.webp", config.headers)["Cache-Control"]).toBe("public, max-age=86400");
    for (const path of ["/", "/profile/", "/_next/static/chunks/app.js"]) {
      expect(headersFor(path, config.headers)["Cache-Control"], path).toBeUndefined();
    }
  });

  it("matches header rules with Vercel path patterns", () => {
    const rules: HeaderRule[] = [
      { source: "/(.*)", headers: [{ key: "A", value: "all" }] },
      { source: "/fonts/(.*)", headers: [{ key: "A", value: "font" }, { key: "B", value: "font" }] },
      { source: "/exact", headers: [{ key: "C", value: "exact" }] },
    ];
    expect(headersFor("/", rules)).toEqual({ A: "all" });
    expect(headersFor("/fonts/inter.woff2", rules)).toEqual({ A: "font", B: "font" });
    expect(headersFor("/exact", rules)).toEqual({ A: "all", C: "exact" });
    expect(headersFor("/exact/more", rules)).toEqual({ A: "all" });
  });
});
