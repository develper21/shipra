import React, { useState } from "react";
import { Users, Plus, X, Mail, Shield, CheckCircle2 } from "@/components/icons";

interface TeamInvite {
  email: string;
  role: "developer" | "viewer" | "admin";
}

interface Screen06TeamInviteProps {
  currentUserEmail: string;
  invites: TeamInvite[];
  onAddInvite: (invite: TeamInvite) => void;
  onRemoveInvite: (email: string) => void;
}

export const Screen06TeamInvite: React.FC<Screen06TeamInviteProps> = ({
  currentUserEmail,
  invites,
  onAddInvite,
  onRemoveInvite,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<"developer" | "viewer" | "admin">("developer");
  const [inputError, setInputError] = useState("");

  const handleAdd = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setInputError("Please enter a valid email address");
      return;
    }

    if (trimmed === currentUserEmail.toLowerCase()) {
      setInputError("You are already the workspace owner");
      return;
    }

    if (invites.some((inv) => inv.email.toLowerCase() === trimmed)) {
      setInputError("This email has already been added to the invite list");
      return;
    }

    setInputError("");
    onAddInvite({ email: trimmed, role: selectedRole });
    setEmailInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Optional &bull; Solo devs can skip</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Invite your team
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Add engineers, QA testers, or stakeholders to collaborate on Android releases. You can always invite members later from workspace settings.
        </p>
      </div>

      {/* Email and Role Input Box */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Invite teammates by email
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (inputError) setInputError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="colleague@company.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
            />
          </div>

          <div className="flex space-x-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as "developer" | "viewer" | "admin")}
              className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {inputError && (
          <p className="text-xs text-rose-500 font-medium">{inputError}</p>
        )}
      </div>

      {/* Added Invites List */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
          Pending Invitations ({invites.length})
        </span>

        {invites.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
            No teammates added yet. You can invite your team now or proceed solo.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {invites.map((inv) => (
              <div
                key={inv.email}
                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                    {inv.email[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {inv.email}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {inv.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveInvite(inv.email)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                  title="Remove invitee"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seat Allowance Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Free plan includes up to 5 collaborators with RBAC permissions.</span>
        </div>
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {invites.length} / 5 seats queued
        </span>
      </div>
    </div>
  );
};
