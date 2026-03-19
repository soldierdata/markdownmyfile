export async function convertRtf(file: File): Promise<string> {
  const text = await file.text();
  return parseRtf(text);
}

function parseRtf(rtf: string): string {
  // Remove RTF header/footer
  let content = rtf;

  // Remove RTF control groups we don't need (font table, color table, stylesheet, etc.)
  content = content.replace(/\{\\fonttbl[^}]*\}/g, '');
  content = content.replace(/\{\\colortbl[^}]*\}/g, '');
  content = content.replace(/\{\\stylesheet[^}]*\}/g, '');
  content = content.replace(/\{\\info[^}]*\}/g, '');
  content = content.replace(/\{\\header[^}]*\}/g, '');
  content = content.replace(/\{\\footer[^}]*\}/g, '');
  content = content.replace(/\{\\\*\\[^}]*\}/g, '');

  // Track formatting state
  const lines: string[] = [];
  let currentLine = '';
  let bold = false;
  let italic = false;

  let i = 0;
  while (i < content.length) {
    if (content[i] === '\\') {
      // Control word
      let word = '';
      i++;
      while (i < content.length && /[a-zA-Z]/.test(content[i])) {
        word += content[i];
        i++;
      }
      // Skip optional numeric parameter
      let param = '';
      while (i < content.length && /[-0-9]/.test(content[i])) {
        param += content[i];
        i++;
      }
      // Skip delimiter space
      if (i < content.length && content[i] === ' ') i++;

      switch (word) {
        case 'par':
        case 'line':
          lines.push(currentLine);
          currentLine = '';
          break;
        case 'tab':
          currentLine += '\t';
          break;
        case 'b':
          bold = param !== '0';
          break;
        case 'i':
          italic = param !== '0';
          break;
        case 'ldblquote':
          currentLine += '"';
          break;
        case 'rdblquote':
          currentLine += '"';
          break;
        case 'lquote':
          currentLine += "'";
          break;
        case 'rquote':
          currentLine += "'";
          break;
        case 'emdash':
          currentLine += '—';
          break;
        case 'endash':
          currentLine += '–';
          break;
        case 'bullet':
          currentLine += '- ';
          break;
        case 'u': {
          // Unicode character
          const code = parseInt(param);
          if (!isNaN(code)) {
            currentLine += String.fromCharCode(code < 0 ? code + 65536 : code);
          }
          // Skip the replacement character
          if (i < content.length && content[i] === '?') i++;
          break;
        }
        // Skip other control words
      }
    } else if (content[i] === '{' || content[i] === '}') {
      i++;
    } else if (content[i] === '\n' || content[i] === '\r') {
      i++;
    } else {
      // Regular character
      let char = content[i];
      if (bold && !italic) char = char;
      currentLine += char;
      i++;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  // Clean up and format
  const result = lines
    .map(line => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return result || '*(No readable text content found in RTF file)*';
}
