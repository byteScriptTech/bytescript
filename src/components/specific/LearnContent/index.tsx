/* eslint-disable no-unused-vars */
import React from 'react';

import { useContentContext } from '@/context/ContentContext';

import { Content } from './Content';
import data from './example.json';
import Navigation from './Navigation';

interface Topic {
  id: string;
  name: string;
}
interface LearnContentProps {
  currentTopic: Topic | undefined;
  setCurrentTopic: (item: Topic) => void;
}
const LearnContent: React.FC<LearnContentProps> = ({
  setCurrentTopic,
  currentTopic,
}) => {
  const { content, loading } = useContentContext();
  const courseContent = content && content[0];
  const { topics } = courseContent || {};

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <Navigation ctid={courseContent?.id} {...{ topics, setCurrentTopic }} />
      <div className="grid gap-6 overflow-y-auto h-[calc(100vh-22vh)]">
        <Content />
      </div>
    </div>
  );
};

export default LearnContent;
