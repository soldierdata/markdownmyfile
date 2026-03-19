import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { QueuedFile } from '../types';

function toMdFilename(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}.md`;
}

export function downloadSingle(originalName: string, markdown: string) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, toMdFilename(originalName));
}

export async function downloadAllZip(files: QueuedFile[]) {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const file of files) {
    let name = toMdFilename(file.name);
    // Deduplicate
    let counter = 1;
    while (usedNames.has(name)) {
      name = toMdFilename(file.name).replace('.md', ` (${counter++}).md`);
    }
    usedNames.add(name);
    zip.file(name, file.markdown);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'converted-markdown.zip');
}
