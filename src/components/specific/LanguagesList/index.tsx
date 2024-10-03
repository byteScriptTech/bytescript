import React from 'react';

import { useLanguages } from '@/context/LanguagesContext';

const LanguagesList = () => {
  const { languages, deleteLanguage } = useLanguages();
  const handleDelete = async (id: string) => {
    try {
      await deleteLanguage(id);
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };
  return (
    <div>
      <h2>Languages List</h2>
      <ul>
        {languages.map((language) => (
          <li key={language.id}>
            {language.name}
            <button onClick={() => handleDelete(language.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguagesList;
