'use client';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import ExploreLanguages from '@/components/specific/ExploreLanguages';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LanguagesProvider } from '@/context/LanguagesContext';

function Dashboard() {
  const [feedback, setFeedback] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleFeedbackChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('Thank you for your feedback!');
    setFeedback('');
  };
  return (
    <AuthGuard>
      <LanguagesProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Navbar />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#00BFA6] to-[#00796B] shadow-md">
                  <div className="text-white font-bold text-2xl">
                    👋 Hi Hemant!
                  </div>
                  <div className="text-white text-lg">
                    How&apos;s your day going?
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <ExploreLanguages />
                    <Card
                      x-chunk="dashboard-07-chunk-0"
                      className="bg-white rounded-lg  p-4"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          Carry on where you left?
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          Object Oriented Programming (OOPs)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-600">
                            Your Progress
                          </p>
                          <p className="text-sm text-gray-500">45% completed</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: '45%' }}
                          ></div>
                        </div>

                        <div className="mt-6 space-y-2">
                          <button
                            className="w-full bg-[#00BFA6] hover:bg-[#00A38C] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all duration-300"
                            onClick={() => router.push('/resume-course')}
                          >
                            Resume Learning
                          </button>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">
                              ⏳ Estimated time left:
                            </span>
                            <span className="ml-2 font-medium text-gray-800">
                              30 mins
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      x-chunk="dashboard-07-chunk-1"
                      className="bg-white rounded-lg p-4 "
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          Notes
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          Add, view, and edit your notes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-4 space-y-4">
                        <div className="bg-gray-100 p-3 rounded-md shadow-sm hover:bg-gray-200 transition-colors">
                          <p className="text-gray-700 text-sm font-medium">
                            &quot;Learn more about closures and hoisting in
                            JavaScript&quot;
                          </p>
                          <span className="text-xs text-gray-400">
                            Last edited: 1 day ago
                          </span>
                        </div>
                        {/* <div className="text-center text-gray-500">No notes available. Start by adding one!</div> */}
                      </CardContent>

                      <CardFooter className="justify-center border-t p-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-green-600 hover:text-green-700 hover:bg-gray-50"
                          onClick={() => console.log('Add a new note')}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add a Note
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-3">
                      <CardHeader>
                        <CardTitle>Streak</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 text-center">
                          {/* Streak Icon */}
                          <div className="grid gap-3">
                            <div className="flex items-center justify-center">
                              <div className="text-[3rem] text-[#FFA500] font-bold">
                                🔥
                              </div>
                            </div>
                            {/* Streak Count */}
                            <div className="flex flex-col items-center">
                              <p className="text-2xl font-semibold text-[#00BFA6]">
                                7 Days
                              </p>
                              <p className="text-sm text-gray-500">
                                You’re on a hot streak! Keep up the momentum!
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="border rounded-lg shadow-sm"
                      x-chunk="dashboard-07-chunk-4"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          Practice Problem Solving
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Challenge yourself with new problems daily.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div className="text-gray-700">
                            <p>Progress: 20/50 problems completed</p>
                            <p>Next Topic: Dynamic Programming</p>
                          </div>
                          <Button className="w-full bg-[#00BFA6] hover:bg-[#00A38C]text-white rounded-md">
                            Start Today&apos;s Challenge
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border p-4 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          We Value Your Feedback
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                          Help us improve the app!
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col">
                          <Textarea
                            value={feedback}
                            onChange={handleFeedbackChange}
                            rows={4}
                            className="border rounded-md p-2 mb-2"
                            placeholder="Share your feedback or suggestions..."
                            required
                          />
                          <Button
                            type="submit"
                            className="mt-2 w-full"
                            variant="outline"
                          >
                            Submit Feedback
                          </Button>
                          {successMessage && (
                            <p className="mt-2 text-green-600">
                              {successMessage}
                            </p>
                          )}
                        </form>
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
      </LanguagesProvider>
    </AuthGuard>
  );
}
export default Dashboard;
