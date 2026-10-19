import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectSlideshow } from "../components/projects/project-slideshow";
import { projectGalleries } from "../data/galleries";
import { featuredProjects } from "../lib/portfolio";
import { publicImagePath } from "../lib/image-path";

describe("project galleries", () => {
  it("registers a gallery whose slide files exist for every featured project", () => {
    for (const { slug } of featuredProjects) {
      // Arrange
      const gallery = projectGalleries[slug];

      // Act
      const missing = gallery.slides.map(slide => `public/images/${gallery.imageDirectory}/${slide.file}`).filter(path => !existsSync(path));

      // Assert
      expect(gallery.slides.length, slug).toBeGreaterThan(0);
      expect(missing, slug).toEqual([]);
    }
  });

  it("encodes each path segment of a public image without encoding the separators", () => {
    expect(publicImagePath("The Wild Oasis Admin/dashboard-overview.webp")).toBe("/images/The%20Wild%20Oasis%20Admin/dashboard-overview.webp");
    expect(publicImagePath("a#b/c?d.webp")).toBe("/images/a%23b/c%3Fd.webp");
  });

  it("renders gallery image URLs with encoded directory names", () => {
    // Arrange
    const gallery = projectGalleries["the-wild-oasis-for-admin"];

    // Act
    const html = renderToStaticMarkup(<ProjectSlideshow {...gallery} />);

    // Assert
    expect(html).toContain(`src="/images/The%20Wild%20Oasis%20Admin/${gallery.slides[0]?.file}"`);
    expect(html).not.toContain('src="/images/The Wild Oasis Admin/');
  });
});
