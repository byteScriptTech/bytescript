import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useContentContext } from '@/context/ContentContext';
import { LanguageContent } from '@/types/content';

import ContentSections from './ContentSections';

type ContentProps = {};

export const Content: React.FC<ContentProps> = () => {
  const [currentContent, setCurrentContent] = useState<
    LanguageContent | undefined
  >();
  const { content, loading, scrollToList } = useContentContext();
  const courseContent: LanguageContent | undefined = content && content[0];
  const searchParams = useSearchParams();
  const topicIdArray = searchParams.getAll('id');
  const topicId = topicIdArray[1];
  useEffect(() => {
    if (topicId && courseContent) {
      const content = courseContent[topicId];
      setCurrentContent(content);
    } else if (courseContent) {
      setCurrentContent(courseContent as any);
    }
  }, [topicId, courseContent]);
  return (
    <div className="text-sm">
      {scrollToList[0]?.views.map((topic: { name: string; id: string }) => (
        <React.Fragment key={topic.id}>
          <ContentSections
            {...{ section: topic.id, loading, courseContent: currentContent }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Content;
