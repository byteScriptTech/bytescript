'use client';

import React from 'react';
import { useState } from 'react';

import AuthGuard from '@/components/misc/authGuard';
import { BreadcrumbProvider } from '@/context/BreadCrumbContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

import LanguageBody from './LanguageBody';

type Topic = {
  name: string;
  id: string;
};

type CourseProps = {
  searchParams: {
    name: string;
    id: string;
  };
};

const Course: React.FC<CourseProps> = ({ searchParams }) => {
  const [currentTopic, setCurrentTopic] = useState<Topic | undefined>({
    name: searchParams.name,
    id: searchParams.id,
  });

  return (
    <AuthGuard requireAuth={false}>
      <BreadcrumbProvider>
        <LocalStorageProvider>
          <LanguageBody
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
            searchParams={searchParams}
          />
        </LocalStorageProvider>
      </BreadcrumbProvider>
    </AuthGuard>
  );
};

export default Course;
