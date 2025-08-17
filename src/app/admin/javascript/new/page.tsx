'client';

import { JavaScriptContentForm } from '../JavaScriptContentForm';

export default function NewJavaScriptContentPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New JavaScript Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <JavaScriptContentForm />
      </div>
    </div>
  );
}
