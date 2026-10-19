import { randomUUID } from 'node:crypto';
import { rename, rm, writeFile } from 'node:fs/promises';

// 同じディレクトリの一時ファイルに書いてから rename し、読み手には完成したファイルだけを見せる
export async function writeFileAtomic(path: string, data: string | Uint8Array): Promise<void> {
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, data);
    await rename(temporary, path);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}
