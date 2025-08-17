'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import ExploreLanguages from '@/components/specific/ExploreLanguages';
import Greetings from '@/components/specific/Greetings';
import { Notes } from '@/components/specific/Notes';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { NotesProvider } from '@/context/NotesContext';

function Dashboard() {
  return (
    <AuthProvider>
      <AuthGuard>
        <LocalStorageProvider>
          <LanguagesProvider>
            <ContentProvider>
              <NotesProvider>
                <div className="flex min-h-screen w-full flex-col bg-muted/40">
                  <div className="flex flex-col sm:gap-4">
                    <Navbar />
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                        <Greetings />
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <ExploreLanguages />
                          </div>
                          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                            <Notes />
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-lg font-semibold">
                                      Practice Problem Solving
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                      Challenge yourself with new problems daily
                                    </CardDescription>
                                  </div>
                                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-emerald-500"
                                    >
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                                    <p className="text-sm text-muted-foreground">
                                      Coming soon with exciting new challenges
                                    </p>
                                  </div>
                                  <Button
                                    disabled
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600/90 dark:hover:bg-emerald-700/90 transition-colors"
                                  >
                                    Start Today&apos;s Challenge
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                          <Button variant="outline" size="sm">
                            Discard
                          </Button>
                          <Button size="sm">Save Product</Button>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
              </NotesProvider>
            </ContentProvider>
          </LanguagesProvider>
        </LocalStorageProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
export default Dashboard;
