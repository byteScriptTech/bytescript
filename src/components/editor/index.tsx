'use client';
import Editor from '@monaco-editor/react';
import React from 'react';

type MonacoEditorProps = {
  height?: string;
  language?: string;
  theme?: 'vs-dark' | 'light' | 'hc-black';
  value?: string;
  onChange?: (value: string | undefined) => void;
};

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  height = '90vh',
  language = 'javascript',
  theme = 'vs-dark',
  value = '',
  onChange,
}) => {
  return (
    <Editor
      height={height}
      defaultLanguage={language}
      theme={theme}
      value={value}
      onChange={onChange}
    />
  );
};

export default MonacoEditor;
