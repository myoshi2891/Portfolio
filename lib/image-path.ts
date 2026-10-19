// Directory names under public/images/ may contain spaces, so each segment is encoded separately.
export function publicImagePath(path: string) {
  return `/images/${path.split("/").map(encodeURIComponent).join("/")}`;
}
