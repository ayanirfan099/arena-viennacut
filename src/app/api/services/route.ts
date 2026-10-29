import { NextResponse } from "next/server";
import { services, barbers } from "@/lib/data";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({ services, barbers, timezone: "Europe/Vienna" });
}
