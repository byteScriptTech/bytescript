import React from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageContent } from '@/types/content';
import { decodeEntities } from '@/util/endecode';

import CodeBlock from '../CodeBlock';

interface ContentSectionsProps {
  section: string;
  loading: boolean;
  courseContent?: LanguageContent;
}
const ContentSections: React.FC<ContentSectionsProps> = ({
  section,
  loading,
  courseContent,
}) => {
  console.log(section);
  const { introduction, explanation } = courseContent || {};
  switch (section) {
    case 'introduction':
      return (
        <section id="introduction">
          <Card>
            {loading ? (
              <SkeletonContent />
            ) : (
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
                <CardDescription>
                  {introduction?.text}
                  {explanation?.map((exp, i) => (
                    <p key={i} className="my-2">
                      {exp}
                    </p>
                  ))}
                </CardDescription>
              </CardHeader>
            )}
          </Card>
        </section>
      );
    case 'objective':
      return (
        <section id="objective">
          {introduction?.objective && (
            <ul>
              <li className="my-2">
                <b>Objective: </b>
                {introduction.objective}
              </li>
              <li className="my-2">
                <b>Key Concept: </b>
                {introduction.key_concepts}
              </li>
              <li className="my-2">
                <b>Real World Example: </b>
                {introduction.real_world_use_cases}
              </li>
              <li className="my-2">
                <b>Prerequisite: </b>
                {introduction.prerequisites}
              </li>
            </ul>
          )}
        </section>
      );
    case 'examples':
      return (
        <section id="examples">
          {courseContent?.examples.length && <b>Example:</b>}
          {courseContent?.examples.map((example, i) => (
            <div key={i} className="my-2">
              <p>{example.description}</p>
              <CodeBlock code={`${example.code}`} />
            </div>
          ))}
        </section>
      );
    case 'challenges':
      return (
        <section id="challenges">
          {courseContent?.challenges.length && <b>Challenges:</b>}
          {courseContent?.challenges.map((challenge, i) => (
            <div key={i} className="my-2">
              <p>{challenge.question}</p>
              <CodeBlock code={`${decodeEntities(challenge.code)}`} />
            </div>
          ))}
        </section>
      );
    default:
      return null;
  }
};

const SkeletonContent = () => {
  return (
    <div className="p-4">
      <Skeleton className="h-[125px] rounded-xl my-2" />
      <Skeleton className="h-[125px] rounded-xl" />
      <div className="my-2">
        <Skeleton className="h-6 my-2" />
        <Skeleton className="h-6 my-2" />
        <Skeleton className="h-6 my-2" />
      </div>
    </div>
  );
};

export default ContentSections;
