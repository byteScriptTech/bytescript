import Link from 'next/link';
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
              <li className="py-2">
                <b>Objective: </b>
                {introduction.objective}
              </li>
              <li className="py-2">
                <b>Prerequisite: </b>
                {introduction.prerequisites}
              </li>
            </ul>
          )}
        </section>
      );
    case 'key_concepts':
      return (
        <section id="key_concepts">
          {introduction?.key_concepts && (
            <ul>
              <li className="py-2">
                <b>Key Concepts: </b>
                {introduction.key_concepts}
              </li>
            </ul>
          )}
        </section>
      );
    case 'use_cases':
      return (
        <section id="use_cases">
          {introduction?.real_world_use_cases && (
            <ul>
              <li className="py-2">
                <b>Real World Use Cases: </b>
                {introduction.real_world_use_cases}
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
            <div key={i} className="py-2">
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
            <div key={i} className="py-2">
              <p>{challenge.question}</p>
              <CodeBlock code={`${decodeEntities(challenge.code)}`} />
            </div>
          ))}
        </section>
      );
    case 'best_practices':
      return (
        <section id="best_practices">
          {courseContent?.challenges.length && <b>Best Practices:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.best_practices_and_common_mistakes.best_practices.map(
              (best_practice, i) => <li key={i}>{best_practice}</li>
            )}
          </ul>
          {courseContent?.challenges.length && <b>Common Mistakes:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.best_practices_and_common_mistakes.common_mistakes.map(
              (common_mistake, i) => <li key={i}>{common_mistake}</li>
            )}
          </ul>
        </section>
      );
    case 'applications':
      return (
        <section id="applications">
          {courseContent?.applications.length && <b>Applications:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.applications.map((application, i) => (
              <li key={i}>{application}</li>
            ))}
          </ul>
        </section>
      );
    case 'related_topics':
      return (
        <section id="related_topics">
          {courseContent?.related_topics.length && <b>Applications:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.related_topics.map((topic, i) => (
              <li key={i}>
                <Link href={`#`}>{topic.name}</Link>
              </li>
            ))}
          </ul>
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
