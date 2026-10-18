import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const source = "assets/brand/myoshi.jpeg";
await mkdir("public/images/optimized", { recursive: true });
for (const width of [96, 320, 720]) {
  await sharp(source).resize(width, width).webp({ quality: 88 }).toFile(`public/images/optimized/myoshi-logo-${width}.webp`);
}
await sharp(source).resize(512, 512).png().toFile("app/icon.png");
await sharp(source).resize(180, 180).png().toFile("app/apple-icon.png");

// ICO directory entries can contain PNG payloads, preserving the supplied artwork.
const sizes = [16, 32, 48];
// Turbopack's ICO decoder requires embedded PNGs to use RGBA (PNG color type 6).
const frames = await Promise.all(sizes.map(size => sharp(source).resize(size, size).toColourspace("srgb").ensureAlpha().png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index]!;
  header[entry + 1] = sizes[index]!;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile("app/favicon.ico", Buffer.concat([header, ...frames]));
