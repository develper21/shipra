import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || "https://applaunch.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/features", "/pricing", "/docs", "/blog", "/a/", "/status"],
        disallow: ["/dashboard/", "/admin/", "/api/", "/d/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
