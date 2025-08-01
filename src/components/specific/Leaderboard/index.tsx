'use client';

import { Trophy } from 'lucide-react';

import { NoData } from '@/components/common/NoData';

export const Leaderboard = () => {
  return (
    <NoData
      icon={
        <Trophy
          className="w-8 h-8 text-gray-400 dark:text-gray-500"
          strokeWidth={1.5}
        />
      }
      title="Leaderboard Coming Soon"
      description="The leaderboard will be available once users start participating in challenges."
    />
  );
};
