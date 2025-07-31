'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { CodingQuestion } from '@/components/specific/PracticeQuestion/CodingQuestion';
import { MCQQuestion } from '@/components/specific/PracticeQuestion/MCQQuestion';
import { QuestionHeader } from '@/components/specific/PracticeQuestion/QuestionHeader';
import { QuestionNavigation } from '@/components/specific/PracticeQuestion/QuestionNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePractice } from '@/context/PracticeContext';
import { PracticeQuestion } from '@/types/practiceQuestion';

export default function PracticeQuestionPage() {
  const { id: topicId } = useParams<{ id: string }>();
  const router = useRouter();
  const { getQuestionsByTopicId } = usePractice();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setShowExplanation(false);
      if (nextQuestion?.type === 'coding') {
        setUserCode(nextQuestion.initialCode || '');
      }
      setTimeRemaining(nextQuestion?.timeLimit || null);
    }
  };

  // Fetch questions for the topic
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const topicQuestions = await getQuestionsByTopicId(topicId);
        if (topicQuestions.length === 0) {
          setError('No questions found for this topic');
          return;
        }
        setQuestions(topicQuestions);
        // Set initial code for coding questions
        setUserCode(
          topicQuestions[0].type === 'coding'
            ? (topicQuestions[0] as any).initialCode || ''
            : ''
        );
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchQuestions();
    }
  }, [topicId, getQuestionsByTopicId]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p>Loading questions...</p>
      </div>
    );
  }

  // Show error state
  if (error || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error || 'No question found'}</p>
        <Button className="mt-4" onClick={() => router.push('/practice')}>
          Back to Practice
        </Button>
      </div>
    );
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[prevIndex];
      setCurrentQuestionIndex(prevIndex);
      setSelectedOption(null);
      setShowExplanation(false);
      if (prevQuestion?.type === 'coding') {
        setUserCode(prevQuestion.initialCode || '');
      }
      setTimeRemaining(prevQuestion?.timeLimit || null);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setShowExplanation(true);

    // In a real app, we would submit the answer to the server here
    // and wait for confirmation before moving to the next question

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (!isLastQuestion) {
        handleNextQuestion();
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleComplete = () => {
    // In a real app, we would submit the entire session to the server
    router.push(`/practice/${topicId}/results`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/practice')}
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
          Back to Practice
        </Button>
      </div>
      <QuestionHeader
        mockQuestions={questions}
        setTimeRemaining={setTimeRemaining}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        progress={progress}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex justify-between items-start">
              <span>{currentQuestion.question}</span>
              <span className="text-sm font-normal text-gray-500">
                {currentQuestion.points} points
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'mcq' ? (
            <MCQQuestion
              options={currentQuestion.options}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
            />
          ) : (
            <CodingQuestion
              initialCode={currentQuestion.initialCode || ''}
              testCases={currentQuestion.testCases}
              userCode={userCode}
              onCodeChange={setUserCode}
            />
          )}

          {showExplanation && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionNavigation
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
        isMcq={currentQuestion.type === 'mcq'}
        hasSelectedOption={!!selectedOption}
        onPrevious={handlePreviousQuestion}
        onSubmit={handleSubmit}
        onComplete={handleComplete}
      />
    </div>
  );
}
