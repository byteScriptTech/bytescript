'use client';

import { useMemo } from 'react';

import { useProblems } from '@/hooks/useProblems';
import type { Problem } from '@/types/problem';

import { ProblemCard } from './ProblemCard';

interface ProblemsTabProps {
  patternSlug: string;
}

export function ProblemsTab({ patternSlug }: ProblemsTabProps) {
  const { problems, loading, error } = useProblems();

  // Filter problems based on the current pattern
  const filteredProblems = useMemo(() => {
    if (!problems || !patternSlug) return [];

    const patternSlugLower = patternSlug.toLowerCase();
    return problems.filter((problem: Problem) => {
      return (
        problem.tags?.some(
          (tag) =>
            typeof tag === 'string' && tag.toLowerCase() === patternSlugLower
        ) ||
        (problem.category &&
          typeof problem.category === 'string' &&
          problem.category.toLowerCase() === patternSlugLower)
      );
    });
  }, [problems, patternSlug]);

  return (
    <div className="grid gap-4">
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-destructive">Error: {error}</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No problems found for this pattern.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProblems.map((problem) => {
            return (
              <ProblemCard
                key={problem.id}
                id={problem.id}
                title={problem.title}
                description={problem.description}
                difficulty={problem.difficulty}
                tags={problem.tags}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
