'use client';

import { ProblemForm } from '../ProblemForm';

export default function NewProblemPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Problem</h1>
      <ProblemForm />
    </div>
  );
}
