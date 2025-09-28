'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import { CodeEditor } from '@/components/ui/CodeEditor';

interface CursorPosition {
  lineNumber: number;
  column: number;
}

interface SelectionRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface RemoteCursor {
  id: string;
  name: string;
  color: string;
  position: CursorPosition;
  selection?: SelectionRange;
}

interface CollaborativeCodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
  onCursorChange?: (
    position: CursorPosition,
    selection: SelectionRange | null
  ) => void;
  remoteCursors?: RemoteCursor[];
  language?: string;
  height?: string;
  theme?: 'light' | 'vs-dark';
  userId: string;
  sendData: (data: string) => void;
}

// Generate a consistent color from a string
const generateColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 80%, 50%)`;
};

export function CollaborativeCodeEditor({
  code,
  onCodeChange,
  onCursorChange,
  remoteCursors = [],
  language = 'javascript',
  height = '100%',
  theme = 'light',
  userId,
  sendData,
}: CollaborativeCodeEditorProps) {
  const [localCode, setLocalCode] = useState(code);
  const lastSentCode = useRef(code);
  const lastCursorPosition = useRef<CursorPosition | null>(null);
  const lastSelection = useRef<SelectionRange | null>(null);
  const userColor = generateColor(userId);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendCursorUpdate = useCallback(
    (position: CursorPosition, selection?: SelectionRange) => {
      if (sendData && userId) {
        sendData(
          JSON.stringify({
            type: 'cursor-update',
            userId,
            position,
            selection: selection || undefined,
            color: userColor,
            timestamp: Date.now(),
          })
        );
      }
    },
    [sendData, userId, userColor]
  );

  // Notify parent of code changes with debouncing
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setLocalCode(newCode);

      // Debounce the code change notification
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (lastSentCode.current !== newCode) {
          lastSentCode.current = newCode;
          onCodeChange(newCode);

          // Also send cursor position if available
          if (lastCursorPosition.current) {
            sendCursorUpdate(
              lastCursorPosition.current,
              lastSelection.current || undefined
            );
          }
        }
      }, 300); // 300ms debounce
    },
    [onCodeChange, sendCursorUpdate]
  );

  // Handle cursor position changes
  const handleCursorChange = useCallback(
    (position: CursorPosition, selection: SelectionRange | null = null) => {
      lastCursorPosition.current = position;
      // <-- Use null here (not undefined) because the ref type is SelectionRange | null
      lastSelection.current = selection ?? null;

      // Notify parent component if callback is provided
      onCursorChange?.(position, selection);

      // Send cursor update to peers (send `undefined` to omit field in JSON if no selection)
      sendCursorUpdate(position, selection || undefined);
    },
    [onCursorChange, sendCursorUpdate]
  );

  // Sync with parent code changes
  useEffect(() => {
    if (code !== lastSentCode.current) {
      setLocalCode(code);
      lastSentCode.current = code;
    }
  }, [code]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <CodeEditor
        code={localCode}
        onCodeChange={handleCodeChange}
        onCursorChange={handleCursorChange}
        remoteCursors={remoteCursors}
        language={language}
        height={height}
        theme={theme}
      />

      {/* Remote cursor indicators */}
      <div className="absolute top-2 right-2 flex gap-2">
        {remoteCursors.map((cursor) => (
          <div
            key={cursor.id}
            className="text-xs px-2 py-1 rounded-full flex items-center"
            style={{
              backgroundColor: `${cursor.color}20`,
              color: cursor.color,
            }}
          >
            <div
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: cursor.color }}
            />
            {cursor.name}
          </div>
        ))}
      </div>
    </div>
  );
}
