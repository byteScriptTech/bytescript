import React from 'react';

import { useLanguages } from '@/context/LanguagesContext';

import CourseIcon from '../CourseIcon';

const LanguagesList = () => {
  const { languages } = useLanguages();
  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <div key={language.id}>
          <CourseIcon language={language.name} id={language.id} />
        </div>
      ))}
    </div>
  );
};

export default LanguagesList;
