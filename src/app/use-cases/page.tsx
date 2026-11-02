'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Shield, 
  Smartphone,
  Share2,
  Users
} from "@/components/icons";

export default function UseCasesPage() {
  const useCases = [
    {
      id: 'freelancers',
      title: 'For Freelancers & Consultants',
      badge: 'Client Handoffs',
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      description: 'Deliver preview APKs to non-technical clients smoothly without demanding they install TestFlight or register a Google Tester account.',
      benefits: [
        'Branded install page with your agency or freelancer name and logo',
        'Password-protected download links to prevent unauthorized leaks of client IP',
        'Permanent /latest link so clients can always test the newest revision without asking for a new file',
        'Smart QR code: clients scan from their computer screen directly onto their Android phone'
      ],
      quote: '“My clients used to struggle with Google Play Internal track invites. With Shipra, I just text them one link and they install it in 15 seconds.”'
    },
    {
      id: 'startups',
      title: 'For High-Growth Startups',
      badge: 'Continuous Delivery',
      icon: Rocket,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
      description: 'Ship multiple builds daily across engineering, product management, and executive teams without bottlenecking behind store reviews.',
      benefits: [
        'Automated CI/CD deployment via official GitHub Action or REST API token',
        'Multi-channel separation (Production, Beta, Internal Staging)',
        'Instant rollback button if a regression slips through to the team',
        'Webhook alerts to Slack and Discord notifying your team whenever a build completes'
      ],
      quote: '“We cut our sprint testing cycle from 48 hours down to 10 minutes. Continuous deployment for Android is finally as fast as web.”'
    },
    {
      id: 'students',
      title: 'For Students & Indie Hackers',
      badge: '100% Free Forever',
      icon: GraduationCap,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      description: 'Distribute your personal projects, hackathon prototypes, and portfolio apps without having to pay $25 developer account fees or monthly hosting fees.',
      benefits: [
        'Generous free plan with unlimited uploads and 5 GB storage',
        'No credit card required to sign up or publish builds',
        'Public portfolio page showcasing all your built applications',
        'Works with whatever you are learning: Flutter, React Native, Kotlin, or Unity'
      ],
      quote: '“As a college student building side-projects, paying monthly fees just to test APKs with my friends was impossible. Shipra made it frictionless.”'
    },
    {
      id: 'qa-teams',
      title: 'For QA & Testing Agencies',
      badge: 'Test Orchestration',
      icon: Users,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      description: 'Equip your QA team with granular version tracking, side-by-side build diffing, and device telemetry.',
      benefits: [
        'Compare two builds side-by-side to review permission additions and binary size deltas',
        'Tester groups (QA Engineers, Beta Cohort, VIP Testers) with bulk CSV invitation',
        'In-app feedback collection: testers submit device model, OS version, and bug descriptions',
        'Audit trail verifying who published which binary build and when'
      ],
      quote: '“Our QA engineers test across 25 different Android devices daily. The QR code generator and ABI compatibility tags save us dozens of hours.”'
    }
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
            Tailored Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Built for Every Mobile Creator
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Discover how Shipra accelerates release cycles across solo builders, high-velocity startups, and enterprise testing teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${uc.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                    {uc.description}
                  </p>

                  <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-5 mb-6 text-xs">
                    {uc.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-2.5 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 text-xs italic text-zinc-600 dark:text-zinc-400">
                  {uc.quote}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center space-y-4 shadow-xl shadow-indigo-500/20">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to distribute your apps seamlessly?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
            Get started in under 30 seconds with no credit card required.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold bg-white text-indigo-600 hover:bg-zinc-100 shadow-md transition-all cursor-pointer"
            >
              <span>Upload Your First Build</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
