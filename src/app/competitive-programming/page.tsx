'use client';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Problems } from '@/components/specific/Problems';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

export default function CompetitiveProgrammingPage() {
  const problems = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy' as const,
      solved: false,
      lastAttempted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Reverse String',
      difficulty: 'Easy' as const,
      solved: true,
      lastAttempted: new Date(),
    },
    {
      id: '3',
      title: 'Binary Search',
      difficulty: 'Medium' as const,
      solved: false,
      lastAttempted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      title: 'Merge Sort',
      difficulty: 'Medium' as const,
      solved: false,
      lastAttempted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      title: 'Dijkstra Algorithm',
      difficulty: 'Hard' as const,
      solved: false,
      lastAttempted: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
                    <Problems problems={problems} />
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
