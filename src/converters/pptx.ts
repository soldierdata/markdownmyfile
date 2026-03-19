import JSZip from 'jszip';

export async function convertPptx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Find all slide files and sort them
  const slideFiles: { num: number; path: string }[] = [];
  zip.forEach((path) => {
    const match = path.match(/ppt\/slides\/slide(\d+)\.xml$/);
    if (match) {
      slideFiles.push({ num: parseInt(match[1]), path });
    }
  });
  slideFiles.sort((a, b) => a.num - b.num);

  // Find corresponding notes
  const noteFiles = new Set<string>();
  zip.forEach((path) => {
    if (path.match(/ppt\/notesSlides\/notesSlide\d+\.xml$/)) {
      noteFiles.add(path);
    }
  });

  const slides: string[] = [];

  for (const { num, path } of slideFiles) {
    const xml = await zip.file(path)!.async('string');
    const slideContent = parseSlideXml(xml);

    // Try to get speaker notes
    const notePath = `ppt/notesSlides/notesSlide${num}.xml`;
    let notes = '';
    if (noteFiles.has(notePath)) {
      const noteXml = await zip.file(notePath)!.async('string');
      notes = parseNotesXml(noteXml);
    }

    let slideMarkdown = `## Slide ${num}`;
    if (slideContent.title) {
      slideMarkdown = `## ${slideContent.title}`;
    }

    if (slideContent.body.length > 0) {
      slideMarkdown += '\n\n' + slideContent.body.join('\n');
    }

    if (notes) {
      slideMarkdown += '\n\n> **Speaker Notes:**\n' +
        notes.split('\n').map(line => `> ${line}`).join('\n');
    }

    slides.push(slideMarkdown);
  }

  return slides.join('\n\n---\n\n');
}

interface SlideContent {
  title: string;
  body: string[];
}

function parseSlideXml(xml: string): SlideContent {
  const result: SlideContent = { title: '', body: [] };

  // Extract shape tree content
  const spTreeMatch = xml.match(/<p:spTree>([\s\S]*)<\/p:spTree>/);
  if (!spTreeMatch) return result;

  const spTree = spTreeMatch[1];

  // Find all shape elements
  const shapes = spTree.match(/<p:sp>([\s\S]*?)<\/p:sp>/g) || [];

  for (const shape of shapes) {
    // Check if this is a title shape
    const isTitle = /<p:ph[^>]*type="(?:title|ctrTitle)"/.test(shape);

    // Extract text from all <a:t> elements within this shape
    const textParts: string[] = [];
    const paragraphs = shape.match(/<a:p>([\s\S]*?)<\/a:p>/g) || [];

    for (const para of paragraphs) {
      const texts = para.match(/<a:t>([\s\S]*?)<\/a:t>/g) || [];
      const paraText = texts
        .map(t => t.replace(/<\/?a:t>/g, ''))
        .join('')
        .trim();

      if (paraText) {
        // Check for bullet level
        const lvlMatch = para.match(/<a:pPr[^>]*lvl="(\d+)"/);
        const level = lvlMatch ? parseInt(lvlMatch[1]) : 0;
        const isBullet = /<a:buChar|<a:buAutoNum|<a:buNone/.test(para) || !isTitle;

        if (isTitle) {
          textParts.push(paraText);
        } else if (isBullet && level > 0) {
          textParts.push('  '.repeat(level) + '- ' + paraText);
        } else {
          textParts.push('- ' + paraText);
        }
      }
    }

    if (textParts.length === 0) continue;

    if (isTitle) {
      result.title = textParts.join(' ');
    } else {
      result.body.push(...textParts);
    }
  }

  return result;
}

function parseNotesXml(xml: string): string {
  const texts: string[] = [];
  const paragraphs = xml.match(/<a:p>([\s\S]*?)<\/a:p>/g) || [];

  for (const para of paragraphs) {
    const parts = para.match(/<a:t>([\s\S]*?)<\/a:t>/g) || [];
    const text = parts
      .map(t => t.replace(/<\/?a:t>/g, ''))
      .join('')
      .trim();
    // Skip slide number placeholder text
    if (text && !/^\d+$/.test(text)) {
      texts.push(text);
    }
  }

  return texts.join('\n');
}
