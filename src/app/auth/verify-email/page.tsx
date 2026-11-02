'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight } from "@/components/icons";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto verify if full
    if (newOtp.every(d => d !== '')) {
      setVerified(true);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            We sent a 6-digit confirmation code to your developer inbox.
          </p>
        </div>

        {verified ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="font-bold">Email verified successfully!</p>
            <Link
              href="/auth/onboarding"
              className="inline-flex items-center space-x-1 font-semibold text-indigo-600 dark:text-indigo-400 underline pt-1"
            >
              <span>Continue to Developer Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-11 h-12 rounded-xl text-center font-mono font-bold text-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <button
              onClick={() => { setOtp(['7','4','9','1','2','8']); setVerified(true); }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
            >
              Click to Auto-fill Demo OTP (749128)
            </button>
          </div>
        )}

        <div className="text-xs text-zinc-400">
          Didn&apos;t receive code?{' '}
          <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Resend Email
          </button>
        </div>
      </div>
    </div>
  );
}
