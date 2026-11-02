'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { OnboardingShell } from "@/features/onboarding/components/OnboardingShell";
import { Screen01Welcome } from "@/features/onboarding/pages/Screen01Welcome";
import { Screen02Workspace } from "@/features/onboarding/pages/Screen02Workspace";
import { Screen03RoleGoal } from "@/features/onboarding/pages/Screen03RoleGoal";
import { Screen04ProviderConnect } from "@/features/onboarding/pages/Screen04ProviderConnect";
import { Screen05StartingPoint } from "@/features/onboarding/pages/Screen05StartingPoint";
import { Screen06TeamInvite } from "@/features/onboarding/pages/Screen06TeamInvite";
import { Screen07Complete } from "@/features/onboarding/pages/Screen07Complete";
import { OnboardingState, OnboardingStepId } from "@/types";

const STORAGE_KEY = "shipra_onboarding_state_v1";

const stepMapping: Record<number, OnboardingStepId> = {
  1: "welcome",
  2: "profile_workspace",
  3: "role_goal",
  4: "connect_provider",
  5: "choose_start",
  6: "invite_team",
  7: "setup_complete",
};

export default function OnboardingWizardPage() {
  const router = useRouter();
  const { user, setUser, activeWorkspace, setActiveWorkspace, workspaces } = useApp();

  const [stepNumber, setStepNumber] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");

  // Domain state as specified in Blueprint section 4
  const [fullName, setFullName] = useState(user.name || "Aarav Sharma");
  const [workspaceName, setWorkspaceName] = useState(
    activeWorkspace?.name || `${user.name || "My"}'s Workspace`
  );
  const [workspaceSlug, setWorkspaceSlug] = useState(
    activeWorkspace?.slug ||
      (user.name || "my")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") + "-workspace"
  );
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("developer");
  const [primaryGoal, setPrimaryGoal] = useState("deploy_existing");

  const [providerConnected, setProviderConnected] = useState(false);
  const [providerName, setProviderName] = useState<"github" | "gitlab" | "bitbucket" | undefined>("github");
  const [accountName, setAccountName] = useState<string | undefined>("developer-gh");

  const [startingMode, setStartingMode] = useState<"import" | "dashboard">("dashboard");
  const [selectedRepo, setSelectedRepo] = useState<string | undefined>("developer/pulse-fitness-mobile");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [selectedFramework, setSelectedFramework] = useState<"React Native CLI" | "Expo">("React Native CLI");

  const [invites, setInvites] = useState<Array<{ email: string; role: "developer" | "viewer" | "admin" }>>([]);

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.stepNumber && parsed.stepNumber >= 1 && parsed.stepNumber <= 7) {
            setStepNumber(parsed.stepNumber);
          }
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.workspaceName) setWorkspaceName(parsed.workspaceName);
          if (parsed.workspaceSlug) setWorkspaceSlug(parsed.workspaceSlug);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.role) setRole(parsed.role);
          if (parsed.primaryGoal) setPrimaryGoal(parsed.primaryGoal);
          if (parsed.providerConnected !== undefined) setProviderConnected(parsed.providerConnected);
          if (parsed.providerName) setProviderName(parsed.providerName);
          if (parsed.accountName) setAccountName(parsed.accountName);
          if (parsed.startingMode) setStartingMode(parsed.startingMode);
          if (parsed.selectedRepo) setSelectedRepo(parsed.selectedRepo);
          if (parsed.invites) setInvites(parsed.invites);
        } catch (e) {
          console.error("Failed to parse onboarding state:", e);
        }
      }
    }
  }, []);

  // Persist current state to localStorage and server API
  const saveProgress = async (nextStep: number) => {
    const payload = {
      stepNumber: nextStep,
      currentStep: stepMapping[nextStep] || "welcome",
      fullName,
      workspaceName,
      workspaceSlug,
      companyName,
      role,
      primaryGoal,
      providerConnected,
      providerName,
      accountName,
      startingMode,
      selectedRepo,
      invites,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    try {
      await fetch("/api/v1/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Non-blocking fallback
    }
  };

  // Next Step Handlers
  const handleNext = async () => {
    setIsSaving(true);

    // Step 2 Validation: Workspace Name & Slug
    if (stepNumber === 2) {
      if (!workspaceName.trim() || workspaceName.trim().length < 2) {
        setWorkspaceError("Workspace name must be at least 2 characters");
        setIsSaving(false);
        return;
      }
      if (!workspaceSlug.trim() || !/^[a-z0-9-]+$/.test(workspaceSlug)) {
        setWorkspaceError("Workspace URL must contain only lowercase letters, numbers, and dashes");
        setIsSaving(false);
        return;
      }
      setWorkspaceError("");

      // Update active workspace in context
      setActiveWorkspace({
        ...activeWorkspace,
        name: workspaceName,
        slug: workspaceSlug,
      });

      // Update user full name
      setUser((prev) => ({ ...prev, name: fullName }));
    }

    // Step 6: Send queued team invites
    if (stepNumber === 6 && invites.length > 0) {
      try {
        await fetch("/api/v1/onboarding/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId: activeWorkspace?.id,
            invites,
          }),
        });
      } catch (err) {}
    }

    // Step 7: Completion
    if (stepNumber === 7) {
      try {
        await fetch("/api/v1/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId: activeWorkspace?.id,
            workspaceName,
          }),
        });
      } catch (err) {}

      // Clear local onboarding progress
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem("shipra_onboarding_completed", "true");
        localStorage.setItem("shipra_checklist_open", "true");
      }

      router.push("/dashboard");
      return;
    }

    const nextStep = stepNumber + 1;
    setStepNumber(nextStep);
    await saveProgress(nextStep);
    setIsSaving(false);
  };

  const handleBack = () => {
    if (stepNumber > 1) {
      const prevStep = stepNumber - 1;
      setStepNumber(prevStep);
      saveProgress(prevStep);
    }
  };

  const handleSkip = () => {
    // Optional steps (3, 4, 5, 6) can be safely skipped
    if (stepNumber === 4) {
      setProviderConnected(false);
    }
    if (stepNumber === 5) {
      setStartingMode("dashboard");
    }
    const nextStep = stepNumber + 1;
    setStepNumber(nextStep);
    saveProgress(nextStep);
  };

  // Determine dynamic CTA label per screen
  const getNextLabel = () => {
    switch (stepNumber) {
      case 1:
        return "Set up my workspace";
      case 2:
        return "Create workspace";
      case 3:
        return "Continue";
      case 4:
        return providerConnected ? "Continue with " + providerName : "Continue";
      case 5:
        return startingMode === "import" && selectedRepo ? "Use this repository" : "Continue";
      case 6:
        return invites.length > 0 ? "Send invites & continue" : "Continue";
      case 7:
        return startingMode === "import" && selectedRepo ? "Configure first project" : "Go to dashboard";
      default:
        return "Continue";
    }
  };

  const currentStepId = stepMapping[stepNumber] || "welcome";
  const canSkip = [3, 4, 5, 6].includes(stepNumber);
  const showBack = stepNumber > 1;

  return (
    <OnboardingShell
      stepNumber={stepNumber}
      totalSteps={7}
      currentStepId={currentStepId}
      onBack={handleBack}
      onNext={handleNext}
      onSkip={handleSkip}
      nextLabel={getNextLabel()}
      isNextLoading={isSaving}
      canSkip={canSkip}
      showBack={showBack}
    >
      {/* Screen 01 | Welcome */}
      {stepNumber === 1 && (
        <Screen01Welcome
          onStart={handleNext}
          onLater={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("shipra_onboarding_completed", "true");
            }
            router.push("/dashboard");
          }}
        />
      )}

      {/* Screen 02 | Profile & Workspace */}
      {stepNumber === 2 && (
        <Screen02Workspace
          fullName={fullName}
          workspaceName={workspaceName}
          workspaceSlug={workspaceSlug}
          companyName={companyName}
          onChangeFullName={setFullName}
          onChangeWorkspaceName={setWorkspaceName}
          onChangeWorkspaceSlug={setWorkspaceSlug}
          onChangeCompanyName={setCompanyName}
          error={workspaceError}
        />
      )}

      {/* Screen 03 | Role & Primary Goal */}
      {stepNumber === 3 && (
        <Screen03RoleGoal
          selectedRole={role}
          selectedGoal={primaryGoal}
          onSelectRole={setRole}
          onSelectGoal={setPrimaryGoal}
        />
      )}

      {/* Screen 04 | Connect Source Provider */}
      {stepNumber === 4 && (
        <Screen04ProviderConnect
          connectedProvider={providerConnected ? providerName : undefined}
          accountName={accountName}
          onConnect={(prov, acc) => {
            setProviderConnected(true);
            setProviderName(prov);
            setAccountName(acc);
          }}
          onDisconnect={() => {
            setProviderConnected(false);
          }}
        />
      )}

      {/* Screen 05 | Choose How to Start */}
      {stepNumber === 5 && (
        <Screen05StartingPoint
          providerConnected={providerConnected}
          providerName={providerName}
          selectedOption={startingMode}
          selectedRepo={selectedRepo}
          selectedBranch={selectedBranch}
          onSelectOption={setStartingMode}
          onSelectRepo={(r, b, f) => {
            setSelectedRepo(r);
            setSelectedBranch(b);
            setSelectedFramework(f);
          }}
          onConnectProviderClick={() => {
            setStepNumber(4);
          }}
        />
      )}

      {/* Screen 06 | Invite Your Team */}
      {stepNumber === 6 && (
        <Screen06TeamInvite
          currentUserEmail={user.email || "developer@example.com"}
          invites={invites}
          onAddInvite={(inv) => setInvites([...invites, inv])}
          onRemoveInvite={(em) => setInvites(invites.filter((i) => i.email !== em))}
        />
      )}

      {/* Screen 07 | Setup Complete */}
      {stepNumber === 7 && (
        <Screen07Complete
          workspaceName={workspaceName}
          workspaceSlug={workspaceSlug}
          providerConnected={providerConnected}
          providerName={providerName}
          startingPointType={startingMode}
          selectedRepo={selectedRepo}
          inviteCount={invites.length}
        />
      )}
    </OnboardingShell>
  );
}
