'use client';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Problems } from '@/components/specific/Problems';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

export default function CompetitiveProgrammingPage() {
  return (
    <AuthProvider>
      <AuthGuard requireAuth={false}>
        <ContentProvider>
          <LocalStorageProvider>
            <LanguagesProvider>
              <div className="flex min-h-screen w-full flex-col">
                <Navbar />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                  <div className="container mx-auto py-8">
                    <h1 className="text-3xl font-bold mb-8">
                      Competitive Programming
                    </h1>

                    <Tabs defaultValue="problems" className="mb-8">
                      <TabsList>
                        <TabsTrigger value="problems">Problems</TabsTrigger>
                        <TabsTrigger value="submissions">
                          Submissions
                        </TabsTrigger>
                        <TabsTrigger value="leaderboard">
                          Leaderboard
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="problems">
                        <Problems />
                      </TabsContent>
                      <TabsContent value="submissions">
                        Submissions content
                      </TabsContent>
                      <TabsContent value="leaderboard">
                        Leaderboard content
                      </TabsContent>
                    </Tabs>
                  </div>
                </main>
              </div>
            </LanguagesProvider>
          </LocalStorageProvider>
        </ContentProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
