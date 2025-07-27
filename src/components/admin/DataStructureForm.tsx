'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
} from '@/lib/validations';

const formSchema = dataStructureFormSchema;

interface DataStructureFormProps {
  initialData?: DataStructureFormValues | null;
  onSubmit: (values: DataStructureFormValues) => void;
  isLoading?: boolean;
}

export function DataStructureForm({
  initialData,
  onSubmit,
  isLoading = false,
}: DataStructureFormProps) {
  const form = useForm<DataStructureFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      category: '',
      timeComplexity: '',
      spaceComplexity: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormDescription>
                  The name of the data structure
                </FormDescription>
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
                <FormControl>
                  <Input placeholder="e.g., linked-list" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier (lowercase, hyphen-separated)
                </FormDescription>
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
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Linear">Linear</SelectItem>
                    <SelectItem value="Non-Linear">Non-Linear</SelectItem>
                    <SelectItem value="Graph">Graph</SelectItem>
                    <SelectItem value="Tree">Tree</SelectItem>
                    <SelectItem value="Hash">Hash</SelectItem>
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
                      placeholder="Describe the data structure..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
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
