"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { barbers } from "@/lib/data";
import {
  LogOut,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Search,
} from "lucide-react";
type OwnerLang = "de" | "en";
const copy = {
  de: {
    private: "Geschützter Demo-Bereich",
    login: "Inhaber-Anmeldung",
    credentials:
      "Zugangsdaten werden ausschließlich über serverseitige Umgebungsvariablen bereitgestellt.",
    email: "E-Mail",
    password: "Passwort",
    signIn: "Anmelden",
    signingIn: "Anmeldung…",
    publicSite: "← Zur Website",
    ownerSetup:
      "Inhaberzugang nicht eingerichtet. OWNER_EMAIL, OWNER_PASSWORD_HASH und SESSION_SECRET lokal setzen.",
    invalidCredentials: "Zugangsdaten wurden nicht akzeptiert.",
    workspace: "INHABER-BEREICH · DEMO",
    notifications: "Europe/Vienna · keine Benachrichtigungen eingerichtet",
    overview: "Übersicht",
    appointments: "Termine",
    calendar: "Kalender",
    list: "Liste",
    day: "Tag",
    week: "Woche",
    previous: "← Zurück",
    next: "Weiter →",
    allStatuses: "Alle Status",
    allBarbers: "Alle Barber",
    search: "Name oder Referenz suchen",
    when: "Zeit · Wien",
    customer: "Kunde",
    serviceBarber: "Service / Barber",
    barber: "Barber",
    status: "Status",
    actions: "Aktionen",
    details: "Details",
    noNote: "Keine Notiz",
    confirm: "Bestätigen",
    cancel: "Absagen",
    complete: "Erledigt",
    updated: "aktualisiert",
    invalidTransition: "Dieser Statuswechsel ist nicht zulässig.",
    unableLoad: "Termine konnten nicht geladen werden.",
    noMatch: "Keine Termine für diese Auswahl.",
    todayBookings: "Termine heute",
    upcomingBookings: "Kommende Termine",
    pendingBookings: "Ausstehend",
    confirmedBookings: "Bestätigt",
    completedBookings: "Abgeschlossen",
    cancelledBookings: "Abgesagt",
    scheduledValue: "Geplanter Servicewert ist kein vereinnahmter Umsatz.",
    noNotification: "Keine Benachrichtigungen eingerichtet.",
    unknownStatus: "Unbekannt",
  },
  en: {
    private: "Private demo workspace",
    login: "Owner sign in",
    credentials:
      "Credentials are provisioned from server-only environment variables.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    publicSite: "← Public site",
    ownerSetup:
      "Owner login is not configured. Set OWNER_EMAIL, OWNER_PASSWORD_HASH and SESSION_SECRET locally.",
    invalidCredentials: "Credentials were not accepted.",
    workspace: "OWNER WORKSPACE · DEMO",
    notifications: "Europe/Vienna · no notifications configured",
    overview: "Overview",
    appointments: "Appointments",
    calendar: "Calendar",
    list: "List",
    day: "Day",
    week: "Week",
    previous: "← Previous",
    next: "Next →",
    allStatuses: "All statuses",
    allBarbers: "All barbers",
    search: "Search name or reference",
    when: "When · Vienna",
    customer: "Customer",
    serviceBarber: "Service / barber",
    barber: "Barber",
    status: "Status",
    actions: "Actions",
    details: "Details",
    noNote: "No note",
    confirm: "Confirm",
    cancel: "Cancel",
    complete: "Complete",
    updated: "updated",
    invalidTransition: "This status transition is not allowed.",
    unableLoad: "Unable to load appointments.",
    noMatch: "No bookings match this view yet.",
    todayBookings: "Today's appointments",
    upcomingBookings: "Upcoming appointments",
    pendingBookings: "Pending",
    confirmedBookings: "Confirmed",
    completedBookings: "Completed",
    cancelledBookings: "Cancelled",
    scheduledValue: "Scheduled service value is not collected revenue.",
    noNotification: "No notifications configured.",
    unknownStatus: "Unknown",
  },
} as const;
function useOwnerLanguage() {
  const [lang, setLang] = useState<OwnerLang>("de");
  useEffect(() => {
    const saved = localStorage.getItem("vc-language");
    if (saved === "de" || saved === "en") setLang(saved);
  }, []);
  const toggle = () => {
    const next = lang === "de" ? "en" : "de";
    setLang(next);
    localStorage.setItem("vc-language", next);
    document.documentElement.lang = next;
  };
  return { lang, toggle, t: copy[lang] };
}
function statusLabel(status: string, lang: OwnerLang) {
  const t = copy[lang];
  if (status === "pending") return t.pendingBookings;
  if (status === "confirmed") return t.confirmedBookings;
  if (status === "completed") return t.completedBookings;
  if (status === "cancelled") return t.cancelledBookings;
  return t.unknownStatus;
}
export function OwnerLogin() {
  const { lang, toggle, t } = useOwnerLanguage();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await fetch("/api/owner/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (r.ok) router.push("/owner/dashboard");
    else
      setError(
        d.error === "owner_not_configured"
          ? t.ownerSetup
          : t.invalidCredentials,
      );
    setBusy(false);
  }
  return (
    <div className="owner-shell">
      <header className="owner-top">
        <Link href="/" className="brand">
          VIENNA CUTS<small>OWNER DEMO</small>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggle} className="lang-btn">
            {lang === "de" ? "EN" : "DE"}
          </button>
          <Link href="/" style={{ fontSize: 11 }}>
            {t.publicSite}
          </Link>
        </div>
      </header>
      <main
        style={{
          minHeight: "calc(100vh - 75px)",
          display: "grid",
          placeItems: "center",
          padding: 20,
        }}
      >
        <form
          className="card"
          onSubmit={submit}
          style={{
            width: "min(440px,100%)",
            padding: 35,
            display: "grid",
            gap: 18,
          }}
        >
          <div className="eyebrow">{t.private}</div>
          <h1 className="serif" style={{ fontSize: 48, margin: 0 }}>
            {t.login}
          </h1>
          <p className="muted">{t.credentials}</p>
          <div className="field">
            <label htmlFor="owner-email">{t.email}</label>
            <input
              id="owner-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="owner-password">{t.password}</label>
            <input
              id="owner-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p role="alert" className="notice">
              {error}
            </p>
          )}
          <button className="btn" disabled={busy}>
            {busy ? t.signingIn : t.signIn}
          </button>
        </form>
      </main>
    </div>
  );
}
type Appt = {
  id: string;
  reference: string;
  serviceId: string;
  barberId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  startsAt: string;
  endsAt: string;
  price: number;
  duration: number;
  status: string;
  serviceNameDe: string;
  serviceNameEn: string;
  barberName: string;
};
function viennaDay(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
function dayLabel(s: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Vienna",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(s));
}
function timeLabel(s: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Vienna",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(s));
}
export function OwnerDashboard() {
  const { lang, toggle, t } = useOwnerLanguage();
  const [rows, setRows] = useState<Appt[]>([]),
    [stats, setStats] = useState<Record<string, number>>({}),
    [error, setError] = useState(""),
    [filter, setFilter] = useState(""),
    [barberFilter, setBarberFilter] = useState(""),
    [query, setQuery] = useState(""),
    [view, setView] = useState<"list" | "calendar">("list"),
    [calendarMode, setCalendarMode] = useState<"day" | "week">("week"),
    [range, setRange] = useState(0),
    [notice, setNotice] = useState("");
  const router = useRouter();
  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    if (barberFilter) params.set("barber", barberFilter);
    if (query) params.set("q", query);
    const r = await fetch("/api/owner/appointments?" + params);
    if (!r.ok && r.status !== 401) setError(t.unableLoad);
    if (r.ok) setError("");
    if (r.status === 401) {
      router.push("/owner");
      return;
    }
    const d = await r.json();
    setRows(d.appointments);
    setStats(d.stats || {});
  }, [filter, barberFilter, query, router, t.unableLoad]);
  useEffect(() => {
    void load();
  }, [load]);
  async function update(a: Appt, status: string) {
    const r = await fetch(`/api/owner/appointments/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) {
      setNotice(`${a.reference} ${t.updated}`);
      load();
    } else setNotice(t.invalidTransition);
  }
  async function logout() {
    await fetch("/api/owner/logout", { method: "POST" });
    router.push("/owner");
  }
  const today = new Date();
  today.setDate(today.getDate() + range * (calendarMode === "day" ? 1 : 7));
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const key = viennaDay(d);
    return {
      key,
      label: dayLabel(d.toISOString(), lang === "de" ? "de-AT" : "en-GB"),
      events: rows.filter((r) => viennaDay(new Date(r.startsAt)) === key),
    };
  });
  const visibleWeek =
    calendarMode === "day"
      ? week.filter((d) => d.key === viennaDay(today))
      : week;
  return (
    <div className="owner-shell">
      <header className="owner-top">
        <Link href="/" className="brand">
          VIENNA CUTS<small>{t.workspace}</small>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 10, color: "#c5c2b9" }}>
            {t.notifications}
          </span>
          <button onClick={toggle} className="lang-btn">
            {lang === "de" ? "EN" : "DE"}
          </button>
          <button
            onClick={logout}
            aria-label={lang === "de" ? "Abmelden" : "Sign out"}
            style={{
              background: "none",
              color: "white",
              border: 0,
              cursor: "pointer",
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>
      <div className="owner-layout">
        <aside className="owner-side">
          <Link href="/owner/dashboard">
            <LayoutDashboard
              size={14}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            {t.overview}
          </Link>
          <button
            onClick={() => setView("list")}
            style={{
              textAlign: "left",
              background: "none",
              border: 0,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <ClipboardList
              size={14}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            {t.appointments}
          </button>
          <button
            onClick={() => setView("calendar")}
            style={{
              textAlign: "left",
              background: "none",
              border: 0,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <CalendarDays
              size={14}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            {t.calendar}
          </button>
          <Link href="/">{t.publicSite}</Link>
        </aside>
        <main className="owner-main">
          <div className="eyebrow">
            {new Intl.DateTimeFormat(lang === "de" ? "de-AT" : "en-GB", {
              timeZone: "Europe/Vienna",
              dateStyle: "full",
            }).format(new Date())}{" "}
            · DEMO
          </div>
          <h1 className="serif" style={{ fontSize: 55, margin: "10px 0" }}>
            {t.appointments}
          </h1>
          <p className="muted">{t.scheduledValue}</p>
          {error && (
            <p role="alert" className="notice">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="notice">
              {notice}
            </p>
          )}
          <section className="metric-grid">
            {[
              [t.todayBookings, stats.today],
              [t.upcomingBookings, stats.upcoming],
              [t.pendingBookings, stats.pending],
              [t.confirmedBookings, stats.confirmed],
              [t.completedBookings, stats.completed],
              [t.cancelledBookings, stats.cancelled],
            ].map(([l, v]) => (
              <div className="metric" key={String(l)}>
                <strong>{v || 0}</strong>
                <span>{l}</span>
              </div>
            ))}
          </section>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              margin: "25px 0",
            }}
          >
            <button
              className={`filter-pill ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              {t.list}
            </button>
            <button
              className={`filter-pill ${view === "calendar" ? "active" : ""}`}
              onClick={() => setView("calendar")}
            >
              {t.calendar}
            </button>
            {view === "calendar" && (
              <>
                <button
                  className={`filter-pill ${calendarMode === "day" ? "active" : ""}`}
                  onClick={() => {
                    setCalendarMode("day");
                    setRange(0);
                  }}
                >
                  {t.day}
                </button>
                <button
                  className={`filter-pill ${calendarMode === "week" ? "active" : ""}`}
                  onClick={() => {
                    setCalendarMode("week");
                    setRange(0);
                  }}
                >
                  {t.week}
                </button>
              </>
            )}
            <select
              aria-label={t.status}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-pill"
            >
              <option value="">{t.allStatuses}</option>
              {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s, lang)}
                </option>
              ))}
            </select>
            <select
              aria-label={t.barber}
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="filter-pill"
            >
              <option value="">{t.allBarbers}</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                border: "1px solid var(--line)",
                padding: "0 10px",
              }}
            >
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search}
                style={{ border: 0, background: "transparent", padding: 10 }}
              />
            </label>
          </div>
          {view === "list" ? (
            <div className="table-wrap">
              <table className="appointments">
                <thead>
                  <tr>
                    <th>{t.when}</th>
                    <th>{t.customer}</th>
                    <th>{t.serviceBarber}</th>
                    <th>{t.status}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>
                          {dayLabel(
                            a.startsAt,
                            lang === "de" ? "de-AT" : "en-GB",
                          )}
                        </strong>
                        <br />
                        {timeLabel(
                          a.startsAt,
                          lang === "de" ? "de-AT" : "en-GB",
                        )}{" "}
                        · {a.duration} min
                      </td>
                      <td>
                        {a.name}
                        <br />
                        <span className="muted">{a.email}</span>
                        <details>
                          <summary
                            style={{
                              cursor: "pointer",
                              fontSize: 10,
                              marginTop: 5,
                            }}
                          >
                            {t.details}
                          </summary>
                          <div style={{ fontSize: 11, paddingTop: 5 }}>
                            {a.phone}
                            <br />
                            {a.notes || t.noNote}
                          </div>
                        </details>
                      </td>
                      <td>
                        {lang === "de" ? a.serviceNameDe : a.serviceNameEn}
                        <br />
                        <span className="muted">
                          {a.barberName} · €{a.price}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${a.status}`}>
                          {statusLabel(a.status, lang)}
                        </span>
                      </td>
                      <td>
                        <div className="owner-actions">
                          {a.status === "pending" && (
                            <button onClick={() => update(a, "confirmed")}>
                              {t.confirm}
                            </button>
                          )}
                          {["pending", "confirmed"].includes(a.status) && (
                            <button onClick={() => update(a, "cancelled")}>
                              {t.cancel}
                            </button>
                          )}
                          {a.status === "confirmed" && (
                            <button onClick={() => update(a, "completed")}>
                              {t.complete}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <p style={{ padding: 24 }}>{error || t.noMatch}</p>
              )}
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "20px 0",
                }}
              >
                <button
                  className="filter-pill"
                  onClick={() => setRange(range - 1)}
                >
                  {t.previous} {calendarMode === "day" ? t.day : t.week}
                </button>
                <strong>
                  {calendarMode === "day"
                    ? visibleWeek[0]?.label
                    : `${week[0]?.label} — ${week[6]?.label}`}
                </strong>
                <button
                  className="filter-pill"
                  onClick={() => setRange(range + 1)}
                >
                  {t.next} {calendarMode === "day" ? t.day : t.week}
                </button>
              </div>
              <div className="calendar-grid">
                {visibleWeek.map((d) => (
                  <section className="calendar-day" key={d.key}>
                    <h3>{d.label}</h3>
                    {d.events.map((a) => (
                      <article className="calendar-event" key={a.id}>
                        <strong>
                          {timeLabel(
                            a.startsAt,
                            lang === "de" ? "de-AT" : "en-GB",
                          )}{" "}
                          · {a.barberName}
                        </strong>
                        <br />
                        {lang === "de" ? a.serviceNameDe : a.serviceNameEn}
                        <br />
                        {a.name}{" "}
                        <span className="status">
                          {statusLabel(a.status, lang)}
                        </span>
                      </article>
                    ))}
                  </section>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
