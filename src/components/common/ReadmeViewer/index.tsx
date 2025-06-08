import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ReadmeViewerProps {
  apiUrl: string;
}

const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ apiUrl }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  console.log('this is the url i am getting', apiUrl);
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.download_url) {
          fetch(data.download_url)
            .then((res) => res.text())
            .then((md) => {
              setMarkdown(md);
              setLoading(false);
            });
        } else {
          setMarkdown('README not found.');
          setLoading(false);
        }
      });
  }, [apiUrl]);

  if (loading) return <p>Loading README...</p>;

  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default ReadmeViewer;
