import { NextResponse } from "next/server";

export async function GET() {
  const statusData = {
    indicator: "none",
    description: "All Systems Operational",
    updatedAt: new Date().toISOString(),
    uptime90DaysPercent: 99.98,
    components: [
      { name: "Public App Pages (CDN)", status: "operational", uptimePercent: 100.0 },
      { name: "Direct APK Downloads (Cloudflare R2)", status: "operational", uptimePercent: 99.99 },
      { name: "Upload API & Parser Engine", status: "operational", uptimePercent: 99.95 },
      { name: "Antivirus Scanning (ClamAV & VT)", status: "operational", uptimePercent: 99.92 },
      { name: "Webhooks & Notifications", status: "operational", uptimePercent: 99.98 },
      { name: "Dashboard & Team Portal", status: "operational", uptimePercent: 100.0 },
    ],
    incidents: [],
  };

  return NextResponse.json(statusData);
}
