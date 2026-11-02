import { DeploymentRecord, RealDeploymentStatus } from "@/types";

let activeDeployments: DeploymentRecord[] = [
  {
    id: "dep_5501",
    buildId: "build_10234",
    projectId: "proj_pulse",
    projectName: "Pulse Fitness Mobile",
    destination: "google_play",
    track: "internal",
    status: "submitted",
    releaseNotes: "v2.5.0 internal QA release with treadmill GPS filter",
    externalSubmissionId: "play_sub_883910",
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [
      { timestamp: "14:35:00", message: "Connecting to Google Play Developer API via service account credentials..." },
      { timestamp: "14:35:10", message: "Validated application package com.developer.pulsefitness on Google Play Console." },
      { timestamp: "14:35:35", message: "Uploading production-signed AAB bundle (v2.5.0 #250)..." },
      { timestamp: "14:36:12", message: "Targeting release track: Internal Testing (100% rollout)." },
      { timestamp: "14:36:30", message: "Draft release committed successfully. Release status: In Processing." },
    ],
  },
];

export class RealDeploymentService {
  static getDeployments(): DeploymentRecord[] {
    return activeDeployments;
  }

  static createDeployment(data: {
    buildId: string;
    projectId: string;
    projectName: string;
    destination: "google_play" | "apple_app_store";
    track: "internal" | "closed" | "open" | "production" | "testflight" | "app_store";
    releaseNotes: string;
  }): DeploymentRecord {
    const depId = `dep_${Math.floor(1000 + Math.random() * 9000)}`;

    const newDep: DeploymentRecord = {
      id: depId,
      buildId: data.buildId,
      projectId: data.projectId,
      projectName: data.projectName,
      destination: data.destination,
      track: data.track,
      status: "submitted",
      releaseNotes: data.releaseNotes,
      externalSubmissionId: `${data.destination === "google_play" ? "play" : "asc"}_sub_${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Initiating ${data.destination === "google_play" ? "Google Play Console" : "App Store Connect"} upload pipeline...`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Targeting release track: ${data.track}. Validated binary credentials and package identifier.`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          message: "Uploaded build artifact. Waiting for store verification queue.",
        },
      ],
    };

    activeDeployments = [newDep, ...activeDeployments];
    return newDep;
  }
}
