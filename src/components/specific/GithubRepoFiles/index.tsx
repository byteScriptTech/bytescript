import React, { useEffect, useState } from 'react';

import ReadmeViewer from '@/components/common/ReadmeViewer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { githubUrlToApiUrl } from '@/util/github';

interface GithubRepoFilesProps {
  repoLink: string;
}

const GithubRepoFiles: React.FC<GithubRepoFilesProps> = ({ repoLink }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([repoLink]);
  useEffect(() => {
    const currentLink = history[history.length - 1];
    if (!currentLink) {
      setFiles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(currentLink)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          setFiles([]);
        }
        setLoading(false);
      });
  }, [history]);

  // Breadcrumb navigation
  const handleBreadcrumbClick = (idx: number) => {
    setHistory(history.slice(0, idx + 1));
  };

  if (loading) return <p className="text-gray-500">Loading files...</p>;
  if (!files || files.length === 0)
    return <p className="text-gray-500">No files found.</p>;

  const readmeFile = files?.find(
    (file) => file.name?.toLowerCase() === 'readme.md'
  );

  return (
    <div>
      <nav className="mb-4 flex items-center gap-1">
        {history.map((url, idx) => {
          // Extract the folder/file name from the API URL
          const parts = url.split('/contents/');
          const crumb = parts[1] ? parts[1].split('/').pop() : 'root';
          return (
            <span key={url}>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleBreadcrumbClick(idx)}
                disabled={idx === history.length - 1}
              >
                {crumb || 'root'}
              </button>
              {idx < history.length - 1 && <span>/</span>}
            </span>
          );
        })}
      </nav>
      <ul>
        {readmeFile && (
          <li key={readmeFile.sha} className="font-bold text-blue-600">
            <ReadmeViewer apiUrl={`${history[history.length - 1]}/README.md`} />
          </li>
        )}
        <div className="flex gap-2 my-2">
          {files
            .filter((file) => file !== readmeFile)
            .map((file) => (
              <Card
                onClick={() => {
                  const apiUrl = githubUrlToApiUrl(file.html_url);
                  if (apiUrl && apiUrl !== history[history.length - 1]) {
                    setHistory([...history, apiUrl]);
                  }
                }}
                key={file.sha || file.name}
                className="bg-white rounded-lg p-4 "
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {file.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </div>
      </ul>
    </div>
  );
};

export default GithubRepoFiles;
