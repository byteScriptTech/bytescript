'use client';
import React from 'react';

import AddLanguageForm from '@/components/specific/AddLanguageForm';

interface AdminProps {}
const Admin: React.FC<AdminProps> = () => {
  return (
    <div>
      <h1>
        <AddLanguageForm />
      </h1>
    </div>
  );
};
export default Admin;
