import { mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import sharp from 'sharp';
import { screens, screenWidths } from '../data/screens';

// Originals stay in assets/screens; only compressed WebP derivatives are published.
const source = 'assets/screens';
async function originals(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? originals(path) : Promise.resolve(path.endsWith('.png') ? [path] : []);
  }))).flat();
}

for (const path of await originals(source)) {
  const output = join('public/images', relative(source, path)).replace(/\.png$/, '.webp');
  await mkdir(dirname(output), { recursive: true });
  const info = await sharp(path).webp({ quality: 82 }).toFile(output);
  console.log(`${output}: ${info.size.toLocaleString()} bytes`);
}

await mkdir('public/images/optimized', { recursive: true });
for (const [key, { file }] of Object.entries(screens)) {
  const id = key.toLowerCase();
  for (const width of screenWidths) {
    const info = await sharp(join(source, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`public/images/optimized/${id}-${width}.webp`);
    console.log(`${id} ${width}px: ${info.size.toLocaleString()} bytes`);
  }
}
