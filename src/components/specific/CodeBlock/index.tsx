import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';
import { IoClipboardOutline } from 'react-icons/io5';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';

interface CodeBlockProps {
  title?: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to the clipboard');
  };

  return (
    <Card className="max-w-4xl mx-auto my-4">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="relative p-4 rounded-lg">
        <pre className="overflow-x-auto text-sm">
          <code className="whitespace-pre-wrap">{code}</code>
        </pre>
        <TooltipProvider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                className="absolute top-2 right-2 p-1 text-gray-400"
                onClick={copyToClipboard}
                aria-label="Copy code"
              >
                <IoClipboardOutline className="h-5 w-5" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="rounded px-2 py-1 text-xs">
              Copy
              <Tooltip.Arrow className="fill-gray-200" />
            </Tooltip.Content>
          </Tooltip.Root>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default CodeBlock;
