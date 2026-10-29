import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import db from "@/lib/db";
import { z } from "zod";
export const runtime = "nodejs";
const body = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]),
});
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isOwner()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = body.safeParse(await req.json());
  if (!data.success)
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db
      .prepare("SELECT status,starts_at FROM appointments WHERE id=?")
      .get(id) as { status: string; starts_at: string } | undefined;
    if (!row) {
      db.exec("ROLLBACK");
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const allowed: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    if (!allowed[row.status]?.includes(data.data.status)) {
      db.exec("ROLLBACK");
      return NextResponse.json(
        { error: "invalid_transition" },
        { status: 409 },
      );
    }
    if (
      data.data.status === "completed" &&
      Date.parse(row.starts_at) > Date.now()
    ) {
      db.exec("ROLLBACK");
      return NextResponse.json(
        { error: "appointment_not_started" },
        { status: 409 },
      );
    }
    db.prepare(
      "UPDATE appointments SET status=?,updated_at=? WHERE id=? AND status=?",
    ).run(data.data.status, new Date().toISOString(), id, row.status);
    db.exec("COMMIT");
    return NextResponse.json({ ok: true, status: data.data.status });
  } catch {
    db.exec("ROLLBACK");
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
