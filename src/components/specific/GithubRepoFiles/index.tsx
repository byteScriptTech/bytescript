import React, { useEffect, useState } from 'react';

import ReadmeViewer from '@/components/common/ReadmeViewer';

const repoLink = process.env.NEXT_PUBLIC_GITHUB_REPO_LINK;
interface GithubRepoFilesProps {}

const GithubRepoFiles: React.FC<GithubRepoFilesProps> = () => {
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
      {files
        .filter((file) => file !== readmeFile)
        .map((file) => (
          <li key={file.sha}>{file.name}</li>
        ))}
    </ul>
  );
};

export default GithubRepoFiles;
