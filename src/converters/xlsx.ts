import * as XLSX from 'xlsx';

export async function convertXlsx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sections: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    }) as string[][];

    if (data.length === 0) continue;

    // Trim trailing empty columns
    const maxCols = Math.max(...data.map(row => {
      let last = row.length - 1;
      while (last >= 0 && (row[last] === '' || row[last] === null || row[last] === undefined)) last--;
      return last + 1;
    }));

    if (maxCols === 0) continue;

    const trimmed = data.map(row => {
      const r = row.slice(0, maxCols);
      while (r.length < maxCols) r.push('');
      return r.map(cell => String(cell ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' '));
    });

    const lines: string[] = [];
    if (workbook.SheetNames.length > 1) {
      lines.push(`## ${sheetName}`);
      lines.push('');
    }

    // Header row
    lines.push('| ' + trimmed[0].join(' | ') + ' |');
    lines.push('| ' + trimmed[0].map(() => '---').join(' | ') + ' |');

    // Data rows
    for (let i = 1; i < trimmed.length; i++) {
      lines.push('| ' + trimmed[i].join(' | ') + ' |');
    }

    sections.push(lines.join('\n'));
  }

  return sections.join('\n\n');
}

export async function convertCsv(file: File): Promise<string> {
  const text = await file.text();
  const workbook = XLSX.read(text, { type: 'string' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
  }) as string[][];

  if (data.length === 0) return '';

  const maxCols = Math.max(...data.map(r => r.length));
  const normalized = data.map(row => {
    const r = row.slice(0, maxCols);
    while (r.length < maxCols) r.push('');
    return r.map(cell => String(cell ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' '));
  });

  const lines: string[] = [];
  lines.push('| ' + normalized[0].join(' | ') + ' |');
  lines.push('| ' + normalized[0].map(() => '---').join(' | ') + ' |');
  for (let i = 1; i < normalized.length; i++) {
    lines.push('| ' + normalized[i].join(' | ') + ' |');
  }

  return lines.join('\n');
}
