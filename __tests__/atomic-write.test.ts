import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { writeFileAtomic } from '../lib/atomic-write';

describe('atomic file writes for generated outputs', () => {
  let directory = '';
  beforeEach(async () => { directory = await mkdtemp(join(tmpdir(), 'atomic-write-')); });
  afterEach(async () => { await rm(directory, { recursive: true, force: true }); });

  it('replaces the target with the complete content and leaves no temporary file', async () => {
    // Arrange
    const target = join(directory, 'fonts.css');
    await writeFile(target, 'old');
    // Act
    await writeFileAtomic(target, 'new');
    // Assert
    expect(await readFile(target, 'utf8')).toBe('new');
    expect(await readdir(directory)).toEqual(['fonts.css']);
  });

  it('removes the temporary file and rethrows when the rename fails', async () => {
    // Arrange: 置き換え先がディレクトリだと rename は失敗する
    const target = join(directory, 'files.json');
    await mkdir(target);
    // Act & Assert
    await expect(writeFileAtomic(target, '{}')).rejects.toThrow();
    expect(await readdir(directory)).toEqual(['files.json']);
  });
});
