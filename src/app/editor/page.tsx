import dynamic from 'next/dynamic';

// Import the CodeEditor component with SSR disabled since it uses browser APIs
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
});

export default function EditorPage() {
  return (
    <div className="container mx-auto p-2 sm:p-4 h-screen flex flex-col max-w-7xl">
      <header className="mb-4 sm:mb-6 px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold">JavaScript Playground</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Write and execute JavaScript code in your browser
        </p>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <CodeEditor />
      </div>

      <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 px-2 sm:px-0">
        <p>© {new Date().getFullYear()} @bityescript. All rights reserved.</p>
      </footer>
    </div>
  );
}
