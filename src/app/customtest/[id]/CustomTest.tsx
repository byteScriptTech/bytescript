'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { JavaScriptCodeEditor } from '@/components/common/CodeEditor';
import Timer from '@/components/TestTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuthRedux } from '@/hooks/useAuthRedux';
import { CustomTestService } from '@/services/firebase/customTestService';
import { CustomTest, TestQuestion, TestAnswer } from '@/types/customTest';

export default function CustomTestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const testId = params?.id;

  const { currentUser } = useAuthRedux();

  const [test, setTest] = useState<CustomTest | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------------
  // Fetch Test & Start Attempt
  // -------------------------------
  useEffect(() => {
    const fetchTest = async (id: string) => {
      try {
        setLoading(true);

        if (!currentUser) {
          setError('User not authenticated');
          return;
        }

        const testData = await CustomTestService.getTest(id);
        if (!testData) {
          setError('Test not found');
          return;
        }

        setTest(testData);
        setQuestions(testData.questions);

        // Create attempt
        const attempt = await CustomTestService.startTestAttempt(
          id,
          currentUser.uid
        );
        setAttemptId(attempt);

        // Prepare answers list
        const initAnswers: TestAnswer[] = testData.questions.map((q) => ({
          questionId: q.id,
          answer: '',
          isCorrect: false,
          pointsEarned: 0,
          timeSpent: 0,
        }));

        setAnswers(initAnswers);

        // Initial code template for coding questions
        if (testData.questions[0].type === 'coding') {
          setUserCode(testData.questions[0].codeTemplate || '');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load test');
      } finally {
        setLoading(false);
      }
    };

    if (testId && currentUser) fetchTest(testId);
  }, [testId, currentUser]);

  // -------------------------------
  // Navigation
  // -------------------------------
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];

      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setShowExplanation(false);

      if (nextQuestion.type === 'coding') {
        setUserCode(nextQuestion.codeTemplate || '');
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[prevIndex];

      setCurrentQuestionIndex(prevIndex);
      setSelectedOption(null);
      setShowExplanation(false);

      if (prevQuestion.type === 'coding') {
        setUserCode(prevQuestion.codeTemplate || '');
      }
    }
  };

  // -------------------------------
  // Submit Single Question
  // -------------------------------
  const handleSubmit = () => {
    if (!currentUser || !attemptId) return;

    setIsSubmitting(true);
    setShowExplanation(true);

    const currentAnswer = selectedOption || userCode || '';
    const updated = [...answers];

    updated[currentQuestionIndex] = {
      ...updated[currentQuestionIndex],
      answer: currentAnswer,
      isCorrect:
        currentAnswer === questions[currentQuestionIndex].correctAnswer,
    };

    setAnswers(updated);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      }
      setIsSubmitting(false);
    }, 800);
  };

  // -------------------------------
  // Final Complete Test
  // -------------------------------
  const handleComplete = () => {
    router.push(`/customtest/${testId}/results`);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // -------------------------------
  // UI STATES
  // -------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p>Loading test...</p>
      </div>
    );
  }

  if (error || !test || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error ?? 'Test not found'}</p>
        <Button className="mt-4" onClick={() => router.push('/customtest')}>
          Back to Practice
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* HEADER */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/practice')}
          className="flex items-center gap-2"
        >
          ← Back to Practice
        </Button>
      </div>

      {/* Test Overview */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <p className="text-gray-600">{test.description}</p>

        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>Duration: {test.duration} minutes</span>
          <span>Difficulty: {test.difficulty}</span>
          <span>Questions: {questions.length}</span>
        </div>
      </div>

      {/* Progress & Timer */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <div className="text-sm text-gray-600">
                Progress: {progress.toFixed(1)}%
              </div>
            </div>

            {/* ⏳ TIMER COMPONENT */}
            <Timer
              testId={testId || 'unknown'}
              initialSeconds={test.duration * 60}
              onExpire={handleComplete}
            />
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between">
            <span>{currentQuestion.question}</span>
            <span className="text-sm text-gray-500">
              {currentQuestion.points} pts
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentQuestion.type === 'multiple-choice' ? (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedOption === option}
                    onCheckedChange={() => setSelectedOption(option)}
                  />
                  <Label className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          ) : currentQuestion.type === 'coding' ? (
            <div className="space-y-3">
              <Label>Write your code:</Label>
              <div className="h-full border rounded-md overflow-hidden">
                <JavaScriptCodeEditor
                  initialCode={userCode}
                  className="w-full"
                  height="300px"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Unsupported question type: {currentQuestion.type}
            </p>
          )}

          {showExplanation && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium">Explanation:</h4>
              <p className="text-sm mt-1">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            Finish Test
          </Button>
        ) : (
          <Button onClick={handleSubmit}>Submit & Next</Button>
        )}
      </div>
    </div>
  );
}
