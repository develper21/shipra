import crypto from "crypto";
import { DistributionRecord } from "@/types";

let activeDistributions: DistributionRecord[] = [
  {
    id: "dist_9021",
    buildId: "build_10234",
    projectId: "proj_pulse",
    projectName: "Pulse Fitness Mobile",
    method: "android_direct_download",
    status: "available",
    accessMode: "link",
    shareToken: "test_pf_live_a83f9",
    shareUrl: "https://shipra.dev/test/test_pf_live_a83f9",
    downloadCount: 18,
    installPromptGuide: true,
    expiresAt: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export class RealDistributionService {
  static getDistributions(): DistributionRecord[] {
    return activeDistributions;
  }

  static getDistributionByToken(token: string): DistributionRecord | undefined {
    return activeDistributions.find((d) => d.shareToken === token);
  }

  static createDistribution(data: {
    buildId: string;
    projectId: string;
    projectName: string;
    method?: "android_direct_download" | "testflight" | "adhoc";
    accessMode?: "link" | "workspace_auth" | "invited_testers";
    expiresInDays?: number;
  }): DistributionRecord {
    const rawToken = `test_${crypto.randomBytes(8).toString("hex")}`;
    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const record: DistributionRecord = {
      id: `dist_${Math.floor(1000 + Math.random() * 9000)}`,
      buildId: data.buildId,
      projectId: data.projectId,
      projectName: data.projectName,
      method: data.method || "android_direct_download",
      status: "available",
      accessMode: data.accessMode || "link",
      shareToken: rawToken,
      shareUrl: `https://shipra.dev/test/${rawToken}`,
      downloadCount: 0,
      installPromptGuide: true,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    activeDistributions = [record, ...activeDistributions];
    return record;
  }

  static revokeDistribution(id: string): boolean {
    const dist = activeDistributions.find((d) => d.id === id);
    if (dist) {
      dist.status = "revoked";
      return true;
    }
    return false;
  }

  static recordDownload(token: string): void {
    const dist = activeDistributions.find((d) => d.shareToken === token);
    if (dist) {
      dist.downloadCount += 1;
    }
  }
}
