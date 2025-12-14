'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  problemsService,
  type Problem,
} from '@/services/firebase/problemsService';

import { ProblemForm } from '../../ProblemForm';

export default function EditProblemPage() {
  const params = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params || !params.id) {
      return;
    }

    const fetchProblem = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0]! : params.id!;
        const data = await problemsService.getProblemById(id);
        if (data) {
          setProblem(data);
        } else {
          router.push('/admin/problems');
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        router.push('/admin/problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [params, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }
  console.log(problem, 'problem');
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Problem</h1>
      <ProblemForm problem={problem} />
    </div>
  );
}
