import Markdown from '@/components/common/Markdown';

import type { Problem } from '../../../types/problem';

interface ProblemDetailProps {
  problem: Problem;
}

export default function ProblemDetail({ problem }: ProblemDetailProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {problem.title}
          </h1>
        </div>

        {/* Basic Problem Info */}
        <div className="space-y-4 sm:space-y-5">
          {/* Problem Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h2 className="font-semibold text-sm sm:text-base mb-2">
              Problem Type
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                    Difficulty
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">{problem.difficulty}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <span className="text-sm">{problem.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
              Problem Description
            </h2>
            <div className="text-sm text-gray-800 leading-relaxed">
              <Markdown content={problem.description} />
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-medium text-gray-700 uppercase tracking-wider">
              Examples
            </h2>
            <div className="space-y-3 sm:space-y-4">
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
                    className="p-3 sm:p-4 bg-white border border-gray-100 rounded-lg shadow-xs"
                  >
                    <div className="mb-2 font-medium text-sm text-gray-900 sm:mb-3 sm:text-base">
                      Example {index + 1}
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          Input:
                        </span>
                        <pre className="whitespace-pre-wrap overflow-x-auto rounded border border-gray-100 bg-gray-50 p-2 font-mono text-xs text-gray-800 sm:p-3 sm:text-sm">
                          {JSON.stringify(example.input)}
                        </pre>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          Output:
                        </span>
                        <pre className="whitespace-pre-wrap overflow-x-auto rounded border border-gray-100 bg-gray-50 p-2 font-mono text-xs text-gray-800 sm:p-3 sm:text-sm">
                          {JSON.stringify(example.output)}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div className="flex flex-col gap-1 pt-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">
                            Explanation:
                          </span>
                          <div className="rounded border border-blue-100 bg-blue-50 p-2 text-xs text-gray-700 sm:p-3 sm:text-sm">
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
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                Constraints
              </h2>
              <ul className="text-sm space-y-1.5 text-gray-600 pl-4">
                {problem.constraints?.map(
                  (constraint: string, index: number) => (
                    <li key={index} className="leading-tight">
                      <span className="text-gray-900 font-medium">•</span>{' '}
                      {constraint}
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
