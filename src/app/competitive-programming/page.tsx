'use client';

import { formatDistanceToNow } from 'date-fns';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

export default function CompetitiveProgrammingPage() {
  const problems = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      solved: true,
      lastAttempted: new Date(),
    },
    {
      id: '2',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      solved: false,
      lastAttempted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <AuthGuard>
      <ContentProvider>
        <LocalStorageProvider>
          <LanguagesProvider>
            <div className="flex min-h-screen w-full flex-col">
              <Navbar />
              <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">
                  Competitive Programming
                </h1>

                <Tabs defaultValue="problems" className="mb-8">
                  <TabsList>
                    <TabsTrigger value="problems">Problems</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                  </TabsList>
                  <TabsContent value="problems">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {problems.map((problem) => (
                        <Card
                          key={problem.id}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardHeader>
                            <CardTitle>{problem.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  problem.difficulty === 'Easy'
                                    ? 'bg-green-100 text-green-800'
                                    : problem.difficulty === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                              {problem.solved && (
                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                                  Solved
                                </span>
                              )}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                Last Attempted:{' '}
                                {formatDistanceToNow(problem.lastAttempted, {
                                  addSuffix: true,
                                })}
                              </span>
                              <Button variant="outline">Practice</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="submissions">
                    Submissions content
                  </TabsContent>
                  <TabsContent value="leaderboard">
                    Leaderboard content
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </LanguagesProvider>
        </LocalStorageProvider>
      </ContentProvider>
    </AuthGuard>
  );
}
