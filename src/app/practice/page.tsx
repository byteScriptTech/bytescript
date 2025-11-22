'use client';

import { Code, Database, FileCode2, Terminal } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import CollapsibleSidebar from '@/components/common/CollapsibleSidebar';
import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import PracticeContent from '@/components/specific/PracticeContent';
import { AuthProvider } from '@/context/AuthContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { PracticeProvider } from '@/context/PracticeContext';
import { PracticeTopic, SidebarItem } from '@/types/practice';

export const dynamic = 'force-dynamic';

export default function Practice() {
  const [currentTopic, setCurrentTopic] = useState<PracticeTopic | undefined>(
    undefined
  );
  const [category, setCategory] = useState<string>('problems');
  const [activeItemId, setActiveItemId] = useState<string>('problems');

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        id: 'problems',
        name: 'Problems',
        icon: <FileCode2 className="h-4 w-4" />,
        onClick: () => setCategory('problems'),
        isActive: category === 'problems',
      },
      {
        id: 'dsa',
        name: 'Data Structures',
        icon: <Database className="h-4 w-4" />,
        onClick: () => setCategory('dsa'),
        isActive: category === 'dsa',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: <Code className="h-4 w-4" />,
        onClick: () => setCategory('javascript'),
        isActive: category === 'javascript',
      },
      {
        id: 'python',
        name: 'Python',
        icon: <Terminal className="h-4 w-4" />,
        onClick: () => setCategory('python'),
        isActive: category === 'python',
      },
    ],
    [category]
  );

  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <PracticeProvider>
            <AuthGuard>
              <div className="flex min-h-screen w-full flex-col bg-background">
                <div className="flex flex-col flex-1">
                  <Navbar />
                  <main className="flex-1">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-64 flex-shrink-0">
                        <CollapsibleSidebar
                          items={sidebarItems}
                          header="Choose Category"
                          defaultOpen={true}
                          collapsible={true}
                          activeItemId={activeItemId}
                          onItemClick={(item) => {
                            setActiveItemId(item.id);
                            if (item.onClick) item.onClick();
                          }}
                          className="border-r border-border h-[calc(100vh-4rem)] fixed md:sticky top-16 left-0"
                        />
                      </div>
                      <div className="w-full md:pl-4 flex-1">
                        <PracticeContent
                          currentTopic={currentTopic}
                          setCurrentTopic={setCurrentTopic}
                          category={category}
                        />
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </AuthGuard>
          </PracticeProvider>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
