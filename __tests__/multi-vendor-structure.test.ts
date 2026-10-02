import { afterEach, describe, expect, it, vi } from "vitest";

describe("multi-vendor detail structure", () => {
  afterEach(() => { vi.doUnmock("node:fs"); vi.resetModules(); });

  it("rejects documentation whose sections or diagrams do not match the navigation", async () => {
    // Arrange: 見出し1つ・図0件の不整合なMarkdown
    vi.doMock("node:fs", async importOriginal => ({
      ...await importOriginal<typeof import("node:fs")>(),
      readFileSync: () => "## 概要\n本文のみ\n",
    }));
    // Act & Assert
    await expect(import("../components/projects/multi-vendor-detail")).rejects.toThrow(/multi-vendor/);
  });

  it("accepts the committed documentation", async () => {
    await expect(import("../components/projects/multi-vendor-detail")).resolves.toHaveProperty("MultiVendorDetail");
  });
});
