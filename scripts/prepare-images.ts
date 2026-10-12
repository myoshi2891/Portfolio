import { mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { screens, screenWidths } from '../data/screens';
import { captureOutput, captureSource as source, staleCaptures } from '../lib/capture-images';

// Originals stay in assets/screens; only compressed WebP derivatives are published.
async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : Promise.resolve([path]);
  }))).flat();
}

const sources = await files(source);
for (const path of sources.filter(path => path.endsWith('.png'))) {
  const output = captureOutput(path);
  await mkdir(dirname(output), { recursive: true });
  const info = await sharp(path).webp({ quality: 82 }).toFile(output);
  console.log(`${output}: ${info.size.toLocaleString()} bytes`);
}

// Remove capture WebPs whose source PNG was renamed or deleted.
for (const path of staleCaptures(await files('public/images'), sources)) {
  await rm(path);
  console.log(`${path}: removed`);
}

await mkdir('public/images/optimized', { recursive: true });
for (const [key, { file }] of Object.entries(screens)) {
  const id = key.toLowerCase();
  for (const width of screenWidths) {
    const info = await sharp(join(source, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`public/images/optimized/${id}-${width}.webp`);
    console.log(`${id} ${width}px: ${info.size.toLocaleString()} bytes`);
  }
}
