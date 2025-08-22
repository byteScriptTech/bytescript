import InterviewTopicClient from './InterviewTopicClient';

type PageProps = {
  params: { topicId: string };
};

export default function InterviewTopicPage({ params: _params }: PageProps) {
  // This is a server component that renders the client component
  // You can add server-side data fetching here if needed
  return <InterviewTopicClient />;
}

export async function generateStaticParams() {
  return [
    { topicId: 'javascript' },
    { topicId: 'react' },
    { topicId: 'nodejs' },
    { topicId: 'typescript' },
    { topicId: 'python' },
  ];
}
