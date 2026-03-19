import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem as PdfTextItem } from 'pdfjs-dist/types/src/display/api';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

function isTextItem(item: unknown): item is PdfTextItem {
  return typeof item === 'object' && item !== null && 'str' in item && 'transform' in item;
}

export async function convertPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const items = textContent.items.filter(isTextItem);
    if (items.length === 0) continue;

    // Collect font sizes to detect headings
    const fontSizes = items.map(item => item.height).filter(h => h > 0);
    const avgFontSize = fontSizes.length > 0
      ? fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length
      : 12;

    // Group items by Y position (same line)
    const lineMap = new Map<number, PdfTextItem[]>();
    for (const item of items) {
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push(item);
    }

    // Sort lines top-to-bottom (higher Y = higher on page in PDF coords)
    const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
    const lineTexts: string[] = [];

    for (const y of sortedYs) {
      const lineItems = lineMap.get(y)!;
      // Sort left-to-right
      lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
      const text = lineItems.map(item => item.str).join('');
      if (!text.trim()) continue;

      const maxHeight = Math.max(...lineItems.map(item => item.height));

      // Heading heuristics
      if (maxHeight > avgFontSize * 1.6) {
        lineTexts.push(`# ${text.trim()}`);
      } else if (maxHeight > avgFontSize * 1.3) {
        lineTexts.push(`## ${text.trim()}`);
      } else if (maxHeight > avgFontSize * 1.1) {
        lineTexts.push(`### ${text.trim()}`);
      } else {
        lineTexts.push(text);
      }
    }

    pages.push(lineTexts.join('\n'));
  }

  return pages.join('\n\n---\n\n');
}
