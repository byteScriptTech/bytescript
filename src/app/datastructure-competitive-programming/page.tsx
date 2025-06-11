'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import AuthGuard from '@/components/misc/authGuard';
import GithubRepoFiles from '@/components/specific/GithubRepoFiles';
import { Breadcrumbs } from '@/components/specific/GithubRepoFiles/Breadcrumbs';
import { LocalStorageProvider } from '@/context/LocalhostContext';

const repoLink = process.env.NEXT_PUBLIC_GITHUB_REPO_LINK ?? '';

const ProblemsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const file = searchParams.get('file');

  const fileRepoLink = useMemo(() => {
    if (file) {
      return repoLink.endsWith('/')
        ? `${repoLink}${file}`
        : `${repoLink}/${file}`;
    }
    return repoLink;
  }, [file]);

  const handleCrumbClick = (path: string) => {
    const url = new URL(window.location.href);
    if (path) {
      url.searchParams.set('file', path);
    } else {
      url.searchParams.delete('file');
    }
    router.push(url.pathname + url.search);
  };

  return (
    <AuthGuard>
      <LocalStorageProvider>
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Problems</h1>
          <p className="mb-6 text-gray-700">
            Browse and solve coding problems to improve your skills.
          </p>
          <Breadcrumbs
            repoLink={fileRepoLink}
            onCrumbClick={handleCrumbClick}
          />
          <GithubRepoFiles repoLink={fileRepoLink} />
        </main>
      </LocalStorageProvider>
    </AuthGuard>
  );
};

export default ProblemsPage;
