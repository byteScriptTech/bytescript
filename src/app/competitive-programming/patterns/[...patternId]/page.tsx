import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// This would typically come from your data source
const patternData = {
  backtracking: {
    title: 'Backtracking',
    description:
      "Explore problems that involve trying different solutions and undoing them if they don't work, like solving mazes or puzzles.",
  },
  'binary-search': {
    title: 'Binary Search',
    description:
      'Learn how to efficiently search through sorted data by repeatedly dividing the search interval in half.',
  },
  // Add other patterns here
};

type Props = {
  params: { patternId: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const patternId = params.patternId?.[0] || '';
  const pattern = patternData[patternId as keyof typeof patternData];

  if (!pattern) return {};

  return {
    title: `${pattern.title} | Competitive Programming`,
    description: pattern.description,
  };
}

export default function PatternPage({ params }: Props) {
  const patternId = params.patternId?.[0] || '';
  const pattern = patternData[patternId as keyof typeof patternData];

  if (!pattern) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{pattern.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {pattern.description}
      </p>

      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Problems</h2>
      </div>
    </div>
  );
}
