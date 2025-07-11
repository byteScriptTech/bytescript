'use client';

import React from 'react';
import { useState } from 'react';

import AuthGuard from '@/components/misc/authGuard';
import { BreadcrumbProvider } from '@/context/BreadCrumbContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
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
    <AuthGuard>
      <ContentProvider>
        <LocalStorageProvider>
          <BreadcrumbProvider>
            <LanguagesProvider>
              <LanguageBody
                currentTopic={currentTopic}
                setCurrentTopic={setCurrentTopic}
                searchParams={searchParams}
              />
            </LanguagesProvider>
          </BreadcrumbProvider>
        </LocalStorageProvider>
      </ContentProvider>
    </AuthGuard>
  );
};

export default Course;
