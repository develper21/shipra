import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || "https://applaunch.dev";

  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/use-cases",
    "/blog",
    "/changelog",
    "/docs",
    "/about",
    "/contact",
    "/status",
    "/legal/terms",
    "/legal/privacy",
    "/legal/aup",
    "/legal/dmca",
    "/legal/cookies",
    "/legal/refund",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/features") || route.startsWith("/pricing") ? 0.8 : 0.6,
  }));
}
