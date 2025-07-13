import React from 'react';

interface ActionButtonsProps {
  onCarryOn: () => void;
  lastVisitedTopic: string | null;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCarryOn,
  lastVisitedTopic,
}) => (
  <div className="flex flex-col items-center gap-4">
    <button
      onClick={onCarryOn}
      className="w-full bg-[#00BFA6] hover:bg-[#008F78] text-white font-semibold py-3 px-5 rounded-md shadow-md transition-transform transform"
    >
      Resume Learning
    </button>
    <p className="text-sm text-gray-500">
      Continue with your last topic: {lastVisitedTopic || 'Select a topic'}
    </p>
  </div>
);
