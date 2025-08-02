'use client';

import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TestCase as TestCaseType,
  testCasesService,
} from '@/services/firebase/testCasesService';

import { TestCaseForm } from './TestCaseForm';

interface TestCasesTabProps {
  problemId: string;
}

export function TestCasesTab({ problemId }: TestCasesTabProps) {
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState<
    TestCaseType | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchTestCases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await testCasesService.getTestCasesByProblemId(problemId);
      setTestCases(data);
    } catch (err) {
      console.error('Error fetching test cases:', err);
      setError('Failed to load test cases');
    } finally {
      setIsLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  const handleSave = async (
    testCase: Omit<TestCaseType, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setError(null);
      if (editingTestCase && editingTestCase.id) {
        await testCasesService.updateTestCase(editingTestCase.id, testCase);
      } else {
        await testCasesService.addTestCase(
          testCase.problemId,
          testCase.input,
          testCase.expectedOutput
        );
      }
      await fetchTestCases();
      setIsFormOpen(false);
      setEditingTestCase(undefined);
    } catch (err) {
      console.error('Error saving test case:', err);
      setError('Failed to save test case');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this test case?')) {
      try {
        setError(null);
        await testCasesService.deleteTestCase(id);
        await fetchTestCases();
      } catch (err) {
        console.error('Error deleting test case:', err);
        setError('Failed to delete test case');
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading test cases...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        {error}
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTestCases}
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Test Cases</h3>
        <Button
          onClick={() => {
            setEditingTestCase(undefined);
            setIsFormOpen(true);
          }}
        >
          Add Test Case
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-4">
            {editingTestCase ? 'Edit Test Case' : 'Add New Test Case'}
          </h4>
          <TestCaseForm
            problemId={problemId}
            testCase={editingTestCase}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTestCase(undefined);
            }}
          />
        </div>
      )}

      {testCases.length === 0 ? (
        <div className="text-muted-foreground text-center py-8 border rounded-lg">
          No test cases found. Add your first test case.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Input</TableHead>
              <TableHead>Expected Output</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((testCase) => (
              <TableRow key={testCase.id}>
                <TableCell className="font-mono text-sm max-w-xs truncate">
                  {testCase.input}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {testCase.expectedOutput}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTestCase(testCase);
                        setIsFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(testCase.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
