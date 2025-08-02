'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TestCase as TestCaseType } from '@/services/firebase/testCasesService';

interface TestCaseFormProps {
  problemId: string;
  testCase?: TestCaseType;
  onSave: (
    testCase: Omit<TestCaseType, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  onCancel: () => void;
}

const testCaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  expectedOutput: z.string().min(1, 'Expected output is required'),
});

type TestCaseFormInput = z.infer<typeof testCaseSchema>;

export function TestCaseForm({
  problemId,
  testCase,
  onSave,
  onCancel,
}: TestCaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestCaseFormInput>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      input: testCase?.input || '',
      expectedOutput: testCase?.expectedOutput || '',
    },
  });

  const onSubmit = async (data: TestCaseFormInput) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSave({
        ...data,
        problemId,
      });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="input">Input</Label>
        <Textarea
          id="input"
          {...register('input')}
          placeholder="Enter test case input (e.g., [1,2,3], 6)"
          className="font-mono text-sm"
          rows={3}
        />
        {errors.input && (
          <p className="text-sm text-red-500">{errors.input.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="expectedOutput">Expected Output</Label>
        <Input
          id="expectedOutput"
          {...register('expectedOutput')}
          placeholder="Enter expected output"
          className="font-mono"
        />
        {errors.expectedOutput && (
          <p className="text-sm text-red-500">
            {errors.expectedOutput.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Test Case'}
        </Button>
      </div>
    </form>
  );
}
