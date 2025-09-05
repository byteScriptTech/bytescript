import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemCardProps {
  id: string;
  title: string;
  description?: string;
  difficulty?: Difficulty;
  tags?: string[];
}

const getDifficultyClasses = (difficulty: Difficulty) => {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';
  const variants = {
    Easy: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300',
    Medium:
      'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Hard: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300',
  } as const;

  return `${base} ${variants[difficulty]}`;
};

export function ProblemCard({
  id,
  title,
  description,
  difficulty = 'Medium',
  tags = [],
}: ProblemCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/competitive-programming/problems/${id}`}
              className="-mt-1 rounded-md p-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid="problem-title-link"
            >
              <h3 className="text-lg font-semibold leading-snug group-hover:text-primary">
                {title}
              </h3>
            </Link>
            <span
              className={cn(
                getDifficultyClasses((difficulty as Difficulty) || 'Medium'),
                'shrink-0'
              )}
              data-testid="problem-difficulty"
            >
              {difficulty}
            </span>
          </div>

          {description && (
            <p
              className="text-muted-foreground text-sm line-clamp-2 mt-1"
              data-testid="problem-description"
            >
              {description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardFooter className="pt-0">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="h-5 px-2 py-0.5 text-xs font-normal"
                data-testid="problem-tag"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="h-5 px-2 py-0.5 text-xs"
                data-testid="problem-tag-more"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            asChild
            data-testid="solve-button"
          >
            <Link href={`/competitive-programming/problems/${id}`}>
              Solve Challenge
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
