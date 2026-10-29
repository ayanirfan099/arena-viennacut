import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import db from "@/lib/db";
export const runtime = "nodejs";
const form = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  message: z.string().trim().min(5).max(700),
});
export async function POST(req: NextRequest) {
  const x = form.safeParse(await req.json());
  if (!x.success)
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  db.prepare(
    "INSERT INTO inquiries(id,name,email,message,created_at) VALUES(?,?,?,?,?)",
  ).run(
    randomUUID(),
    x.data.name,
    x.data.email,
    x.data.message,
    new Date().toISOString(),
  );
  return NextResponse.json({ saved: true }, { status: 201 });
}
