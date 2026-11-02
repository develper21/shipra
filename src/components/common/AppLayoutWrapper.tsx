'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CookieBanner } from '@/components/common/CookieBanner';
import { CommandPalette } from '@/components/common/CommandPalette';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardOrAdmin = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  if (isDashboardOrAdmin) {
    return (
      <>
        <main className="flex-1 w-full min-h-screen">
          {children}
        </main>
        <CommandPalette />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
      <CommandPalette />
    </>
  );
}
