import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Settings - biteScript',
  description: 'Your settings',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
