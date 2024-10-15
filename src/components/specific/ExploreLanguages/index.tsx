import React from 'react';

import CardSkeleton from '@/components/common/CardSkeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguages } from '@/context/LanguagesContext';

import LanguagesList from '../LanguagesList';

const ExploreLanguages: React.FC = () => {
  const { loading } = useLanguages();
  if (loading) {
    return (
      <Card className="p-4">
        <CardSkeleton />
      </Card>
    );
  }
  return (
    <Card
      x-chunk="dashboard-07-chunk-2"
      className="border p-4 shadow-sm rounded-lg"
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          Explore Available Languages
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          Choose a language to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <LanguagesList />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExploreLanguages;
