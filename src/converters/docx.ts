import mammoth from 'mammoth';
import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Table support
turndown.addRule('table', {
  filter: 'table',
  replacement(_content: string, node: Node) {
    const table = node as HTMLTableElement;
    const rows: string[][] = [];

    table.querySelectorAll('tr').forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll('th, td').forEach((cell) => {
        cells.push(cell.textContent?.trim() || '');
      });
      rows.push(cells);
    });

    if (rows.length === 0) return '';

    const maxCols = Math.max(...rows.map(r => r.length));
    const normalized = rows.map(r => {
      while (r.length < maxCols) r.push('');
      return r;
    });

    const lines: string[] = [];
    lines.push('| ' + normalized[0].join(' | ') + ' |');
    lines.push('| ' + normalized[0].map(() => '---').join(' | ') + ' |');
    for (let i = 1; i < normalized.length; i++) {
      lines.push('| ' + normalized[i].join(' | ') + ' |');
    }
    return '\n\n' + lines.join('\n') + '\n\n';
  },
});

// Strikethrough
turndown.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement(content: string) {
    return '~~' + content + '~~';
  },
});

export async function convertDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  return turndown.turndown(html);
}
