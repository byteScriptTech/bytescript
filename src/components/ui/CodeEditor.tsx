import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
  language: string;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  language,
  height = '600px',
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor settings
    editor.updateOptions({
      minimap: {
        enabled: true,
      },
      fontSize: 14,
      lineHeight: 22,
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });

    // Set up theme
    monaco.editor.defineTheme('customTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#d4d4d4',
      },
    });
  };

  return (
    <Editor
      height={height}
      defaultLanguage={language || 'javascript'}
      value={code}
      onChange={(value) => onCodeChange(value ?? '')}
      theme="default"
      options={{
        selectOnLineNumbers: true,
        readOnly: false,
        automaticLayout: true,
      }}
      onMount={handleEditorDidMount}
      loading="Loading code editor..."
    />
  );
};
