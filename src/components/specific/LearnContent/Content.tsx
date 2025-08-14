import * as Toggle from '@radix-ui/react-toggle';
import React, { useEffect, useState } from 'react';
import { BiSolidCircleThreeQuarter } from 'react-icons/bi';
import { FaCircle } from 'react-icons/fa6';

import { useLanguages } from '@/context/LanguagesContext';
import { useLocalStorage } from '@/context/LocalhostContext';

interface _Subtopic {
  id: string;
  name: string;
  content?: string;
  examples?: any[];
}

interface ContentProps {
  topicId: string;
  subtopicId: string;
  content: any; // TODO: Replace 'any' with proper type
  onTopicClick: (topicId: string) => void;
  onSubtopicClick: (subtopicId: string) => void;
  renderExamples: (examples: any[]) => React.ReactNode;
}
type Topic = {
  name: string;
  id: string;
  isCompleted: boolean;
};

type ShowToggleProps = {
  handleIsCompleted: (id: string, isCompleted: boolean) => void;
  topicId: string;
  currentLPTopic: Topic | null;
  isCompleted: boolean;
};

export const Content: React.FC<ContentProps> = ({
  topicId,
  subtopicId: _subtopicId,
  content: currentTopic,
  onTopicClick: _onTopicClick,
  onSubtopicClick: _onSubtopicClick,
  renderExamples,
}) => {
  const { learningProgress, updateUserLearningProgress } = useLanguages();
  const { getItem } = useLocalStorage();
  const user = getItem('user');
  const [currentLPTopic, setCurrentLPTopic] = useState<Topic | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Handle learning progress updates
  useEffect(() => {
    if (learningProgress) {
      const topic = learningProgress?.topics.find(
        (topic: Topic) => topic.id === topicId
      );
      if (topic) {
        setIsCompleted(topic.isCompleted);
        setCurrentLPTopic(topic);
      }
    }
  }, [learningProgress, topicId]);

  // Scroll to the active subtopic when it changes
  useEffect(() => {
    if (_subtopicId) {
      const element = document.getElementById(`subtopic-${_subtopicId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [_subtopicId]);

  if (!currentTopic) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleIsCompleted = (id: string, isCompleted: boolean) => {
    if (!learningProgress || !user) return;

    const updatedTopics = learningProgress.topics.map((topic: Topic) =>
      topic.id === id ? { ...topic, isCompleted } : topic
    );

    const completedTopics = updatedTopics.reduce(
      (acc: number, topic: Topic) => (topic.isCompleted ? acc + 1 : acc),
      0
    );

    const totalTopics = updatedTopics.length;
    const progress = Math.round((completedTopics / totalTopics) * 100);

    updateUserLearningProgress(
      user.uid,
      currentTopic.name,
      progress,
      updatedTopics
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{currentTopic.name}</h1>
        <ShowToggle
          handleIsCompleted={handleIsCompleted}
          topicId={topicId}
          currentLPTopic={currentLPTopic}
          isCompleted={isCompleted}
        />
      </div>

      <div className="prose dark:prose-invert max-w-none flex-1 overflow-auto">
        {currentTopic.content && (
          <div className="mb-8">
            <div dangerouslySetInnerHTML={{ __html: currentTopic.content }} />
          </div>
        )}

        {currentTopic.subtopics?.map((subtopic: _Subtopic) => (
          <div
            key={subtopic.id}
            id={`subtopic-${subtopic.id}`}
            className="mb-8 pt-2 -mt-2"
          >
            <h2 className="text-2xl font-semibold mb-4">{subtopic.name}</h2>
            {subtopic.content && (
              <div className="mb-4">
                <div dangerouslySetInnerHTML={{ __html: subtopic.content }} />
              </div>
            )}
            {subtopic.examples && subtopic.examples.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Examples</h3>
                {renderExamples(subtopic.examples)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ShowToggle: React.FC<ShowToggleProps> = ({
  handleIsCompleted,
  topicId,
  currentLPTopic: _currentLPTopic,
  isCompleted,
}) => {
  return (
    <Toggle.Root
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      pressed={isCompleted}
      onPressedChange={(pressed: boolean) => {
        handleIsCompleted(topicId, pressed);
      }}
    >
      {isCompleted ? (
        <>
          <BiSolidCircleThreeQuarter className="w-4 h-4 text-green-500" />
          Completed
        </>
      ) : (
        <>
          <FaCircle className="w-3 h-3 text-gray-400" />
          Mark as Complete
        </>
      )}
    </Toggle.Root>
  );
};
export default React.memo(Content);
