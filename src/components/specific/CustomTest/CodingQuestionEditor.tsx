import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TestQuestion } from '@/types/customTest';

interface Props {
  question: TestQuestion;
  onUpdate: (updates: Partial<TestQuestion>) => void;
}

export default function CodingQuestionEditor({ question, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Language</Label>
        <Select
          value={question.language || 'javascript'}
          onValueChange={(value) => onUpdate({ language: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Starter Code (Optional)</Label>
        <Textarea
          rows={5}
          className="font-mono text-sm"
          value={question.codeTemplate || ''}
          onChange={(e) => onUpdate({ codeTemplate: e.target.value })}
        />
      </div>

      <div>
        <Label>Expected Output</Label>
        <Textarea
          rows={2}
          value={question.correctAnswer as string}
          onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
        />
      </div>
    </div>
  );
}
