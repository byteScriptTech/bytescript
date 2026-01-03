'use client';

import { useParams } from 'next/navigation';

import { useProblemsRedux } from '@/hooks/useProblemsRedux';
import { useGetProblemByIdQuery } from '@/store/slices/problemsSlice';

import { ProblemForm } from '../../ProblemForm';

export default function EditProblemPage() {
  const params = useParams();
  const { getProblemByIdWithFallback } = useProblemsRedux();

  const id = Array.isArray(params?.id) ? params.id[0]! : params?.id!;
  const problemQuery = useGetProblemByIdQuery(id);
  const problemWithFallback = getProblemByIdWithFallback(id, problemQuery);

  if (problemWithFallback.isLoading) {
    return <div>Loading...</div>;
  }

  if (!problemWithFallback.data) {
    return <div>Problem not found</div>;
  }

  console.log(problemWithFallback.data, 'problem');
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Problem</h1>
      <ProblemForm problem={problemWithFallback.data} />
    </div>
  );
}
