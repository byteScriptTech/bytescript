import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Language - byteScript',
  description: 'Practice and improve your language skills',
};

export default function LanguageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
