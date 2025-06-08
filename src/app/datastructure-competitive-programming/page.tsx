'use client';
import React from 'react';

import GithubRepoFiles from '@/components/specific/GithubRepoFiles';

const ProblemsPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Problems</h1>
      <p className="mb-6 text-gray-700">
        Browse and solve coding problems to improve your skills.
      </p>
      {/* Problem list will go here */}
      <div className="bg-white rounded shadow p-6">
        <p className="text-gray-500">No problems available yet.</p>
      </div>
      <GithubRepoFiles />
    </main>
  );
};

export default ProblemsPage;
