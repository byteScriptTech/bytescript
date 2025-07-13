import { FaInbox } from 'react-icons/fa6';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <FaInbox
        className="w-12 h-12 text-gray-400"
        role="img"
        aria-label="Inbox icon"
      />
      <p className="text-sm text-gray-500">Select a topic</p>
    </div>
  );
};
