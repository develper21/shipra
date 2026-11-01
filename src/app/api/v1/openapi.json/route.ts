import { NextResponse } from "next/server";

export async function GET() {
  const openApiDoc = {
    openapi: "3.0.3",
    info: {
      title: "AppLaunch API",
      version: "1.0.0",
      description:
        "Open-source Android mobile app deployment & distribution platform API (Next.js + PostgreSQL + Cloudflare R2).",
      contact: {
        name: "AppLaunch Core Team",
        url: "https://applaunch.dev",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "Primary API v1 Gateway",
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "applaunch_session",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "apl_live_token",
        },
      },
    },
    paths: {
      "/auth/signup": {
        post: {
          summary: "User registration with auto workspace creation",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: { "201": { description: "User created" } },
        },
      },
      "/auth/login": {
        post: {
          summary: "User authentication",
          responses: { "200": { description: "Session created" } },
        },
      },
      "/workspaces": {
        get: {
          summary: "List user workspaces",
          responses: { "200": { description: "Workspaces list" } },
        },
      },
      "/apps/{id}/uploads": {
        post: {
          summary: "Initialize APK multipart upload",
          responses: { "201": { description: "Upload initialized" } },
        },
      },
      "/public/check-update": {
        get: {
          summary: "In-app update check SDK",
          responses: { "200": { description: "Update status" } },
        },
      },
    },
  };

  return NextResponse.json(openApiDoc, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
