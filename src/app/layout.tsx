import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
// import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import 'regenerator-runtime/runtime';
import './globals.css';
import React from 'react';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/theme-provider';
import { ReduxProvider } from '@/providers/ReduxProvider';

const fontSans = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
});

// Keep the mono font for code blocks and other monospace text
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// });

export const metadata: Metadata = {
  title: 'byteScript',
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
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ReduxProvider>
          <ThemeProvider>
            <NextTopLoader />
            <Toaster />
            <Analytics />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
