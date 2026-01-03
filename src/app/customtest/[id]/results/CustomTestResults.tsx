'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthRedux } from '@/hooks/useAuthRedux';
import { useCustomTestsRedux } from '@/hooks/useCustomTestsRedux';

export default function CustomTestResults() {
  const params = useParams<{ id: string }>();
  const testId = params?.id;
  const router = useRouter();
  const { currentUser } = useAuthRedux();

  // Use RTK Query hooks directly
  const {
    data: test,
    isLoading: testLoading,
    error: testError,
  } = useCustomTestsRedux().getTest(testId || '');
  const {
    data: attempts,
    isLoading: attemptsLoading,
    error: attemptsError,
  } = useCustomTestsRedux().getUserTestAttempts(currentUser?.uid || '');

  const loading = testLoading || attemptsLoading;
  const error = testError || attemptsError;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">
          {error ? String(error) : 'Test not found'}
        </p>
        <Button className="mt-4" onClick={() => router.push('/customtest')}>
          Back to Custom Tests
        </Button>
      </div>
    );
  }

  const latestAttempt = attempts?.[0];
  const score = latestAttempt
    ? (latestAttempt.score / latestAttempt.totalPoints) * 100
    : 0;
  const passed = score >= 60; // 60% passing threshold

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/customtest')}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Custom Tests
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <p className="text-gray-600">{test.description}</p>
      </div>

      {latestAttempt ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {score.toFixed(1)}%
                  </div>
                  <div className="text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {latestAttempt.score} / {latestAttempt.totalPoints}
                  </div>
                  <div className="text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {Math.floor(latestAttempt.timeSpent / 60)}:
                    {(latestAttempt.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-600">Time Spent</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div
                  className={`inline-block px-4 py-2 rounded-full text-white font-medium ${
                    passed ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {passed ? 'PASSED' : 'FAILED'}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => router.push(`/customtest/${testId}`)}>
              Retake Test
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/customtest')}
            >
              Back to Tests
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No attempts found for this test.
            </p>
            <Button onClick={() => router.push(`/customtest/${testId}`)}>
              Start Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
