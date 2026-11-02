'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap } from "@/components/icons";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free Forever',
      badge: 'Open-Source & Solo',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Ideal for indie developers, students, and open-source project distribution.',
      features: [
        'Unlimited APK uploads',
        'Up to 3 Active Apps',
        '5 GB Cloudflare R2 Storage',
        '100 GB Monthly Bandwidth',
        '7-day build retention policy',
        'Permanent /latest share link',
        'Automated ClamAV virus scan',
        'Community Discord support'
      ],
      ctaText: 'Start For Free',
      ctaHref: '/dashboard/upload',
      popular: false
    },
    {
      name: 'Pro Developer',
      badge: 'Most Popular',
      priceMonthly: 19,
      priceYearly: 15,
      description: 'For freelance app engineers and fast-moving software development consultancies.',
      features: [
        'Unlimited APK uploads & downloads',
        'Unlimited Active Apps',
        '50 GB Fast Storage',
        '1 TB Monthly Bandwidth',
        '90-day build retention policy',
        'Multi-channel: Production, Beta, Internal',
        'Password-protected download links',
        'Email whitelist & download limiters',
        '300 Cloud Build minutes/month',
        'ClamAV + VirusTotal 72-engine scans',
        'Priority email & Slack support'
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/dashboard/billing',
      popular: true
    },
    {
      name: 'Team & Studio',
      badge: 'Agencies & Enterprise',
      priceMonthly: 49,
      priceYearly: 39,
      description: 'For growing teams requiring role-based permissions, custom branding, and audit logs.',
      features: [
        'Everything in Pro Developer',
        'Unlimited Team Members with roles (Owner, Admin, Developer, Viewer)',
        '250 GB Storage & 5 TB Bandwidth',
        'Permanent build archive retention',
        '1,200 Cloud Build minutes/month',
        'Team-level audit log with IP history',
        'Custom domain support (download.myagency.com)',
        'Full REST API & Webhooks with 99.9% SLA',
        'Invoice with India GST / US Tax ID support'
      ],
      ctaText: 'Get Team Workspace',
      ctaHref: '/dashboard/billing',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'Why is Shipra free for open source and solo developers?',
      a: 'We believe distributing Android builds for QA testing shouldn\'t be gated behind costly monthly subscriptions. Storage and bandwidth on Cloudflare R2 are cost-efficient, allowing us to offer a generous free tier.'
    },
    {
      q: 'Can I distribute Flutter, React Native, and native Android APKs?',
      a: 'Yes! Shipra is completely framework-agnostic. Any valid Android .apk file created using Flutter, React Native, Expo, Android Studio (Kotlin/Java), Unity, or Capacitor works instantly.'
    },
    {
      q: 'How does malware scanning work?',
      a: 'Every APK uploaded to Shipra runs through our automated heuristics pipeline powered by ClamAV and VirusTotal. If an APK contains adware, trojans, or unauthorized accessibility service hijacks, it is quarantined immediately before any public link is generated.'
    },
    {
      q: 'Do you support Indian payment methods like UPI and RuPay?',
      a: 'Yes. In addition to global Stripe credit cards, we support Razorpay with instant UPI QR, NetBanking, and GST compliance for Indian businesses and freelancers.'
    },
    {
      q: 'Can I cancel or downgrade anytime?',
      a: 'Absolutely. You can downgrade to the Free Forever plan or cancel subscription directly from your Dashboard settings with one click. Your existing public links will remain active.'
    }
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Honest Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Simple Plans for Every Stage
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            Distribute without worrying about surprise bandwidth charges. Upgrade whenever you need cloud build runners or team access.
          </p>

          {/* Monthly / Yearly Toggle (PUB-05) */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500 text-white font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
          {plans.map((plan, idx) => {
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            return (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-3xl p-8 transition-all ${
                  plan.popular
                    ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-zinc-900 shadow-2xl shadow-indigo-500/10 relative -translate-y-2'
                    : 'border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{plan.name}</h3>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        plan.popular
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline space-x-1 mb-8">
                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {price === 0 ? '' : '/ month'} {billingCycle === 'yearly' && price > 0 && '(billed annually)'}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-8 text-xs">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                      Included Capabilities
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-xl font-semibold text-xs text-center transition-all ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Billing FAQ (PUB-05) */}
        <div className="max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Frequently Asked Billing Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Have a custom request or enterprise inquiry? Reach our team directly at billing@shipra.dev
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-2 flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
