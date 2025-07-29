'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  dataStructureFormSchema,
  type DataStructureFormValues,
  type Resource,
  type Example,
} from '@/lib/validations';

const formSchema = dataStructureFormSchema;

interface DataStructureFormProps {
  initialData?: DataStructureFormValues | null;
  onSubmit: (values: DataStructureFormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

const TagInput = ({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add a tag...',
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-1 rounded-full hover:bg-accent"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};

interface ResourceFormProps {
  resources: Resource[];
  onAdd: (resource: Resource) => void;
  onRemove: (index: number) => void;
}

const ResourceForm = ({ resources, onAdd, onRemove }: ResourceFormProps) => {
  const [resource, setResource] = useState<Omit<Resource, 'id'>>({
    title: '',
    url: '',
    type: 'article',
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (resource.title && resource.url) {
      onAdd({ ...resource, id: Date.now().toString() });
      setResource({ title: '', url: '', type: 'article' });
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((res, index) => (
        <div key={res.id || index} className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <div className="font-medium">{res.title}</div>
            <div className="text-sm text-muted-foreground">{res.url}</div>
            <Badge variant="outline" className="text-xs">
              {res.type}
            </Badge>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <form onSubmit={handleAddResource} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Title"
            value={resource.title}
            onChange={(e) =>
              setResource({ ...resource, title: e.target.value })
            }
          />
          <Input
            placeholder="URL"
            type="url"
            value={resource.url}
            onChange={(e) => setResource({ ...resource, url: e.target.value })}
          />
          <Select
            value={resource.type}
            onValueChange={(value: Resource['type']) =>
              setResource({ ...resource, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="interactive">Interactive</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Resource
        </Button>
      </form>
    </div>
  );
};

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export function DataStructureForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: DataStructureFormProps) {
  const form = useForm<DataStructureFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      category: 'data-structures',
      subcategory: '',
      difficulty: 'beginner',
      content: '',
      timeComplexity: '',
      spaceComplexity: '',
      tags: [],
      prerequisites: [],
      operations: [],
      useCases: [],
      resources: [],
      examples: [],
    },
  });

  const { watch, setValue } = form;
  const tags = watch('tags') || [];
  const prerequisites = watch('prerequisites') || [];
  const operations = watch('operations') || [];
  const useCases = watch('useCases') || [];
  const resources = watch('resources') || [];
  const examples = watch('examples') || [];

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setValue('tags', [...tags, tag], { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue(
      'tags',
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  const handleAddPrerequisite = (prereq: string) => {
    if (!prerequisites.includes(prereq)) {
      setValue('prerequisites', [...prerequisites, prereq], {
        shouldValidate: true,
      });
    }
  };

  const handleRemovePrerequisite = (prereq: string) => {
    setValue(
      'prerequisites',
      prerequisites.filter((p) => p !== prereq),
      { shouldValidate: true }
    );
  };

  const handleAddOperation = (op: string) => {
    if (!operations.includes(op)) {
      setValue('operations', [...operations, op], { shouldValidate: true });
    }
  };

  const handleRemoveOperation = (op: string) => {
    setValue(
      'operations',
      operations.filter((o) => o !== op),
      { shouldValidate: true }
    );
  };

  const handleAddUseCase = (useCase: string) => {
    if (!useCases.includes(useCase)) {
      setValue('useCases', [...useCases, useCase], { shouldValidate: true });
    }
  };

  const handleRemoveUseCase = (useCase: string) => {
    setValue(
      'useCases',
      useCases.filter((u) => u !== useCase),
      { shouldValidate: true }
    );
  };

  const handleAddResource = (resource: Resource) => {
    setValue('resources', [...resources, resource], { shouldValidate: true });
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setValue('resources', newResources, { shouldValidate: true });
  };

  const handleAddExample = (example: Example) => {
    setValue('examples', [...examples, example], { shouldValidate: true });
  };

  const handleRemoveExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setValue('examples', newExamples, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Basic details about the data structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Linked List" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <Input
                        placeholder="e.g., linked-list"
                        {...field}
                        onChange={(e) => {
                          // Auto-generate slug from name if empty
                          if (!initialData?.slug) {
                            field.onChange(
                              e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^a-z0-9-]/g, '')
                            );
                          } else {
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="data-structures">
                            Data Structures
                          </SelectItem>
                          <SelectItem value="algorithms">Algorithms</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Linked Lists" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeComplexity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Complexity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., O(n)"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spaceComplexity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space Complexity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., O(1)"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the data structure..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <div className="mt-1 mb-2">
                          <p className="text-sm text-muted-foreground">
                            Detailed content about the data structure (supports
                            markdown)
                          </p>
                        </div>
                        <FormControl>
                          <div className="mt-2" data-color-mode="light">
                            <MDEditor
                              value={field.value}
                              onChange={(value) => field.onChange(value || '')}
                              height={400}
                              previewOptions={{
                                wrapperElement: {
                                  'data-color-mode': 'light',
                                },
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tags & Categorization</CardTitle>
              <CardDescription>
                Add tags and prerequisites to help users find this content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        tags={tags}
                        onAdd={handleAddTag}
                        onRemove={handleRemoveTag}
                        placeholder="e.g., array, linked-list, recursion"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prerequisites"
                render={() => (
                  <FormItem>
                    <FormLabel>Prerequisites</FormLabel>
                    <FormControl>
                      <TagInput
                        tags={prerequisites}
                        onAdd={handleAddPrerequisite}
                        onRemove={handleRemovePrerequisite}
                        placeholder="e.g., arrays, pointers, recursion"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>
                Common operations for this data structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="operations"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <TagInput
                        tags={operations}
                        onAdd={handleAddOperation}
                        onRemove={handleRemoveOperation}
                        placeholder="e.g., insert, delete, search"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>
                Common use cases for this data structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="useCases"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <TagInput
                        tags={useCases}
                        onAdd={handleAddUseCase}
                        onRemove={handleRemoveUseCase}
                        placeholder="e.g., browser history, undo functionality"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>
                Helpful resources for learning about this data structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="resources"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ResourceForm
                        resources={resources}
                        onAdd={handleAddResource}
                        onRemove={handleRemoveResource}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
              <CardDescription>
                Code examples for this data structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="examples"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        {examples.map((example, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">
                                Example {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExample(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="text-sm font-medium mb-1">
                                  Input
                                </div>
                                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                                  {example.input}
                                </pre>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-1">
                                  Output
                                </div>
                                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                                  {example.output}
                                </pre>
                              </div>
                              {example.explanation && (
                                <div>
                                  <div className="text-sm font-medium mb-1">
                                    Explanation
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {example.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAddExample({
                              input: '// Example input',
                              output: '// Expected output',
                              explanation: '',
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Example
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Data Structure'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
