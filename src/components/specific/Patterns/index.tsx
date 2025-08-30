'use client';

import {
  Code2,
  Cpu,
  GitBranch,
  GitFork,
  Zap,
  GitCommitHorizontal,
  Network,
  Gauge,
  BarChart3,
  ArrowDownUp,
  LayoutGrid,
  Code,
  GitCompare,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { patternService, type PatternData } from '@/services/patternService';

import { PatternCard } from './PatternCard';

export const Patterns = () => {
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const data = await patternService.getPatterns();
        setPatterns(data);
      } catch (err) {
        console.error('Failed to fetch patterns:', err);
        setError('Failed to load patterns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, []);

  if (loading) {
    return <div>Loading patterns...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Map icon names to their corresponding components
  const iconMap = {
    code: <Code2 />,
    cpu: <Cpu />,
    'git-branch': <GitBranch />,
    'git-fork': <GitFork />,
    zap: <Zap />,
    'git-commit-horizontal': <GitCommitHorizontal />,
    network: <Network />,
    gauge: <Gauge />,
    'bar-chart-3': <BarChart3 />,
    'arrow-down-up': <ArrowDownUp />,
    'layout-grid': <LayoutGrid />,
    'code-2': <Code />,
    'git-compare': <GitCompare />,
  } as const;

  const patternCards = patterns.map((pattern) => ({
    title: pattern.title,
    description: pattern.description,
    icon: iconMap[pattern.icon as keyof typeof iconMap] || <Code2 />,
    href: `/${pattern.slug}`,
  }));

  // Fallback to hardcoded patterns if database is empty (for development)
  const displayPatterns =
    patternCards.length > 0
      ? patternCards
      : [
          {
            title: 'Backtracking',
            description:
              "Explore problems that involve trying different solutions and undoing them if they don't work, like solving mazes or puzzles.",
            icon: <GitCommitHorizontal />,
            href: '/backtracking',
          },
          {
            title: 'Binary Search',
            description:
              'Learn how to efficiently search through sorted data by repeatedly dividing the search interval in half.',
            icon: <Code2 />,
            href: '/binary-search',
          },
          {
            title: 'Bit Manipulation',
            description:
              'Master techniques for manipulating individual bits to solve problems with optimal space and time complexity.',
            icon: <Cpu />,
            href: '/bit-manipulation',
          },
          {
            title: 'Depth-First Search',
            description:
              'Explore tree and graph structures by going as far as possible along each branch before backtracking.',
            icon: <GitBranch />,
            href: '/dfs',
          },
          {
            title: 'Breadth-First Search',
            description:
              'Level-order traversal of trees and graphs, exploring all neighbors at the present depth before moving on.',
            icon: <GitFork />,
            href: '/bfs',
          },
          {
            title: 'Dynamic Programming',
            description:
              'Solve complex problems by breaking them down into simpler subproblems and storing their solutions.',
            icon: <Zap />,
            href: '/dp',
          },
          {
            title: 'Fast & Slow Pointers',
            description:
              'Use two pointers moving at different speeds to solve problems with linked lists and cyclic detection.',
            icon: <ArrowDownUp />,
            href: '/fast-slow-pointers',
          },
          {
            title: 'Greedy Algorithms',
            description:
              'Make locally optimal choices at each step to find a global optimum, often used in optimization problems.',
            icon: <BarChart3 />,
            href: '/greedy',
          },
          {
            title: 'Sliding Window',
            description:
              'Efficiently process arrays/lists by maintaining a window of elements that satisfies certain constraints.',
            icon: <LayoutGrid />,
            href: '/sliding-window',
          },
          {
            title: 'Topological Sort',
            description:
              'Linear ordering of vertices in a directed acyclic graph where for every directed edge (u, v), u comes before v.',
            icon: <Network />,
            href: '/topological-sort',
          },
          {
            title: 'Trie',
            description:
              'A tree-like data structure that stores a dynamic set of strings, useful for search and prefix matching.',
            icon: <GitCompare />,
            href: '/trie',
          },
          {
            title: 'Two Pointers',
            description:
              'Use two pointers to efficiently traverse data structures like arrays or linked lists in a single pass.',
            icon: <Code />,
            href: '/two-pointers',
          },
          {
            title: 'Union Find',
            description:
              'Efficient data structure to keep track of elements split into disjoint sets, supporting union and find operations.',
            icon: <Gauge />,
            href: '/union-find',
          },
        ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Problem Solving Patterns
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayPatterns.map((pattern) => (
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
