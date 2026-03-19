import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { FileQueue } from './components/FileQueue';
import { PreviewPane } from './components/PreviewPane';
import { ActionBar } from './components/ActionBar';
import { Footer } from './components/Footer';
import { useDarkMode } from './hooks/useDarkMode';
import { useFileQueue } from './hooks/useFileQueue';

function App() {
  const [dark, toggleDark] = useDarkMode();
  const {
    files,
    selectedFile,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    updateMarkdown,
    clearAll,
  } = useFileQueue();

  const hasFiles = files.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header dark={dark} toggleDark={toggleDark} />

      {!hasFiles ? (
        /* Landing / upload state */
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-8 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              Convert any document to Markdown
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Drop your file below and get clean, downloadable Markdown in seconds.
              No sign-up. No paywall. No data stored. Completely free.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <DropZone onFilesAdded={addFiles} />
          </div>

          {/* Format use-cases — SEO keyword hints */}
          <div className="mt-12 w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs text-gray-400 dark:text-gray-500">
            <span><strong className="text-gray-500 dark:text-gray-400">.docx</strong> → GitHub wikis</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.pdf</strong> → Obsidian notes</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.xlsx</strong> → Markdown tables</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.pptx</strong> → Static sites</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.html</strong> → Clean Markdown</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.rtf</strong> → Plain text docs</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.csv</strong> → Data tables</span>
            <span><strong className="text-gray-500 dark:text-gray-400">.txt</strong> → Formatted docs</span>
          </div>

          {/* How it works */}
          <div className="mt-16 w-full max-w-3xl">
            <h3 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">
              How it works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">1</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Upload</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop or browse for your file. We support 10+ formats.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">2</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Convert</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We parse your document and generate clean, structured Markdown.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">3</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Download</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preview, edit, then copy or download your .md file instantly.
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Conversion workspace */
        <main className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4">
            <DropZone onFilesAdded={addFiles} compact />
          </div>
          <FileQueue
            files={files}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRemove={removeFile}
            onClear={clearAll}
          />
          <PreviewPane file={selectedFile} onUpdateMarkdown={updateMarkdown} />
          <ActionBar selectedFile={selectedFile} allFiles={files} />
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;
