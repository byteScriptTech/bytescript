import { JavaScriptCodeEditor } from '@/components/common/JavaScriptCodeEditor';
import { TestCase } from '@/types/practiceQuestion';

interface CodingQuestionProps {
  initialCode: string;
  testCases: TestCase[];
  userCode: string;
  onCodeChange: (code: string) => void;
  language?: string;
}

export function CodingQuestion({
  initialCode,
  testCases,
  userCode,
  onCodeChange,
}: CodingQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="h-[600px] rounded-md overflow-hidden">
        <JavaScriptCodeEditor
          initialCode={userCode || initialCode || ''}
          onCodeChange={onCodeChange}
          readOnly={false}
          className="w-full h-full"
          showRunButton
          showOutput
          height="300px"
        />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-medium mb-2">Test Cases:</h3>
        <div className="space-y-2">
          {testCases.map((testCase, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {testCase.input} → {testCase.isHidden ? '???' : testCase.output}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
