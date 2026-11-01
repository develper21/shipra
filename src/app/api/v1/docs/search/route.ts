import { NextRequest } from "next/server";
import { apiSuccess } from "@/server/lib/response";

const DOCS_INDEX = [
  {
    title: "Quickstart Guide",
    slug: "quickstart",
    description: "Get started deploying your first Android APK in under 2 minutes.",
    category: "Getting Started",
  },
  {
    title: "CI/CD & GitHub Actions",
    slug: "ci-cd-integration",
    description: "Automate build uploads using AppLaunch CLI and GitHub Actions workflows.",
    category: "Automation",
  },
  {
    title: "CLI Reference",
    slug: "cli-reference",
    description: "Command line reference for applaunch auth, upload, channels, and tokens.",
    category: "Developer Tools",
  },
  {
    title: "In-App Updates SDK",
    slug: "in-app-updates",
    description: "Integrate automatic in-app APK update prompts in your React Native or Flutter app.",
    category: "SDK",
  },
  {
    title: "Security & Antivirus Scanning",
    slug: "security-scanning",
    description: "How ClamAV and VirusTotal heuristics protect your distribution pipeline.",
    category: "Security",
  },
  {
    title: "Phased Rollouts & Channels",
    slug: "channels-rollouts",
    description: "Promoting builds between internal, beta, and production channels.",
    category: "Release Management",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (!q) {
    return apiSuccess(DOCS_INDEX);
  }

  const matches = DOCS_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );

  return apiSuccess(matches);
}
