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
  title: {
    default: 'byteScript - Code Like a Pro',
    template: '%s | byteScript',
  },
  description:
    'Master coding with byteScript - Interactive coding platform for competitive programming, interview prep, and real-time collaboration. Practice problems, learn algorithms, and improve your programming skills.',
  keywords: [
    'coding',
    'programming',
    'competitive programming',
    'interview prep',
    'algorithms',
    'data structures',
    'javascript',
    'python',
    'typescript',
    'code practice',
    'learn to code',
  ],
  authors: [{ name: 'byteScript Team' }],
  creator: 'byteScript',
  publisher: 'byteScript',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bytescript.tech'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bytescript.tech',
    title: 'byteScript - Code Like a Pro',
    description:
      'Master coding with byteScript - Interactive coding platform for competitive programming, interview prep, and real-time collaboration.',
    siteName: 'byteScript',
    images: [
      {
        url: '/images/favicon.png',
        width: 1200,
        height: 630,
        alt: 'byteScript - Interactive Coding Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'byteScript - Code Like a Pro',
    description:
      'Master coding with byteScript - Interactive coding platform for competitive programming, interview prep, and real-time collaboration.',
    images: ['/images/favicon.png'],
    creator: '@bytescriptTech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'djkNU0YiAeGbRAJXJwx4KONAsZ_bBr7Zx49vLe7hlZs',
  },
  icons: {
    icon: [
      { url: '/images/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      {
        url: '/images/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'byteScript',
    description:
      'Master coding with byteScript - Interactive coding platform for competitive programming, interview prep, and real-time collaboration',
    url: 'https://bytescript.tech',
    sameAs: [
      'https://x.com/bytescriptTech',
      'https://github.com/byteScriptTech',
      'https://instagram.com/bytescript.tech',
      'https://linkedin.com/company/bytescripttech',
    ],
    author: {
      '@type': 'Organization',
      name: 'byteScript Team',
      url: 'https://bytescript.tech',
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'byteScript',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  };

  return (
    <html lang="en" className={fontSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <NextTopLoader />
          <Toaster />
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
