import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TestQuestion } from '@/types/customTest';

interface Props {
  question: TestQuestion;
  onUpdate: (updates: Partial<TestQuestion>) => void;
}

export default function MultipleChoiceEditor({ question, onUpdate }: Props) {
  const options = question.options ?? ['', '', '', ''];

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    onUpdate({ options: updated });
  };

  return (
    <div className="space-y-2">
      <Label>Options</Label>

      {options.map((opt, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            value={opt}
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
            onChange={(e) => updateOption(i, e.target.value)}
          />

          <Button
            size="sm"
            variant={question.correctAnswer === opt ? 'default' : 'outline'}
            onClick={() => onUpdate({ correctAnswer: opt })}
          >
            Correct
          </Button>
        </div>
      ))}
    </div>
  );
}
