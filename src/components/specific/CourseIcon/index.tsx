import Link from 'next/link';
import React from 'react';

import JavascriptIcon from '@/assets/CourseIcons/Javascript';
import PythonIcon from '@/assets/CourseIcons/Python';
import TypeScriptIcon from '@/assets/CourseIcons/TypescriptIcon';

type CourseIconProps = { language: string; id: string };

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
          <div className={cardStyles}>
            <JavascriptIcon altText="Javascript" size={40} />
          </div>
        </Link>
      );
    case 'python':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <div className={cardStyles}>
            <PythonIcon altText="Python" size={40} />
          </div>
        </Link>
      );
    case 'typescript':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <div className={cardStyles}>
            <TypeScriptIcon altText="Typescript" size={40} />
          </div>
        </Link>
      );
    default:
      return null; // Return null for unsupported language error
  }
};

export default CourseIcon;
