'use client';

import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
  lastAttempted: Date;
}

interface ProblemsProps {
  problems: Problem[];
}

export const Problems = ({ problems }: ProblemsProps) => {
  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className="border rounded-lg p-4 hover:bg-muted/5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{problem.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-800'
                      : problem.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {problem.difficulty}
                </span>
                {problem.solved && (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Solved
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(problem.lastAttempted, {
                  addSuffix: true,
                })}
              </span>
              <Button variant="outline" size="sm">
                Practice
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
