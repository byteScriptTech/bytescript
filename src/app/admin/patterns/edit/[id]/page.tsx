'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Import markdown editor styles
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
import { patternService } from '@/services/patternService';

export default function EditPatternPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    readme: '',
    category: '',
    timeComplexity: '',
    spaceComplexity: '',
    order: 0,
    icon: '',
  });

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        const pattern = await patternService.getPatternById(params.id);
        if (pattern) {
          setFormData({
            title: pattern.title,
            slug: pattern.slug,
            description: pattern.description,
            readme: pattern.readme,
            category: pattern.category || '',
            timeComplexity: pattern.timeComplexity || '',
            spaceComplexity: pattern.spaceComplexity || '',
            order: pattern.order || 0,
            icon: pattern.icon || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch pattern:', error);
        // Handle error (e.g., show error toast)
      } finally {
        setIsLoading(false);
      }
    };

    fetchPattern();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await patternService.savePattern(formData, params.id);
      router.push('/admin/patterns');
    } catch (error) {
      console.error('Failed to update pattern:', error);
      // Handle error (e.g., show error toast)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Pattern</h2>
        <p className="text-muted-foreground">Update the pattern details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeComplexity">Time Complexity</Label>
            <Input
              id="timeComplexity"
              name="timeComplexity"
              value={formData.timeComplexity}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spaceComplexity">Space Complexity</Label>
            <Input
              id="spaceComplexity"
              name="spaceComplexity"
              value={formData.spaceComplexity}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Short Description *</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Detailed Documentation (Markdown) *</Label>
            <div data-color-mode="light">
              <MDEditor
                value={formData.readme}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    readme: value || '',
                  }))
                }
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this pattern?')) {
                try {
                  await patternService.deletePattern(params.id);
                  router.push('/admin/patterns');
                } catch (error) {
                  console.error('Failed to delete pattern:', error);
                }
              }
            }}
          >
            Delete Pattern
          </Button>
          <div className="space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/patterns')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
