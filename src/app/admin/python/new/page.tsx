'client';

import { PythonContentForm } from '../PythonContentForm';

export default function NewPythonContentPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Python Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <PythonContentForm />
      </div>
    </div>
  );
}
