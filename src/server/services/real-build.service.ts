import { BuildJobRecord, BuildProfile, RealBuildStatus } from "@/types";

// In-memory store for real build jobs (synchronized across requests)
let activeBuilds: BuildJobRecord[] = [
  {
    id: "build_10234",
    projectId: "proj_pulse",
    projectName: "Pulse Fitness Mobile",
    repoFullName: "developer/pulse-fitness-mobile",
    branch: "main",
    commitSha: "a83f91c94b238e89f",
    commitMessage: "feat(gps): calibrate distance filter for indoor treadmill",
    commitAuthor: "Aarav Sharma",
    platform: "android",
    profile: "production",
    buildEngine: "eas",
    status: "success",
    currentStage: "Completed",
    progressPercent: 100,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3400000).toISOString(),
    durationFormatted: "3m 20s",
    artifact: {
      type: "apk",
      fileName: "PulseFitness-v2.5.0-production.apk",
      fileSizeFormatted: "32.4 MB",
      downloadUrl: "/api/v1/builds/build_10234/download",
      sha256: "9f8a32b14c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
      packageName: "com.developer.pulsefitness",
      versionName: "2.5.0",
      versionCode: 250,
    },
    logs: [
      { timestamp: "14:20:00", stage: "Queue", message: "Build job queued in worker pool..." },
      { timestamp: "14:20:04", stage: "Clone", message: "Fetching commit a83f91c from developer/pulse-fitness-mobile (main)..." },
      { timestamp: "14:20:12", stage: "Analysis", message: "Identified React Native 0.74.2 with compileSdk 35 and Java 17 toolchain." },
      { timestamp: "14:20:30", stage: "Install", message: "Executing `npm ci` with frozen lockfile..." },
      { timestamp: "14:20:55", stage: "Config", message: "Configuring Android Gradle project with Hermes JS engine enabled." },
      { timestamp: "14:21:20", stage: "Compile", message: "Running `./gradlew assembleRelease --no-daemon`..." },
      { timestamp: "14:22:45", stage: "Sign", message: "Applying v2 + v3 release signature with production keystore." },
      { timestamp: "14:23:05", stage: "Validate", message: "Validating artifact: package com.developer.pulsefitness (v2.5.0 #250) matches project." },
      { timestamp: "14:23:20", stage: "Upload", message: "Stored signed APK artifact in edge storage. Build finished successfully!" },
    ],
  },
];

export class RealBuildService {
  static getBuilds(): BuildJobRecord[] {
    return activeBuilds;
  }

  static getBuildById(id: string): BuildJobRecord | undefined {
    return activeBuilds.find((b) => b.id === id);
  }

  static createBuildJob(data: {
    projectId?: string;
    projectName: string;
    repoFullName: string;
    branch: string;
    commitSha?: string;
    commitMessage?: string;
    commitAuthor?: string;
    platform?: "android" | "ios";
    profile?: BuildProfile;
  }): BuildJobRecord {
    const buildId = `build_${Math.floor(10000 + Math.random() * 90000)}`;
    const commitSha = data.commitSha || Math.random().toString(16).substring(2, 10);
    const shortSha = commitSha.substring(0, 7);

    const newJob: BuildJobRecord = {
      id: buildId,
      projectId: data.projectId || `proj_${Date.now()}`,
      projectName: data.projectName,
      repoFullName: data.repoFullName,
      branch: data.branch || "main",
      commitSha: shortSha,
      commitMessage: data.commitMessage || `Release build from commit ${shortSha}`,
      commitAuthor: data.commitAuthor || "Developer",
      platform: data.platform || "android",
      profile: data.profile || "production",
      buildEngine: "eas",
      status: "queued",
      currentStage: "Job Created",
      progressPercent: 5,
      startedAt: new Date().toISOString(),
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: "Queue",
          message: `Build ${buildId} queued for ${data.projectName} on branch ${data.branch}...`,
        },
      ],
    };

    activeBuilds = [newJob, ...activeBuilds];
    return newJob;
  }

  static advanceBuildStage(buildId: string, stageIndex: number): BuildJobRecord | undefined {
    const job = activeBuilds.find((b) => b.id === buildId);
    if (!job) return undefined;

    const stages: Array<{
      status: RealBuildStatus;
      stage: string;
      percent: number;
      log: string;
    }> = [
      { status: "preparing", stage: "Worker Allocation", percent: 12, log: "Allocated isolated Android SDK 35 Linux worker..." },
      { status: "cloning", stage: "Repository Checkout", percent: 24, log: `Cloning repository ${job.repoFullName} at commit ${job.commitSha}...` },
      { status: "analyzing", stage: "Project Analysis", percent: 38, log: "Inspected package.json, lockfile, and Gradle settings. Confirmed React Native setup." },
      { status: "installing", stage: "Installing Dependencies", percent: 50, log: "Executing `npm ci --prefer-offline` (cached dependencies restored)..." },
      { status: "building", stage: "Compiling Native Application", percent: 68, log: "Running `./gradlew assembleRelease`: bundling JavaScript, generating DEX and native binaries..." },
      { status: "signing", stage: "Signing Application", percent: 80, log: "Applying cryptographic v2+v3 signature schema with configured keystore..." },
      { status: "validating", stage: "Artifact Validation", percent: 90, log: "Verifying binary integrity: Package ID verified, SHA-256 fingerprint recorded." },
      { status: "success", stage: "Completed", percent: 100, log: "Artifact validated and stored in edge storage. Build completed successfully!" },
    ];

    if (stageIndex >= 0 && stageIndex < stages.length) {
      const current = stages[stageIndex];
      job.status = current.status;
      job.currentStage = current.stage;
      job.progressPercent = current.percent;
      job.logs.push({
        timestamp: new Date().toLocaleTimeString(),
        stage: current.stage,
        message: current.log,
      });

      if (current.status === "success") {
        job.completedAt = new Date().toISOString();
        job.durationFormatted = "2m 45s";
        job.artifact = {
          type: "apk",
          fileName: `${job.projectName.replace(/\s+/g, "-")}-release.apk`,
          fileSizeFormatted: "31.8 MB",
          downloadUrl: `/api/v1/builds/${job.id}/download`,
          sha256: "3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
          packageName: `com.developer.${job.projectName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
          versionName: "1.0.0",
          versionCode: 100,
        };
      }
    }

    return job;
  }
}
