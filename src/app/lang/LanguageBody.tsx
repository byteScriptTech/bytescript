'use client';

import { notFound } from 'next/navigation';
import React from 'react';

import Navbar from '@/components/common/Navbar';
import LearnContent from '@/components/specific/LearnContent';
import LearnScreenBreadCrumb from '@/components/specific/LearnScreenBreadCrumb';
import { useLanguages } from '@/context/LanguagesContext';

type Topic = {
  name: string;
  id: string;
};

type LanguageBodyProps = {
  currentTopic: Topic | undefined;
  setCurrentTopic: (topic: Topic | undefined) => void;
  searchParams: {
    name: string | string[];
    id: string;
  };
};

const LanguageBody: React.FC<LanguageBodyProps> = ({
  currentTopic,
  setCurrentTopic,
  searchParams,
}) => {
  const { loading, languages } = useLanguages();

  if (!searchParams?.name || !searchParams?.id) {
    console.warn('Missing required search parameters:', searchParams);
    return notFound();
  }

  const currentLanguage = Array.isArray(searchParams.name)
    ? searchParams.name[0]
    : searchParams.name;

  if (!loading && !languages.some((lang) => lang.name === currentLanguage)) {
    console.warn('Language not found:', currentLanguage);
    return notFound();
  }

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <LearnScreenBreadCrumb />
            <h1 className="text-3xl font-semibold">{currentTopic?.name}</h1>
          </div>
          <LearnContent
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
          />
        </main>
      </div>
    </div>
  );
};

export default LanguageBody;
