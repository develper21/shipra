'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { Invoice } from '@/types';
import { 
  CreditCard, 
  Check, 
  Download, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  HardDrive, 
  Activity, 
  ArrowRight,
  QrCode,
  Tag
} from "@/components/icons";

export default function BillingPage() {
  const { activeWorkspace } = useApp();
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'team'>('pro');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<'Pro' | 'Team'>('Team');
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'razorpay'>('stripe');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeWorkspace) {
      setCurrentPlan(activeWorkspace.plan as 'free' | 'pro' | 'team' || 'free');
      api.getWorkspaceBilling(activeWorkspace.id).then((res) => {
        if (res.data) {
          if (res.data.plan) setCurrentPlan(res.data.plan);
          if (res.data.invoices && Array.isArray(res.data.invoices)) {
            setInvoices(res.data.invoices);
          }
        }
      });
    }
  }, [activeWorkspace]);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    const res = await api.applyCoupon(promoCode);
    if (res.data?.discountPercent) {
      setPromoDiscount(res.data.discountPercent);
      alert(`${res.data.discountPercent}% Promotional Discount Applied!`);
    } else if (promoCode.toUpperCase() === 'OPENSOURCE' || promoCode.toUpperCase() === 'BUILDINDIA') {
      setPromoDiscount(20);
      alert('20% Promotional Discount Applied!');
    } else {
      alert(res.error?.message || 'Invalid coupon code. Try: OPENSOURCE');
    }
  };

  const handleSimulatePayment = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    const res = await api.createCheckout(activeWorkspace.id, {
      plan: targetUpgradePlan.toLowerCase(),
      gateway: paymentProvider,
      coupon: promoDiscount > 0 ? promoCode : undefined,
    });
    setLoading(false);

    if (res.error) {
      alert(`Checkout error: ${res.error.message}`);
      return;
    }

    alert(`Payment initiated/successful via ${paymentProvider === 'stripe' ? 'Stripe (Global Card)' : 'Razorpay (UPI / NetBanking)'}! Workspace upgraded.`);
    setCurrentPlan(targetUpgradePlan.toLowerCase() as typeof currentPlan);
    setCheckoutModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Billing, Plans &amp; Invoices
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your workspace subscription tier, usage quotas, and download GST tax receipts.
          </p>
        </div>

        {/* Current Plan Card (BIL-01, BIL-05) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-zinc-900 to-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 uppercase">
              Current Active Plan
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {currentPlan === 'free' ? 'Free Forever' : currentPlan === 'pro' ? 'Pro Developer ($19/mo)' : 'Team Studio ($49/mo)'}
            </h2>
            <p className="text-xs text-zinc-400 max-w-md">
              Next renewal on June 01, 2025. Includes 50 GB storage, unlimited APK releases, and 300 cloud build minutes.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setTargetUpgradePlan('Team'); setCheckoutModalOpen(true); }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              Change Subscription Plan (BIL-03)
            </button>
          </div>
        </div>

        {/* Usage Quotas Grid (BIL-05) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 text-xs">
            <span className="text-zinc-500 font-semibold">Storage Meter (50 GB Cap)</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">18.4</span>
              <span className="text-zinc-400">GB Used</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '36%' }} />
            </div>
            <span className="text-[10px] text-zinc-400">31.6 GB available</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 text-xs">
            <span className="text-zinc-500 font-semibold">Edge Bandwidth (1 TB Cap)</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">240</span>
              <span className="text-zinc-400">GB Transferred</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '24%' }} />
            </div>
            <span className="text-[10px] text-zinc-400">Resets in 12 days</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 text-xs">
            <span className="text-zinc-500 font-semibold">Cloud Build Runners</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">38</span>
              <span className="text-zinc-400">/ 300 mins used</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }} />
            </div>
            <span className="text-[10px] text-zinc-400">262 minutes remaining</span>
          </div>
        </div>

        {/* Invoices List with GST Tax ID Support (BIL-04, BIL-10) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Invoices &amp; Tax Receipts (BIL-04)
              </h3>
              <p className="text-xs text-zinc-500">Download past invoices with India GST / US EIN details.</p>
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">GSTIN: 29AABCU9603R1ZM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Invoice Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Plan Description</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-white">{inv.number}</td>
                    <td className="py-3 px-3 text-zinc-500">{inv.date}</td>
                    <td className="py-3 px-3 font-medium text-zinc-700 dark:text-zinc-300">{inv.plan}</td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-white">
                      ${inv.amount.toFixed(2)} USD
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Downloading PDF for invoice ${inv.number}`)}
                        className="p-1 text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Download PDF Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checkout Modal (BIL-02 Stripe & Razorpay simulation) */}
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Upgrade to {targetUpgradePlan} Plan
                </h3>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Provider Selector (BIL-02) */}
              <div>
                <label className="font-semibold block mb-2">Select Payment Gateway</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('stripe')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentProvider === 'stripe'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
                    }`}
                  >
                    Stripe (Credit / Debit Cards)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('razorpay')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentProvider === 'razorpay'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
                    }`}
                  >
                    Razorpay (India UPI / NetBanking)
                  </button>
                </div>
              </div>

              {/* Promo Code Input (BIL-07) */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (Try: OPENSOURCE)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono text-xs uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Apply
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal:</span>
                  <span className="font-mono">{targetUpgradePlan === 'Team' ? '$49.00' : '$19.00'}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Discount (20%):</span>
                    <span>-${(targetUpgradePlan === 'Team' ? 49 * 0.2 : 19 * 0.2).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-1 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white">
                  <span>Total Due Today:</span>
                  <span>${((targetUpgradePlan === 'Team' ? 49 : 19) * (1 - promoDiscount / 100)).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Confirm &amp; Pay with {paymentProvider === 'stripe' ? 'Stripe' : 'Razorpay UPI'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
