import { describe, expect, it, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";
import Profile, { generateMetadata } from "../app/profile/page";

afterEach(() => vi.unstubAllEnvs());

describe("profile page", () => {
  it("renders the portrait, qualifications in newest-first order, and all activity links", async () => {
    const html = renderToStaticMarkup(<Profile />);
    // The portrait is displayed at most 360 CSS px wide; ship a 2x WebP only.
    expect(html).toContain('src="/images/optimized/profile-720.webp"');
    expect(html).toContain('width="720"');
    expect(html).toContain('height="964"');
    expect(html).toContain('alt="myoshi2891のモノクロの肖像画"');
    expect(await sharp("public/images/optimized/profile-720.webp").metadata()).toMatchObject({ format: "webp", width: 720, height: 964 });
    expect(statSync("public/images/optimized/profile-720.webp").size).toBeLessThan(150_000);
    expect(existsSync("public/images/profile.jpeg")).toBe(false);
    expect([...html.matchAll(/datetime="([^"]+)"/gi)].map(match => match[1])).toEqual([
      "2026-10", "2026-08", "2026-03", "2025-12", "2025-11", "2021-09", "2019-01", "2017-11",
    ]);
    for (const name of ["JSTQB Foundation Level試験 V2023 V4.0", "Associate Cloud Engineer Certification (ENG)", "Generative AI Leader Certification (ENG)", "AWS Certified AI Practitioner (ENG)", "AWS Certified Cloud Practitioner (ENG)", "TOEIC 955", "H.B.A. 認定 シニアバーテンダー", "J.S.A. 認定 ソムリエ"]) expect(html).toContain(name);
    for (const date of ["2026年10月", "2026年8月", "2026年3月", "2025年12月", "2025年11月", "2021年9月", "2019年1月", "2017年11月"]) expect(html).toContain(date);
    for (const url of ["https://github.com/myoshi2891", "https://x.com/myoshi2891", "https://leetcode.com/u/myoshizumi/", "https://skillsprofile.skillbuilder.aws/user/myoshi2891/certification-badges"]) expect(html).toContain(`href="${url}"`);
    expect(html).toContain("GitHubでフォロー");
    expect(html).toContain("Xでフォロー");
  });

  it("uses profile metadata and preserves the production and preview indexing policy", () => {
    vi.stubEnv("SITE_URL", "https://example.com");
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    expect(generateMetadata()).toMatchObject({
      title: "プロフィール — myoshi2891",
      alternates: { canonical: "https://example.com/profile/" },
      robots: { index: true, follow: true },
      openGraph: { url: "https://example.com/profile/" },
    });
    vi.stubEnv("DEPLOYMENT_ENV", "preview");
    expect(generateMetadata().robots).toEqual({ index: false, follow: false });
  });
});
