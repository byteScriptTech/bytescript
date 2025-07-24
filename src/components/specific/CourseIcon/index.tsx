'use client';

import Link from 'next/link';
import React from 'react';

import CompetitiveProgrammingIcon from '@/assets/CourseIcons/CompetitiveProgrammingIcon';
import DataStructuresIcon from '@/assets/CourseIcons/DataStructuresIcon';
import JavascriptIcon from '@/assets/CourseIcons/Javascript';
import PythonIcon from '@/assets/CourseIcons/Python';

interface CourseIconProps {
  language: string;
  id: string;
  size?: number;
}

const CourseIcon: React.FC<CourseIconProps> = ({ language, id, size = 40 }) => {
  if (!language || !id) {
    return null;
  }

  const cardStyles =
    'bg-white shadow-md p-2 rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out';
  switch (language) {
    case 'javascript':
      return (
        <Link href={`/lang?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <JavascriptIcon altText="JavaScript" size={size} />
          </div>
        </Link>
      );
    case 'python':
      return (
        <Link href={`/lang?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <PythonIcon altText="Python" size={size} />
          </div>
        </Link>
      );

    case 'competitive-programming':
      return (
        <Link href={`/lang?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <CompetitiveProgrammingIcon
              altText="Competitive Programming"
              size={size}
            />
          </div>
        </Link>
      );
    case 'data-structures-&-algorithms':
      return (
        <Link href={`/lang?name=${language}&id=${id}`}>
          <div className={cardStyles} tabIndex={0} role="button">
            <DataStructuresIcon
              altText="Data Structures & Algorithms"
              size={size}
            />
          </div>
        </Link>
      );
    default:
      return null; // Return null for unsupported language error
  }
};

export default CourseIcon;
