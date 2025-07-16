import Link from 'next/link';
import React from 'react';

import CompetitiveProgrammingIcon from '@/assets/CourseIcons/CompetitiveProgrammingIcon';
import DataStructuresIcon from '@/assets/CourseIcons/DataStructuresIcon';
import JavascriptIcon from '@/assets/CourseIcons/Javascript';
import PythonIcon from '@/assets/CourseIcons/Python';

interface CourseIconProps {
  language: string;
  id: string;
}

const CourseIcon: React.FC<CourseIconProps> = ({ language, id }) => {
  if (!language || !id) {
    return null;
  }

  const cardStyles =
    'bg-white shadow-md p-2 rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out';
  switch (language) {
    case 'javascript':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <JavascriptIcon altText="JavaScript" size={40} />
          </div>
        </Link>
      );
    case 'python':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <PythonIcon altText="Python" size={40} />
          </div>
        </Link>
      );

    case 'competitive-programming':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <CompetitiveProgrammingIcon
              altText="Competitive Programming"
              size={40}
            />
          </div>
        </Link>
      );
    case 'data-structures-&-algorithms':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <DataStructuresIcon
              altText="Data Structures & Algorithms"
              size={40}
            />
          </div>
        </Link>
      );
    default:
      return null; // Return null for unsupported language error
  }
};

export default CourseIcon;
