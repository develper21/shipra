import { NextRequest } from "next/server";
import { apiSuccess } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") || "github";

  // Realistic repositories for React Native and Expo projects
  const repositories = [
    {
      id: "repo_rn_01",
      name: "pulse-fitness-mobile",
      fullName: "developer/pulse-fitness-mobile",
      description: "Cross-platform workout tracker & GPS runner",
      defaultBranch: "main",
      branches: ["main", "staging", "v2-beta"],
      framework: "React Native CLI",
      isPrivate: false,
      updatedAt: "2 hours ago",
    },
    {
      id: "repo_rn_02",
      name: "hyper-chat-app",
      fullName: "developer/hyper-chat-app",
      description: "Real-time encrypted messaging client built with Expo EAS",
      defaultBranch: "main",
      branches: ["main", "preview"],
      framework: "Expo",
      isPrivate: true,
      updatedAt: "Yesterday",
    },
    {
      id: "repo_rn_03",
      name: "ecommerce-store-rn",
      fullName: "developer/ecommerce-store-rn",
      description: "Production mobile storefront with offline catalog sync",
      defaultBranch: "main",
      branches: ["main", "development"],
      framework: "Expo",
      isPrivate: false,
      updatedAt: "3 days ago",
    },
    {
      id: "repo_rn_04",
      name: "finflow-crypto-wallet",
      fullName: "developer/finflow-crypto-wallet",
      description: "Biometric hardware key authentication mobile app",
      defaultBranch: "main",
      branches: ["main", "release/v1.4"],
      framework: "React Native CLI",
      isPrivate: true,
      updatedAt: "Last week",
    },
  ];

  return apiSuccess({
    provider,
    total: repositories.length,
    repositories,
  });
}
