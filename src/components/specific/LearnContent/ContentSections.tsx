import Link from 'next/link';
import React from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  courseContent,
}) => {
  const { introduction, explanation } = courseContent || {};

  switch (section) {
    case 'introduction':
      return (
        <section id="introduction">
          <Card>
            <CardHeader className="relative">
              <CardTitle>
                <div>Introduction</div>
              </CardTitle>
              <CardDescription>
                {introduction?.text}
                {explanation?.map((exp, i) => (
                  <p key={i} className="my-2">
                    {exp}
                  </p>
                ))}
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      );
    case 'objective':
      return (
        <section id="objective">
          {introduction?.objective.length && (
            <ul>
              <li className="py-2">
                <b>Objective: </b>
                {introduction.objective.map((obj, i) => (
                  <span key={i}>{obj}</span>
                ))}
              </li>
              <li className="py-2">
                <b>Prerequisite: </b>
                {introduction.prerequisites?.map((prerequisite, i) => (
                  <span key={i}>{prerequisite}</span>
                ))}
              </li>
            </ul>
          )}
        </section>
      );
    case 'key_concepts':
      return (
        <section id="key_concepts">
          {introduction?.key_concepts.length && (
            <ul>
              <li className="py-2">
                <b>Key Concepts: </b>
                {introduction.key_concepts.map((keyConcept, i) => (
                  <span key={i}>{keyConcept}</span>
                ))}
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
                {introduction.real_world_use_cases.map((useCase, i) => (
                  <span key={i}>{useCase}</span>
                ))}
              </li>
            </ul>
          )}
        </section>
      );
    case 'examples':
      return (
        <section id="examples">
          {courseContent?.examples?.length && <b>Examples:</b>}
          {courseContent?.examples?.map((example, i) => (
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
          {courseContent?.challenges?.length ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Practice Challenges</h3>
              {courseContent.challenges.map((challenge, i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-lg mb-1">
                        {challenge.title}
                      </h4>
                      {challenge.difficulty && (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 mb-2">
                          {challenge.difficulty}
                        </span>
                      )}
                      <p className="text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>

                    {challenge.requirements &&
                      challenge.requirements.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground mb-1">
                            Requirements:
                          </h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {challenge.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {challenge.example && (
                      <div>
                        <h5 className="font-medium text-sm text-muted-foreground mb-1">
                          Example:
                        </h5>
                        <div className="text-sm">
                          <CodeBlock code={challenge.example} />
                        </div>
                      </div>
                    )}

                    {challenge.solution && (
                      <details>
                        <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                          Show Solution
                        </summary>
                        <div className="mt-2">
                          <div className="text-sm">
                            <CodeBlock code={challenge.solution} />
                          </div>
                        </div>
                      </details>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </section>
      );
    case 'best_practices':
      return (
        <section id="best_practices">
          {courseContent?.challenges?.length && <b>Best Practices:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.best_practices_and_common_mistakes?.best_practices?.map(
              (best_practice, i) => {
                return (
                  <React.Fragment key={i}>
                    <li key={i}>{best_practice.text}</li>
                    {best_practice.code && (
                      <CodeBlock
                        code={`${decodeEntities(best_practice.code)}`}
                      />
                    )}
                  </React.Fragment>
                );
              }
            )}
          </ul>
          {courseContent?.challenges?.length && <b>Common Mistakes:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.best_practices_and_common_mistakes?.common_mistakes?.map(
              (common_mistake, i) => {
                return (
                  <React.Fragment key={i}>
                    <li key={i}>{common_mistake.text}</li>
                    {common_mistake.code && (
                      <CodeBlock
                        code={`${decodeEntities(common_mistake.code)}`}
                      />
                    )}
                  </React.Fragment>
                );
              }
            )}
          </ul>
        </section>
      );
    case 'applications':
      return (
        <section id="applications">
          {courseContent?.applications?.length && <b>Applications:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.applications?.map((application, i) => (
              <li key={i}>{application}</li>
            ))}
          </ul>
        </section>
      );
    case 'related_topics':
      return (
        <section id="related_topics">
          {courseContent?.related_topics?.length && <b>Applications:</b>}
          <ul className="py-2 list-disc list-inside">
            {courseContent?.related_topics?.map((topic, i) => (
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

export default ContentSections;
