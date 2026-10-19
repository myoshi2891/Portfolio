import { describe, expect, it } from "vitest";
import { fragmentId, returnIds, samePageFragment, type ReturnTarget } from "../lib/navigation-ids";

const link = (href: string, label: string): ReturnTarget => ({ tag: "a", href, label });

describe("returnIds", () => {
  it("gives the same element the same ID regardless of controls inserted before it", () => {
    // Arrange
    const targets = [link("/#studies", "学習"), link("/projects/comparison-of-llms/", "LLM料金の収集と費用計算")];

    // Act
    const without = returnIds(targets);
    const withToggle = returnIds([{ tag: "button", href: null, label: "ダークモードに切り替える" }, ...targets]);

    // Assert
    expect(withToggle.slice(1)).toEqual(without);
  });

  it("keeps IDs unique for identical targets and valid as fragment IDs", () => {
    // Arrange
    const targets = [link("/#selected-work", "制作"), link("/#selected-work", "制作"), link("/#studies", "学習")];

    // Act
    const ids = returnIds(targets);

    // Assert
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^return-[a-z0-9]+(-\d+)?$/);
  });

  it("keeps a stateful control's ID when its label changes", () => {
    // Arrange
    const toggle = (label: string): ReturnTarget => ({ tag: "button", href: null, label, key: "theme-toggle" });

    // Act
    const [dark] = returnIds([toggle("ダークモードに切り替える")]);
    const [light] = returnIds([toggle("ライトモードに切り替える")]);

    // Assert
    expect(light).toBe(dark);
  });

  it("still distinguishes controls without a key by their label", () => {
    const [previous, next] = returnIds([{ tag: "button", href: null, label: "前へ" }, { tag: "button", href: null, label: "次へ" }]);
    expect(previous).not.toBe(next);
    expect(next).not.toMatch(/-\d+$/);
  });

  it("is deterministic across runs", () => {
    const targets = [link("/profile/", "プロフィール")];
    expect(returnIds(targets)).toEqual(returnIds(targets));
  });
});

describe("fragmentId", () => {
  it("decodes the hash and rejects malformed escapes", () => {
    expect(fragmentId("#study-r10")).toBe("study-r10");
    expect(fragmentId("#%E5%AD%A6")).toBe("学");
    expect(fragmentId("#%E0%A4%A")).toBeNull();
    expect(fragmentId("")).toBeNull();
  });
});

describe("samePageFragment", () => {
  const current = "https://example.com/projects/a/?q=1";

  it("returns the hash only for a fragment on the current page", () => {
    expect(samePageFragment("/projects/a/?q=1#features", current)).toBe("#features");
    expect(samePageFragment("#features", current)).toBe("#features");
  });

  it("ignores other pages, other queries, other origins and links without a hash", () => {
    // Arrange
    const hrefs = ["/projects/b/#features", "/projects/a/#features", "https://other.example/projects/a/?q=1#features", "/projects/a/?q=1"];

    // Act
    const results = hrefs.map(href => samePageFragment(href, current));

    // Assert
    expect(results).toEqual([null, null, null, null]);
  });
});
