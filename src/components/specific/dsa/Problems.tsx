'use client';

import {
  ChevronDown,
  ChevronUp,
  Code,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Problem {
  id?: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  tags?: string[];
  initialCode?: string;
  hint?: string;
  solution?: string;
}

interface ProblemsProps {
  problems: Problem[];
}

export function Problems({ problems }: ProblemsProps) {
  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(
    new Set()
  );
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [revealedSolutions, setRevealedSolutions] = useState<Set<string>>(
    new Set()
  );

  const toggleProblemExpansion = (problemId: string) => {
    setExpandedProblems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const toggleHint = (problemId: string) => {
    setRevealedHints((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const toggleSolution = (problemId: string) => {
    setRevealedSolutions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!problems || problems.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          No practice problems available for this topic yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Practice Problems</h3>
        <span className="text-sm text-muted-foreground">
          {problems.length} {problems.length === 1 ? 'problem' : 'problems'}{' '}
          available
        </span>
      </div>

      {problems.map((problem) => {
        const problemId = problem.id || `problem-${problem.title}`;
        const isExpanded = expandedProblems.has(problemId);
        const hintRevealed = revealedHints.has(problemId);
        const solutionRevealed = revealedSolutions.has(problemId);

        return (
          <Card key={problemId} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)}
                    </Badge>
                    {problem.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleProblemExpansion(problemId)}
                  className="shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-4 pt-0">
                <CardDescription className="text-base leading-relaxed">
                  {problem.description}
                </CardDescription>

                {problem.initialCode && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <h4 className="font-medium text-sm">Initial Code</h4>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{problem.initialCode}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {problem.hint && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleHint(problemId)}
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {hintRevealed ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                    {hintRevealed && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                        <p className="text-sm text-blue-800">{problem.hint}</p>
                      </div>
                    )}
                  </div>
                )}

                {problem.solution && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSolution(problemId)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {solutionRevealed ? 'Hide Solution' : 'Show Solution'}
                    </Button>
                    {solutionRevealed && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                        <div className="text-sm text-green-800 whitespace-pre-wrap">
                          {problem.solution}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
