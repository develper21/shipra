import React, { useState } from "react";
import { 
  Github, 
  Gitlab, 
  Bitbucket, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink 
} from "@/components/icons";

interface Screen04ProviderConnectProps {
  connectedProvider?: "github" | "gitlab" | "bitbucket";
  accountName?: string;
  onConnect: (provider: "github" | "gitlab" | "bitbucket", accountName: string) => void;
  onDisconnect: () => void;
}

export const Screen04ProviderConnect: React.FC<Screen04ProviderConnectProps> = ({
  connectedProvider,
  accountName,
  onConnect,
  onDisconnect,
}) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleSimulateOAuth = (provider: "github" | "gitlab" | "bitbucket") => {
    setConnecting(provider);
    setTimeout(() => {
      setConnecting(null);
      const name = provider === "github" ? "developer-gh" : provider === "gitlab" ? "developer-gl" : "developer-bb";
      onConnect(provider, name);
    }, 600);
  };

  const providers = [
    {
      id: "github" as const,
      name: "GitHub",
      badge: "Recommended",
      icon: Github,
      color: "text-zinc-900 dark:text-white",
      desc: "Import repositories, trigger CI builds, and sync release tags automatically.",
    },
    {
      id: "gitlab" as const,
      name: "GitLab",
      badge: "Supported",
      icon: Gitlab,
      color: "text-orange-500",
      desc: "Connect GitLab.com or self-hosted GitLab CI/CD runner pipelines.",
    },
    {
      id: "bitbucket" as const,
      name: "Bitbucket",
      badge: "Supported",
      icon: Bitbucket,
      color: "text-blue-500",
      desc: "Deploy mobile builds directly from Bitbucket Cloud repositories.",
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Optional Step &bull; Can be skipped</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Connect a source-control provider
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Connecting code hosting allows Shipra to detect React Native / Expo projects and automate release publishing. You can also skip this and upload APK binaries directly.
        </p>
      </div>

      {/* Provider Cards */}
      <div className="space-y-3.5">
        {providers.map((p) => {
          const Icon = p.icon;
          const isConnected = connectedProvider === p.id;
          const isBusy = connecting === p.id;

          return (
            <div
              key={p.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isConnected
                  ? "border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {p.name}
                    </h3>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {p.badge}
                    </span>
                    {isConnected && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isConnected ? `Connected as @${accountName} (read-only scopes)` : p.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-2 sm:self-center">
                {isConnected ? (
                  <button
                    type="button"
                    onClick={onDisconnect}
                    className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleSimulateOAuth(p.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? (
                      <span className="flex items-center space-x-1.5">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Connecting...</span>
                      </span>
                    ) : (
                      <span>Connect {p.name}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Transparency Box */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5">
        <div className="flex items-center space-x-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span>Requested Permissions (Least Privilege):</span>
        </div>
        <p className="leading-relaxed">
          Shipra only requests read-only repository metadata and webhook events to build and distribute APKs. We never request organization admin rights or code push rights without explicit user authorization.
        </p>
      </div>
    </div>
  );
};
