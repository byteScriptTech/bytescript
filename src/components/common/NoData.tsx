import { ReactNode } from 'react';

interface NoDataProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const NoData = ({
  icon,
  title,
  description,
  className = '',
}: NoDataProps) => {
  const defaultIcon = (
    <svg
      className="w-8 h-8 text-gray-400 dark:text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
          {icon || defaultIcon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NoData;
