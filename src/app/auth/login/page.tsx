'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Eye, EyeOff, Github, Google } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      email,
    }));
    router.push('/dashboard');
  };

  const loginAsDeveloper = () => {
    setUser((prev) => ({
      ...prev,
      name: 'Aarav Sharma',
      email: 'aarav@techbuilder.io',
      role: 'developer'
    }));
    router.push('/dashboard');
  };

  const loginAsAdmin = () => {
    setUser((prev) => ({
      ...prev,
      name: 'Admin Master',
      email: 'security-admin@shipra.dev',
      role: 'admin'
    }));
    router.push('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2.5">
            <img
              src="/shipara.svg"
              alt="Shipra"
              className="w-10 h-10 rounded-xl shadow-md object-contain"
            />
            <span className="font-extrabold text-2xl text-zinc-900 dark:text-white">Shipra</span>
          </Link>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-zinc-500">
            Log in to manage your apps, builds, and release channels.
          </p>
        </div>

        {/* Social Auth (Icon Only, 2 Columns) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={loginAsDeveloper}
            type="button"
            className="flex items-center justify-center py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all hover:scale-[1.02] cursor-pointer"
            title="Continue with GitHub"
          >
            <Github className="w-5 h-5" />
          </button>
          <button
            onClick={loginAsDeveloper}
            type="button"
            className="flex items-center justify-center py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all hover:scale-[1.02] cursor-pointer"
            title="Continue with Google"
          >
            <Google className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center text-xs text-zinc-400">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-zinc-900 uppercase tracking-wider text-[10px]">
            Or email login
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="developer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
}
