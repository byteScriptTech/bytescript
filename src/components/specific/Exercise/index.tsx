import { AlertCircle, Lightbulb, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { JavaScriptCodeEditor } from '@/components/common/JavaScriptCodeEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface ExerciseProps {
  title: string;
  prompt: string;
  difficulty: Difficulty;
  hint?: string;
  initialCode?: string;
  solution?: string;
  code?: string;
}

export function Exercise({
  title,
  prompt,
  difficulty,
  hint,
  initialCode = '',
  solution,
  code = '',
}: ExerciseProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const difficultyColors = {
    Beginner:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Intermediate:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1',
                difficultyColors[difficulty]
              )}
            >
              {difficulty}
            </span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground">{prompt}</p>
        </div>

        {code && (
          <div className="mt-4">
            <Label>Initial Code:</Label>
            <div className="mt-1 rounded-md overflow-hidden border [&_.cm-editor]:bg-muted/50 [&_.cm-editor]:p-2 [&_.cm-editor]:rounded-md [&_.cm-gutters]:bg-muted/30 [&_.cm-gutters]:border-r [&_.cm-gutters]:border-border/50 [&_.cm-scroller]:min-h-[100px]">
              <JavaScriptCodeEditor
                initialCode={code}
                readOnly={true}
                showRunButton={false}
                showOutput={false}
                className="rounded-t-none border-0"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="code-editor">Your Solution</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </div>

          {showHint && hint && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 text-sm text-yellow-800 dark:text-yellow-200">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Hint</p>
                  <p className="mt-1">{hint}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md overflow-hidden border">
            <JavaScriptCodeEditor
              initialCode={initialCode}
              readOnly={false}
              showRunButton={true}
              showOutput={true}
              className="rounded-b-none"
            />
          </div>
        </div>

        {solution && (
          <div className="mt-4">
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1 w-full justify-between"
              >
                <span>{showSolution ? 'Hide' : 'Show'} Solution</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showSolution ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              {showSolution && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Solution:</h4>
                  <div className="rounded-md overflow-hidden border [&_.cm-editor]:bg-muted/50 [&_.cm-editor]:p-2 [&_.cm-editor]:rounded-md [&_.cm-gutters]:bg-muted/30 [&_.cm-gutters]:border-r [&_.cm-gutters]:border-border/50 [&_.cm-scroller]:min-h-[100px]">
                    <JavaScriptCodeEditor
                      initialCode={solution}
                      readOnly={true}
                      showRunButton={false}
                      showOutput={false}
                      className="rounded-t-none border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Press{' '}
          <kbd className="px-1.5 py-0.5 text-xs border rounded bg-muted">
            ⌘ + Enter
          </kbd>{' '}
          to run
        </div>
      </div>
    </div>
  );
}
