import type { Metadata } from 'next';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import 'regenerator-runtime/runtime';
import './globals.css';
import React from 'react';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'biteScript',
  description: 'code like a pro!',
  icons: {
    icon: [{ url: '/favicon.png', sizes: 'any' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          <NextTopLoader />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
