import React from 'react';

import { CollaborativeCodeEditor } from './CollaborativeCodeEditor';

type Props = {
  code: string;
  onCodeChange: (c: string) => void;
  onRunCode: (code: string) => void;
  sendData: (d: string) => boolean;
  wsConnectionStatus: 'disconnected' | 'connecting' | 'connected';
  userId: string;
  isExecuting?: boolean;
  className?: string;
};

export default function EditorPanel({
  code,
  onCodeChange,
  onRunCode,
  sendData,
  wsConnectionStatus,
  userId,
  isExecuting = false,
  className = '',
}: Props) {
  const handleRun = () => {
    onRunCode(code);
  };

  return (
    <section className={`flex-1 flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-border flex justify-between items-center gap-2">
        <h2 className="text-lg font-semibold">Collaborative Editor</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExecuting ? (
              <>
                <span className="animate-spin">⟳</span> Running...
              </>
            ) : (
              <>
                <span>▶</span> Run Code
              </>
            )}
          </button>
          <div className="text-sm text-muted-foreground">
            {wsConnectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <CollaborativeCodeEditor
            code={code}
            onCodeChange={onCodeChange}
            onCursorChange={() => {}}
            height="100%"
            userId={userId}
            sendData={sendData}
          />
        </div>
      </div>
    </section>
  );
}
