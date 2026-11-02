'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Rocket, ArrowRight, Folder, Terminal } from "@/components/icons";

export default function DeprecatedUploadRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the real project & build pipeline
    const timer = setTimeout(() => {
      router.replace("/dashboard/apps/new");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <Terminal className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Upgraded to Real Build Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Direct drag-and-drop binary uploads have been upgraded to truthful repository analysis, reproducible builds, and separate tester distribution.
          </p>
        </div>

        <div>
          <Link
            href="/dashboard/apps/new"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all"
          >
            <span>Start New Real Build Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
