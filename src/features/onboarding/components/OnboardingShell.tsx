import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft, ArrowRight, Check } from "@/components/icons";

interface OnboardingShellProps {
  stepNumber: number;
  totalSteps: number;
  currentStepId: string;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  canSkip?: boolean;
  showBack?: boolean;
  children: React.ReactNode;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({
  stepNumber,
  totalSteps,
  currentStepId,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continue",
  isNextDisabled = false,
  isNextLoading = false,
  canSkip = false,
  showBack = true,
  children,
}) => {
  // Calculate percentage: Step 1 = 14%, Step 7 = 100%
  const progressPercent = Math.min(100, Math.round((stepNumber / totalSteps) * 100));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <img
              src="/shipara.svg"
              alt="Shipra"
              className="w-8 h-8 rounded-lg shadow-sm object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
              Shipra
            </span>
          </Link>

          {/* Step Indicator & Progress */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Step {stepNumber} of {totalSteps}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">
                {currentStepId.replace(/_/g, " ")}
              </span>
            </div>

            <div className="w-24 sm:w-32 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Exit to Dashboard */}
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors px-2 py-1 rounded"
              title="Save progress and exit to dashboard"
            >
              Exit to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl p-6 sm:p-10 transition-all">
          {children}

          {/* Bottom Actions Bar */}
          <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            {/* Left: Back action */}
            <div>
              {showBack && onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Right: Skip and Primary CTA */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {canSkip && onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              )}

              {onNext && (
                <button
                  type="button"
                  disabled={isNextDisabled || isNextLoading}
                  onClick={onNext}
                  className={`inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white transition-all shadow-md cursor-pointer ${
                    isNextDisabled || isNextLoading
                      ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25 active:scale-[0.98]"
                  }`}
                >
                  <span>{isNextLoading ? "Saving..." : nextLabel}</span>
                  {!isNextLoading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Trust & Privacy Footer Note */}
      <footer className="py-4 text-center text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-900">
        <span>Protected by Shipra Open-Source Security &bull; End-to-end encrypted</span>
      </footer>
    </div>
  );
};
