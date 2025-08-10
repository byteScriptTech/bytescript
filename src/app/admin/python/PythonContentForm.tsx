'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { JSX } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
import { pythonService } from '@/services/pythonService';
import type { Topic } from '@/types/content';

type ContentFormValues = Omit<Topic, 'id' | 'createdAt' | 'updatedAt'> & {
  content: string;
  timeToComplete: number;
  learningObjectives: string[];
  commonMistakes: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'documentation' | 'video' | 'article';
    description?: string;
  }>;
  examples: Array<{
    code: string;
    description?: string;
  }>;
  subtopics: Array<{
    name: string;
    content: string;
    examples: Array<{ code: string; description?: string }>;
  }>;
  exercises: Array<{
    title: string;
    prompt: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    hint?: string;
  }>;
};

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;
type Difficulty = (typeof difficultyLevels)[number];

const resourceTypes = ['documentation', 'video', 'article'] as const;

const contentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  difficulty: z.enum(difficultyLevels),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required'),
  timeToComplete: z.number().min(1, 'Time to complete is required').default(30),
  learningObjectives: z.array(z.string()).default([]),
  commonMistakes: z.array(z.string()).default([]),
  resources: z
    .array(
      z.object({
        title: z.string().min(1, 'Title is required'),
        url: z.string().url('Invalid URL').min(1, 'URL is required'),
        type: z.enum(resourceTypes),
        description: z.string().optional(),
      })
    )
    .default([]),
  examples: z
    .array(
      z.object({
        code: z.string().min(1, 'Example code is required'),
        description: z.string().optional(),
      })
    )
    .default([]),
  subtopics: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        content: z.string().min(1, 'Content is required'),
        examples: z
          .array(
            z.object({
              code: z.string().min(1, 'Example code is required'),
              description: z.string().optional(),
            })
          )
          .default([]),
      })
    )
    .default([]),
  exercises: z
    .array(
      z.object({
        title: z.string().min(1, 'Title is required'),
        prompt: z.string().min(1, 'Prompt is required'),
        difficulty: z.enum(difficultyLevels),
        hint: z.string().optional(),
      })
    )
    .default([]),
});

interface PythonContentFormProps {
  content?: Partial<ContentFormValues> & { id?: string };
}

export function PythonContentForm({
  content,
}: PythonContentFormProps): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema as any),
    defaultValues: {
      name: content?.name || '',
      description: content?.description || '',
      difficulty: (content?.difficulty as Difficulty) || 'Beginner',
      content: content?.content || '',
      slug: content?.slug || '',
      timeToComplete: content?.timeToComplete || 30,
      learningObjectives: content?.learningObjectives || [],
      commonMistakes: content?.commonMistakes || [],
      resources: content?.resources || [],
      examples: content?.examples || [],
      subtopics: content?.subtopics || [],
      exercises: content?.exercises || [],
    },
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control: form.control,
    name: 'learningObjectives',
  });

  const {
    fields: mistakeFields,
    append: appendMistake,
    remove: removeMistake,
  } = useFieldArray({
    control: form.control,
    name: 'commonMistakes',
  });

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({
    control: form.control,
    name: 'resources',
  });

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control: form.control,
    name: 'examples',
  });

  const {
    fields: subtopicFields,
    append: appendSubtopic,
    remove: removeSubtopic,
  } = useFieldArray({
    control: form.control,
    name: 'subtopics',
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const [newObjective, setNewObjective] = useState('');
  const [newMistake, setNewMistake] = useState('');

  const onSubmit = async (data: ContentFormValues) => {
    try {
      setLoading(true);
      const topicData = {
        ...data,
        updatedAt: new Date().toISOString(),
        ...(!content?.id && { createdAt: new Date().toISOString() }),
      };

      if (content?.id) {
        await pythonService.updateTopic(content.id, topicData);
        toast.success('Topic updated successfully');
      } else {
        await pythonService.createTopic(topicData);
        toast.success('Topic created successfully');
        form.reset();
      }

      router.push('/admin/python');
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save topic'
      );
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
    const firstError = Object.values(errors)[0] as { message?: string };
    if (firstError?.message) {
      toast.error(`Validation error: ${firstError.message}`);
    } else {
      toast.error('Please check the form for errors');
    }
  };

  const formSubmit = form.handleSubmit(onSubmit, onError);

  const addObjective = () => {
    if (newObjective.trim()) {
      appendObjective(newObjective);
      setNewObjective('');
    }
  };

  const addMistake = () => {
    if (newMistake.trim()) {
      appendMistake(newMistake);
      setNewMistake('');
    }
  };

  return (
    <form onSubmit={formSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Enter topic name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...form.register('slug')}
            placeholder="Enter URL slug (e.g., python-basics)"
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-red-500">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            onValueChange={(value) =>
              form.setValue('difficulty', value as Difficulty)
            }
            defaultValue={form.getValues('difficulty') || 'Beginner'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.difficulty && (
            <p className="text-sm text-red-500">
              {form.formState.errors.difficulty.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Enter description"
          rows={3}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          {...form.register('content')}
          placeholder="Enter topic content (Markdown supported)"
          className="min-h-[200px]"
        />
        {form.formState.errors.content && (
          <p className="text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeToComplete">Time to Complete (minutes)</Label>
        <Input
          id="timeToComplete"
          type="number"
          {...form.register('timeToComplete', { valueAsNumber: true })}
          placeholder="30"
        />
        {form.formState.errors.timeToComplete && (
          <p className="text-sm text-red-500">
            {form.formState.errors.timeToComplete.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Learning Objectives</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('newObjective')?.focus()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Objective
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              id="newObjective"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addObjective())
              }
              placeholder="Enter a learning objective"
              className="flex-1"
            />
            <Button type="button" onClick={addObjective}>
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {objectiveFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-2 text-sm">
                  {field}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => removeObjective(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Common Mistakes</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('newMistake')?.focus()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Mistake
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              id="newMistake"
              value={newMistake}
              onChange={(e) => setNewMistake(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addMistake())
              }
              placeholder="Enter a common mistake"
              className="flex-1"
            />
            <Button type="button" onClick={addMistake}>
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {mistakeFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-2 text-sm">
                  {field}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => removeMistake(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Resources</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              appendResource({
                title: '',
                url: '',
                type: 'documentation',
                description: '',
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Resource
          </Button>
        </div>
        <div className="space-y-4">
          {resourceFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    {...form.register(`resources.${index}.title` as const)}
                    placeholder="Resource title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue(
                        `resources.${index}.type`,
                        value as 'documentation' | 'video' | 'article'
                      )
                    }
                    value={form.watch(`resources.${index}.type`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  {...form.register(`resources.${index}.url` as const)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  {...form.register(`resources.${index}.description` as const)}
                  placeholder="Brief description of the resource"
                  rows={2}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => removeResource(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove Resource
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Code Examples</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              appendExample({
                code: '',
                description: '',
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Example
          </Button>
        </div>
        <div className="space-y-4">
          {exampleFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4 rounded-md">
              <div className="space-y-2">
                <Label>Code</Label>
                <Textarea
                  {...form.register(`examples.${index}.code` as const)}
                  placeholder="// Your code example here"
                  className="font-mono text-sm h-32"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  {...form.register(`examples.${index}.description` as const)}
                  placeholder="Explain what this example demonstrates"
                  rows={2}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => removeExample(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove Example
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Subtopics</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              appendSubtopic({
                name: '',
                content: '',
                examples: [],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Subtopic
          </Button>
        </div>
        <div className="space-y-4">
          {subtopicFields.map((field, subtopicIndex) => (
            <div key={field.id} className="space-y-4 border p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtopic Name</Label>
                  <Input
                    {...form.register(
                      `subtopics.${subtopicIndex}.name` as const
                    )}
                    placeholder="Subtopic name"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => removeSubtopic(subtopicIndex)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove Subtopic
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  {...form.register(
                    `subtopics.${subtopicIndex}.content` as const
                  )}
                  placeholder="Subtopic content (Markdown supported)"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Examples</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      form.setValue(`subtopics.${subtopicIndex}.examples`, [
                        ...(form.watch(`subtopics.${subtopicIndex}.examples`) ||
                          []),
                        { code: '', description: '' },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Example
                  </Button>
                </div>
                {form
                  .watch(`subtopics.${subtopicIndex}.examples`)
                  ?.map((_, exampleIndex) => (
                    <div
                      key={exampleIndex}
                      className="space-y-2 border-l-2 pl-4"
                    >
                      <div className="flex justify-between items-center">
                        <Label>Example {exampleIndex + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 h-8"
                          onClick={() => {
                            const currentExamples = form.getValues(
                              `subtopics.${subtopicIndex}.examples`
                            );
                            form.setValue(
                              `subtopics.${subtopicIndex}.examples`,
                              currentExamples?.filter(
                                (_, i) => i !== exampleIndex
                              ) || []
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        {...form.register(
                          `subtopics.${subtopicIndex}.examples.${exampleIndex}.code` as const
                        )}
                        placeholder="// Example code"
                        className="font-mono text-sm h-24"
                      />
                      <Textarea
                        {...form.register(
                          `subtopics.${subtopicIndex}.examples.${exampleIndex}.description` as const
                        )}
                        placeholder="Description of the example"
                        rows={2}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Exercises</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              appendExercise({
                title: '',
                prompt: '',
                difficulty: 'Beginner',
                hint: '',
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Exercise
          </Button>
        </div>
        <div className="space-y-4">
          {exerciseFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    {...form.register(`exercises.${index}.title` as const)}
                    placeholder="Exercise title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue(
                        `exercises.${index}.difficulty`,
                        value as 'Beginner' | 'Intermediate' | 'Advanced'
                      )
                    }
                    value={form.watch(`exercises.${index}.difficulty`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prompt</Label>
                <Textarea
                  {...form.register(`exercises.${index}.prompt` as const)}
                  placeholder="Describe the exercise requirements and what the user needs to do"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Hint (Optional)</Label>
                <Textarea
                  {...form.register(`exercises.${index}.hint` as const)}
                  placeholder="Provide a hint to help the user if they get stuck"
                  rows={2}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => removeExercise(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove Exercise
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? 'Saving...' : 'Save Topic'}
        </Button>
      </div>
    </form>
  );
}
