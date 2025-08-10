'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

type ContentFormValues = Omit<
  Topic,
  | 'id'
  | 'challenges'
  | 'sections'
  | 'quizzes'
  | 'recommended_resources'
  | 'projects'
  | 'estimated_time_hours'
  | 'learning_objectives'
> & {
  content: string;
};

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;
type Difficulty = (typeof difficultyLevels)[number];

const contentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  difficulty: z.enum(difficultyLevels),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required'),
});

interface PythonContentFormProps {
  content?: Partial<ContentFormValues> & { id?: string };
}

export function PythonContentForm({ content }: PythonContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema as any), // Temporary type assertion
    defaultValues: {
      name: content?.name || '',
      description: content?.description || '',
      difficulty: (content?.difficulty as Difficulty) || 'Beginner',
      content: content?.content || '',
      slug: content?.slug || '',
    },
  });

  const onSubmit = async (data: ContentFormValues) => {
    try {
      setLoading(true);

      if (content?.id) {
        await pythonService.updateTopic(content.id, data);
        toast.success('Topic updated successfully');
      } else {
        await pythonService.createTopic(data);
        toast.success('Topic created successfully');
      }

      router.push('/admin/python');
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error('Failed to save topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          placeholder="Enter content (Markdown supported)"
          rows={10}
          className="font-mono text-sm"
        />
        {form.formState.errors.content && (
          <p className="text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/python')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
