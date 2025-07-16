import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Login - biteScript',
  description: 'Login to your account',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
