import { Option } from '@/types/practiceQuestion';

interface MCQQuestionProps {
  options: Option[];
  selectedOption: string | null;
  onSelect: (id: string) => void;
}

export function MCQQuestion({
  options,
  selectedOption,
  onSelect,
}: MCQQuestionProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div
          key={option.id}
          role="radio"
          aria-checked={selectedOption === option.id}
          tabIndex={0}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedOption === option.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onClick={() => onSelect(option.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(option.id);
            }
          }}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center border rounded-full mr-3">
              {selectedOption === option.id && (
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              )}
            </div>
            <span>{option.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
