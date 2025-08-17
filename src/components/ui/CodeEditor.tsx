'use client';

import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
  language: string;
  height?: string;
  theme?: 'light' | 'vs-dark';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  language,
  height = '600px',
  theme = 'light',
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

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
    <div className="h-full w-full">
      <Editor
        height={height}
        defaultLanguage={language || 'javascript'}
        language={language || 'javascript'}
        value={code}
        theme="custom-theme"
        onMount={handleEditorDidMount}
        onChange={(value) => onCodeChange(value || '')}
        options={{
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
        }}
      />
    </div>
  );
};
