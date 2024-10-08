import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentContext } from '@/context/ContentContext';

import CodeBlock from '../CodeBlock';

type ContentProps = {};

export const Content: React.FC<ContentProps> = () => {
  const { content, loading } = useContentContext();
  const courseContent = content && content[0];
  return (
    <Card>
      {loading ? (
        <SkeletonContent />
      ) : (
        <React.Fragment>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
            <CardDescription>
              {courseContent?.introduction.text}
              {courseContent?.explanation?.map((exp, i) => (
                <p key={i} className="my-2">
                  {exp}
                </p>
              ))}
            </CardDescription>
            <CardContent>
              <ul>
                <li className="my-2">
                  <b>Objective:</b> {courseContent?.introduction.objective}
                </li>
                <li className="my-2">
                  <b>Key Concept:</b> {courseContent?.introduction.key_concepts}
                </li>
                <li className="my-2">
                  <b>Real World Example:</b>
                  {courseContent?.introduction.real_world_use_cases}
                </li>
                <li className="my-2">
                  <b>Prerequisite:</b>
                  {courseContent?.introduction.prerequisites}
                </li>
              </ul>
              Examples:
              {courseContent?.examples.map((example, i) => (
                <div key={i} className="my-2">
                  <p>{example.description}</p>
                  <CodeBlock code={`${example.code}`} />
                </div>
              ))}
            </CardContent>
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
