import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionCardProps {
  id: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function QuestionCard({
  question,
  answer,
  defaultOpen = false,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg m-0">{question}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="p-4 pt-0 border-t">
          <div className="prose dark:prose-invert">
            <p>{answer}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
