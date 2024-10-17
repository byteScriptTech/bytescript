import { Toggle } from '@radix-ui/react-toggle';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BiSolidCircleThreeQuarter } from 'react-icons/bi';
import { FaCircle } from 'react-icons/fa6';

import { useContentContext } from '@/context/ContentContext';
import { useLanguages } from '@/context/LanguagesContext';
import { useLocalStorage } from '@/context/LocalhostContext';
import { LanguageContent } from '@/types/content';

import ContentSections from './ContentSections';

type ContentProps = {};
type Topic = {
  name: string;
  id: string;
  isCompleted: boolean;
};

export const Content: React.FC<ContentProps> = () => {
  const searchParams = useSearchParams();
  const { content, loading, scrollToList } = useContentContext();
  const topicIdArray = searchParams.getAll('id');
  const { learningProgress, updateUserLearningProgress } = useLanguages();
  const { getItem } = useLocalStorage();
  const topicId = topicIdArray[1];
  const user = getItem('user');
  const courseContent: LanguageContent | undefined = content && content[0];
  const [currentContent, setCurrentContent] = useState<
    LanguageContent | undefined
  >();
  const [currentLPTopic, setCurrentLPTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (topicId && courseContent) {
      const content = courseContent[topicId];
      setCurrentContent(content);
    } else if (courseContent) {
      setCurrentContent(courseContent as any);
    }
  }, [topicId, courseContent]);

  useEffect(() => {
    if (learningProgress) {
      const topic = learningProgress?.topics.find(
        (topic: Topic) => topic.id === topicId
      );
      topic && setCurrentLPTopic(topic);
    }
  }, [learningProgress]);
  const handleIsCompleted = (id: string, isCompleted: boolean) => {
    const completedTopics = learningProgress?.topics.reduce(
      (acc: number, topic: Topic) => (topic.isCompleted ? acc + 1 : acc),
      0
    );
    const updatedTopics = learningProgress?.topics.map((topic) => {
      if (topic.id === id) {
        topic.isCompleted = isCompleted;
      }
      return topic;
    });
    if (
      typeof completedTopics === 'number' &&
      learningProgress?.topics &&
      updatedTopics
    ) {
      updateUserLearningProgress(
        user.uid,
        courseContent?.name as string,
        Math.round((completedTopics / learningProgress?.topics?.length) * 100),
        updatedTopics
      );
    }
  };
  return (
    <div className="text-sm relative">
      <div className="absolute top-2 right-2 z-10">
        <Toggle
          title="Click to mark topic as completed"
          className={`p-1 h-8 w-8 rounded-full top-3 right-3 bg-gray-100 flex justify-center items-center`}
          onPressedChange={() =>
            handleIsCompleted(topicId, !currentLPTopic?.isCompleted)
          }
        >
          {currentLPTopic?.isCompleted ? (
            <FaCircle size={20} className="text-[#00BFA6]" />
          ) : (
            <BiSolidCircleThreeQuarter size={22} className="text-[#00BFA6]" />
          )}
        </Toggle>
      </div>
      {scrollToList[0]?.views.map((topic: { name: string; id: string }) => (
        <React.Fragment key={topic.id}>
          <ContentSections
            {...{
              section: topic.id,
              loading,
              courseContent: currentContent,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(Content);
