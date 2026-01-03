'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Timer } from '@/components/common/Timer';
import LandingPageHeader from '@/components/specific/LandingPageHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from '@/context/theme-provider';

// Import the CodeEditor components with SSR disabled since they use browser APIs
const JsEditor = dynamic<{
  initialCode: string;
  className?: string;
  height?: string | number;
  readOnly?: boolean;
  showRunButton?: boolean;
  showOutput?: boolean;
  showAlgorithm?: boolean;
  onCodeChange?: (code: string) => void;
  onOutput?: (output: string) => void;
}>(
  () =>
    import('@/components/common/CodeEditor').then(
      (mod) => mod.JavaScriptCodeEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    ),
  }
);

const PythonEditor = dynamic<{
  initialCode: string;
  className?: string;
  height?: string | number;
  readOnly?: boolean;
  showRunButton?: boolean;
  showOutput?: boolean;
  showAlgorithm?: boolean;
  onCodeChange?: (code: string) => void;
  onOutput?: (output: string) => void;
}>(
  () =>
    import('@/components/common/PythonCodeEditor').then(
      (mod) => mod.PythonCodeEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    ),
  }
);

type EditorType = 'javascript' | 'python';

const DEFAULT_JAVASCRIPT_CODE = `// Write your JavaScript code here and click Run to execute it`;
const DEFAULT_PYTHON_CODE = `# Write your Python code here and click Run to execute it`;

export default function EditorPage() {
  const router = useRouter();
  const [editorType, setEditorType] = useState<EditorType>('javascript');
  const [pythonCode, setPythonCode] = useState(DEFAULT_PYTHON_CODE);

  const handlePythonCodeChange = (code: string) => {
    setPythonCode(code);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <LandingPageHeader
          handleExploreByteScriptClick={() => router.push('/login')}
          hideGetStarted={true}
        />
        <div className="container mx-auto p-2 sm:p-4 h-[calc(100vh-64px)] flex flex-col max-w-7xl">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs
              value={editorType}
              onValueChange={(value) => setEditorType(value as EditorType)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="w-full sm:w-auto">
              <Timer
                onTimeUp={() => {
                  // Optional: Add a notification or sound when timer ends
                  if (typeof window !== 'undefined') {
                    new Audio('/sounds/timer-end.mp3')
                      .play()
                      .catch(console.error);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 rounded-lg overflow-hidden border">
            {editorType === 'javascript' ? (
              <JsEditor
                initialCode={DEFAULT_JAVASCRIPT_CODE}
                showAlgorithm={true}
              />
            ) : (
              <PythonEditor
                initialCode={pythonCode}
                onCodeChange={handlePythonCodeChange}
                showAlgorithm={true}
              />
            )}
          </div>

          <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground px-2 sm:px-0">
            <p>
              © {new Date().getFullYear()} @bytescript.tech. All rights
              reserved.
            </p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
