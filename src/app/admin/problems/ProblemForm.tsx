/* eslint-disable */
// @ts-nocheck
'use client';

// TODO: Fix type issues in this file:
// 1. Resolve form input type conflicts
// 2. Fix any remaining TypeScript errors
// 3. Re-enable ESLint after fixing all issues

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestCasesTab } from './TestCasesTab';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Problem } from '@/services/firebase/problemsService';
import { problemsService } from '@/services/firebase/problemsService';
import { patternService } from '@/services/patternService';

interface Pattern {
  id: string;
  title: string;
  slug: string;
}

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  patternId: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().transform((val) =>
    val
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  ),
  constraints: z.string().transform((val) => val.split('\n').filter(Boolean)),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string(),
    })
  ),
}) as z.ZodType<{
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
}>;

interface ProblemFormProps {
  problem?: Problem;
}

interface ProblemFormInput {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string;
  constraints: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
}

export function ProblemForm({ problem }: ProblemFormProps) {
  const router = useRouter();

  useEffect(() => {
    const loadPatterns = async () => {
      try {
        const patternData = await patternService.getPatterns();
        setPatterns(patternData);
      } catch (error) {
        console.error('Error loading patterns:', error);
      } finally {
        setIsLoadingPatterns(false);
      }
    };

    loadPatterns();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoadingPatterns, setIsLoadingPatterns] = useState(true);
  const [examples, setExamples] = useState(
    problem?.examples || [{ input: '', output: '', explanation: '' }]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProblemFormInput>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: problem?.title ?? '',
      description: problem?.description ?? '',
      difficulty: problem?.difficulty ?? 'Medium',
      category: problem?.category ?? '',
      tags: problem?.tags?.join(', ') ?? '',
      constraints: problem?.constraints?.join('\n') ?? '',
      examples: problem?.examples?.length
        ? problem.examples
        : [{ input: '', output: '', explanation: '' }],
    } as ProblemFormInput,
  });

  const addExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };

  const removeExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setExamples(newExamples);
  };

  const updateExample = (
    index: number,
    field: keyof (typeof examples)[0],
    value: string
  ) => {
    const newExamples = [...examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setExamples(newExamples);
  };

  const onSubmit: SubmitHandler<ProblemFormInput> = async (data) => {
    const { tags, constraints, ...formData } = data;
    // Handle patternId separately to ensure it's not undefined
    const patternId =
      data.patternId === 'none' || !data.patternId ? null : data.patternId;

    try {
      setIsSubmitting(true);

      // Transform the form data to match the Problem type
      const problemData = {
        ...formData,
        ...(patternId !== null && { patternId }),
        order: problem?.order || 0,
        tags:
          typeof tags === 'string'
            ? tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
            : Array.isArray(tags)
              ? tags
              : [],
        constraints:
          typeof constraints === 'string'
            ? constraints
                .split('\n')
                .map((c) => c.trim())
                .filter(Boolean)
            : Array.isArray(constraints)
              ? constraints
              : [],
        examples: examples.filter((ex) => ex.input && ex.output),
      };

      console.log('Processed problem data:', problemData);

      if (problem) {
        await problemsService.updateProblem(problem.id, problemData);
      } else {
        await problemsService.createProblem(problemData);
      }

      router.push('/admin/problems');
    } catch (error) {
      console.error('Error saving problem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="problem">
        <TabsList>
          <TabsTrigger value="problem">Problem Details</TabsTrigger>
          {problem?.id && (
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="problem">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submit event fired');
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Enter problem title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Pattern (Optional)</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue('patternId', value === 'none' ? null : value)
                      }
                      defaultValue={problem?.patternId || 'none'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {patterns.map((pattern) => (
                          <SelectItem key={pattern.id} value={pattern.id}>
                            {pattern.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.patternId && (
                      <p className="text-sm text-red-500">
                        {errors.patternId.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter problem description"
                  rows={5}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue('difficulty', value as any)
                    }
                    defaultValue={problem?.difficulty || 'Medium'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register('category')}
                    placeholder="e.g., Array, String, Dynamic Programming"
                  />
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="e.g., array, sorting, two-pointers"
                />
                {errors.tags && (
                  <p className="text-sm text-red-500">{errors.tags.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="constraints">Constraints (one per line)</Label>
                <Textarea
                  id="constraints"
                  {...register('constraints')}
                  placeholder="1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label>Examples</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExample}
                  >
                    Add Example
                  </Button>
                </div>

                <div className="space-y-4 mt-2">
                  {examples.map((example, index) => (
                    <div key={index} className="border p-4 rounded-md relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeExample(index)}
                      >
                        Remove
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Input</Label>
                          <Input
                            value={example.input}
                            onChange={(e) =>
                              updateExample(index, 'input', e.target.value)
                            }
                            placeholder="Input"
                          />
                        </div>
                        <div>
                          <Label>Output</Label>
                          <Input
                            value={example.output}
                            onChange={(e) =>
                              updateExample(index, 'output', e.target.value)
                            }
                            placeholder="Output"
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <Label>Explanation</Label>
                        <Textarea
                          value={example.explanation}
                          onChange={(e) =>
                            updateExample(index, 'explanation', e.target.value)
                          }
                          placeholder="Explanation"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/problems')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Problem'}
              </Button>
            </div>
          </form>
        </TabsContent>

        {problem?.id && (
          <TabsContent value="test-cases" className="mt-6">
            <TestCasesTab problemId={problem.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
