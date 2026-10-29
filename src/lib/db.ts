import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { barbers, services } from "./data";
const dbPath =
  process.env.DATABASE_PATH || join(process.cwd(), "data", "viennacuts.sqlite");
mkdirSync(dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath);
db.exec(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS services(id TEXT PRIMARY KEY,name_de TEXT NOT NULL,name_en TEXT NOT NULL,price INTEGER NOT NULL,duration INTEGER NOT NULL,active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS barbers(id TEXT PRIMARY KEY,name TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS appointments(id TEXT PRIMARY KEY,reference TEXT UNIQUE NOT NULL,service_id TEXT NOT NULL REFERENCES services(id),barber_id TEXT NOT NULL REFERENCES barbers(id),customer_name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT NOT NULL,notes TEXT NOT NULL DEFAULT '',starts_at TEXT NOT NULL,ends_at TEXT NOT NULL,price_snapshot INTEGER NOT NULL,duration_snapshot INTEGER NOT NULL,status TEXT NOT NULL CHECK(status IN ('pending','confirmed','completed','cancelled')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS appointments_start_idx ON appointments(starts_at);
CREATE INDEX IF NOT EXISTS appointments_barber_start_idx ON appointments(barber_id,starts_at,ends_at);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE TABLE IF NOT EXISTS inquiries(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,message TEXT NOT NULL,created_at TEXT NOT NULL);`);
const insS = db.prepare(
  "INSERT OR IGNORE INTO services(id,name_de,name_en,price,duration) VALUES(?,?,?,?,?)",
);
for (const s of services)
  insS.run(s.id, s.name.de, s.name.en, s.price, s.duration);
const insB = db.prepare("INSERT OR IGNORE INTO barbers(id,name) VALUES(?,?)");
for (const b of barbers) insB.run(b.id, b.name);
export default db;
