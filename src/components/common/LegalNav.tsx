'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileText, Lock, Copyright, Cookie, RefreshCw } from "@/components/icons";

const LegalNavContent: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/legal/terms', label: 'Terms of Service', icon: FileText },
    { href: '/legal/privacy', label: 'Privacy Policy (GDPR / DPDP)', icon: Lock },
    { href: '/legal/aup', label: 'Acceptable Use Policy (AUP)', icon: Shield },
    { href: '/legal/dmca', label: 'DMCA & Copyright Takedown', icon: Copyright },
    { href: '/legal/cookies', label: 'Cookie Policy', icon: Cookie },
    { href: '/legal/refund', label: 'Refund Policy', icon: RefreshCw },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 text-xs">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              active
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export const LegalNav: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-10 mb-8" />}>
      <LegalNavContent />
    </Suspense>
  );
};
