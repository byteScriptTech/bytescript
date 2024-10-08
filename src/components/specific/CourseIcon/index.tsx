import Link from 'next/link';
import React from 'react';
import { AiOutlinePython } from 'react-icons/ai';
import { TbBrandJavascript, TbBrandTypescript } from 'react-icons/tb';

type CourseIconProps = { language: string; id: string };

const CourseIcon: React.FC<CourseIconProps> = ({ language, id }) => {
  switch (language) {
    case 'javascript':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <TbBrandJavascript size={50} />
        </Link>
      );
    case 'python':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <AiOutlinePython size={50} />
        </Link>
      );
    case 'typescript':
      return (
        <Link href={`/language?name=${language}&id=${id}`}>
          <TbBrandTypescript size={50} />
        </Link>
      );
    default:
      return '';
  }
};

export default CourseIcon;
