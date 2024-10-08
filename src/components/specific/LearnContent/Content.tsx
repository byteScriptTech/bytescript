import React from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentContext } from '@/context/ContentContext';

type ContentProps = {};

export const Content: React.FC<ContentProps> = () => {
  const { content, loading } = useContentContext();
  const courseContent = content && content[0];
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      {loading ? (
        <SkeletonContent />
      ) : (
        <React.Fragment>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
            <CardDescription>
              {courseContent?.introduction.text}
            </CardDescription>
          </CardHeader>
        </React.Fragment>
      )}
    </Card>
  );
};

const SkeletonContent = () => {
  return (
    <div className="p-4">
      <Skeleton className="h-[125px] rounded-xl" />
      <div className="my-2">
        <Skeleton className="h-6 my-2" />
        <Skeleton className="h-6 my-2" />
      </div>
    </div>
  );
};

export default Content;
