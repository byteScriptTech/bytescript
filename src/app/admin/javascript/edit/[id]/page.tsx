import { notFound } from 'next/navigation';

import { javascriptService } from '@/services/javascriptService';

import { JavaScriptContentForm } from '../../JavaScriptContentForm';

export default async function EditJavaScriptContentPage({
  params,
}: {
  params: { id: string };
}) {
  const content = await javascriptService.getTopicById(params.id);

  if (!content) {
    notFound();
  }

  // Transform the content to match the form's expected shape
  const formContent = {
    id: content.id,
    name: content.name,
    description: content.description || '',
    difficulty: content.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
    content: content.content || '',
    slug: content.slug,
    timeToComplete: content.timeToComplete || 30,
    learningObjectives: content.learningObjectives || [],
    commonMistakes: content.commonMistakes || [],
    resources: content.resources || [],
    examples: content.examples || [],
    subtopics: (content.subtopics || []).map((subtopic) => ({
      id: subtopic.id || '',
      name: subtopic.name || '',
      content: subtopic.content || '',
      recommended_resources: subtopic.recommended_resources || [],
      examples: (subtopic.examples || []).map((example) => ({
        code: example.code || '',
        description: example.description,
      })),
      exercises: subtopic.exercises || [],
      estimated_time_minutes: subtopic.estimated_time_minutes,
      description: subtopic.description,
    })),
    exercises: content.exercises || [],
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit JavaScript Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <JavaScriptContentForm content={formContent} />
      </div>
    </div>
  );
}
