'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { DraggableCircle } from '@/components/ui/DraggableCircle';
import { useGetAllProblemsQuery } from '@/store/slices/problemsSlice';

// Dynamically import the DraggableEditor to avoid SSR issues
const DraggableEditor = dynamic(
  () =>
    import('@/components/editor/DraggableEditor').then(
      (mod) =>
        mod.DraggableEditor as React.ComponentType<{
          defaultPosition?: { x: number; y: number };
          defaultSize?: { width: number; height: string | number };
          defaultEditorType?: string;
          defaultPythonCode?: string;
          onClose?: () => void;
          showAlgorithm?: boolean;
          hideTabs?: boolean;
          onPythonCodeChange?: (code: string) => void;
        }>
    ),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-background" />,
  }
);

interface PatternPageClientProps {
  children: React.ReactNode;
  pattern: any;
}

export function PatternPageClient({
  children,
  pattern,
}: PatternPageClientProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode] = useState('');
  const circleSize = 50;

  // Get all problems using Redux API
  const { data: allProblems = [], isLoading } = useGetAllProblemsQuery();
  const patternSlugLower = pattern.slug.toLowerCase();

  const problems = allProblems.filter((problem) => {
    return (
      problem.category &&
      typeof problem.category === 'string' &&
      problem.category.toLowerCase() === patternSlugLower
    );
  });

  // Update DOM elements when problems data changes
  useEffect(() => {
    // Update problems badge
    const badge = document.querySelector('[data-problems-badge]');
    if (badge) {
      badge.textContent = problems.length.toString();
    }

    // Update problems list
    const problemsContainer = document.querySelector('[data-problems-list]');
    if (problemsContainer) {
      if (isLoading) {
        problemsContainer.innerHTML =
          '<div class="text-center py-8"><p class="text-muted-foreground">Loading problems...</p></div>';
      } else if (problems.length === 0) {
        problemsContainer.innerHTML =
          '<div class="text-center py-8"><p class="text-muted-foreground">No problems found for this pattern.</p></div>';
      } else {
        const problemsHtml = problems
          .map(
            (problem) => `
          <div class="grid gap-4">
            <div class="border rounded-lg p-4">
              <h3 class="font-semibold">${problem.title}</h3>
              <p class="text-muted-foreground text-sm mt-1">${problem.description}</p>
              <span class="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                ${problem.difficulty}
              </span>
            </div>
          </div>
        `
          )
          .join('');
        problemsContainer.innerHTML = problemsHtml;
      }
    }
  }, [problems, isLoading]);

  return (
    <div className="relative min-h-screen">
      <DraggableCircle
        size={circleSize}
        onClick={() => setShowEditor(!showEditor)}
      />

      <div>{children}</div>
      {showEditor && (
        <DraggableEditor
          defaultPosition={{ x: 200, y: 70 }}
          defaultEditorType="javascript"
          defaultPythonCode={editorCode}
          defaultSize={{ width: 800, height: 500 }}
          onClose={() => setShowEditor(false)}
          showAlgorithm={true}
          hideTabs={false}
        />
      )}
    </div>
  );
}
