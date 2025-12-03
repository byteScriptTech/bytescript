'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { JSX } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

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
import { javascriptService } from '@/services/javascriptService';
import type { Topic } from '@/types/content';

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

const resourceTypes = ['documentation', 'video', 'article'] as const;

type Difficulty = (typeof difficultyLevels)[number];

type ContentFormValues = Omit<Topic, 'id' | 'createdAt' | 'updatedAt'> & {
  content: string;
  timeToComplete: number;
  learningObjectives: string[];
  commonMistakes: string[];
  resources: Array<{
    id?: string;
    title: string;
    url: string;
    type: 'documentation' | 'video' | 'article';
    description?: string;
  }>;
  examples: Array<{
    id?: string;
    code: string;
    description?: string;
  }>;
  subtopics: Array<{
    id?: string;
    name: string;
    content: string;
    examples: Array<{ id?: string; code: string; description?: string }>;
  }>;
  exercises: Array<{
    id?: string;
    title: string;
    prompt: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    hint?: string;
    solution?: string;
    code?: string;
  }>;
};

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
        id: z.string().optional(),
        name: z.string().min(1, 'Name is required'),
        content: z.string().min(1, 'Content is required'),
        examples: z
          .array(
            z.object({
              id: z.string().optional(),
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
        solution: z.string().optional(),
        code: z.string().optional(),
      })
    )
    .default([]),
});

type TopicService = Pick<
  typeof javascriptService,
  'createTopic' | 'updateTopic'
>;

interface JavaScriptContentFormProps {
  content?: Partial<ContentFormValues> & { id?: string };
  onSuccess?: () => void;
  service?: TopicService;
  redirectPath?: string;
}

export function JavaScriptContentForm({
  content,
  onSuccess,
  service,
  redirectPath,
}: JavaScriptContentFormProps): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [newMistake, setNewMistake] = useState('');
  const contentService = service ?? javascriptService;
  const successRedirect = redirectPath ?? '/admin/javascript';

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
      resources:
        content?.resources?.map((resource) => ({
          ...resource,
          id: resource.id || `res-${Date.now()}`,
        })) || [],
      examples:
        content?.examples?.map(
          (example: { id?: string; code: string; description?: string }) => ({
            ...example,
            id: example?.id ? String(example.id) : `ex-${Date.now()}`,
          })
        ) || [],
      subtopics:
        content?.subtopics?.map(
          (subtopic: {
            id?: string;
            name: string;
            content?: string;
            examples?: Array<{
              id?: string;
              code: string;
              description?: string;
            }>;
            [key: string]: any;
          }) => ({
            ...subtopic,
            id: subtopic?.id ? String(subtopic.id) : `st-${Date.now()}`,
            examples:
              subtopic.examples?.map(
                (example: {
                  id?: string;
                  code: string;
                  description?: string;
                }) => ({
                  ...example,
                  id: example?.id ? String(example.id) : `ex-${Date.now()}`,
                })
              ) || [],
          })
        ) || [],
      exercises:
        content?.exercises?.map((exercise) => ({
          ...exercise,
          id: exercise.id || `ex-${Date.now()}`,
        })) || [],
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

  const addSubtopic = () => {
    appendSubtopic({
      id: `st-${Date.now()}`,
      name: '',
      content: '',
      examples: [],
    });
  };

  const addExample = (subtopicIndex: number, exampleIndex?: number) => {
    const currentExamples =
      form.getValues(`subtopics.${subtopicIndex}.examples`) || [];
    const newExample = { id: `ex-${Date.now()}`, code: '', description: '' };

    if (exampleIndex !== undefined) {
      // Update existing example
      const updatedExamples = [...currentExamples];
      updatedExamples[exampleIndex] = newExample;
      form.setValue(`subtopics.${subtopicIndex}.examples`, updatedExamples, {
        shouldDirty: true,
      });
    } else {
      // Add new example
      form.setValue(
        `subtopics.${subtopicIndex}.examples`,
        [...currentExamples, newExample],
        { shouldDirty: true }
      );
    }
  };

  const onSubmit = async (data: ContentFormValues) => {
    try {
      setLoading(true);
      const topicData = {
        ...data,
        updatedAt: new Date().toISOString(),
        ...(!content?.id && { createdAt: new Date().toISOString() }),
      };

      if (content?.id) {
        await contentService.updateTopic(content.id, topicData);
        toast.success('Topic updated successfully');
        if (onSuccess) onSuccess();
      } else {
        await contentService.createTopic(topicData);
        toast.success('Topic created successfully');
        form.reset();
        if (onSuccess) onSuccess();
      }

      router.push(successRedirect);
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Enter topic name"
            {...form.register('name')}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            placeholder="Enter URL slug"
            {...form.register('slug')}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeToComplete">Time to Complete (minutes)</Label>
          <Input
            id="timeToComplete"
            type="number"
            min="1"
            {...form.register('timeToComplete', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter a brief description"
          rows={3}
          {...form.register('description')}
        />
      </div>

      <div className="space-y-2">
        <Label>Learning Objectives</Label>
        <div className="flex gap-2">
          <Input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Add a learning objective"
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addObjective())
            }
          />
          <Button type="button" onClick={addObjective}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <ul className="space-y-1 mt-2">
          {objectiveFields.map((item, index) => (
            <li key={item.id} className="flex items-center justify-between">
              <span>{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeObjective(index)}
                className="h-6 w-6 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Label>Common Mistakes</Label>
        <div className="flex gap-2">
          <Input
            value={newMistake}
            onChange={(e) => setNewMistake(e.target.value)}
            placeholder="Add a common mistake"
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addMistake())
            }
          />
          <Button type="button" onClick={addMistake}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <ul className="space-y-1 mt-2">
          {mistakeFields.map((item, index) => (
            <li key={item.id} className="flex items-center justify-between">
              <span>{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMistake(index)}
                className="h-6 w-6 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <div data-color-mode="light" className="mt-2">
          <MDEditor
            value={form.watch('content')}
            onChange={(value) => form.setValue('content', value || '')}
            height={400}
            previewOptions={{
              className: 'prose max-w-none',
            }}
          />
          {form.formState.errors.content && (
            <p className="mt-2 text-sm text-red-500">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Resources</h3>
          <Button
            type="button"
            variant="outline"
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

        {resourceFields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Resource {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeResource(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`resources.${index}.title`}>Title *</Label>
                <Input
                  id={`resources.${index}.title`}
                  placeholder="Resource title"
                  {...form.register(`resources.${index}.title`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`resources.${index}.type`}>Type</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      `resources.${index}.type`,
                      value as 'documentation' | 'video' | 'article'
                    )
                  }
                  defaultValue={field.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`resources.${index}.url`}>URL *</Label>
                <Input
                  id={`resources.${index}.url`}
                  placeholder="https://example.com"
                  {...form.register(`resources.${index}.url`)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`resources.${index}.description`}>
                  Description
                </Label>
                <Textarea
                  id={`resources.${index}.description`}
                  placeholder="Brief description of the resource"
                  rows={2}
                  {...form.register(`resources.${index}.description`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Code Examples</h3>
          <Button
            type="button"
            variant="outline"
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

        {exampleFields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Example {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeExample(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`examples.${index}.code`}>Code *</Label>
              <Textarea
                id={`examples.${index}.code`}
                placeholder="Enter example code"
                className="font-mono text-sm h-32"
                {...form.register(`examples.${index}.code`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`examples.${index}.description`}>
                Description
              </Label>
              <Textarea
                id={`examples.${index}.description`}
                placeholder="Explain what this example demonstrates"
                rows={2}
                {...form.register(`examples.${index}.description`)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Subtopics</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSubtopic}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Subtopic
          </Button>
        </div>

        {subtopicFields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Subtopic {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSubtopic(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`subtopics.${index}.name`}>Name *</Label>
                <Input
                  id={`subtopics.${index}.name`}
                  placeholder="Subtopic name"
                  {...form.register(`subtopics.${index}.name`)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`subtopics.${index}.content`}>Content *</Label>
              <div data-color-mode="light" className="mt-2">
                <MDEditor
                  value={form.watch(`subtopics.${index}.content`)}
                  onChange={(value) =>
                    form.setValue(`subtopics.${index}.content`, value || '')
                  }
                  height={300}
                  previewOptions={{
                    className: 'prose max-w-none',
                  }}
                />
                {form.formState.errors.subtopics?.[index]?.content && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.subtopics[index]?.content?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Examples</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addExample(index)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Example
                </Button>
              </div>
              {form
                .watch(`subtopics.${index}.examples`)
                ?.map((example, exIndex) => (
                  <div key={exIndex} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Example {exIndex + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const examples = [
                            ...(form.getValues(`subtopics.${index}.examples`) ||
                              []),
                          ];
                          examples.splice(exIndex, 1);
                          form.setValue(
                            `subtopics.${index}.examples`,
                            examples,
                            { shouldDirty: true }
                          );
                        }}
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`subtopics.${index}.examples.${exIndex}.code`}
                      >
                        Code *
                      </Label>
                      <Textarea
                        id={`subtopics.${index}.examples.${exIndex}.code`}
                        placeholder="Enter example code"
                        className="font-mono text-sm h-24"
                        {...form.register(
                          `subtopics.${index}.examples.${exIndex}.code`
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`subtopics.${index}.examples.${exIndex}.description`}
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`subtopics.${index}.examples.${exIndex}.description`}
                        placeholder="Explain what this example demonstrates"
                        rows={2}
                        {...form.register(
                          `subtopics.${index}.examples.${exIndex}.description`
                        )}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Exercises</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendExercise({
                title: '',
                prompt: '',
                difficulty: 'Beginner',
                hint: '',
                solution: '',
                code: '',
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Exercise
          </Button>
        </div>

        {exerciseFields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Exercise {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeExercise(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`exercises.${index}.title`}>Title *</Label>
                <Input
                  id={`exercises.${index}.title`}
                  placeholder="Exercise title"
                  {...form.register(`exercises.${index}.title`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`exercises.${index}.difficulty`}>
                  Difficulty
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      `exercises.${index}.difficulty`,
                      value as 'Beginner' | 'Intermediate' | 'Advanced'
                    )
                  }
                  defaultValue={field.difficulty || 'Beginner'}
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
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`exercises.${index}.prompt`}>Prompt *</Label>
                <Textarea
                  id={`exercises.${index}.prompt`}
                  placeholder="Describe the exercise and what the user should do"
                  rows={3}
                  {...form.register(`exercises.${index}.prompt`)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`exercises.${index}.hint`}>Hint</Label>
                <Textarea
                  id={`exercises.${index}.hint`}
                  placeholder="Provide a hint to help the user (optional)"
                  rows={2}
                  {...form.register(`exercises.${index}.hint`)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`exercises.${index}.solution`}>Solution</Label>
                <Textarea
                  id={`exercises.${index}.solution`}
                  placeholder="Provide the solution code (optional)"
                  rows={4}
                  {...form.register(`exercises.${index}.solution`)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`exercises.${index}.code`}>Initial Code</Label>
                <Textarea
                  id={`exercises.${index}.code`}
                  placeholder="Provide initial code for the exercise (optional)"
                  rows={4}
                  {...form.register(`exercises.${index}.code`)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/javascript')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Topic'}
        </Button>
      </div>
    </form>
  );
}
