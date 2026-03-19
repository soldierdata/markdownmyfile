import { useState, useCallback } from 'react';
import type { QueuedFile, FileType } from '../types';
import { convertFile } from '../converters';

let nextId = 0;

export function useFileQueue() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: Array<{ file: File; type: FileType }>) => {
    const queued: QueuedFile[] = newFiles.map(({ file, type }) => ({
      id: String(++nextId),
      file,
      name: file.name,
      size: file.size,
      type,
      status: 'queued' as const,
      markdown: '',
    }));

    setFiles(prev => [...prev, ...queued]);

    // Auto-select first file if none selected
    if (!nextId || queued.length > 0) {
      setSelectedId(prev => prev ?? queued[0]?.id ?? null);
    }

    // Process sequentially
    processQueue(queued);
  }, []);

  const processQueue = async (queued: QueuedFile[]) => {
    for (const qf of queued) {
      setFiles(prev =>
        prev.map(f => (f.id === qf.id ? { ...f, status: 'converting' as const } : f))
      );
      try {
        const markdown = await convertFile(qf.file, qf.type);
        setFiles(prev =>
          prev.map(f => (f.id === qf.id ? { ...f, status: 'done' as const, markdown } : f))
        );
      } catch (err) {
        setFiles(prev =>
          prev.map(f =>
            f.id === qf.id
              ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : 'Conversion failed' }
              : f
          )
        );
      }
    }
  };

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, []);

  const updateMarkdown = useCallback((id: string, markdown: string) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, markdown } : f)));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setSelectedId(null);
  }, []);

  const selectedFile = files.find(f => f.id === selectedId) ?? null;

  return {
    files,
    selectedFile,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    updateMarkdown,
    clearAll,
  };
}
