'use client';

import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TestResult } from '@/types/customTest';

interface TestResultsProps {
  result: TestResult;
  onRetakeTest: () => void;
  onBackToTests: () => void;
}

export default function TestResults({
  result,
  onRetakeTest,
  onBackToTests,
}: TestResultsProps) {
  const { attempt, test } = result;
  const percentageScore = result.percentageScore;

  // Safety check for answers array
  const answers = Array.isArray(attempt.answers) ? attempt.answers : [];
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const passed = result.passed;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent! Outstanding performance!';
    if (percentage >= 80) return 'Great job! Well done!';
    if (percentage >= 70) return 'Good effort! Keep practicing!';
    if (percentage >= 60) return 'Nice try! Room for improvement.';
    return 'Keep learning! Practice makes perfect.';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            {passed ? (
              <Trophy className="h-16 w-16 text-yellow-500" />
            ) : (
              <Target className="h-16 w-16 text-gray-400" />
            )}
          </div>

          <h1 className="text-3xl font-bold">Test Completed!</h1>
          <h2 className="text-xl text-muted-foreground">{test.title}</h2>

          <div className="space-y-2">
            <div
              className={`text-4xl font-bold ${getScoreColor(percentageScore)}`}
            >
              {percentageScore.toFixed(1)}%
            </div>
            <p className="text-lg text-muted-foreground">
              {getScoreMessage(percentageScore)}
            </p>
          </div>

          <Badge
            className={
              passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }
          >
            {passed ? 'PASSED' : 'FAILED'}
          </Badge>
        </div>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            <div className="text-2xl font-bold text-green-600">
              {attempt.score}
            </div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
            <div className="text-xs text-muted-foreground">
              out of {attempt.totalPoints}
            </div>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="space-y-2">
            <Clock className="h-8 w-8 text-blue-500 mx-auto" />
            <div className="text-2xl font-bold">
              {formatTime(attempt.timeSpent)}
            </div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
            <div className="text-xs text-muted-foreground">
              out of {test.duration}min
            </div>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="space-y-2">
            <Target className="h-8 w-8 text-purple-500 mx-auto" />
            <div className="text-2xl font-bold">{correctCount}</div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
            <div className="text-xs text-muted-foreground">
              out of {test.questions.length}
            </div>
          </div>
        </Card>
      </div>

      {/* Question Review */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Question Review</h3>
        <div className="space-y-4">
          {test.questions.map((question, index) => {
            const answer = answers.find((a) => a.questionId === question.id);
            const isCorrect = answer?.isCorrect || false;

            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Question {index + 1}</span>
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isCorrect ? 'default' : 'destructive'}>
                      {isCorrect ? '+' : '0'} {answer?.pointsEarned || 0} pts
                    </Badge>
                    <Badge variant="secondary">{question.points} total</Badge>
                  </div>
                </div>

                <p className="text-sm mb-2">{question.question}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-600">
                      Your Answer:
                    </span>
                    <p className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      {formatAnswer(answer?.answer, question.type)}
                    </p>
                  </div>

                  {!isCorrect && (
                    <div>
                      <span className="font-medium text-blue-600">
                        Correct Answer:
                      </span>
                      <p className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        {formatAnswer(question.correctAnswer, question.type)}
                      </p>
                    </div>
                  )}
                </div>

                {question.explanation && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    <span className="font-medium">Explanation:</span>
                    <p className="mt-1">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onRetakeTest}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Test
          </Button>
          <Button onClick={onBackToTests}>
            <Home className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </Card>
    </div>
  );
}

function formatAnswer(
  answer: string | string[] | undefined,
  type: string
): string {
  if (!answer) return 'Not answered';

  if (Array.isArray(answer)) {
    return answer.join(', ');
  }

  if (type === 'true-false') {
    return answer.toString() === 'true' ? 'True' : 'False';
  }

  return answer.toString();
}
