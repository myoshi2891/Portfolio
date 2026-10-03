import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

const { Navigation } = await import("../components/layout/chrome");

describe("header GitHub link", () => {
  beforeEach(() => { navigation.pathname = "/"; });

  it("is hidden on documented project detail pages", () => {
    navigation.pathname = "/projects/medical-studies/";
    expect(renderToStaticMarkup(<Navigation />)).not.toContain("github-nav");
  });

  // 404.html は /projects/ 以外として事前生成されるため、未知のプロジェクトURLでも同じ出力にしないとhydrationが不一致になる
  it("stays visible on unknown project URLs so the shared 404 HTML hydrates", () => {
    navigation.pathname = "/projects/unknown/";
    expect(renderToStaticMarkup(<Navigation />)).toContain("github-nav");
  });
});
