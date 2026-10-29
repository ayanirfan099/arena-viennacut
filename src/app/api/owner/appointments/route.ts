import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import db from "@/lib/db";
import { localToUtc, partsInVienna } from "@/lib/scheduler";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  if (!(await isOwner()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const status = req.nextUrl.searchParams.get("status"),
    barber = req.nextUrl.searchParams.get("barber"),
    q = req.nextUrl.searchParams.get("q");
  let sql = `SELECT a.id,a.reference,a.service_id serviceId,a.barber_id barberId,a.customer_name name,a.email,a.phone,a.notes,a.starts_at startsAt,a.ends_at endsAt,a.price_snapshot price,a.duration_snapshot duration,a.status,s.name_de serviceNameDe,s.name_en serviceNameEn,b.name barberName FROM appointments a JOIN services s ON s.id=a.service_id JOIN barbers b ON b.id=a.barber_id WHERE 1=1`;
  const args: (string | number)[] = [];
  if (
    status &&
    ["pending", "confirmed", "completed", "cancelled"].includes(status)
  ) {
    sql += " AND a.status=?";
    args.push(status);
  }
  if (barber && /^[a-z0-9_-]{1,40}$/.test(barber)) {
    sql += " AND a.barber_id=?";
    args.push(barber);
  }
  if (q) {
    sql += " AND (a.customer_name LIKE ? OR a.reference LIKE ?)";
    args.push(`%${q.slice(0, 80)}%`, `%${q.slice(0, 80)}%`);
  }
  sql += " ORDER BY a.starts_at ASC LIMIT 200";
  const appointments = db.prepare(sql).all(...args);
  const now = new Date(),
    today = partsInVienna(now),
    [y, m, d] = today.split("-").map(Number),
    tomorrowDate = new Date(Date.UTC(y, m - 1, d + 1, 12)),
    tomorrow = partsInVienna(tomorrowDate),
    from = localToUtc(today, "00:00"),
    to = localToUtc(tomorrow, "00:00");
  const totals = db
    .prepare(
      `SELECT SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) pending,SUM(CASE WHEN status='confirmed' THEN 1 ELSE 0 END) confirmed,SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) completed,SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) cancelled FROM appointments`,
    )
    .get() as Record<string, number | null>;
  const todayCount = (
    db
      .prepare(
        "SELECT COUNT(*) n FROM appointments WHERE starts_at>=? AND starts_at<? AND status IN ('pending','confirmed')",
      )
      .get(from, to) as { n: number }
  ).n;
  const upcoming = (
    db
      .prepare(
        "SELECT COUNT(*) n FROM appointments WHERE starts_at>=? AND status IN ('pending','confirmed')",
      )
      .get(now.toISOString()) as { n: number }
  ).n;
  return NextResponse.json({
    appointments,
    stats: { ...totals, today: todayCount, upcoming },
  });
}
