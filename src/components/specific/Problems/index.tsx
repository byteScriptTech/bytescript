'use client';

import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useProblems } from '@/hooks/useProblems';

export const Problems = () => {
  const { problems, loading, error, updateLastAttempted } = useProblems();
  const router = useRouter();

  const handlePractice = async (id: string) => {
    await updateLastAttempted(id);
    router.push(`/competitive-programming/${id}`);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border rounded-lg p-4 hover:bg-muted/5 transition-colors"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500">Failed to load problems</div>
      ) : (
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
                  <p className="mt-4 text-gray-600">
                    {problem.lastAttempted
                      ? formatDistanceToNow(
                          problem.lastAttempted instanceof Timestamp
                            ? problem.lastAttempted.toDate()
                            : problem.lastAttempted,
                          { addSuffix: true }
                        )
                      : 'Never attempted'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePractice(problem.id)}
                >
                  Practice
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
