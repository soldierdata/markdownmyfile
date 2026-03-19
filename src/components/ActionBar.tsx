import { Copy, Download, FolderArchive, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { QueuedFile } from '../types';
import { downloadSingle, downloadAllZip } from '../utils/download';

interface ActionBarProps {
  selectedFile: QueuedFile | null;
  allFiles: QueuedFile[];
}

export function ActionBar({ selectedFile, allFiles }: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const doneFiles = allFiles.filter(f => f.status === 'done');
  const hasSelected = selectedFile && selectedFile.status === 'done';

  const handleCopy = async () => {
    if (!hasSelected) return;
    await navigator.clipboard.writeText(selectedFile.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!hasSelected) return;
    downloadSingle(selectedFile.name, selectedFile.markdown);
  };

  const handleDownloadAll = () => {
    if (doneFiles.length === 0) return;
    downloadAllZip(doneFiles);
  };

  const handleConvertAnother = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (doneFiles.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <button
        onClick={handleCopy}
        disabled={!hasSelected}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>

      <button
        onClick={handleDownload}
        disabled={!hasSelected}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
          bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        <Download className="w-4 h-4" />
        Download .md
      </button>

      {doneFiles.length > 1 && (
        <button
          onClick={handleDownloadAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FolderArchive className="w-4 h-4" />
          Download All (.zip)
        </button>
      )}

      <div className="flex-1" />

      <button
        onClick={handleConvertAnother}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
          text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Convert Another
      </button>
    </div>
  );
}
