import { NextRequest, NextResponse } from "next/server";
import { DistributionService } from "@/server/services/distribution.service";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ token: string }> }
) {
  const params = await props.params;
  const ip = req.headers.get("x-forwarded-for") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;
  const passwordHeader = req.cookies.get(`link_pwd_${params.token}`)?.value || null;

  try {
    const result = await DistributionService.resolveDownload(params.token, {
      ip,
      userAgent,
      passwordHeader,
    });

    if (result.requiresPassword) {
      // Redirect to password unlock prompt page
      return NextResponse.redirect(new URL(`/d/${params.token}/unlock`, req.url));
    }

    if (!result.signedUrl) {
      return new NextResponse("Download unavailable", { status: 404 });
    }

    // 302 redirect directly to signed Cloudflare R2 download URL
    return NextResponse.redirect(result.signedUrl, {
      status: 302,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Download failed";
    return new NextResponse(`Download Error: ${message}`, { status: 400 });
  }
}
