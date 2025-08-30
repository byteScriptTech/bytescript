import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProblemStatus = 'solved' | 'attempted' | 'todo';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  status: ProblemStatus;
}

interface PatternData {
  title: string;
  description: string;
  readme?: string;
  problems?: Problem[];
}

// Mock data - replace with actual data fetching
const patternData: Record<string, PatternData> = {
  backtracking: {
    title: 'Backtracking',
    description:
      "Explore problems that involve trying different solutions and undoing them if they don't work, like solving mazes or puzzles.",
    readme: `
## What is Backtracking?

Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point in time.

## When to Use Backtracking

- When you need to explore all possible solutions
- When the solution requires making a series of choices
- When you need to find all possible configurations
- When the problem has constraints that must be satisfied

## Common Problems

- N-Queens Problem
- Sudoku Solver
- Maze Solving
- Generating all permutations/combinations

## Time Complexity

- Generally O(b^d) where b is the branching factor and d is the depth of the recursion tree
- Can be optimized with pruning techniques
`,
    problems: [
      {
        id: '1',
        title: 'N-Queens',
        difficulty: 'Hard',
        tags: ['Backtracking', 'Recursion'],
        status: 'solved',
      },
      {
        id: '2',
        title: 'Sudoku Solver',
        difficulty: 'Hard',
        tags: ['Backtracking', 'Matrix'],
        status: 'attempted',
      },
      {
        id: '3',
        title: 'Combination Sum',
        difficulty: 'Medium',
        tags: ['Backtracking', 'Array'],
        status: 'todo',
      },
    ],
  },
  'binary-search': {
    title: 'Binary Search',
    description:
      'Learn how to efficiently search through sorted data by repeatedly dividing the search interval in half.',
    readme:
      '## Binary Search\n\nBinary search is an efficient algorithm for finding an item from a sorted list of items...',
    problems: [
      {
        id: '4',
        title: 'Binary Search',
        difficulty: 'Easy',
        tags: ['Binary Search', 'Array'],
        status: 'todo',
      },
    ],
  } satisfies PatternData,
};

type Props = {
  params: { patternId: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const patternId = params.patternId?.[0] || '';
  const pattern = patternData[patternId];

  if (!pattern) return {};

  return {
    title: `${pattern.title} | Competitive Programming`,
    description: pattern.description,
  };
}

function getStatusColor(status: ProblemStatus) {
  switch (status) {
    case 'solved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'attempted':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export default function PatternPage({ params }: Props) {
  const patternId = params.patternId?.[0] || '';
  const pattern = patternData[patternId];

  if (!pattern) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{pattern.title}</h1>
        <p className="text-muted-foreground mt-2">{pattern.description}</p>
      </div>

      <Tabs defaultValue="readme" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
          <TabsTrigger value="readme">Readme</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
        </TabsList>

        <TabsContent value="readme">
          <Card>
            <CardContent className="pt-6">
              <article className="prose dark:prose-invert max-w-none">
                {pattern.readme ? (
                  <MarkdownRenderer>{pattern.readme}</MarkdownRenderer>
                ) : (
                  <p className="text-muted-foreground">
                    No readme available for this pattern.
                  </p>
                )}
              </article>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Practice Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pattern.problems?.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{problem.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={getStatusColor(problem.status)}
                        >
                          {problem.status.charAt(0).toUpperCase() +
                            problem.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">{problem.difficulty}</Badge>
                        {problem.tags.map((tag: string) => (
                          <div key={tag} className="whitespace-nowrap">
                            <Badge variant="secondary">{tag}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Solve
                    </Button>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-8">
                    No problems available for this pattern yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
