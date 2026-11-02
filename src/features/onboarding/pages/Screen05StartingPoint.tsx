import React, { useState } from "react";
import { 
  GitBranch, 
  Folder, 
  UploadCloud, 
  Sparkles, 
  Check, 
  Smartphone, 
  Search, 
  ArrowRight, 
  AlertCircle 
} from "@/components/icons";

interface Screen05StartingPointProps {
  providerConnected: boolean;
  providerName?: string;
  selectedOption: "import" | "dashboard";
  selectedRepo?: string;
  selectedBranch?: string;
  onSelectOption: (option: "import" | "dashboard") => void;
  onSelectRepo: (repo: string, branch: string, framework: "React Native CLI" | "Expo") => void;
  onConnectProviderClick: () => void;
}

export const Screen05StartingPoint: React.FC<Screen05StartingPointProps> = ({
  providerConnected,
  providerName = "GitHub",
  selectedOption,
  selectedRepo,
  selectedBranch = "main",
  onSelectOption,
  onSelectRepo,
  onConnectProviderClick,
}) => {
  const [repoSearch, setRepoSearch] = useState("");

  const sampleRepos = [
    {
      id: "pulse-fitness-mobile",
      name: "developer/pulse-fitness-mobile",
      framework: "React Native CLI" as const,
      defaultBranch: "main",
      desc: "Cross-platform GPS workout tracking app",
    },
    {
      id: "hyper-chat-app",
      name: "developer/hyper-chat-app",
      framework: "Expo" as const,
      defaultBranch: "main",
      desc: "Encrypted messaging client with Expo EAS config",
    },
    {
      id: "ecommerce-store-rn",
      name: "developer/ecommerce-store-rn",
      framework: "Expo" as const,
      defaultBranch: "main",
      desc: "Catalog browser and cart with offline sync",
    },
  ];

  const filteredRepos = sampleRepos.filter((r) =>
    r.name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Choose how to start
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Pick whether to connect an existing mobile repository right now or explore the workspace first.
        </p>
      </div>

      {/* Two Large Selectable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Import existing app */}
        <div
          onClick={() => onSelectOption("import")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
            selectedOption === "import"
              ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-sm"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Folder className="w-5 h-5" />
            </div>
            {selectedOption === "import" && (
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
            Import an existing app
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Link a repository from {providerConnected ? providerName : "Git"} to automatically configure build pipelines.
          </p>
        </div>

        {/* Option 2: Start from dashboard */}
        <div
          onClick={() => onSelectOption("dashboard")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
            selectedOption === "dashboard"
              ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-sm"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
            {selectedOption === "dashboard" && (
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
            Start from dashboard
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Upload raw APK binaries directly, invite testers, or configure repositories later from the dashboard.
          </p>
        </div>
      </div>

      {/* Dynamic Sub-Panel for Import */}
      {selectedOption === "import" && (
        <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-4">
          {!providerConnected ? (
            <div className="text-center py-4 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  No Git provider connected yet
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Connect GitHub or GitLab to view and select your mobile repositories.
                </p>
              </div>
              <button
                type="button"
                onClick={onConnectProviderClick}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm"
              >
                Connect GitHub Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Select a repository from {providerName}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {sampleRepos.length} repositories found
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  placeholder="Search repository name..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Repos list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredRepos.map((repo) => {
                  const isRepoSelected = selectedRepo === repo.id;
                  return (
                    <div
                      key={repo.id}
                      onClick={() => onSelectRepo(repo.id, repo.defaultBranch, repo.framework)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isRepoSelected
                          ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">
                            {repo.name}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {repo.framework}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {repo.desc}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-zinc-400 flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span>{repo.defaultBranch}</span>
                        </span>
                        {isRepoSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
