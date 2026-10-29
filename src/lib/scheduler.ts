import db from "./db";
export function partsInVienna(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function localToUtc(day: string, time: string) {
  const [y, m, d] = day.split("-").map(Number),
    [hh, mm] = time.split(":").map(Number);
  const calendarDate = new Date(Date.UTC(y, m - 1, d));
  if (
    calendarDate.getUTCFullYear() !== y ||
    calendarDate.getUTCMonth() !== m - 1 ||
    calendarDate.getUTCDate() !== d
  )
    throw new Error("invalid_local_date");
  const target = Date.UTC(y, m - 1, d, hh, mm);
  let guess = target;
  for (let i = 0; i < 4; i++) {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Vienna",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const v = (k: string) => Number(f.find((p) => p.type === k)?.value);
    const represented = Date.UTC(
      v("year"),
      v("month") - 1,
      v("day"),
      v("hour"),
      v("minute"),
    );
    const delta = target - represented;
    guess += delta;
    if (!delta) break;
  }
  // Reject nonexistent wall times (DST spring-forward gap).
  const check = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Vienna",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(guess));
  if (check !== time) throw new Error("invalid_local_time");
  return new Date(guess).toISOString();
}
export function getSlots(day: string, serviceId: string, barberPref: string) {
  const svc = db
    .prepare("SELECT duration FROM services WHERE id=? AND active=1")
    .get(serviceId) as { duration: number } | undefined;
  if (!svc) return [];
  const barberRows = (
    barberPref === "any"
      ? db.prepare("SELECT id,name FROM barbers WHERE active=1").all()
      : db
          .prepare("SELECT id,name FROM barbers WHERE id=? AND active=1")
          .all(barberPref)
  ) as { id: string; name: string }[];
  const now = new Date();
  const today = partsInVienna(now);
  if (day < today) return [];
  const [yy, mo, dd] = day.split("-").map(Number);
  const weekday = new Date(Date.UTC(yy, mo - 1, dd, 12)).getUTCDay();
  if (weekday === 0 || weekday === 1) return [];
  const opening = weekday === 6 ? 10 * 60 : 9 * 60,
    closing = weekday === 6 ? 16 * 60 : 18 * 60;
  const result: { time: string; barberId: string; barberName: string }[] = [];
  for (const barber of barberRows) {
    for (
      let minutes = opening;
      minutes + svc.duration <= closing;
      minutes += 30
    ) {
      const hh = String(Math.floor(minutes / 60)).padStart(2, "0"),
        mm = String(minutes % 60).padStart(2, "0"),
        time = `${hh}:${mm}`;
      let start: string;
      try {
        start = localToUtc(day, time);
      } catch {
        continue;
      }
      const end = new Date(
        new Date(start).getTime() + svc.duration * 60000,
      ).toISOString();
      if (new Date(start) <= now) continue;
      const clash = db
        .prepare(
          "SELECT 1 FROM appointments WHERE barber_id=? AND status IN ('pending','confirmed') AND starts_at < ? AND ends_at > ? LIMIT 1",
        )
        .get(barber.id, end, start);
      if (!clash)
        result.push({ time, barberId: barber.id, barberName: barber.name });
    }
  }
  return result.sort(
    (a, b) =>
      a.time.localeCompare(b.time) || a.barberName.localeCompare(b.barberName),
  );
}
export function hasOverlap(
  start: string,
  end: string,
  otherStart: string,
  otherEnd: string,
) {
  return start < otherEnd && end > otherStart;
}
