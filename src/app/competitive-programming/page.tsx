'use client';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Leaderboard } from '@/components/specific/Leaderboard';
import { Problems } from '@/components/specific/Problems';
import { Submissions } from '@/components/specific/Submissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { ThemeProvider } from '@/context/theme-provider';

export default function CompetitiveProgrammingPage() {
  return (
    <AuthProvider>
      <AuthGuard requireAuth={false}>
        <ContentProvider>
          <LocalStorageProvider>
            <LanguagesProvider>
              <ThemeProvider>
                <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
                  <Navbar />
                  <main className="flex-1">
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-3xl font-bold text-foreground mb-8">
                        Competitive Programming
                      </h1>

                      <Tabs defaultValue="problems" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                          <TabsTrigger
                            value="problems"
                            className="text-sm font-medium"
                          >
                            Problems
                          </TabsTrigger>
                          <TabsTrigger
                            value="submissions"
                            className="text-sm font-medium"
                          >
                            Submissions
                          </TabsTrigger>
                          <TabsTrigger
                            value="leaderboard"
                            className="text-sm font-medium"
                          >
                            Leaderboard
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="problems" className="mt-0">
                          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                            <Problems />
                          </div>
                        </TabsContent>
                        <TabsContent value="submissions" className="mt-0">
                          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                            <Submissions />
                          </div>
                        </TabsContent>
                        <TabsContent value="leaderboard" className="mt-0">
                          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                            <Leaderboard />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </main>
                </div>
              </ThemeProvider>
            </LanguagesProvider>
          </LocalStorageProvider>
        </ContentProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
