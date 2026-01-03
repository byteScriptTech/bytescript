'use client';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Patterns } from '@/components/specific/Patterns';
import { Problems } from '@/components/specific/Problems';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { ThemeProvider } from '@/context/theme-provider';

export default function CompetitiveProgrammingPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LocalStorageProvider>
        <ThemeProvider>
          <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">
                  Competitive Programming
                </h1>

                <Tabs defaultValue="patterns" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger
                      value="patterns"
                      className="text-sm font-medium"
                    >
                      Patterns
                    </TabsTrigger>
                    <TabsTrigger
                      value="problems"
                      className="text-sm font-medium"
                    >
                      Problems
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="patterns" className="mt-0">
                    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                      <Patterns />
                    </div>
                  </TabsContent>
                  <TabsContent value="problems" className="mt-0">
                    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                      <Problems />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </ThemeProvider>
      </LocalStorageProvider>
    </AuthGuard>
  );
}
