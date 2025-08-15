'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import LandingPageHeader from '@/components/specific/LandingPageHeader';

// Import the CodeEditor component with SSR disabled since it uses browser APIs
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
});

export default function EditorPage() {
  const router = useRouter();
  return (
    <>
      <LandingPageHeader
        handleExploreBiteScriptClick={function (): void {
          router.push('/login');
        }}
      />
      <div className="container mx-auto p-2 sm:p-4 h-screen flex flex-col max-w-7xl">
        <div className="flex-1 flex flex-col min-h-0">
          <CodeEditor />
        </div>

        <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 px-2 sm:px-0">
          <p>
            © {new Date().getFullYear()} @bityescript. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
