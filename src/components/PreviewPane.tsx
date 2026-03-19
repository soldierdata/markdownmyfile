import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import type { QueuedFile } from '../types';

interface PreviewPaneProps {
  file: QueuedFile | null;
  onUpdateMarkdown: (id: string, markdown: string) => void;
}

export function PreviewPane({ file, onUpdateMarkdown }: PreviewPaneProps) {
  const [fullscreen, setFullscreen] = useState<'left' | 'right' | null>(null);

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600 px-6">
        <div className="text-center">
          <p className="text-lg">No file selected</p>
          <p className="text-sm mt-1">Upload a file and select it to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-0 border-t border-gray-200 dark:border-gray-800 min-h-0">
      {/* Raw Markdown */}
      {fullscreen !== 'right' && (
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-800">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Raw Markdown
            </h3>
            <button
              onClick={() => setFullscreen(fullscreen === 'left' ? null : 'left')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle fullscreen"
            >
              {fullscreen === 'left'
                ? <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
                : <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              }
            </button>
          </div>
          <textarea
            value={file.markdown}
            onChange={e => onUpdateMarkdown(file.id, e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 resize-none outline-none min-h-[300px]"
            spellCheck={false}
          />
        </div>
      )}

      {/* Rendered Preview */}
      {fullscreen !== 'left' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Preview
            </h3>
            <button
              onClick={() => setFullscreen(fullscreen === 'right' ? null : 'right')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle fullscreen"
            >
              {fullscreen === 'right'
                ? <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
                : <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              }
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto bg-white dark:bg-gray-950 min-h-[300px]">
            <div className="markdown-preview prose-sm max-w-none text-left">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {file.markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
