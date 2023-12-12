import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ThemeProvider } from '@/components/providers/Themes-Provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FileHub',
  description:
    'FileHub is a file sharing service that is easy to use and free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
