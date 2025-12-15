import { notFound } from 'next/navigation';

import { pythonService } from '@/services/pythonService';

import { PythonContentForm } from '../../PythonContentForm';

export default async function EditPythonContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const content = await pythonService.getTopicById(id);

  if (!content) {
    notFound();
  }

  const formContent = {
    id: content.id,
    name: content.name,
    description: content.description || '',
    difficulty: content.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
    content: content.content || '',
    slug: content.slug,
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Python Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <PythonContentForm content={formContent} />
      </div>
    </div>
  );
}
