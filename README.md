# VIENNA CUTS — Premium Barber Studio

A bilingual (German / English) fictional barber-studio demonstration, built at the repository root with Next.js App Router, React, TypeScript, Tailwind CSS v4, SQLite (`node:sqlite`) and Zod. It is a product prototype, not an operating business. Names, imagery, sample records, hours, testimonials and service catalogue are illustrative. No real address, phone number, customer review, email/SMS delivery, payment integration, or connected AI assistant is represented.

## Requirements and setup

- Node.js 22.13+ (uses Node's built-in `node:sqlite`; Node currently labels this API experimental)
- npm 10+

```sh
npm ci
cp .env.example .env.local
# Generate a password hash (choose your password privately), then set OWNER_PASSWORD_HASH in .env.local:
# node -e "require('bcryptjs').hash('your-private-password', 12).then(console.log)"
# Generate a long random signing secret in .env.local:
# openssl rand -hex 32
npm run dev
```

When entering the bcrypt value in `.env.local`, prefix each dollar sign with a backslash (`\$`) so Next.js environment expansion preserves it. Open the URL printed by Next (Arena's preview binds to `0.0.0.0`). The SQLite file is created at `DATABASE_PATH` (default `./data/viennacuts.sqlite`). The idempotent schema and catalog initialization run on first server-side database access. To clear all local demo appointments and inquiry records, stop the app and remove that SQLite file plus its `-wal`/`-shm` sidecars; the catalog tables are recreated on the next run. Seed sample appointments again with `npm run db:seed`. `.npmrc` enables legacy peer resolution for npm's current optional-peer dependency graph; the checked-in lockfile was verified with `npm ci`. To add two explicitly synthetic appointments to the dashboard, run `npm run db:seed`. This does not reset existing bookings. `OWNER_EMAIL`, a bcrypt `OWNER_PASSWORD_HASH`, and a 32+ character `SESSION_SECRET` must be set to use the owner sign-in. Use a unique password and rotate demo credentials before any shared deployment.

```sh
npm run typecheck
npm test
npm run lint
npm run build
npm start
```

## Routes

- `/` — editorial home
- `/services` — the five fixed demo services and book links
- `/team` — four fictional barber concepts, preselectable in booking
- `/gallery` — illustrative image categories and keyboard-operated lightbox
- `/about` — studio concept and values
- `/contact` — example hours and a demo inquiry form (stored in SQLite; no email sent)
- `/book` — four-step service, barber, Vienna date/time and customer detail booking flow
- `/owner` — owner sign-in
- `/owner/dashboard` — server-gated, bilingual owner workspace with appointment search/status/barber filters, day/week calendar and status transitions

The customer flow can also be opened at `/book?service=classic` or `/book?barber=otto`. Switch DE/EN in the header; the choice persists in browser local storage.

## Booking and data behavior

Service price/duration are defined centrally in `src/lib/data.ts` and copied to authoritative SQLite rows. The five values are Classic Haircut €35/45 min, Skin Fade €40/50 min, Beard Trim €15/20 min, Haircut & Beard €45/60 min and Premium Grooming €60/75 min. The API ignores client-supplied price and duration. All four fictional barbers can perform all five demo services. Barber preferences are resolved to a concrete barber when the customer picks a slot. Availability uses Tuesday–Friday 09:00–18:00 and Saturday 10:00–16:00 Vienna-local hours, 30-minute start increments and duration-aware finishing times (closed Sunday and Monday). `Europe/Vienna` wall time is converted to UTC using IANA timezone data; nonexistent spring-forward times are rejected, and the scheduled hours avoid the repeated autumn 02:00 hour. Pending and confirmed records block availability; cancelled records do not. Overlap uses half-open intervals.

Booking writes execute inside SQLite `BEGIN IMMEDIATE`: competing writers serialize, availability is rechecked under the write reservation and the unique booking id prevents accidental duplicates through the submitted idempotency key. This protection is specific to a single SQLite database file on a filesystem with SQLite locking semantics; do not run multiple isolated database copies or assume a network filesystem has equivalent locking. For multi-instance production deployment, move to managed PostgreSQL and enforce overlap rules with a database exclusion constraint/transaction. The stored appointments and inquiries survive app restarts while that file is retained; this is local demo persistence, not a managed backup service.

Owner credentials are read only on the server from environment variables. Successful sign-in issues an eight-hour signed, HttpOnly, SameSite=Lax cookie; owner pages and every owner API handler check the session on the server. Set `SESSION_SECRET` to a random secret. This is a deliberately small single-owner demo login, not a complete production identity provider, CSRF/origin policy, rate-limiting or account lifecycle system. Never expose its env values publicly. Appointment status transitions are constrained (pending→confirmed/cancelled, confirmed→completed/cancelled). Owner lists are bounded to 200 rows. The week calendar filters loaded records in the client and is intended for the seeded/demo scale.

## Demo versus production

- AI-generated studio/craft imagery and four fictional barber portraits are original demo art, **not actual employees or customers**. Replace with properly licensed, consented business assets before launch. There are no third-party stock-photo assets.
- Sample contact entries use reserved `.invalid` email addresses and synthetic names. Example opening hours are not verified hours.
- Booking creates a persisted pending record and displays its backend-generated reference only after commit. It does not deliver email/SMS or create a confirmed real-world appointment. The owner dashboard can confirm or cancel it.
- Contact inquiries are persisted locally; no email is sent. No payment, map, external analytics, or AI provider is connected.
- No legal privacy notice or actual business contact/address is asserted. Add reviewed legal notices, retention/deletion tooling, verified identity/contact information, consent and privacy operations before a real launch.
- `src/lib/db.ts` creates idempotent SQLite tables and indexes; it is intentionally a compact demo schema rather than a versioned production migration chain. For a real launch add formal migrations, backups, retention/deletion workflows and PostgreSQL constraints.

## Design system and assets

Central tokens are CSS custom properties in `src/app/globals.css`: warm ivory canvas, charcoal ink, copper action, semantic status colors, serif display and neutral UI families, radii, container width and reduced-motion behavior. All six images in `/public/images/` are generated original fictional visual assets, including four synthetic barber portraits. See `docs/design-system.md` and `docs/asset-manifest.md`.
