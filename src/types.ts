export type FileStatus = 'queued' | 'converting' | 'done' | 'error';

export type FileType = 'docx' | 'doc' | 'pdf' | 'xlsx' | 'xls' | 'csv' | 'pptx' | 'html' | 'rtf' | 'txt';

export interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: FileType;
  status: FileStatus;
  markdown: string;
  error?: string;
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const ACCEPTED_EXTENSIONS: Record<string, FileType> = {
  '.docx': 'docx',
  '.doc': 'doc',
  '.pdf': 'pdf',
  '.xlsx': 'xlsx',
  '.xls': 'xls',
  '.csv': 'csv',
  '.pptx': 'pptx',
  '.html': 'html',
  '.htm': 'html',
  '.rtf': 'rtf',
  '.txt': 'txt',
};

export const ACCEPTED_MIME_TYPES: Record<string, FileType> = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/html': 'html',
  'application/rtf': 'rtf',
  'text/rtf': 'rtf',
  'text/plain': 'txt',
};

export const FORMAT_LABELS: Record<FileType, { label: string; color: string }> = {
  docx: { label: '.docx', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  doc: { label: '.doc', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  pdf: { label: '.pdf', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  xlsx: { label: '.xlsx', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  xls: { label: '.xls', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  csv: { label: '.csv', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  pptx: { label: '.pptx', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  html: { label: '.html', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  rtf: { label: '.rtf', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  txt: { label: '.txt', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300' },
};

export function getFileType(file: File): FileType | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (ext && ext in ACCEPTED_EXTENSIONS) {
    return ACCEPTED_EXTENSIONS[ext];
  }
  if (file.type in ACCEPTED_MIME_TYPES) {
    return ACCEPTED_MIME_TYPES[file.type];
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
