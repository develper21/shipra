"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Users, CheckCircle2, AlertCircle, ArrowRight, Shield, Loader2 } from "@/components/icons";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

interface InviteDetails {
  email: string;
  role: string;
  workspace: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
}

export default function WorkspaceInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/v1/invites/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error?.message || "Invalid or expired invitation");
        }
        return res.json();
      })
      .then((res) => {
        setInvite(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/invites/${token}/accept`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || "Failed to accept invite");
      }

      setAccepted(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Accept failed";
      setError(message);
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-400">Verifying team invitation...</p>
            </div>
          ) : error ? (
            <div className="py-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Invitation Expired or Invalid</h2>
              <p className="text-sm text-slate-400 mb-6">{error}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : accepted ? (
            <div className="py-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to the Team!</h2>
              <p className="text-sm text-slate-400 mb-4">
                You have successfully joined <span className="text-white font-medium">{invite?.workspace.name}</span>. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7" />
              </div>

              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Team Invitation</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-2">Join {invite?.workspace.name}</h2>
              <p className="text-sm text-slate-400 mb-6">
                You have been invited to collaborate with the role of{" "}
                <span className="text-blue-400 font-semibold capitalize">{invite?.role}</span>.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Workspace</span>
                  <span className="text-slate-200 font-medium">{invite?.workspace.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invited Email</span>
                  <span className="text-slate-200 font-medium">{invite?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Permissions</span>
                  <span className="text-emerald-400 font-medium capitalize">{invite?.role} Access</span>
                </div>
              </div>

              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 mb-3"
              >
                {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept Invitation"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Protected by Shipra RBAC Policies
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
