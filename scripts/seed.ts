import db from "../src/lib/db";
import { localToUtc } from "../src/lib/scheduler";
if (
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_DEMO_SEED !== "yes"
) {
  throw new Error(
    "Refusing to seed production. Set ALLOW_DEMO_SEED=yes only for a deliberate demo reset.",
  );
}
const localDate = (offset: number) => {
  const d = new Date(Date.now() + offset * 86400000);
  while (
    [0, 1].includes(
      new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12),
      ).getUTCDay(),
    )
  )
    d.setUTCDate(d.getUTCDate() + 1);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};
type ServiceRow = { price: number; duration: number };
const now = new Date().toISOString();
const examples = [
  {
    key: "sample-pending",
    service: "classic",
    barber: "otto",
    time: "11:00",
    name: "Demo Guest One",
    email: "guest1@example.invalid",
    status: "pending",
  },
  {
    key: "sample-confirmed",
    service: "fade",
    barber: "milan",
    time: "14:00",
    name: "Demo Guest Two",
    email: "guest2@example.invalid",
    status: "confirmed",
  },
];
for (const x of examples) {
  const day = localDate(2),
    start = localToUtc(day, x.time),
    svc = db
      .prepare("SELECT price,duration FROM services WHERE id=?")
      .get(x.service) as ServiceRow;
  db.prepare(
    "INSERT OR IGNORE INTO appointments(id,reference,service_id,barber_id,customer_name,email,phone,notes,starts_at,ends_at,price_snapshot,duration_snapshot,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
  ).run(
    x.key,
    `DEMO-${x.key.toUpperCase()}`,
    x.service,
    x.barber,
    x.name,
    x.email,
    "+0000000000",
    "Synthetic seed record",
    start,
    new Date(Date.parse(start) + svc.duration * 60000).toISOString(),
    svc.price,
    svc.duration,
    x.status,
    now,
    now,
  );
}
console.log(
  "Demo catalog initialized; two synthetic appointments seeded for two days from now in Europe/Vienna.",
);
