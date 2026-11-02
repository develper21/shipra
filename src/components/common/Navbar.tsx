'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';
import { 
  Rocket, 
  Sun, 
  Moon, 
  Languages, 
  Search, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles
} from "@/components/icons";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { lang, setLang, theme, toggleTheme, setIsCommandPaletteOpen } = useApp();
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <img
              src="/shipara.svg"
              alt="Shipra"
              className="w-9 h-9 rounded-xl shadow-md group-hover:scale-105 transition-transform object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                Shipra
              </span>
              <span className="text-[10px] -mt-1 font-medium tracking-wide text-indigo-600 dark:text-indigo-400">
                OPEN SOURCE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/features"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/features'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/pricing'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/use-cases"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/use-cases'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Use Cases
              </Link>
              <Link
                href="/docs"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname?.startsWith('/docs')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Docs
              </Link>
              <Link
                href="/blog"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname?.startsWith('/blog')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/changelog"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/changelog'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Changelog
              </Link>
            </nav>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Log in / Sign up CTA */}
          <div className="hidden sm:flex items-center space-x-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <Link
              href="/auth/login"
              className="px-3 py-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Sign up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Pricing
          </Link>
          <Link
            href="/use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Use Cases
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Documentation
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Blog
          </Link>
          <Link
            href="/changelog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Changelog
          </Link>
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-md"
            >
              Sign up free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
