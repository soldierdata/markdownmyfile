import { useState, useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { getFileType, ACCEPTED_EXTENSIONS, FORMAT_LABELS, MAX_FILE_SIZE, formatFileSize } from '../types';
import type { FileType } from '../types';

interface DropZoneProps {
  onFilesAdded: (files: Array<{ file: File; type: FileType }>) => void;
  compact?: boolean;
}

export function DropZone({ onFilesAdded, compact }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    setError(null);
    const valid: Array<{ file: File; type: FileType }> = [];
    const rejected: string[] = [];
    const tooLarge: string[] = [];

    Array.from(fileList).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        tooLarge.push(file.name);
        return;
      }
      const type = getFileType(file);
      if (type) {
        valid.push({ file, type });
      } else {
        rejected.push(file.name);
      }
    });

    const errors: string[] = [];
    if (tooLarge.length > 0) {
      errors.push(`File too large (max ${formatFileSize(MAX_FILE_SIZE)}): ${tooLarge.join(', ')}`);
    }
    if (rejected.length > 0) {
      errors.push(`Unsupported format: ${rejected.join(', ')}`);
    }
    if (errors.length > 0) {
      setError(errors.join('. '));
    }

    if (valid.length > 0) {
      onFilesAdded(valid);
    }
  }, [onFilesAdded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const acceptStr = Object.keys(ACCEPTED_EXTENSIONS).join(',');

  // Compact mode for the workspace view
  if (compact) {
    return (
      <div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Upload className="w-4 h-4" />
            <span>Drop more files or click to browse</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptStr}
            onChange={e => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Full landing page upload zone
  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.01]'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-900'
          }
        `}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Drop your file here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Up to {formatFileSize(MAX_FILE_SIZE)} per file
        </p>

        {/* Format badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(FORMAT_LABELS).map(([key, { label, color }]) => (
            <span
              key={key}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
            >
              {label}
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptStr}
          onChange={e => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
      )}

      {/* Privacy notice */}
      <p className="mt-3 text-xs text-center text-gray-400 dark:text-gray-500">
        All conversions happen in your browser. Your files never leave your device.
      </p>
    </div>
  );
}
