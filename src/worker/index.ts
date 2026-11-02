/**
 * AppLaunch Background Worker Process Entry Point
 * Designed to run in a container alongside Next.js for heavy APK parsing, ClamAV, and BullMQ queues
 */

import { JobQueue } from "../server/jobs";

console.log("==================================================");
console.log("AppLaunch Background Worker Process Initialized");
console.log("Modules: [process-apk, scan-apk, webhooks, analytics, cleanup]");
console.log("==================================================");

// Periodic cleanup timer every 30 minutes
setInterval(() => {
  JobQueue.runRetentionCleanup().catch((err) =>
    console.error("[Worker] Retention cleanup error:", err)
  );
}, 30 * 60 * 1000);

// Graceful termination handling
process.on("SIGINT", () => {
  console.log("[Worker] Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("[Worker] SIGTERM received. Shutting down...");
  process.exit(0);
});
