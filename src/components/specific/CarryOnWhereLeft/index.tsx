import { toUpper } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaInbox } from 'react-icons/fa6';

import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar';
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
  const currentLang = getItem('lvl_name');
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
  if (!currentLang) {
    return (
      <Card className="bg-white rounded-lg  p-8">
        <CarryOnCardTitle />
        <CardContent className="mt-4 space-y-4 flex justify-center">
          <FaInbox size={60} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg p-6 shadow-sm">
      <CardHeader>
        <CarryOnCardTitle />
        <CardDescription className="text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-700">
              Current Topic:
              <span className="pl-2 text-sm font-normal text-gray-500">
                {lastVisitedTopic}
              </span>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 py-2">
                  <span className="text-xs text-gray-600">
                    ⏳ Estimated time left:
                  </span>
                  <span className="font-medium text-xs text-gray-800">
                    30 mins
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <AnimatedCircularProgressBar
                max={100}
                min={0}
                className="h-20"
                value={10}
                gaugePrimaryColor="#00BFA6"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
              />
              <p className="pt-2 text-sm text-gray-600">
                {toUpper(currentLang) || 'Start learning'}
              </p>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-6 space-y-6">
        <div>
          <button
            className="w-full bg-[#00BFA6] hover:bg-[#008F78] text-white font-semibold py-3 px-5 rounded-md shadow-md transition-transform transform"
            onClick={handleCarryOnClick}
          >
            Resume Learning
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
const CarryOnCardTitle = () => {
  return (
    <CardTitle className="text-xl font-semibold text-gray-800">
      Carry on where you left?
    </CardTitle>
  );
};
export default CarryOnWhereLeft;
