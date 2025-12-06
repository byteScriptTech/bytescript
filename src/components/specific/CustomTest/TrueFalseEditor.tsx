import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import { TestQuestion } from '@/types/customTest';

interface Props {
  question: TestQuestion;
  onUpdate: (updates: Partial<TestQuestion>) => void;
}

export default function TrueFalseEditor({ question, onUpdate }: Props) {
  return (
    <div>
      <Label>Correct Answer</Label>

      <Select
        value={String(question.correctAnswer)}
        onValueChange={(v) => onUpdate({ correctAnswer: v })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
