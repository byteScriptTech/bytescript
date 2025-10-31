import Markdown from '@/components/common/Markdown';

import type { Problem } from '../../../types/problem';

interface ProblemDetailProps {
  problem: Problem;
}

export default function ProblemDetail({ problem }: ProblemDetailProps) {
  return (
    <div className="w-full h-full flex flex-col text-foreground">
      <div className="space-y-4 sm:space-y-5 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent hover:scrollbar-thumb-border/80 dark:scrollbar-thumb-border/30 dark:hover:scrollbar-thumb-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {problem.title}
          </h1>
        </div>

        {/* Basic Problem Info */}
        <div className="space-y-4 sm:space-y-5">
          {/* Problem Requirements */}
          <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
            <h2 className="font-semibold text-sm sm:text-base mb-3 text-foreground">
              Problem Type
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Difficulty
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-foreground">
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Category
                  </h3>
                  <span className="text-sm font-medium text-foreground">
                    {problem.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Problem Description
            </h2>
            <div className="text-base leading-relaxed text-foreground">
              <Markdown content={problem.description} />
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Examples
            </h2>
            <div className="space-y-4">
              {problem.examples?.map(
                (
                  example: {
                    input: string;
                    output: string;
                    explanation?: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="p-4 bg-card rounded-lg border border-border shadow-sm"
                  >
                    <div className="mb-3 font-medium text-foreground">
                      Example {index + 1}
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Input:
                        </span>
                        <pre className="whitespace-pre-wrap overflow-x-auto rounded border border-border bg-muted/50 p-3 font-mono text-sm">
                          {JSON.stringify(example.input)}
                        </pre>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Output:
                        </span>
                        <pre className="whitespace-pre-wrap overflow-x-auto rounded border border-border bg-muted/50 p-3 font-mono text-sm">
                          {JSON.stringify(example.output)}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div className="flex flex-col gap-1 pt-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            Explanation:
                          </span>
                          <div className="rounded border border-primary/20 bg-[#f0fdf9] dark:bg-primary/5 p-3 text-sm text-foreground">
                            {example.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wider">
                Constraints
              </h2>
              <ul className="text-sm space-y-1.5 text-muted-foreground/80 pl-4">
                {problem.constraints?.map(
                  (constraint: string, index: number) => (
                    <li key={index} className="leading-tight">
                      <span className="text-foreground/90 font-medium">•</span>{' '}
                      <span className="text-foreground/80">{constraint}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
