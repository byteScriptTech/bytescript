import { z } from 'zod';

// Sub-schemas
const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['article', 'video', 'interactive', 'other']),
});

const exampleSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  explanation: z.string().optional(),
});

// Main schema
export const dataStructureFormSchema = z.object({
  // Basic info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),

  // Categorization
  category: z.enum(['data-structures', 'algorithms']),
  subcategory: z.string().min(1, 'Subcategory is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),

  // Content
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),

  // Complexity
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),

  // Arrays
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  prerequisites: z.array(z.string()).optional(),
  operations: z.array(z.string()).optional(),
  useCases: z.array(z.string()).optional(),

  // Nested objects
  resources: z.array(resourceSchema).optional(),
  examples: z.array(exampleSchema).optional(),

  // Metadata
  lastUpdated: z.string().optional(),
});

export type DataStructureFormValues = z.infer<typeof dataStructureFormSchema>;

// Helper types for form handling
export type Resource = z.infer<typeof resourceSchema> & {
  id?: string; // Optional id for form handling
};
export type Example = z.infer<typeof exampleSchema>;
