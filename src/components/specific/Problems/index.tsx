'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useProblems } from '@/hooks/useProblems';

const ITEMS_PER_PAGE = 10;

export const Problems = () => {
  const { problems, loading, error, updateLastAttempted } = useProblems();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filteredProblems = useMemo(() => {
    if (!difficultyFilter) return problems || [];
    return (problems || []).filter(
      (problem) =>
        problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    );
  }, [problems, difficultyFilter]);

  const totalPages = Math.ceil(
    (filteredProblems?.length || 0) / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProblems =
    filteredProblems?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  const difficultyCounts = useMemo(
    () => ({
      all: problems?.length || 0,
      easy:
        problems?.filter(
          (problem) => problem.difficulty.toLowerCase() === 'easy'
        ).length || 0,
      medium:
        problems?.filter(
          (problem) => problem.difficulty.toLowerCase() === 'medium'
        ).length || 0,
      hard:
        problems?.filter(
          (problem) => problem.difficulty.toLowerCase() === 'hard'
        ).length || 0,
    }),
    [problems]
  );

  const handlePractice = async (id: string) => {
    await updateLastAttempted(id);
    router.push(`/competitive-programming/${id}`);
  };

  return (
    <div className="space-y-3">
      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        {[
          { value: null, label: 'All', count: difficultyCounts.all },
          { value: 'easy', label: 'Easy', count: difficultyCounts.easy },
          { value: 'medium', label: 'Med', count: difficultyCounts.medium },
          { value: 'hard', label: 'Hard', count: difficultyCounts.hard },
        ].map(({ value, label, count }) => (
          <button
            key={value || 'all'}
            onClick={() => {
              setCurrentPage(1);
              setDifficultyFilter(value);
            }}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              difficultyFilter === value
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="hidden xs:inline">{label}</span>
            <span className="xs:hidden">{label.charAt(0)}</span>
            {count > 0 && <span className="ml-0.5">({count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
          Failed to load problems. Please try again later.
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedProblems.map((problem) => (
            <div
              key={problem.id}
              className="group bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-900/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                    {problem.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span
                      className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : problem.difficulty === 'Medium'
                            ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    {problem.solved && (
                      <span className="px-2 py-0.5 sm:py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] sm:text-xs font-medium">
                        Solved
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-center mt-1 sm:mt-0 shadow-sm hover:shadow transition-colors text-xs sm:text-sm"
                  onClick={() => handlePractice(problem.id)}
                >
                  Practice
                </Button>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination className="justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={`text-xs sm:text-sm ${
                        currentPage === 1
                          ? 'pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          className="text-xs sm:text-sm"
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={`text-xs sm:text-sm ${
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
