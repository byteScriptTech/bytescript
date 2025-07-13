import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar';

interface ProgressInfoProps {
  language: string;
  timeLeft: string;
  progress: number;
}

export const ProgressInfo = ({
  language,
  timeLeft,
  progress,
}: ProgressInfoProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {language.toUpperCase()}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            ⏳ Time left to complete:
          </span>
          <span className="font-medium text-sm text-gray-800">
            {timeLeft.replace('mins', 'minutes')}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedCircularProgressBar
          max={100}
          value={progress}
          gaugePrimaryColor="#00BFA6"
          gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
          className="relative w-20 h-20 text-2xl font-semibold"
        />
        <span className="text-sm text-gray-600">Progress</span>
      </div>
    </div>
  );
};
