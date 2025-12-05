'use client';

import {
  Plus,
  Play,
  Clock,
  Users,
  Edit,
  Trash2,
  FileText,
  Globe,
  History,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { CustomTestService } from '@/services/firebase/customTestService';
import { CustomTest, TestAttempt } from '@/types/customTest';

interface CustomTestListProps {
  onCreateTest: () => void;
  onStartTest: (testId: string) => void;
  onEditTest: (testId: string) => void;
  onViewAttemptResults: (attempt: TestAttempt) => void;
}

export default function CustomTestList({
  onCreateTest,
  onStartTest,
  onEditTest,
  onViewAttemptResults,
}: CustomTestListProps) {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'my-tests' | 'public' | 'attempts'
  >('my-tests');
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  // Debug function - add this to your component
  const debugTests = async () => {
    console.log('=== DEBUG INFO ===');
    console.log('Current user:', currentUser?.uid);
    console.log('Current user email:', currentUser?.email);

    try {
      // Test 1: Get user's own tests
      console.log('\n--- Testing getUserTests ---');
      const userTests = await CustomTestService.getUserTests(
        currentUser?.uid || ''
      );
      console.log('User tests found:', userTests.length);
      userTests.forEach((test) => {
        console.log(
          'User Test:',
          test.id,
          test.title,
          'createdBy:',
          test.createdBy
        );
      });

      // Test 2: Get public tests
      console.log('\n--- Testing getPublicTests ---');
      const publicTests = await CustomTestService.getPublicTests();
      console.log('Public tests found:', publicTests.length);
      publicTests.forEach((test) => {
        console.log(
          'Public Test:',
          test.id,
          test.title,
          'createdBy:',
          test.createdBy,
          'isPublic:',
          test.isPublic
        );
      });
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  const loadTests = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      if (activeTab === 'attempts') {
        const userAttempts = await CustomTestService.getUserTestAttempts(
          currentUser.uid
        );
        setAttempts(userAttempts);
        setTests([]);
      } else {
        const testList =
          activeTab === 'my-tests'
            ? await CustomTestService.getUserTests(currentUser.uid)
            : await CustomTestService.getPublicTests();
        setTests(testList);
        setAttempts([]);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentUser]);

  // Add this to your useEffect or call it manually
  useEffect(() => {
    loadTests();
    // Debug on load
    debugTests();
  }, [loadTests]);
  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;

    try {
      await CustomTestService.deleteTest(testId);
      setTests((prev) => prev.filter((test) => test.id !== testId));
      toast.success('Test deleted successfully');
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <TestListSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Custom Tests</h1>
        <div className="flex gap-2">
          {/* Debug button - remove this in production */}
          <Button variant="outline" onClick={debugTests}>
            Debug
          </Button>
          <Button onClick={onCreateTest}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'my-tests'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('my-tests')}
        >
          My Tests
        </button>
        <button
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'public'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('public')}
        >
          Public Tests
        </button>
        <button
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'attempts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('attempts')}
        >
          My Attempts
        </button>
      </div>

      {/* Content Grid */}
      {activeTab === 'attempts' ? (
        attempts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attempts.map((attempt) => (
              <AttemptCard
                key={attempt.id}
                attempt={attempt}
                onViewResults={() => onViewAttemptResults(attempt)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              You haven&apos;t attempted any tests yet.
            </div>
            <Button onClick={() => setActiveTab('my-tests')}>
              <Play className="h-4 w-4 mr-2" />
              Start Your First Test
            </Button>
          </div>
        )
      ) : tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              isOwner={test.createdBy === currentUser?.uid}
              onStart={() => onStartTest(test.id)}
              onEdit={() => onEditTest(test.id)}
              onDelete={() => handleDeleteTest(test.id)}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {activeTab === 'my-tests'
              ? "You haven't created any tests yet."
              : 'No public tests available yet.'}
          </div>
          {activeTab === 'my-tests' && (
            <Button onClick={onCreateTest}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Test
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function TestCard({
  test,
  isOwner,
  onStart,
  onEdit,
  onDelete,
  getDifficultyColor,
}: {
  test: CustomTest;
  isOwner: boolean;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getDifficultyColor: (difficulty: string) => string;
}) {
  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <Badge
            className={cn(
              'text-xs font-medium',
              getDifficultyColor(test.difficulty)
            )}
          >
            {test.difficulty}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
          {test.title}
        </CardTitle>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {test.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{test.duration}min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{test.questions.length} questions</span>
          </div>
          {test.isPublic && (
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              <span>Public</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {test.tags && test.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {test.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {test.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{test.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <Button onClick={onStart} className="flex-1 group/btn">
            <Play className="h-4 w-4 mr-2 transition-transform group-hover/btn:translate-x-1" />
            Start Test
          </Button>

          {isOwner && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="hover:bg-primary/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AttemptCard({
  attempt,
  onViewResults,
}: {
  attempt: TestAttempt;
  onViewResults: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <History className="w-5 h-5" />
          </div>
          <Badge
            className={cn(
              'text-xs font-medium',
              getStatusColor(attempt.status)
            )}
          >
            {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
          Test Attempt
        </CardTitle>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          Completed on {formatDate(attempt.completedAt || attempt.startedAt)}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Score */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Score</span>
          <span className="font-semibold">
            {attempt.score} / {attempt.totalPoints}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Time Spent</span>
          <span className="font-medium">{formatTime(attempt.timeSpent)}</span>
        </div>

        {/* Questions */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Questions</span>
          <span className="font-medium">{attempt.answers?.length || 0}</span>
        </div>

        {/* Action */}
        <div className="pt-2 border-t border-border/50">
          <Button onClick={onViewResults} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            View Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TestListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex border-b border-border gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
