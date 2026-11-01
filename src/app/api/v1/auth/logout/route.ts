import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get("applaunch_session")?.value;

  if (sessionToken) {
    await AuthService.logout(sessionToken).catch(() => {});
  }

  const res = apiSuccess({ success: true, message: "Logged out successfully" });
  res.cookies.set("applaunch_session", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
