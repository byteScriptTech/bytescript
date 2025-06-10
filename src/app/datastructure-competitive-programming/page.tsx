'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useMemo } from 'react';

import GithubRepoFiles from '@/components/specific/GithubRepoFiles';
const repoLink = process.env.NEXT_PUBLIC_GITHUB_REPO_LINK ?? '';

const ProblemsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const file = searchParams.get('file');

  const fileRepoLink = useMemo(() => {
    if (file) {
      return repoLink.endsWith('/')
        ? `${repoLink}${file}`
        : `${repoLink}/${file}`;
    }
    return repoLink;
  }, [file]);

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
      <GithubRepoFiles repoLink={fileRepoLink} />
    </main>
  );
};

export default ProblemsPage;
