export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} markdownmyfile.com</p>
        <div className="flex items-center gap-6">
          <span>All conversions are processed locally in your browser</span>
        </div>
      </div>
    </footer>
  );
}
