import React, { useEffect, useState } from 'react';

import { useAuthRedux } from '@/hooks/useAuthRedux';

const Greetings: React.FC = () => {
  const { currentUser } = useAuthRedux();
  const [greeting, setGreeting] = useState('');
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  useEffect(() => {
    const greetingMessage = getGreeting();
    setGreeting(greetingMessage);
  }, []);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#00BFA6] to-[#00796B] shadow-md">
      <div className="text-white font-bold text-2xl">
        👋 Hi {currentUser?.displayName?.split(' ')[0] || 'there'}!
      </div>
      <div className="text-white text-lg">
        {greeting}, how&apos;s your day going?
      </div>
    </div>
  );
};

export default Greetings;
