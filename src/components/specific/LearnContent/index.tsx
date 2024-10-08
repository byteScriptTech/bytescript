/* eslint-disable no-unused-vars */
import React from 'react';

import { Content } from './Content';
import data from './example.json';
import Navigation from './Navigation';
const usableData = data['hvuC1U4W1hrLVFFjREhz'];

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
  const { topics } = usableData;
  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <Navigation ctid={currentTopic?.id} {...{ topics, setCurrentTopic }} />
      <div className="grid gap-6">
        <Content />
      </div>
    </div>
  );
};

export default LearnContent;
