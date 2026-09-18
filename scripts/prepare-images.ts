import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { screens, screenWidths } from '../data/screens';

await mkdir('public/images/optimized', { recursive: true });
for (const [key, { file }] of Object.entries(screens)) {
  const id = key.toLowerCase();
  for (const width of screenWidths) {
    const info = await sharp(`public/images/${file}`).resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`public/images/optimized/${id}-${width}.webp`);
    console.log(`${id} ${width}px: ${info.size.toLocaleString()} bytes`);
  }
}
