'use client';

import {
  Code2,
  Cpu,
  GitBranch,
  GitFork,
  Zap,
  GitCommitHorizontal,
  Network,
  BarChart3,
  ArrowDownUp,
  LayoutGrid,
  Code,
  GitCompare,
  Layers,
} from 'lucide-react';
import React from 'react';

import { PatternCard } from './PatternCard';
import { useGetAllPatternsQuery } from '../../../store/slices/patternsSlice';

export const Patterns = () => {
  const { data: patterns, isLoading, error } = useGetAllPatternsQuery();

  if (isLoading) {
    return <div>Loading patterns...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Failed to load patterns. Please try again later.
      </div>
    );
  }

  // Map icon names to their corresponding components
  const iconMap = {
    'frequency-counter': <BarChart3 />,
    'topological-sorting': <Network />,
    'fast-slow-pointers': <ArrowDownUp />,
    'heap-priority-queue': <Layers />,
    'greedy-algorithms': <BarChart3 />,
    'two-pointers': <Code />,
    'divide-and-conquer': <GitBranch />,
    'dynamic-programming': <Zap />,
    'depth-first-search': <GitBranch />,
    'bit-manipulation': <Cpu />,
    'back-tracking': <GitCommitHorizontal />,
    'sliding-window': <LayoutGrid />,
    'disjoint-set-union': <GitFork />,
    'binary-search': <Code2 />,
    'trie-prefix-tree': <GitCompare />,
    'breadth-first-search': <GitFork />,
  } as const;
  const patternCards = (patterns || []).map((pattern) => ({
    title: pattern.title,
    description: pattern.description,
    icon: iconMap[pattern.slug as keyof typeof iconMap] || <Code2 />,
    href: `/${pattern.slug}`,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Problem Solving Patterns
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patternCards.map((pattern) => (
          <PatternCard
            key={pattern.href}
            title={pattern.title}
            description={pattern.description}
            href={pattern.href}
            icon={pattern.icon}
          />
        ))}
      </div>
    </div>
  );
};
