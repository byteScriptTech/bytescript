import React, { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useContentContext } from '@/context/ContentContext';
import { useLanguages } from '@/context/LanguagesContext';
import { useLocalStorage } from '@/context/LocalhostContext';

import CourseIcon from '../CourseIcon';

const LanguagesList = () => {
  const { languages, getUserLearningProgress, addUserLearningProgress } =
    useLanguages();
  const { content, fetchContent } = useContentContext();
  const { getItem, setItem } = useLocalStorage();
  const progress = getItem('progressCache');
  const { currentUser } = useAuth();

  const handleLanguageClick = (name: string) => {
    if (name && !content) {
      fetchContent(name);
    }
    setItem('lvl_name', name);
  };

  useEffect(() => {
    if (content) {
      const topics = content[0]?.topics.map((topic) => ({
        name: topic.name,
        id: topic.id,
        isCompleted: false,
      }));
      getUserLearningProgress(currentUser?.uid, content[0]?.name);
      const findLanguage = progress?.includes(content[0]?.name.toLowerCase());

      if (!findLanguage) {
        if (progress?.length) {
          setItem('progressCache', [...progress, content[0]?.name]);
        } else {
          setItem('progressCache', [content[0]?.name.toLowerCase()]);
        }
        addUserLearningProgress(currentUser.uid, content[0].name, topics);
      }
    }
  }, [content]);

  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <div
          onClick={() => handleLanguageClick(language.name)}
          key={language.id}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLanguageClick(language.name);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <CourseIcon language={language.name} id={language.id} />
        </div>
      ))}
    </div>
  );
};

export default LanguagesList;
