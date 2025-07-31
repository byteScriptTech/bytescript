import { ReactNode } from 'react';

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
