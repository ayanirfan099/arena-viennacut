import { NextRequest, NextResponse } from "next/server";
import { randomUUID, createHash } from "node:crypto";
import { z } from "zod";
import db from "@/lib/db";
import { localToUtc, getSlots } from "@/lib/scheduler";
export const runtime = "nodejs";
type ExistingBooking = {
  reference: string;
  starts_at: string;
  service_id: string;
  barber_id: string;
  status: string;
};
const schema = z.object({
  serviceId: z.string(),
  barberId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  phone: z.string().trim().min(5).max(32),
  notes: z.string().max(500).default(""),
  idempotencyKey: z.string().min(16).max(100),
});
export async function POST(req: NextRequest) {
  try {
    const raw = await req.json(),
      parsed = schema.safeParse(raw);
    if (!parsed.success)
      return NextResponse.json(
        { error: "invalid_fields", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    const x = parsed.data;
    const existing = db
      .prepare(
        "SELECT reference,starts_at,service_id,barber_id,status FROM appointments WHERE id=?",
      )
      .get(createHash("sha256").update(x.idempotencyKey).digest("hex")) as
      | ExistingBooking
      | undefined;
    if (existing)
      return NextResponse.json({
        booking: {
          reference: existing.reference,
          startsAt: existing.starts_at,
          serviceId: existing.service_id,
          barberId: existing.barber_id,
          status: existing.status,
        },
      });
    const service = db
      .prepare("SELECT price,duration FROM services WHERE id=? AND active=1")
      .get(x.serviceId) as { price: number; duration: number } | undefined;
    if (!service)
      return NextResponse.json(
        { error: "service_unavailable" },
        { status: 409 },
      );
    const barber = db
      .prepare("SELECT id FROM barbers WHERE id=? AND active=1")
      .get(x.barberId);
    if (!barber)
      return NextResponse.json(
        { error: "barber_unavailable" },
        { status: 409 },
      );
    const start = localToUtc(x.date, x.time),
      end = new Date(
        new Date(start).getTime() + service.duration * 60000,
      ).toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      const duplicate = db
        .prepare(
          "SELECT reference,starts_at,service_id,barber_id,status FROM appointments WHERE id=?",
        )
        .get(createHash("sha256").update(x.idempotencyKey).digest("hex")) as
        | ExistingBooking
        | undefined;
      if (duplicate) {
        db.exec("COMMIT");
        return NextResponse.json({
          booking: {
            reference: duplicate.reference,
            startsAt: duplicate.starts_at,
            serviceId: duplicate.service_id,
            barberId: duplicate.barber_id,
            status: duplicate.status,
          },
        });
      }
      // Re-run the complete slot check while holding SQLite's write reservation, so parallel writers serialize.
      if (
        !getSlots(x.date, x.serviceId, x.barberId).some(
          (s) => s.time === x.time && s.barberId === x.barberId,
        )
      )
        throw new Error("slot_conflict");
      const id = createHash("sha256").update(x.idempotencyKey).digest("hex"),
        reference = `VC-${randomUUID().slice(0, 8).toUpperCase()}`,
        now = new Date().toISOString();
      db.prepare(
        "INSERT INTO appointments(id,reference,service_id,barber_id,customer_name,email,phone,notes,starts_at,ends_at,price_snapshot,duration_snapshot,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      ).run(
        id,
        reference,
        x.serviceId,
        x.barberId,
        x.name,
        x.email,
        x.phone,
        x.notes,
        start,
        end,
        service.price,
        service.duration,
        "pending",
        now,
        now,
      );
      db.exec("COMMIT");
      return NextResponse.json(
        {
          booking: {
            reference,
            startsAt: start,
            endsAt: end,
            serviceId: x.serviceId,
            barberId: x.barberId,
            price: service.price,
            duration: service.duration,
            status: "pending",
          },
        },
        { status: 201 },
      );
    } catch (e) {
      db.exec("ROLLBACK");
      if ((e as Error).message === "slot_conflict")
        return NextResponse.json(
          { error: "slot_unavailable" },
          { status: 409 },
        );
      throw e;
    }
  } catch (e) {
    if (
      ["invalid_local_time", "invalid_local_date"].includes(
        (e as Error).message,
      )
    )
      return NextResponse.json({ error: "invalid_time" }, { status: 400 });
    console.error("booking_failed", (e as Error).name);
    return NextResponse.json({ error: "booking_failed" }, { status: 500 });
  }
}
