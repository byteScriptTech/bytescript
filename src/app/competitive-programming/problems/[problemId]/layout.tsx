import React from 'react';

export const metadata = {
  title: 'Solve Problem - biteScript',
  description: 'Solve competitive programming problems',
};

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
