import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

import Markdown from '@/components/common/Markdown';

import type { Problem, Submission } from '../../../types/problem';

interface ProblemDetailProps {
  problem: Problem & { lastAttempted?: Timestamp | Date | null };
  submissions?: Submission[];
}

export default function ProblemDetail({
  problem,
  submissions = [],
}: ProblemDetailProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {problem.title}
          </h1>
          <div className="mt-1 text-xs sm:text-sm text-gray-500">
            <p>
              Last attempted:{' '}
              {problem.lastAttempted
                ? formatDistanceToNow(
                    problem.lastAttempted instanceof Timestamp
                      ? problem.lastAttempted.toDate()
                      : problem.lastAttempted,
                    { addSuffix: true }
                  )
                : 'Never'}
              {submissions.length > 0 && (
                <span className="ml-2">
                  • {submissions.length} submission
                  {submissions.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
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
                    <div className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
                      Example {index + 1}
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          Input:
                        </span>
                        <pre className="whitespace-pre-wrap bg-gray-50 p-2 sm:p-3 rounded text-xs sm:text-sm font-mono text-gray-800 border border-gray-100 overflow-x-auto">
                          {JSON.stringify(example.input)}
                        </pre>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          Output:
                        </span>
                        <pre className="whitespace-pre-wrap bg-gray-50 p-2 sm:p-3 rounded text-xs sm:text-sm font-mono text-gray-800 border border-gray-100 overflow-x-auto">
                          {JSON.stringify(example.output)}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div className="flex flex-col gap-1 pt-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">
                            Explanation:
                          </span>
                          <div className="text-xs sm:text-sm text-gray-700 bg-blue-50 p-2 sm:p-3 rounded border border-blue-100">
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
