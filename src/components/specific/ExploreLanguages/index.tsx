import { BookOpen } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import LanguagesList from '../LanguagesList';

export const ExploreLanguages: FC = () => {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="rounded-xl shadow-md border bg-card text-card-foreground">
          <CardHeader className="flex flex-col space-y-1.5 p-6 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="tracking-tight text-xl font-semibold">
                All Topics
              </CardTitle>
            </div>
            <p className="text-sm pt-1 text-muted-foreground">
              Browse through all available learning topics and start your
              journey
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="mt-4">
              <LanguagesList />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border bg-card text-card-foreground hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col space-y-1.5 p-6 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
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
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <CardTitle className="tracking-tight text-xl font-semibold">
                  Practice
                </CardTitle>
              </div>
              <a
                href="/practice"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/practice';
                }}
              >
                Start Practicing →
              </a>
            </div>
            <p className="text-sm pt-1 text-muted-foreground">
              Test your knowledge with practice problems and challenges
            </p>
          </CardHeader>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-[#f0fdf9] to-[#e0faf5] dark:from-primary/10 dark:to-primary/20 rounded-xl p-6 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Complete lessons, earn achievements, and monitor your learning
            journey.
          </p>
          <Button
            variant="outline"
            className="bg-background hover:bg-background/80"
          >
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExploreLanguages;
