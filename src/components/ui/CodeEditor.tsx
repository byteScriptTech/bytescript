'use client';

import Editor, { OnChange } from '@monaco-editor/react';
import React, { useRef, useEffect } from 'react';
import './CodeEditor.css';

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface SelectionRange {
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

interface CodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
  onCursorChange?: (
    position: CursorPosition,
    selection?: SelectionRange
  ) => void;
  remoteCursors?: RemoteCursor[];
  language: string;
  height?: string;
  theme?: 'light' | 'vs-dark';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  onCursorChange,
  remoteCursors = [],
  language,
  height = '600px',
  theme = 'vs-dark',
}) => {
  const handleChange: OnChange = (value) => {
    onCodeChange(value || '');
  };
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const monacoRef = useRef<any>(null);

  // Update remote cursors and selections
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const newDecorations = [];

    for (const cursor of remoteCursors) {
      // Add cursor decoration
      newDecorations.push({
        range: new monaco.Range(
          cursor.position.lineNumber,
          cursor.position.column,
          cursor.position.lineNumber,
          cursor.position.column
        ),
        options: {
          className: 'remote-cursor',
          hoverMessage: { value: cursor.name },
          glyphMarginClassName: 'remote-cursor-glyph',
          inlineClassName: `remote-cursor-${cursor.id}`,
          beforeContentClassName: `remote-cursor-before-${cursor.id}`,
          afterContentClassName: `remote-cursor-after-${cursor.id}`,
        },
      });

      // Add selection decoration if it exists
      if (cursor.selection) {
        newDecorations.push({
          range: new monaco.Range(
            cursor.selection.startLineNumber,
            cursor.selection.startColumn,
            cursor.selection.endLineNumber,
            cursor.selection.endColumn
          ),
          options: {
            className: `remote-selection ${cursor.id}`,
            isWholeLine: false,
          },
        });
      }
    }

    // Update decorations
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [remoteCursors]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      if (onCursorChange) {
        onCursorChange(
          { lineNumber: e.position.lineNumber, column: e.position.column },
          undefined
        );
      }
    });

    // Handle selection changes
    editor.onDidChangeCursorSelection((e: any) => {
      if (onCursorChange && !e.selection.isEmpty()) {
        const selection = e.selection;
        onCursorChange(
          {
            lineNumber: selection.positionLineNumber,
            column: selection.positionColumn,
          },
          {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn,
          }
        );
      }
    });

    const updateEditorTheme = () => {
      const isDarkNow = theme === 'vs-dark';

      // Configure editor settings
      editor.updateOptions({
        minimap: { enabled: true },
        fontSize: 14,
        lineHeight: 22,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
      });

      // Define custom theme
      monaco.editor.defineTheme('custom-theme', {
        base: isDarkNow ? 'vs-dark' : 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: '569CD6' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'delimiter', foreground: isDarkNow ? '#D4D4D4' : '#1E1E1E' },
        ],
        colors: {
          'editor.background': isDarkNow ? '#1E1E1E' : '#FFFFFF',
          'editor.foreground': isDarkNow ? '#D4D4D4' : '#1E1E1E',
          'editor.lineHighlightBackground': isDarkNow ? '#2D2D2D' : '#F3F3F3',
          'editor.selectionBackground': isDarkNow ? '#264F78' : '#ADD6FF',
          'editor.inactiveSelectionBackground': isDarkNow
            ? '#3A3D41'
            : '#E5EBF1',
          'editorIndentGuide.background': isDarkNow ? '#404040' : '#D3D3D3',
          'editorIndentGuide.activeBackground': isDarkNow
            ? '#707070'
            : '#939393',
        },
      });

      // Set the theme
      monaco.editor.setTheme('custom-theme');
    };

    // Initial theme setup
    updateEditorTheme();
  };

  // Update theme when it changes
  React.useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const isDarkNow = theme === 'vs-dark';
        editorRef.current.updateOptions({
          theme: 'custom-theme',
        });
        // @ts-ignore - Monaco types are not available in the global scope
        const monaco = (window as any).monaco;
        if (monaco) {
          monaco.editor.defineTheme('custom-theme', {
            base: isDarkNow ? 'vs-dark' : 'vs',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
              { token: 'keyword', foreground: '569CD6' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
              {
                token: 'delimiter',
                foreground: isDarkNow ? '#D4D4D4' : '#1E1E1E',
              },
            ],
            colors: {
              'editor.background': isDarkNow ? '#1E1E1E' : '#FFFFFF',
              'editor.foreground': isDarkNow ? '#D4D4D4' : '#1E1E1E',
              'editor.lineHighlightBackground': isDarkNow
                ? '#2D2D2D'
                : '#F3F3F3',
              'editor.selectionBackground': isDarkNow ? '#264F78' : '#ADD6FF',
              'editor.inactiveSelectionBackground': isDarkNow
                ? '#3A3D41'
                : '#E5EBF1',
              'editorIndentGuide.background': isDarkNow ? '#404040' : '#D3D3D3',
              'editorIndentGuide.activeBackground': isDarkNow
                ? '#707070'
                : '#939393',
            },
          });
          monaco.editor.setTheme('custom-theme');
        }
      }
    }
  }, [theme]);

  return (
    <div className="code-editor-container">
      <Editor
        height={height}
        defaultLanguage={language}
        value={code}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineHeight: 22,
          wordWrap: 'on',
          automaticLayout: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};
