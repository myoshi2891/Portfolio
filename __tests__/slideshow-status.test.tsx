import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectSlideshow } from "../components/projects/project-slideshow";

it("renders the slide status as a live region that stays silent while slides rotate", () => {
  // Arrange
  const slides = [{ file: "a.webp", title: "最初の画面", alt: "a" }, { file: "b.webp", title: "次の画面", alt: "b" }];
  // Act
  const html = renderToStaticMarkup(<ProjectSlideshow slides={slides} imageDirectory="x" label="ギャラリー" browserTitle="X" />);
  // Assert: 自動送り中の初期状態は通知しない（WAI-ARIA APG カルーセル）
  expect(html).toMatch(/<figcaption aria-live="off" aria-atomic="true"><strong>最初の画面<\/strong><span>1 \/ 2<\/span><\/figcaption>/);
});
