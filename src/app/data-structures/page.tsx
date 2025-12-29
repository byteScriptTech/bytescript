'use client';

import { Code, Cpu, Database, Rocket, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { dsaService } from '@/services/firebase/dsaService';

export const dynamic = 'force-dynamic'; // Disable static generation

interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'data-structures' | 'algorithms';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const TopicCard = ({ topic }: { topic: DSATopic }) => (
  <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
    <Link
      href={`/data-structures/${topic.slug}`}
      className="flex-1 flex flex-col"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {topic.title}
          </h3>
          {topic.difficulty && (
            <span
              className={cn(
                'text-xs px-2 py-1 rounded-full',
                topic.difficulty === 'beginner' &&
                  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
                topic.difficulty === 'intermediate' &&
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
                topic.difficulty === 'advanced' &&
                  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
              )}
            >
              {topic.difficulty.charAt(0).toUpperCase() +
                topic.difficulty.slice(1)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col group">
        <p className="text-muted-foreground text-sm mb-6 flex-1">
          {topic.description || 'No description available.'}
        </p>
        <div className="mt-auto relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full border border-border bg-background/80 backdrop-blur-sm hover:bg-accent/50 hover:shadow-sm transition-all duration-200 px-6"
            >
              Explore {topic.title}
              <span className="ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                →
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Link>
  </Card>
);

const TopicSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <Skeleton className="h-10 w-full mt-6" />
    </CardContent>
  </Card>
);

export default function DataStructuresPage() {
  const [topics, setTopics] = useState<DSATopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = (await dsaService.getAllTopics()) as DSATopic[];
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      searchQuery === '' ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || topic.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const dataStructures = filteredTopics.filter(
    (topic) => topic.category === 'data-structures'
  );
  const algorithms = filteredTopics.filter(
    (topic) => topic.category === 'algorithms'
  );

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border border-destructive/20">
          <div className="text-destructive text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <Rocket className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <Navbar />
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-semibold">DSA Topics</h1>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search topics..."
                  className="pl-9 h-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs
            defaultValue="all"
            className="space-y-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                All Topics
              </TabsTrigger>
              <TabsTrigger
                value="data-structures"
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Data Structures
              </TabsTrigger>
              <TabsTrigger
                value="algorithms"
                className="flex items-center gap-2"
              >
                <Cpu className="h-4 w-4" />
                Algorithms
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">All Topics</h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <TopicSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredTopics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">
                      No topics found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="data-structures" className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Data Structures</h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <TopicSkeleton key={i} />
                    ))}
                  </div>
                ) : dataStructures.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataStructures.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">
                      No data structures found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="algorithms" className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Algorithms</h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <TopicSkeleton key={i} />
                    ))}
                  </div>
                ) : algorithms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {algorithms.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">
                      No algorithms found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    
  );
}
