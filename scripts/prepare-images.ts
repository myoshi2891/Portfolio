import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const captures = { r06: 'LLM Studies.png', r07: 'QA_STUDIES.png', r10: 'Cloud Infrastructure Studies.png' };
await mkdir('public/images/optimized', { recursive: true });
for (const [id, file] of Object.entries(captures)) {
  for (const width of [640, 1280, 1854]) {
    const info = await sharp(`public/images/${file}`).resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`public/images/optimized/${id}-${width}.webp`);
    console.log(`${id} ${width}px: ${info.size.toLocaleString()} bytes`);
  }
}
