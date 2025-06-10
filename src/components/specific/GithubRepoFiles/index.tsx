import React, { useEffect, useState } from 'react';

import ReadmeViewer from '@/components/common/ReadmeViewer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface GithubRepoFilesProps {
  repoLink: string;
}

const GithubRepoFiles: React.FC<GithubRepoFilesProps> = ({ repoLink }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repoLink) {
      setFiles([]);
      setLoading(false);
      return;
    }
    fetch(repoLink)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      });
  }, []);
  console.log(files, 'these are the files');
  if (loading) return <p className="text-gray-500">Loading files...</p>;
  if (!files || files.length === 0)
    return <p className="text-gray-500">No files found.</p>;

  const readmeFile = files.find(
    (file) => file.name?.toLowerCase() === 'readme.md'
  );
  return (
    <ul>
      {readmeFile && (
        <li key={readmeFile.sha} className="font-bold text-blue-600">
          <ReadmeViewer apiUrl={`${repoLink}/README.md`} />
        </li>
      )}
      <div className="flex gap-2 my-2">
        {files
          .filter((file) => file !== readmeFile)
          .map((file) => (
            <Card
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('file', file.name);
                window.history.pushState({}, '', url.toString());
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
  );
};

export default GithubRepoFiles;
