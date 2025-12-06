import { Button } from '@/components/ui/button';

interface QuestionNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  isMcq: boolean;
  hasSelectedOption: boolean;
  showNext: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export function QuestionNavigation({
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
  isMcq,
  hasSelectedOption,
  showNext,
  onPrevious,
  onSubmit,
  onNext,
  onComplete,
}: QuestionNavigationProps) {
  const isSubmitDisabled = isSubmitting || (isMcq && !hasSelectedOption);
  const isNextDisabled = isSubmitting;

  return (
    <div className="flex justify-between">
      <Button variant="outline" disabled={isFirstQuestion} onClick={onPrevious}>
        Previous
      </Button>

      <div className="flex gap-2">
        {!showNext && !isLastQuestion && (
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            variant="outline"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}

        {showNext ? (
          <Button onClick={onNext} disabled={isNextDisabled}>
            Next Question
          </Button>
        ) : isLastQuestion ? (
          <Button
            onClick={onComplete}
            disabled={isSubmitDisabled}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Practice'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
