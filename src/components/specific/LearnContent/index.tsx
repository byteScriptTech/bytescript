/* eslint-disable no-unused-vars */
import React from 'react';

import { Card } from '@/components/ui/card';
import { useContentContext } from '@/context/ContentContext';

import { Content } from './Content';
import data from './example.json';
import Navigation from './Navigation';
import ScrollToTopic from './ScrollToTopic';

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
  console.log(content, 'content');

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[20%_60%_20%] lg:grid-cols-[20%_60%_20%]">
      <Navigation ctid={currentTopic?.id} {...{ topics, setCurrentTopic }} />
      <div className="grid gap-6 overflow-y-auto h-[calc(100vh-20vh)] custom-scrollbar">
        <Content />
      </div>
      <ScrollToTopic />
    </div>
  );
};

export default LearnContent;
