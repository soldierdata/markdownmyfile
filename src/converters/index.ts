import type { FileType } from '../types';
import { convertDocx } from './docx';
import { convertXlsx, convertCsv } from './xlsx';
import { convertPdf } from './pdf';
import { convertHtml } from './html';
import { convertTxt } from './txt';
import { convertRtf } from './rtf';
import { convertPptx } from './pptx';

export async function convertFile(file: File, type: FileType): Promise<string> {
  switch (type) {
    case 'docx':
    case 'doc':
      return convertDocx(file);
    case 'xlsx':
    case 'xls':
      return convertXlsx(file);
    case 'csv':
      return convertCsv(file);
    case 'pdf':
      return convertPdf(file);
    case 'html':
      return convertHtml(file);
    case 'txt':
      return convertTxt(file);
    case 'rtf':
      return convertRtf(file);
    case 'pptx':
      return convertPptx(file);
    default:
      throw new Error(`Unsupported file type: ${type}`);
  }
}
