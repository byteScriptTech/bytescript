import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLocalStorage } from '@/context/LocalhostContext';

const CarryOnWhereLeft: React.FC = () => {
  const [carryOnPath, setCrryOnPath] = useState<string>('');
  const [lastVisitedTopic, setLastVisitedTopic] = useState<string | null>(null);
  const { getItem } = useLocalStorage();
  const router = useRouter();
  useEffect(() => {
    const lvt = getItem('lvt');
    const lvt_name = getItem('lvt_name');
    const lvt_sub = getItem('lvt_sub');
    setLastVisitedTopic(lvt_name);
    setCrryOnPath(`${lvt}&lvt_sub=${lvt_sub}`);
  }, []);
  const handleCarryOnClick = () => {
    router.push(carryOnPath);
  };

  return (
    <Card x-chunk="dashboard-07-chunk-0" className="bg-white rounded-lg  p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Carry on where you left?
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {lastVisitedTopic?.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">Your Progress</p>
          <p className="text-sm text-gray-500">45% completed</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: '45%' }}
          ></div>
        </div>

        <div className="mt-6 space-y-2">
          <button
            className="w-full bg-[#00BFA6] hover:bg-[#00A38C] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all duration-300"
            onClick={handleCarryOnClick}
          >
            Resume Learning
          </button>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              ⏳ Estimated time left:
            </span>
            <span className="ml-2 font-medium text-gray-800">30 mins</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarryOnWhereLeft;
