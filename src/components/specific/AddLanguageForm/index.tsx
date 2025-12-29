import React, { useState } from 'react';

import { useLanguagesRedux } from '@/hooks/useLanguagesRedux';

const AddLanguageForm = () => {
  const { addLanguage, updateLanguage } = useLanguagesRedux();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateLanguage(editId, name);
        setEditId(null);
      } else {
        await addLanguage(name);
      }
      setName('');
    } catch (error) {
      console.error('Error adding/updating language:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editId ? 'Edit Language' : 'Add New Language'}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Language name"
        required
      />
      <button type="submit">{editId ? 'Update' : 'Add'}</button>
    </form>
  );
};

export default AddLanguageForm;
