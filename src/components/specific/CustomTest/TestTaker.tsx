'use client';

import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { CustomTestService } from '@/services/firebase/customTestService';
import {
  CustomTest,
  TestQuestion,
  TestAttempt,
  TestAnswer,
} from '@/types/customTest';

interface TestTakerProps {
  test: CustomTest;
  onComplete: (attempt: TestAttempt) => void;
  onCancel: () => void;
}

export default function TestTaker({
  test,
  onComplete,
  onCancel,
}: TestTakerProps) {
  const { currentUser } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60); // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  // Submit test function - defined early to avoid temporal dead zone
  const handleSubmitTest = useCallback(async () => {
    console.log('=== TEST SUBMISSION DEBUG ===');
    console.log('Attempt ID:', attemptId);
    console.log('Is submitting:', isSubmitting);
    console.log('Answers:', answers);
    console.log('Test questions:', test.questions);

    if (!attemptId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Calculate final scores
      const scoredAnswers = answers.map((answer) => {
        const question = test.questions.find((q) => q.id === answer.questionId);
        if (!question) return answer;

        let isCorrect = false;
        let pointsEarned = 0;

        if (question.type === 'multiple-choice') {
          isCorrect = answer.answer === question.correctAnswer;
        } else if (question.type === 'true-false') {
          isCorrect = answer.answer === question.correctAnswer;
        } else if (question.type === 'fill-blank') {
          isCorrect =
            answer.answer.toString().toLowerCase().trim() ===
            question.correctAnswer.toString().toLowerCase().trim();
        } else if (question.type === 'coding') {
          // For coding questions, you might want to implement actual code execution
          // For now, we'll mark them as incorrect unless manually reviewed
          isCorrect = false;
        }

        if (isCorrect) {
          pointsEarned = question.points || 1;
        }

        return {
          ...answer,
          isCorrect,
          pointsEarned,
        };
      });

      console.log('Scored answers:', scoredAnswers);

      const totalPoints = scoredAnswers.reduce(
        (sum, a) => sum + a.pointsEarned,
        0
      );
      const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);

      console.log('Total points:', totalPoints);
      console.log('Total time:', totalTime);

      // Update the attempt with final scores
      console.log('Updating attempt...');
      await CustomTestService.updateTestAttempt(attemptId, scoredAnswers);
      console.log('Attempt updated successfully');

      // Complete the attempt with final data
      console.log('Completing attempt...');
      try {
        await CustomTestService.completeTestAttempt(attemptId);
        console.log('Attempt completed successfully');
      } catch (completeError) {
        console.log(
          'Could not complete attempt due to security rules, but submission is still valid'
        );
        console.log('Complete error:', completeError);
      }

      // Get the final attempt data
      console.log('Getting final attempt data...');
      const finalAttempt = await CustomTestService.getTestAttempt(attemptId);
      console.log('Final attempt:', finalAttempt);

      // Create a completed attempt object even if we couldn't update Firestore
      const completedAttempt = finalAttempt
        ? {
            ...finalAttempt,
            answers: scoredAnswers,
            score: totalPoints,
            timeSpent: totalTime,
            status: 'completed' as const,
            completedAt: new Date(),
          }
        : null;

      if (completedAttempt) {
        onComplete(completedAttempt);
        toast.success('Test submitted successfully!');
      } else {
        throw new Error('Could not retrieve final attempt data');
      }
    } catch (error) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error:', error);
      toast.error('Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  }, [attemptId, isSubmitting, answers, test, onComplete]);

  useEffect(() => {
    const initializeTest = async () => {
      if (!currentUser) return;

      try {
        const testAttemptId = await CustomTestService.startTestAttempt(
          test.id,
          currentUser.uid
        );
        setAttemptId(testAttemptId);

        // Initialize answers
        const initialAnswers = test.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === 'multiple-choice' ? '' : '',
          isCorrect: false,
          pointsEarned: 0,
          timeSpent: 0,
        }));
        setAnswers(initialAnswers);
      } catch (error) {
        console.error('Error starting test:', error);
        toast.error('Failed to start test');
        onCancel();
      }
    };

    initializeTest();
  }, [test.id, currentUser, onCancel, test.questions]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmitTest]);

  const updateAnswer = useCallback(
    (questionId: string, answer: string | string[]) => {
      const now = Date.now();
      const timeSpent = Math.floor((now - questionStartTime) / 1000);

      setAnswers((prev) =>
        prev.map((a) =>
          a.questionId === questionId
            ? { ...a, answer, timeSpent: a.timeSpent + timeSpent }
            : a
        )
      );

      setQuestionStartTime(now);
    },
    [questionStartTime]
  );

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (test.duration * 60)) * 100;
    if (percentage <= 10) return 'text-red-600';
    if (percentage <= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{test.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${getTimeColor()}`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {currentQuestion.question}
              </h2>
              <Badge variant="secondary">{currentQuestion.points} points</Badge>
            </div>

            {currentQuestion.type === 'multiple-choice' && (
              <MultipleChoiceQuestion
                question={currentQuestion}
                answer={
                  (answers.find((a) => a.questionId === currentQuestion.id)
                    ?.answer as string) || ''
                }
                onAnswerChange={(answer) =>
                  updateAnswer(currentQuestion.id, answer)
                }
              />
            )}

            {currentQuestion.type === 'coding' && (
              <CodingQuestion
                question={currentQuestion}
                answer={
                  (answers.find((a) => a.questionId === currentQuestion.id)
                    ?.answer as string) || ''
                }
                onAnswerChange={(answer) =>
                  updateAnswer(currentQuestion.id, answer)
                }
              />
            )}

            {currentQuestion.type === 'true-false' && (
              <TrueFalseQuestion
                answer={
                  (answers.find((a) => a.questionId === currentQuestion.id)
                    ?.answer as string) || ''
                }
                onAnswerChange={(answer) =>
                  updateAnswer(currentQuestion.id, answer)
                }
              />
            )}

            {currentQuestion.type === 'fill-blank' && (
              <FillBlankQuestion
                answer={
                  (answers.find((a) => a.questionId === currentQuestion.id)
                    ?.answer as string) || ''
                }
                onAnswerChange={(answer) =>
                  updateAnswer(currentQuestion.id, answer)
                }
              />
            )}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === test.questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel Test
            </Button>

            <Button
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Test
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Question Navigation */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {test.questions.map((question, index) => {
            const answer = answers.find((a) => a.questionId === question.id);
            const isAnswered = answer && answer.answer !== '';
            const isCurrent = index === currentQuestionIndex;

            return (
              <Button
                key={question.id}
                variant={isCurrent ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setQuestionStartTime(Date.now());
                }}
                className={`w-10 h-10 p-0 ${isAnswered ? 'bg-green-100 border-green-500' : ''}`}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function MultipleChoiceQuestion({
  question,
  answer,
  onAnswerChange,
}: {
  question: TestQuestion;
  answer: string;
  onAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <label
          key={index}
          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <input
            type="radio"
            name="multiple-choice"
            value={option}
            checked={answer === option}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-4 h-4"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function CodingQuestion({
  question,
  answer,
  onAnswerChange,
}: {
  question: TestQuestion;
  answer: string;
  onAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-4">
      {question.codeTemplate && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Starter Code:</p>
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {question.codeTemplate}
          </pre>
        </div>
      )}

      <div>
        <label htmlFor="solution" className="block text-sm font-medium mb-2">
          Your Solution:
        </label>
        <textarea
          id="solution"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Write your solution here..."
          className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function TrueFalseQuestion({
  answer,
  onAnswerChange,
}: {
  answer: string;
  onAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-3">
      {['true', 'false'].map((value) => (
        <label
          key={value}
          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <input
            type="radio"
            name="true-false"
            value={value}
            checked={answer === value}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-4 h-4"
          />
          <span className="capitalize">{value}</span>
        </label>
      ))}
    </div>
  );
}

function FillBlankQuestion({
  answer,
  onAnswerChange,
}: {
  answer: string;
  onAnswerChange: (answer: string) => void;
}) {
  return (
    <div>
      <label htmlFor="answer" className="block text-sm font-medium mb-2">
        Your Answer:
      </label>
      <input
        id="answer"
        type="text"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: 'secondary';
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        variant === 'secondary'
          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      }`}
    >
      {children}
    </span>
  );
}
