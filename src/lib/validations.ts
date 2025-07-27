import { z } from 'zod';

export const dataStructureFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.',
  }),
  category: z.string().min(1, {
    message: 'Please select a category',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
});

export type DataStructureFormValues = z.infer<typeof dataStructureFormSchema>;
