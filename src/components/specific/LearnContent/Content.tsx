import React from 'react';

import { useContentContext } from '@/context/ContentContext';

import ContentSections from './ContentSections';

type ContentProps = {};

export const Content: React.FC<ContentProps> = () => {
  const { content, loading, scrollToList } = useContentContext();
  const courseContent = content && content[0];
  return (
    <div className="text-sm">
      {scrollToList[0]?.views.map((topic: { name: string; id: string }) => (
        <React.Fragment key={topic.id}>
          <ContentSections {...{ section: topic.id, loading, courseContent }} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Content;
