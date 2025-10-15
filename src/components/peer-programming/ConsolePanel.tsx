import { Terminal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type LogEntry = {
  type: 'log' | 'error' | 'info' | 'warn';
  message: string;
  timestamp: number;
};

type ConsolePanelProps = {
  logs: LogEntry[];
  onClear: () => void;
};

export function ConsolePanel({ logs, onClear }: ConsolePanelProps) {
  const renderLogItem = (log: LogEntry, index: number) => {
    const time = new Date(log.timestamp).toLocaleTimeString();
    const bgColor =
      log.type === 'error'
        ? 'bg-red-50 dark:bg-red-900/20'
        : log.type === 'warn'
          ? 'bg-yellow-50 dark:bg-yellow-900/20'
          : log.type === 'info'
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : '';

    return (
      <div key={index} className={`p-2 text-sm font-mono ${bgColor} border-b`}>
        <span className="text-gray-500 text-xs mr-2">[{time}]</span>
        <span
          className={`${
            log.type === 'error'
              ? 'text-red-600 dark:text-red-400'
              : log.type === 'warn'
                ? 'text-yellow-600 dark:text-yellow-400'
                : log.type === 'info'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-foreground'
          }`}
        >
          {log.message}
        </span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col border-t border-border bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Console</h3>
          {logs.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              {logs.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="divide-y divide-border">
            {logs.length === 0 ? (
              <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
                No logs to display
              </div>
            ) : (
              logs.map((log, index) => renderLogItem(log, index))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
