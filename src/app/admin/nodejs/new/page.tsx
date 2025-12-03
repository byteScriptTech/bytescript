'use client';

import { NodejsContentForm } from '../NodejsContentForm';

export default function NewNodejsContentPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Node.js Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <NodejsContentForm />
      </div>
    </div>
  );
}
