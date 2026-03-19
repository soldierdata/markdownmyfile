import { FileText, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  dark: boolean;
  toggleDark: () => void;
}

export function Header({ dark, toggleDark }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            markdownmyfile
            <span className="text-blue-600 dark:text-blue-400">.com</span>
          </h1>
        </div>
      </div>
      <button
        onClick={toggleDark}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}
