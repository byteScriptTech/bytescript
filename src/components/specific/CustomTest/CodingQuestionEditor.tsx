import dynamic from 'next/dynamic';

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

// Dynamically import the JavaScriptCodeEditor with SSR disabled
const JavaScriptCodeEditor = dynamic(
  () =>
    import('@/components/common/JavaScriptCodeEditor').then((mod) => {
      // Return a new component that matches the expected props
      return function WrappedEditor(props: any) {
        return <mod.JavaScriptCodeEditor {...props} />;
      };
    }),
  { ssr: false }
);

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
        <div className="border rounded-md overflow-hidden">
          <JavaScriptCodeEditor
            initialCode={question.codeTemplate || ''}
            onCodeChange={(code: string) => onUpdate({ codeTemplate: code })}
            showRunButton={false}
            showOutput={false}
            height="200px"
          />
        </div>
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
