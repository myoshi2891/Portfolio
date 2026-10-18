import { describe, expect, it, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";
import Profile, { generateMetadata } from "../app/profile/page";

afterEach(() => vi.unstubAllEnvs());

describe("profile page", () => {
  it("renders the portrait, qualifications with skill descriptions, and all activity links", async () => {
    const html = renderToStaticMarkup(<Profile />);
    // Reuse the supplied high-resolution WebP for the 300 CSS px portrait.
    expect(html).toContain('src="/images/optimized/profile-720.webp"');
    expect(html).toContain('width="720"');
    expect(html).toContain('height="964"');
    expect(html).toContain('alt="myoshi2891のモノクロの肖像画"');
    expect(await sharp("public/images/optimized/profile-720.webp").metadata()).toMatchObject({ format: "webp", width: 720, height: 964 });
    expect(statSync("public/images/optimized/profile-720.webp").size).toBeLessThan(150_000);
    expect(existsSync("public/images/profile.jpeg")).toBe(false);
    expect(html).not.toMatch(/<time|datetime=|\d{4}年\d{1,2}月/);
    for (const name of ["JSTQB Foundation Level試験 V2023 V4.0", "Associate Cloud Engineer Certification (ENG)", "Generative AI Leader Certification (ENG)", "AWS Certified AI Practitioner (ENG)", "AWS Certified Cloud Practitioner (ENG)", "TOEIC 955", "H.B.A. 認定 シニアバーテンダー", "J.S.A. 認定 ソムリエ"]) expect(html).toContain(name);
    for (const description of ["テスト設計、レビュー、欠陥管理", "Google Cloud環境の構築・運用", "生成AIの仕組み", "責任あるAIの基礎", "料金・コスト管理", "英語のリスニング・リーディング", "カクテルや酒類の専門知識", "料理に合わせたワインの提案"]) expect(html).toContain(description);
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
