import { Trash2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

import CodingQuestionEditor from './CodingQuestionEditor';
import MultipleChoiceEditor from './MultipleChoiceEditor';
import TrueFalseEditor from './TrueFalseEditor';

interface Props {
  question: TestQuestion;
  index: number;
  onUpdate: (updates: Partial<TestQuestion>) => void;
  onRemove: () => void;
}

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Question {index + 1}</h4>
        <button
          className="text-red-600 hover:text-red-800 flex items-center"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </button>
      </div>

      <div>
        <Label>Question *</Label>
        <Textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select
            value={question.type}
            onValueChange={(value) =>
              onUpdate({
                type: value as TestQuestion['type'],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="true-false">True/False</SelectItem>
              <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Points</Label>
          <Input
            type="number"
            min="1"
            value={question.points}
            onChange={(e) =>
              onUpdate({ points: parseInt(e.target.value) || 1 })
            }
          />
        </div>
      </div>

      {/* TYPE-SPECIFIC SUB EDITORS */}
      {question.type === 'multiple-choice' && (
        <MultipleChoiceEditor question={question} onUpdate={onUpdate} />
      )}

      {question.type === 'coding' && (
        <CodingQuestionEditor question={question} onUpdate={onUpdate} />
      )}

      {question.type === 'true-false' && (
        <TrueFalseEditor question={question} onUpdate={onUpdate} />
      )}

      {question.type === 'fill-blank' && (
        <div>
          <Label>Correct Answer</Label>
          <Input
            value={question.correctAnswer || ''}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            placeholder="Correct answer"
          />
        </div>
      )}

      <div>
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
        />
      </div>
    </Card>
  );
}
