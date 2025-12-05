'use client';

import { Code, Database, FileCode2, Terminal, Edit3 } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import CollapsibleSidebar from '@/components/common/CollapsibleSidebar';
import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import CustomTestContent from '@/components/specific/CustomTest/CustomTestContent';
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
  const [view, setView] = useState<'practice' | 'custom-tests'>('practice');

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        id: 'custom-tests',
        name: 'Custom Tests',
        icon: <Edit3 className="h-4 w-4" />,
        onClick: () => {
          setView('custom-tests');
          setActiveItemId('custom-tests');
        },
        isActive: view === 'custom-tests',
      },
      {
        id: 'problems',
        name: 'Problems',
        icon: <FileCode2 className="h-4 w-4" />,
        onClick: () => {
          setCategory('problems');
          setView('practice');
          setActiveItemId('problems');
        },
        isActive: category === 'problems' && view === 'practice',
      },
      {
        id: 'dsa',
        name: 'Data Structures',
        icon: <Database className="h-4 w-4" />,
        onClick: () => {
          setCategory('dsa');
          setView('practice');
          setActiveItemId('dsa');
        },
        isActive: category === 'dsa' && view === 'practice',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: <Code className="h-4 w-4" />,
        onClick: () => {
          setCategory('javascript');
          setView('practice');
          setActiveItemId('javascript');
        },
        isActive: category === 'javascript' && view === 'practice',
      },
      {
        id: 'python',
        name: 'Python',
        icon: <Terminal className="h-4 w-4" />,
        onClick: () => {
          setCategory('python');
          setView('practice');
          setActiveItemId('python');
        },
        isActive: category === 'python' && view === 'practice',
      },
    ],
    [category, view]
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
                        {view === 'custom-tests' ? (
                          <CustomTestContent />
                        ) : (
                          <PracticeContent
                            currentTopic={currentTopic}
                            setCurrentTopic={setCurrentTopic}
                            category={category}
                          />
                        )}
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
