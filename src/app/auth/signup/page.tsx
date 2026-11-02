'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Check, AlertCircle, ArrowRight, Eye, EyeOff, Github, Google } from "@/components/icons";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  // Password strength meter calculation (AUTH-09)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const strengthColors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    if (strength < 2) {
      setError('Please use a stronger password with numbers and symbols.');
      return;
    }

    // Set mock user and redirect to onboarding wizard (AUTH-19)
    setUser((prev) => ({
      ...prev,
      name,
      email,
      username: name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'newdeveloper',
    }));

    router.push('/auth/onboarding');
  };

  const handleSocialAuth = (provider: string) => {
    setUser((prev) => ({
      ...prev,
      name: `${provider} Developer`,
      email: `dev@${provider.toLowerCase()}.com`,
    }));
    router.push('/auth/onboarding');
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
            Create Your Free Developer Account
          </h2>
          <p className="text-xs text-zinc-500">
            Unlimited APK deployments, automated malware scans, and instant shareable QR codes.
          </p>
        </div>

        {/* Social Login (Icon Only, 2 Columns) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialAuth('GitHub')}
            type="button"
            className="flex items-center justify-center py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all hover:scale-[1.02] cursor-pointer"
            title="Continue with GitHub"
          >
            <Github className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSocialAuth('Google')}
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
            Or register with email
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Work / Developer Email
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
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create strong password"
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

            {/* Password Strength Meter (AUTH-09) */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">Security Strength:</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Consent Checkbox (LEG-08) */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="tos"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="tos" className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight">
              I agree to the{' '}
              <Link href="/legal/terms" className="text-indigo-600 underline font-semibold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-indigo-600 underline font-semibold">
                Privacy Policy
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
