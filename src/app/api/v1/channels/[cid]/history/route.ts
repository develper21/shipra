import { NextRequest } from "next/server";
import { ChannelService } from "@/server/services/channel.service";
import { apiSuccess } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ cid: string }> }
) {
  const params = await props.params;
  const history = await ChannelService.getHistory(params.cid);
  return apiSuccess(history);
}
