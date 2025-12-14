'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { JavaScriptCodeEditor } from './common/CodeEditor';

interface CodeEditorProps {
  code?: string;
  onCodeChange?: (code: string) => void;
  initialCode?: string;
  showAlgorithm?: boolean;
}

export default function CodeEditor({
  code: externalCode,
  onCodeChange,
  initialCode = '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  showAlgorithm = false,
}: CodeEditorProps) {
  const [currentCode, setCurrentCode] = useState(externalCode || initialCode);

  // Update editor when external code changes
  useEffect(() => {
    if (externalCode !== undefined) {
      setCurrentCode(externalCode);
    }
  }, [externalCode]);

  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  const handleOutput = useCallback((result: string) => {
    setOutput(result);
  }, []);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCurrentCode(newCode);
      onCodeChange?.(newCode);
    },
    [onCodeChange]
  );

  const clearOutput = useCallback(() => {
    setOutput('');
  }, []);

  // Scroll output automatically when it changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const [algorithm, setAlgorithm] = useState('// Write your algorithm here\n');

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden border">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Algorithm Panel */}
          {showAlgorithm && (
            <>
              <Panel
                defaultSize={30}
                minSize={0}
                className="flex flex-col border-r"
              >
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="text-sm font-medium px-2">Algorithm</div>
                </div>
                <textarea
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm bg-background outline-none resize-none"
                  spellCheck={false}
                />
              </Panel>

              <PanelResizeHandle className="w-2 bg-border/50 hover:bg-primary/60 transition-colors" />
            </>
          )}

          {/* Editor + Output Panel */}
          <Panel defaultSize={70} minSize={30} className="flex flex-col">
            <PanelGroup direction="vertical" className="flex-1">
              {/* JavaScript Editor Panel */}
              <Panel defaultSize={70} minSize={30} className="flex flex-col">
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="text-sm font-medium px-2">
                    JavaScript Editor
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                  <JavaScriptCodeEditor
                    initialCode={currentCode}
                    onCodeChange={handleCodeChange}
                    onOutput={handleOutput}
                    readOnly={false}
                    className="h-full w-full"
                    showRunButton={true}
                    showOutput={false}
                  />
                </div>
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="h-2 bg-border hover:bg-primary/60 transition-colors" />

              {/* Console Output Panel */}
              <Panel defaultSize={30} minSize={20} className="flex flex-col">
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="text-sm font-medium px-2">Console Output</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={clearOutput}
                      disabled={!output}
                      className="border bg-background hover:bg-accent h-8 px-3 text-xs rounded-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div
                  ref={outputRef}
                  className="flex-1 overflow-auto p-4 text-sm font-mono whitespace-pre-wrap bg-background"
                >
                  {output ? (
                    <pre className="whitespace-pre-wrap break-words">
                      {output}
                    </pre>
                  ) : (
                    <div className="text-muted-foreground">
                      Output will appear here
                    </div>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
