import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

const { Navigation } = await import("../components/layout/chrome");

// 単体テストの描画は next.config の trailingSlash を読まないため、Link の href を末尾スラッシュ付きにそろえる
const normalize = (href: string | undefined) => href && (href.includes("#") || href.endsWith("/") ? href : `${href}/`);

// aria-current を持つリンクの href を、ナビゲーションごとに取り出す
function currentLinks(html: string) {
  const navs = [...html.matchAll(/<nav[^>]*aria-label="([^"]+)"[^>]*>([\s\S]*?)<\/nav>/g)];
  return Object.fromEntries(navs.map(([, label, body]) => [
    label,
    [...(body ?? "").matchAll(/<a[^>]*>/g)].map(([tag]) => tag).filter(tag => tag.includes('aria-current="page"')).map(tag => normalize(tag.match(/href="([^"]+)"/)?.[1])),
  ]));
}

describe("header navigation current page", () => {
  beforeEach(() => { navigation.pathname = "/"; });

  it("marks the profile link as the current page in both desktop and mobile navigation", () => {
    // Arrange
    navigation.pathname = "/profile/";

    // Act
    const current = currentLinks(renderToStaticMarkup(<Navigation />));

    // Assert
    expect(current).toEqual({ "メインナビゲーション": ["/profile/"], "モバイルナビゲーション": ["/profile/"] });
  });

  it("accepts the pathname without a trailing slash", () => {
    // Arrange
    navigation.pathname = "/profile";

    // Act
    const current = currentLinks(renderToStaticMarkup(<Navigation />));

    // Assert
    expect(current["メインナビゲーション"]).toEqual(["/profile/"]);
  });

  it("does not mark in-page section links on Home or other pages", () => {
    for (const pathname of ["/", "/projects/medical-studies/"]) {
      // Arrange
      navigation.pathname = pathname;

      // Act
      const current = currentLinks(renderToStaticMarkup(<Navigation />));

      // Assert
      expect(current, pathname).toEqual({ "メインナビゲーション": [], "モバイルナビゲーション": [] });
    }
  });
});
