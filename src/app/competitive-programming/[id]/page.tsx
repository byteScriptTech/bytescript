'use client';

import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Button } from '@/components/ui/button';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { problemsService } from '@/services/firebase/problemsService';
import { Problem } from '@/services/firebase/problemsService';

export default function ProblemPage() {
  const params = useParams();
  const id = params.id;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProblem = async () => {
        try {
          setLoading(true);
          const problem = await problemsService.getProblemById(id as string);
          setProblem(problem);
        } catch (err) {
          console.error('Error fetching problem:', err);
          setError('Failed to fetch problem');
        } finally {
          setLoading(false);
        }
      };
      fetchProblem();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="text-center py-8">Problem not found</div>;
  }

  const handleRun = () => {
    // TODO: Implement code execution
    setOutput('');
    setError('');
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    setOutput('');
    setError('');
  };

  return (
    <AuthGuard>
      <ContentProvider>
        <LanguagesProvider>
          <LocalStorageProvider>
            <div className="flex min-h-screen w-full flex-col">
              <Navbar />
              <main className="flex-1">
                <div className="container mx-auto px-4 py-8 md:px-0">
                  <div className="flex flex-col gap-6 md:gap-8 md:flex-row md:h-full md:w-full">
                    {/* Problem Description */}
                    <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                        <div className="mt-2 flex items-center gap-2">
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
                                {
                                  addSuffix: true,
                                }
                              )
                            : 'Never attempted'}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                          Problem Description
                        </h2>
                        <div className="prose max-w-none text-gray-700">
                          <pre className="whitespace-pre-wrap">
                            {problem.description}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Examples</h2>
                        {problem.examples.map((example, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="mb-2">
                              <h3 className="font-medium">
                                Example {index + 1}
                              </h3>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <strong>Input:</strong> {example.input}
                              </div>
                              <div>
                                <strong>Output:</strong> {example.output}
                              </div>
                              {example.explanation && (
                                <div>
                                  <strong>Explanation:</strong>{' '}
                                  {example.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Constraints</h2>
                        <ul className="list-disc pl-5 text-gray-600">
                          {problem.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Code Editor */}
                    <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">Code Editor</h2>
                          <select className="rounded-md border px-3 py-1">
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                          </select>
                        </div>
                        <div className="min-h-[400px] border rounded-lg p-4">
                          {/* TODO: Add actual code editor component */}
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Write your code here..."
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:flex-row">
                        <Button onClick={handleRun} className="flex-1">
                          Run
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          variant="outline"
                          className="flex-1"
                        >
                          Submit
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:items-center mb-4">
                          <h2 className="text-lg font-semibold">Run Results</h2>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Last run:
                            </span>
                            <span className="text-sm text-gray-400">
                              {formatDistanceToNow(new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {error && (
                            <div className="border rounded-lg p-4 bg-red-50">
                              <h3 className="font-medium mb-2">Error</h3>
                              <pre className="whitespace-pre-wrap">{error}</pre>
                            </div>
                          )}

                          {output && (
                            <div className="border rounded-lg p-4 bg-green-50">
                              <h3 className="font-medium mb-2">Output</h3>
                              <pre className="whitespace-pre-wrap">
                                {output}
                              </pre>
                            </div>
                          )}

                          <div className="border rounded-lg p-4">
                            <h3 className="font-medium mb-2">Test Cases</h3>
                            <div className="space-y-4">
                              {problem.examples.map((example, index) => (
                                <div
                                  key={index}
                                  className="p-4 border rounded-lg"
                                >
                                  <div className="mb-2">
                                    <h4 className="font-medium">
                                      Example {index + 1}
                                    </h4>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <strong>Input:</strong> {example.input}
                                    </div>
                                    <div>
                                      <strong>Expected Output:</strong>{' '}
                                      {example.output}
                                    </div>
                                    {example.explanation && (
                                      <div>
                                        <strong>Explanation:</strong>{' '}
                                        {example.explanation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </LocalStorageProvider>
        </LanguagesProvider>
      </ContentProvider>
    </AuthGuard>
  );
}
