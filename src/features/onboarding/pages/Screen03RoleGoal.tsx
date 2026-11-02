import React from "react";
import { 
  Code2, 
  Users, 
  Rocket, 
  Building, 
  Terminal, 
  Sparkles, 
  Layers, 
  UploadCloud, 
  Check, 
  Clock 
} from "@/components/icons";

interface Screen03RoleGoalProps {
  selectedRole: string;
  selectedGoal: string;
  onSelectRole: (role: string) => void;
  onSelectGoal: (goal: string) => void;
}

export const Screen03RoleGoal: React.FC<Screen03RoleGoalProps> = ({
  selectedRole,
  selectedGoal,
  onSelectRole,
  onSelectGoal,
}) => {
  const roles = [
    {
      id: "developer",
      label: "Developer",
      desc: "Building, compiling, and testing mobile apps",
      icon: Code2,
    },
    {
      id: "team_lead",
      label: "Team Lead / EM",
      desc: "Managing engineering release pipelines and QA",
      icon: Users,
    },
    {
      id: "founder",
      label: "Founder / PM",
      desc: "Shipping fast MVPs and testing builds with early adopters",
      icon: Rocket,
    },
    {
      id: "agency",
      label: "Agency / Consultant",
      desc: "Delivering client builds with custom install links",
      icon: Building,
    },
    {
      id: "student",
      label: "Student / Learner",
      desc: "Learning React Native or building hackathon projects",
      icon: Terminal,
    },
    {
      id: "other",
      label: "Other",
      desc: "Custom mobile infrastructure or platform exploration",
      icon: Sparkles,
    },
  ];

  const goals = [
    {
      id: "deploy_existing",
      title: "Deploy an existing app",
      desc: "Generate 1-tap APK download links and QR codes for testers",
      icon: UploadCloud,
    },
    {
      id: "automate_ci",
      title: "Automate builds & CI/CD",
      desc: "Auto-publish on Git commit with GitHub Actions or CLI",
      icon: Terminal,
    },
    {
      id: "manage_multiple",
      title: "Manage multiple apps",
      desc: "Centralize Android releases and channels across projects",
      icon: Layers,
    },
    {
      id: "collaborate_team",
      title: "Collaborate with a team",
      desc: "Shared workspace with member roles and tester groups",
      icon: Users,
    },
    {
      id: "explore_platform",
      title: "Explore the platform",
      desc: "Evaluating modern open-source Expo & Diawi alternatives",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          What is your role &amp; primary goal?
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          This helps us personalize your dashboard tips and documentation guides. You will always have full access to all features.
        </p>
      </div>

      {/* Part 1: Role Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          1. Select your primary role
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRole(r.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-0.5">
                  {r.label}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  {r.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 2: Primary Goal Selection */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          2. What do you want to accomplish first?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((g) => {
            const Icon = g.icon;
            const isSelected = selectedGoal === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectGoal(g.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-start space-x-3 cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800/60"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-0.5">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                    {g.desc}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
