'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { CustomTestService } from '@/services/firebase/customTestService';
import { CustomTest, TestAttempt, TestResult } from '@/types/customTest';

import CustomTestList from './CustomTestList';
import TestCreator from './TestCreator';
import TestResults from './TestResults';
import TestTaker from './TestTaker';

type ViewState = 'list' | 'create' | 'edit' | 'take' | 'results';

export default function CustomTestContent() {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedTest, setSelectedTest] = useState<CustomTest | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(
    null
  );
  const [, setEditingTestId] = useState<string | null>(null);

  const handleCreateTest = () => {
    setViewState('create');
  };

  const handleSaveTest = (_testId: string) => {
    toast.success('Test saved successfully!');
    setViewState('list');
  };

  const handleCancelCreate = () => {
    setViewState('list');
  };

  const handleStartTest = async (testId: string) => {
    try {
      const test = await CustomTestService.getTest(testId);
      if (test) {
        // Navigate to the separate custom test page
        router.push(`/customtest/${testId}`);
      }
    } catch (error) {
      console.error('Error loading test:', error);
      toast.error('Failed to load test');
    }
  };

  const handleEditTest = (testId: string) => {
    setEditingTestId(testId);
    setViewState('edit');
  };

  const handleCompleteTest = (attempt: TestAttempt) => {
    setSelectedAttempt(attempt);
    setViewState('results');
  };

  const handleRetakeTest = () => {
    if (selectedTest) {
      setViewState('take');
    }
  };

  const handleViewAttemptResults = async (attempt: TestAttempt) => {
    try {
      const test = await CustomTestService.getTest(attempt.testId);
      if (test) {
        setSelectedTest(test);
        setSelectedAttempt(attempt);
        setViewState('results');
      }
    } catch (error) {
      console.error('Error loading test for results:', error);
      toast.error('Failed to load test results');
    }
  };

  const handleBackToTests = () => {
    setViewState('list');
    setSelectedTest(null);
    setSelectedAttempt(null);
  };

  const renderContent = () => {
    switch (viewState) {
      case 'list':
        return (
          <CustomTestList
            onCreateTest={handleCreateTest}
            onStartTest={handleStartTest}
            onEditTest={handleEditTest}
            onViewAttemptResults={handleViewAttemptResults}
          />
        );

      case 'create':
        return (
          <TestCreator onCancel={handleCancelCreate} onSave={handleSaveTest} />
        );

      case 'edit':
        return (
          <TestCreator onCancel={handleBackToTests} onSave={handleSaveTest} />
        );

      case 'take':
        return selectedTest ? (
          <TestTaker
            test={selectedTest}
            onComplete={handleCompleteTest}
            onCancel={handleBackToTests}
          />
        ) : null;

      case 'results':
        if (selectedAttempt && selectedTest) {
          // Create TestResult object
          const result: TestResult = {
            attempt: selectedAttempt,
            test: selectedTest,
            percentageScore:
              (selectedAttempt.score / selectedAttempt.totalPoints) * 100,
            passed: selectedAttempt.score / selectedAttempt.totalPoints >= 0.6, // 60% passing threshold
          };

          return (
            <TestResults
              result={result}
              onRetakeTest={handleRetakeTest}
              onBackToTests={handleBackToTests}
            />
          );
        }
        return null;

      default:
        return (
          <CustomTestList
            onCreateTest={handleCreateTest}
            onStartTest={handleStartTest}
            onEditTest={handleEditTest}
            onViewAttemptResults={handleViewAttemptResults}
          />
        );
    }
  };

  return <div className="min-h-full">{renderContent()}</div>;
}
