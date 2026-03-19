import {
  FileText, FileSpreadsheet, File, X, Loader2, Check, AlertCircle,
  Presentation, Globe, Type
} from 'lucide-react';
import type { QueuedFile, FileStatus, FileType } from '../types';
import { formatFileSize } from '../types';

interface FileQueueProps {
  files: QueuedFile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const typeIcons: Record<FileType, typeof FileText> = {
  docx: FileText,
  doc: FileText,
  pdf: File,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  pptx: Presentation,
  html: Globe,
  rtf: FileText,
  txt: Type,
};

const statusConfig: Record<FileStatus, { icon: typeof Check; label: string; color: string }> = {
  queued: { icon: File, label: 'Queued', color: 'text-gray-400' },
  converting: { icon: Loader2, label: 'Converting...', color: 'text-blue-500' },
  done: { icon: Check, label: 'Done', color: 'text-green-500' },
  error: { icon: AlertCircle, label: 'Error', color: 'text-red-500' },
};

export function FileQueue({ files, selectedId, onSelect, onRemove, onClear }: FileQueueProps) {
  if (files.length === 0) return null;

  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Files ({files.length})
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-1">
        {files.map(file => {
          const TypeIcon = typeIcons[file.type] ?? File;
          const status = statusConfig[file.status];
          const StatusIcon = status.icon;
          const isSelected = file.id === selectedId;

          return (
            <div
              key={file.id}
              onClick={() => file.status === 'done' && onSelect(file.id)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                ${file.status === 'done' ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <TypeIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs ${status.color}`}>
                <StatusIcon className={`w-3.5 h-3.5 ${file.status === 'converting' ? 'animate-spin' : ''}`} />
                <span>{file.status === 'error' ? file.error || status.label : status.label}</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onRemove(file.id); }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
