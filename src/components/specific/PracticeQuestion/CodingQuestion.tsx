import { TestCase } from '@/types/practiceQuestion';

interface CodingQuestionProps {
  initialCode: string;
  testCases: TestCase[];
  userCode: string;
  onCodeChange: (code: string) => void;
}

export function CodingQuestion({
  initialCode,
  testCases,
  userCode,
  onCodeChange,
}: CodingQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="h-48 bg-gray-50 dark:bg-gray-800 rounded p-4 font-mono text-sm">
        <textarea
          className="w-full h-full bg-transparent outline-none resize-none"
          value={userCode || initialCode || ''}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck="false"
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
