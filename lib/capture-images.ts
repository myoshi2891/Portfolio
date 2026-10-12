// Capture originals in assets/screens publish as WebP at the same relative path under public/images.
export const captureSource = "assets/screens";
const captureRoot = "public/images";
// Display-width variants and SVG diagrams are produced separately and are never treated as captures.
const optimizedRoot = `${captureRoot}/optimized/`;

export function captureOutput(path: string) {
  return path.replace(/\\/g, "/").replace(`${captureSource}/`, `${captureRoot}/`).replace(/\.png$/, ".webp");
}

export function staleCaptures(published: string[], sources: string[]) {
  const current = new Set(sources.filter(path => path.endsWith(".png")).map(captureOutput));
  return published.map(path => path.replace(/\\/g, "/"))
    .filter(path => path.startsWith(`${captureRoot}/`) && !path.startsWith(optimizedRoot) && path.endsWith(".webp") && !current.has(path));
}
