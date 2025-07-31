import { Button } from '@/components/ui/button';

interface QuestionNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  isMcq: boolean;
  hasSelectedOption: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
  onComplete: () => void;
}

export function QuestionNavigation({
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
  isMcq,
  hasSelectedOption,
  onPrevious,
  onSubmit,
  onComplete,
}: QuestionNavigationProps) {
  return (
    <div className="flex justify-between">
      <Button variant="outline" disabled={isFirstQuestion} onClick={onPrevious}>
        Previous
      </Button>

      {isLastQuestion ? (
        <Button
          onClick={onComplete}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Submitting...' : 'Complete Practice'}
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || (isMcq && !hasSelectedOption)}
        >
          {isSubmitting ? 'Submitting...' : 'Submit & Next'}
        </Button>
      )}
    </div>
  );
}
