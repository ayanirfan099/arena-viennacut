import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSlots } from "@/lib/scheduler";
export const runtime = "nodejs";
const query = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service: z.string(),
  barber: z.string().default("any"),
});
export async function GET(req: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  return NextResponse.json({
    slots: getSlots(parsed.data.date, parsed.data.service, parsed.data.barber),
  });
}
