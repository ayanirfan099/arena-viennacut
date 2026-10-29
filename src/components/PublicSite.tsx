"use client";
import {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  FormEvent,
  ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { barbers, services, money } from "@/lib/data";

type Lang = "de" | "en";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "de",
  setLang: () => {},
});
export const useLang = () => useContext(LangContext);
const words = {
  de: {
    home: "Start",
    services: "Services",
    team: "Team",
    gallery: "Galerie",
    about: "Studio",
    contact: "Kontakt",
    book: "Termin buchen",
    demo: "Fiktives Studio · Demonstrationsprojekt",
    ariaMain: "Hauptnavigation",
    changeLanguage: "Sprache ändern",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    close: "Schließen",
    previousImage: "Vorheriges Bild",
    nextImage: "Nächstes Bild",
    catalogueNote: "Preise und Dauer gehören zum fiktiven Demo-Katalog.",
    contactDemo:
      "Keine echte Adresse, Telefonnummer oder Kartenmarkierung vorhanden.",
    aboutHeading: "Mit Sorgfalt gestaltet, mit Wärme gelebt.",
    homeEyebrow: "Handwerk. Haltung. Ein guter Schnitt.",
    homeTitle: "Stil, der\nsich nach dir anfühlt.",
    homeText:
      "Ein modernes Barber-Studio-Konzept aus Wien. Präzises Handwerk, gute Gespräche und Zeit für die Details.",
    discover: "Das Studio entdecken",
    serviceIntro:
      "Weniger, aber besser. Jeder Service beginnt mit einem Gespräch und endet mit einem Schnitt, der zu dir passt.",
    servicesTitle: "Handwerk mit Haltung.",
    teamTitle: "Vier Perspektiven. Ein Anspruch.",
    galleryTitle: "Form. Textur. Atmosphäre.",
    aboutTitle: "Ein Ort für die kleinen Details.",
    contactTitle: "Sag Hallo.",
    bookTitle: "Dein Termin. In vier Schritten.",
    stepService: "Service",
    stepBarber: "Barber",
    stepDate: "Zeit",
    stepDetails: "Details",
    next: "Weiter",
    back: "Zurück",
    choose: "Auswählen",
    any: "Wer gerade passt",
    anyText: "Zeigt alle passenden Termine.",
    date: "Datum",
    selectTime: "Uhrzeit auswählen",
    name: "Dein Name",
    email: "E-Mail",
    phone: "Telefon",
    notes: "Notiz (optional)",
    submit: "Termin verbindlich anfragen",
    summary: "Deine Auswahl",
    none: "Noch nicht gewählt",
    available: "Verfügbar",
    emptySlots:
      "An diesem Tag sind keine passenden Zeiten verfügbar. Wähle einen anderen Tag.",
    success: "Anfrage gespeichert",
    successText:
      "Dein Termin ist vorgemerkt. Das Studio kann ihn im Demo-Dashboard bestätigen.",
    reference: "Referenz",
    studioTime: "Alle Zeiten in Europe/Vienna.",
    why: "Gute Gründe, wiederzukommen.",
    whyTitle: "Keine Show. Nur gutes Handwerk.",
    whyText:
      "Zeit nehmen, genau zuhören und den Schnitt gemeinsam finden. Das ist die Idee hinter Vienna Cuts.",
    craft: "Präzision ohne Eile",
    craftText: "Ein sauberer Ablauf, ruhige Hand und ein Auge für Proportion.",
    welcome: "Entspannt ankommen",
    welcomeText: "Keine Hektik. Ein klarer Termin und ein guter Kaffee.",
    personal: "Dein Stil zuerst",
    personalText:
      "Wir finden gemeinsam heraus, was sich für dich richtig anfühlt.",
    process: "So einfach geht’s",
    processTitle: "Vier Schritte. Ein guter Termin.",
    testimonials: "Stimmen aus dem Konzept",
    fictional: "Fiktive Beispielstimmen · keine echten Kundenbewertungen",
    quote: "„Ein gutes Gefühl, noch bevor der Umhang sitzt.“",
    quoteBy: "Beispiel aus dem fiktiven Markenkonzept",
    cta: "Der nächste gute Schnitt beginnt hier.",
    ctaText:
      "Wähle deinen Service und finde in wenigen Schritten einen passenden Zeitpunkt.",
    seeServices: "Services ansehen",
    story: "Die Idee",
    storyText:
      "Vienna Cuts ist ein fiktives Barber-Studio-Konzept für Menschen, die Handwerk nicht laut erklären müssen. Eine gute Form, ein ruhiger Moment, ein Schnitt mit Absicht.",
    values: "Wofür wir stehen",
    valuesText:
      "Sorgfalt statt Schnellschuss. Beratung auf Augenhöhe. Räume, in denen man gerne ankommt. Ein Stil, der sich nicht nach einer Saison richtet.",
    location: "Ort",
    locationText: "Wien · Demonstrationsprojekt. Keine reale Geschäftsadresse.",
    hours: "Beispiel-Öffnungszeiten",
    inquiry: "Allgemeine Anfrage",
    message: "Deine Nachricht",
    send: "Anfrage speichern",
    saved: "Danke — deine Demo-Anfrage wurde gespeichert.",
    contactNote:
      "Keine E-Mail wird versendet. Die Nachricht wird lokal in der Demo-Datenbank gespeichert.",
    hoursDays: ["Montag", "Dienstag – Freitag", "Samstag", "Sonntag"],
    hoursTimes: [
      "Geschlossen",
      "09:00 – 18:00",
      "10:00 – 16:00",
      "Geschlossen",
    ],
    filterAll: "Alle",
    filterCuts: "Schnitte",
    filterBeards: "Bart",
    filterStudio: "Studio",
    visual:
      "KI-generierte Bildstimmung · keine echten Mitarbeiter oder Kundenergebnisse",
    servicesLabel: "Unsere Services",
    loading: "Wird gespeichert…",
    errors: "Bitte prüfe deine Eingaben und versuche es erneut.",
    unavailable:
      "Dieser Termin ist gerade nicht mehr verfügbar. Bitte wähle eine andere Zeit.",
    aboutStudio: "Über das Konzept",
    service: "Service",
    barber: "Barber",
    time: "Zeit",
    duration: "Dauer",
    total: "Gesamt",
    minutes: "Minuten",
    anySummary: "Beliebiger Barber",
    bookThis: "Diesen Service buchen",
    profile: "Termin wählen",
  },
  en: {
    home: "Home",
    services: "Services",
    team: "Barbers",
    gallery: "Gallery",
    about: "Studio",
    contact: "Contact",
    book: "Book an appointment",
    demo: "Fictional studio · demonstration project",
    ariaMain: "Main navigation",
    changeLanguage: "Change language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    close: "Close",
    previousImage: "Previous image",
    nextImage: "Next image",
    catalogueNote:
      "Prices and durations are part of this fictional demonstration catalogue.",
    contactDemo: "No real address, phone or map pin is provided.",
    aboutHeading: "Thoughtfully made, warmly lived in.",
    homeEyebrow: "Craft. Character. A considered cut.",
    homeTitle: "A style that\nfeels like you.",
    homeText:
      "A contemporary barber studio concept from Vienna. Precise craft, good conversation and time for the details.",
    discover: "Discover the studio",
    serviceIntro:
      "Less, but better. Every service begins with a conversation and ends with a cut that feels like yours.",
    servicesTitle: "Craft, with character.",
    teamTitle: "Four perspectives. One standard.",
    galleryTitle: "Shape. Texture. Atmosphere.",
    aboutTitle: "A place for the finer details.",
    contactTitle: "Say hello.",
    bookTitle: "Your appointment. Four easy steps.",
    stepService: "Service",
    stepBarber: "Barber",
    stepDate: "Time",
    stepDetails: "Details",
    next: "Continue",
    back: "Back",
    choose: "Choose",
    any: "Whoever is available",
    anyText: "Shows every matching appointment.",
    date: "Date",
    selectTime: "Choose a time",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    notes: "Note (optional)",
    submit: "Request appointment",
    summary: "Your selection",
    none: "Not selected yet",
    available: "Available",
    emptySlots: "There are no suitable times on this date. Choose another day.",
    success: "Request saved",
    successText:
      "Your appointment is held as pending. The studio can confirm it in the demo dashboard.",
    reference: "Reference",
    studioTime: "All times shown in Europe/Vienna.",
    why: "Reasons to return.",
    whyTitle: "No theatre. Just good craft.",
    whyText:
      "Take time, listen closely and find the right cut together. That is the idea behind Vienna Cuts.",
    craft: "Precision without hurry",
    craftText: "A considered process, steady hands and an eye for proportion.",
    welcome: "Arrive at ease",
    welcomeText: "No rush. A clear appointment and a good coffee.",
    personal: "Your style comes first",
    personalText: "We work out together what feels right for you.",
    process: "Simple by design",
    processTitle: "Four steps. One good appointment.",
    testimonials: "A few words from the concept",
    fictional: "Fictional sample quotes · not real customer reviews",
    quote: "“A good feeling before the cape is even on.”",
    quoteBy: "Sample from this fictional brand concept",
    cta: "Your next great cut starts here.",
    ctaText: "Choose a service and find a time that works in just a few steps.",
    seeServices: "Explore services",
    story: "The idea",
    storyText:
      "Vienna Cuts is a fictional barber studio concept for people who do not need craft to shout. A considered shape, a quiet moment, a cut with intention.",
    values: "What matters",
    valuesText:
      "Care over haste. Advice without attitude. A room that feels good to arrive in. A style not dictated by a season.",
    location: "Location",
    locationText: "Vienna · demonstration project. No real business address.",
    hours: "Example opening hours",
    inquiry: "General enquiry",
    message: "Your message",
    send: "Save enquiry",
    saved: "Thank you — your demo enquiry has been saved.",
    contactNote:
      "No email is sent. The message is stored locally in the demo database.",
    hoursDays: ["Monday", "Tuesday – Friday", "Saturday", "Sunday"],
    hoursTimes: ["Closed", "09:00 – 18:00", "10:00 – 16:00", "Closed"],
    filterAll: "All",
    filterCuts: "Cuts",
    filterBeards: "Beard",
    filterStudio: "Studio",
    visual:
      "AI-generated visual direction · no real employees or customer results",
    servicesLabel: "Our services",
    loading: "Saving…",
    errors: "Please check your details and try again.",
    unavailable: "That time is no longer available. Please choose another.",
    aboutStudio: "About the concept",
    service: "Service",
    barber: "Barber",
    time: "Time",
    duration: "Duration",
    total: "Total",
    minutes: "minutes",
    anySummary: "Any available barber",
    bookThis: "Book this service",
    profile: "Choose a time",
  },
} as const;
const navKeys = [
  "home",
  "services",
  "team",
  "gallery",
  "about",
  "contact",
] as const;
const pathMap: Record<string, string> = {
  home: "/",
  services: "/services",
  team: "/team",
  gallery: "/gallery",
  about: "/about",
  contact: "/contact",
  book: "/book",
};
function Title({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="page-hero">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="serif">{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  );
}
function ServiceList() {
  const { lang } = useLang(),
    t = words[lang];
  return (
    <div className="service-list">
      {services.map((s, i) => (
        <article className="service-row" key={s.id}>
          <span className="service-num">
            <span
              className={`service-thumb thumb${i + 1}`}
              aria-hidden="true"
            />
            <span>0{i + 1}</span>
          </span>
          <div>
            <h3>{s.name[lang]}</h3>
            <p>{s.description[lang]}</p>
          </div>
          <span className="service-min">
            {s.duration} {t.minutes}
          </span>
          <span className="service-price">
            {money(s.price, lang === "de" ? "de-AT" : "en-IE")}
          </span>
          <Link className="btn btn-light" href={`/book?service=${s.id}`}>
            {t.bookThis}
            <ArrowRight size={13} />
          </Link>
        </article>
      ))}
    </div>
  );
}
function PublicHeader() {
  const { lang, setLang } = useLang(),
    t = words[lang],
    path = usePathname(),
    [open, setOpen] = useState(false);
  return (
    <>
      <div className="demo-strip">{t.demo}</div>
      <header className="public-nav">
        <div className="wrap nav-inner">
          <Link className="brand" href="/">
            VIENNA CUTS<small>Premium Barber Studio</small>
          </Link>
          <nav className="nav-links" aria-label={t.ariaMain}>
            {navKeys.map((k) => (
              <Link
                key={k}
                href={pathMap[k]}
                aria-current={path === pathMap[k] ? "page" : undefined}
              >
                {t[k]}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="lang-btn"
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              aria-label={t.changeLanguage}
            >
              {lang === "de" ? "EN" : "DE"}
            </button>
            <Link href="/book" className="btn">
              {t.book}
              <ArrowRight size={13} />
            </Link>
            <button
              className="mobile-toggle"
              onClick={() => setOpen(!open)}
              aria-label={open ? t.closeMenu : t.openMenu}
              aria-expanded={open}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
          {open && (
            <nav className="mobile-nav">
              {navKeys.map((k) => (
                <Link onClick={() => setOpen(false)} key={k} href={pathMap[k]}>
                  {t[k]}
                </Link>
              ))}
              <Link className="btn" href="/book" onClick={() => setOpen(false)}>
                {t.book}
              </Link>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
function Footer() {
  const { lang } = useLang(),
    t = words[lang];
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand">
              VIENNA CUTS<small>Premium Barber Studio</small>
            </div>
            <p
              style={{
                color: "#c4c1b8",
                maxWidth: 300,
                fontSize: 13,
                marginTop: 22,
              }}
            >
              {t.demo}. {t.locationText}
            </p>
          </div>
          <div>
            <div
              className="eyebrow"
              style={{ color: "#d4a57d", marginBottom: 15 }}
            >
              {t.servicesLabel}
            </div>
            <div className="footer-links">
              <Link href="/services">{t.services}</Link>
              <Link href="/team">{t.team}</Link>
              <Link href="/gallery">{t.gallery}</Link>
            </div>
          </div>
          <div>
            <div
              className="eyebrow"
              style={{ color: "#d4a57d", marginBottom: 15 }}
            >
              {t.aboutStudio}
            </div>
            <div className="footer-links">
              <Link href="/book">{t.book}</Link>
              <Link href="/contact">{t.contact}</Link>
              <Link href="/owner">Owner demo</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© VIENNA CUTS — DEMONSTRATION CONCEPT</span>
          <span>Vienna · Europe/Vienna</span>
        </div>
      </div>
    </footer>
  );
}
function HomePage() {
  const { lang } = useLang(),
    t = words[lang];
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <div className="eyebrow">{t.homeEyebrow}</div>
            <h1 className="serif">
              {t.homeTitle.split("\n").map((line, i) => (
                <span key={line}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p>{t.homeText}</p>
            <Link className="btn btn-copper" href="/book">
              {t.book}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="hero-meta">A fictional studio concept · Vienna</div>
      </section>
      <section className="section">
        <div className="wrap intro-grid">
          <div>
            <div className="eyebrow">{t.why}</div>
            <h2 className="serif">{t.whyTitle}</h2>
            <p className="intro-copy">{t.whyText}</p>
            <Link
              className="inline-link"
              href="/about"
              style={{
                display: "inline-flex",
                gap: 10,
                marginTop: 22,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".12em",
              }}
            >
              {t.discover}
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="photo-panel" role="img" aria-label={t.visual} />
        </div>
      </section>
      <section className="section-sm">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">01 / {t.servicesLabel}</div>
            <h2 className="serif">{t.servicesTitle}</h2>
            <p className="muted">{t.serviceIntro}</p>
          </div>
          <div style={{ marginTop: 32 }}>
            <ServiceList />
          </div>
        </div>
      </section>
      <section className="section dark-band">
        <div className="wrap">
          <div className="eyebrow">02 / {t.team}</div>
          <h2
            className="serif"
            style={{ fontSize: "clamp(44px,6vw,72px)", margin: "12px 0 38px" }}
          >
            {t.teamTitle}
          </h2>
          <TeamCards compact />
          <div style={{ marginTop: 30 }}>
            <Link className="btn btn-light" href="/team">
              {t.team}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">03 / {t.process}</div>
          <h2 className="serif" style={{ fontSize: 54, margin: "12px 0" }}>
            {t.processTitle}
          </h2>
          <p className="muted">{t.studioTime}</p>
          <ProcessSteps />
        </div>
      </section>
      <section className="section dark-band">
        <div
          className="wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 50,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow">{t.testimonials}</div>
            <h2 className="serif" style={{ fontSize: 47 }}>
              {t.quote}
            </h2>
            <p style={{ color: "#b8b5ac", fontSize: 11 }}>{t.fictional}</p>
          </div>
          <div className="photo-panel" style={{ height: 290 }} />
        </div>
      </section>
      <CallToAction />
    </>
  );
}
function TeamCards({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang(),
    t = words[lang];
  return (
    <div className="team-grid">
      {barbers.map((b) => (
        <article className="person-card" key={b.id}>
          <div
            className="person-photo"
            style={{ backgroundImage: `url('/images/${b.image}')` }}
            role="img"
            aria-label={`${b.name} — ${t.visual}`}
          />
          <div className="person-info">
            <span className="eyebrow">{b.role[lang]}</span>
            <h3>{b.name}</h3>
            <p>{b.bio[lang]}</p>
            {!compact && <p>{b.specialties[lang]}</p>}
            <Link
              href={`/book?barber=${b.id}`}
              style={{
                fontSize: 10,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {t.profile}
              <ArrowRight size={13} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
function ProcessSteps() {
  const { lang } = useLang(),
    t = words[lang];
  const names = [t.stepService, t.stepBarber, t.stepDate, t.stepDetails],
    desc =
      lang === "de"
        ? [
            "Wähle den Schnitt, der zu dir passt.",
            "Such dir deinen Barber aus – oder lass uns wählen.",
            "Finde einen freien Termin in Wien.",
            "Hinterlasse deine Kontaktdaten.",
          ]
        : [
            "Choose the service that suits you.",
            "Pick your barber, or leave it to us.",
            "Find an available Vienna time.",
            "Leave your contact details.",
          ];
  return (
    <div className="steps-grid">
      {names.map((n, i) => (
        <article className="step-card" key={n}>
          <span>0{i + 1}</span>
          <h3>{n}</h3>
          <p>{desc[i]}</p>
        </article>
      ))}
    </div>
  );
}
function CallToAction() {
  const { lang } = useLang(),
    t = words[lang];
  return (
    <section className="section" style={{ background: "#e5ded2" }}>
      <div
        className="wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 30,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="eyebrow">Vienna Cuts</div>
          <h2
            className="serif"
            style={{ fontSize: "clamp(40px,5vw,64px)", margin: "12px 0" }}
          >
            {t.cta}
          </h2>
          <p className="muted">{t.ctaText}</p>
        </div>
        <Link className="btn" href="/book">
          {t.book}
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
function GalleryPage() {
  const { lang } = useLang(),
    t = words[lang],
    [filter, setFilter] = useState("all"),
    [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const items: [string, string][] = [
    ["cuts", "/images/craft.jpg"],
    ["fade", "/images/craft.jpg"],
    ["beard", "/images/craft.jpg"],
    ["studio", "/images/studio-hero.jpg"],
    ["cuts", "/images/craft.jpg"],
    ["studio", "/images/studio-hero.jpg"],
  ];
  const labels = [t.filterAll, t.filterCuts, t.filterBeards, t.filterStudio],
    keys = ["all", "cuts", "beards", "studio"];
  const filtered = items
    .map((x, i) => ({ category: x[0], image: x[1], index: i }))
    .filter(
      (x) =>
        filter === "all" ||
        x.category === filter ||
        (filter === "beards" && x.category === "beard"),
    );
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((active + 1) % 6);
      if (e.key === "ArrowLeft") setActive((active + 5) % 6);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [active]);
  useEffect(() => {
    if (active === null) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const controls = dialog?.querySelectorAll<HTMLElement>("button");
    controls?.[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !controls?.length) return;
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog?.addEventListener("keydown", trap);
    return () => {
      dialog?.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [active]);
  return (
    <>
      <Title
        eyebrow="04 / VIENNA CUTS"
        title={t.galleryTitle}
        copy={t.visual}
      />
      <section className="section-sm">
        <div className="wrap">
          <div className="filter-row">
            {keys.map((key, i) => (
              <button
                className={`filter-pill ${filter === key ? "active" : ""}`}
                key={key}
                onClick={() => setFilter(key)}
              >
                {labels[i]}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {filtered.map((item) => (
              <button
                key={item.index}
                className="gallery-item"
                onClick={() => setActive(item.index)}
                aria-label={`${labels[Math.max(0, keys.indexOf(item.category))]} — ${t.visual}`}
              >
                <Image
                  fill
                  sizes="(max-width: 760px) 50vw, 33vw"
                  src={item.image}
                  alt={t.visual}
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 11, marginTop: 18 }}>
            {t.visual}
          </p>
        </div>
      </section>
      {active !== null && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={t.galleryTitle}
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(12,13,12,.92)",
            display: "grid",
            placeItems: "center",
            padding: 22,
          }}
        >
          <button
            onClick={() => setActive(null)}
            aria-label={t.close}
            style={{
              position: "absolute",
              right: 25,
              top: 20,
              color: "white",
              background: "none",
              border: 0,
              cursor: "pointer",
            }}
          >
            <X />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + items.length - 1) % items.length);
            }}
            aria-label={t.previousImage}
            style={{
              position: "absolute",
              left: 20,
              color: "white",
              background: "none",
              border: 0,
            }}
          >
            <ChevronLeft />
          </button>
          <Image
            src={items[active][1]}
            alt={t.visual}
            width={1600}
            height={1100}
            sizes="90vw"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % items.length);
            }}
            aria-label={t.nextImage}
            style={{
              position: "absolute",
              right: 20,
              color: "white",
              background: "none",
              border: 0,
            }}
          >
            <ChevronRight />
          </button>
        </div>
      )}
      <CallToAction />
    </>
  );
}
function StaticPage({ page }: { page: string }) {
  const { lang } = useLang(),
    t = words[lang];
  if (page === "home") return <HomePage />;
  if (page === "services")
    return (
      <>
        <Title
          eyebrow="01 / SERVICES"
          title={t.servicesTitle}
          copy={t.serviceIntro}
        />
        <section className="section-sm">
          <div className="wrap">
            <ServiceList />
            <div className="notice">
              {t.demo}. {t.catalogueNote}
            </div>
          </div>
        </section>
        <CallToAction />
      </>
    );
  if (page === "team")
    return (
      <>
        <Title eyebrow="02 / THE PEOPLE" title={t.teamTitle} copy={t.visual} />
        <section className="section-sm">
          <div className="wrap">
            <TeamCards />
            <p className="muted" style={{ fontSize: 11, marginTop: 20 }}>
              {t.visual}
            </p>
          </div>
        </section>
        <CallToAction />
      </>
    );
  if (page === "gallery") return <GalleryPage />;
  if (page === "about")
    return (
      <>
        <Title eyebrow="03 / THE STUDIO" title={t.aboutTitle} copy={t.demo} />
        <section className="section">
          <div className="wrap intro-grid">
            <div>
              <div className="eyebrow">{t.story}</div>
              <h2 className="serif">{t.storyText}</h2>
            </div>
            <div className="photo-panel" />
          </div>
        </section>
        <section className="section dark-band">
          <div className="wrap intro-grid">
            <div>
              <div className="eyebrow">{t.values}</div>
              <h2 className="serif">{t.aboutHeading}</h2>
            </div>
            <p className="intro-copy" style={{ color: "#c4c1b8" }}>
              {t.valuesText}
            </p>
          </div>
        </section>
        <CallToAction />
      </>
    );
  if (page === "contact") return <ContactPage />;
  return <BookingPage />;
}
function ContactPage() {
  const { lang } = useLang(),
    t = words[lang],
    [done, setDone] = useState(false),
    [err, setErr] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        email: f.get("email"),
        message: f.get("message"),
      }),
    });
    if (r.ok) setDone(true);
    else setErr(t.errors);
  }
  return (
    <>
      <Title
        eyebrow="06 / CONTACT"
        title={t.contactTitle}
        copy={t.locationText}
      />
      <section className="section">
        <div className="wrap contact-grid">
          <div>
            <div className="eyebrow">{t.hours}</div>
            <h2 className="serif" style={{ fontSize: 43 }}>
              {t.location}
            </h2>
            <p className="muted">{t.locationText}</p>
            <div className="hours">
              {t.hoursDays.map((d, i) => (
                <div key={d} style={{ display: "contents" }}>
                  <div>{d}</div>
                  <div>{t.hoursTimes[i]}</div>
                </div>
              ))}
            </div>
            <p className="notice">
              {t.demo} · {t.contactDemo}
            </p>
          </div>
          <form
            className="card"
            style={{ padding: 27, display: "grid", gap: 16 }}
            onSubmit={submit}
          >
            <div className="eyebrow">{t.inquiry}</div>
            {done ? (
              <div role="status" className="notice">
                {t.saved}
              </div>
            ) : (
              <>
                <Field label={t.name} name="name" required />
                <Field label={t.email} name="email" type="email" required />
                <div className="field">
                  <label>{t.message}</label>
                  <textarea name="message" required maxLength={700} />
                </div>
                {err && (
                  <p role="alert" style={{ color: "var(--danger)" }}>
                    {err}
                  </p>
                )}
                <button className="btn">
                  {t.send}
                  <ArrowRight size={14} />
                </button>
                <p className="muted" style={{ fontSize: 11 }}>
                  {t.contactNote}
                </p>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
function Field({
  label,
  name,
  type = "text",
  required = false,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      {children || (
        <input id={name} name={name} type={type} required={required} />
      )}
    </div>
  );
}
function todayVienna() {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return f;
}
function tomorrowVienna() {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() + 86400000));
  return f;
}
function BookingPage() {
  const { lang } = useLang(),
    t = words[lang],
    params = useSearchParams();
  const [step, setStep] = useState(0),
    [serviceId, setService] = useState<string>(""),
    [barberId, setBarber] = useState("any"),
    [date, setDate] = useState(""),
    [slots, setSlots] = useState<
      { time: string; barberId: string; barberName: string }[]
    >([]),
    [time, setTime] = useState(""),
    [concreteBarber, setConcrete] = useState(""),
    [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirmation, setConfirmation] = useState<{
      reference: string;
      startsAt: string;
      endsAt: string;
      serviceId: string;
      barberId: string;
      price: number;
      duration: number;
      status: string;
    } | null>(null),
    [token, setToken] = useState("");
  const service = services.find((s) => s.id === serviceId);
  const barber =
    barbers.find((b) => b.id === concreteBarber) ||
    barbers.find((b) => b.id === barberId);
  useEffect(() => {
    setService(params.get("service") || "");
    setBarber(params.get("barber") || "any");
    setDate(tomorrowVienna());
    setToken(crypto.randomUUID());
  }, [params]);
  useEffect(() => {
    if (!date || !serviceId) return;
    let alive = true;
    fetch(`/api/slots?date=${date}&service=${serviceId}&barber=${barberId}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setSlots(d.slots || []);
      })
      .catch(() => {
        if (alive) setSlots([]);
      });
    return () => {
      alive = false;
    };
  }, [date, serviceId, barberId]);
  const valid =
    step === 0
      ? !!service
      : step === 1
        ? !!barberId
        : step === 2
          ? !!time && !!concreteBarber
          : true;
  function advance() {
    setError("");
    if (valid) setStep((s) => Math.min(3, s + 1));
    else
      setError(
        lang === "de"
          ? "Bitte triff eine Auswahl."
          : "Please make a selection.",
      );
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!service || !time || !concreteBarber) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          barberId: concreteBarber,
          date,
          time,
          ...form,
          idempotencyKey: token,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error === "slot_unavailable" ? t.unavailable : t.errors);
        setStep(2);
        setTime("");
      } else setConfirmation(d.booking);
    } catch {
      setError(t.errors);
    } finally {
      setBusy(false);
    }
  }
  const dateDisplay = date
    ? new Intl.DateTimeFormat(lang === "de" ? "de-AT" : "en-GB", {
        timeZone: "Europe/Vienna",
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(new Date(`${date}T12:00:00Z`))
    : t.none;
  return (
    <>
      <Title
        eyebrow="BOOKING / VIENNA"
        title={t.bookTitle}
        copy={t.studioTime}
      />
      <section className="section-sm">
        <div className="wrap book-shell">
          <div className="wizard">
            {confirmation ? (
              <div className="success-panel" role="status">
                <div className="success-mark">
                  <CheckCircle2 />
                </div>
                <div className="eyebrow">{t.success}</div>
                <h2 className="serif" style={{ fontSize: 48 }}>
                  {t.success}
                </h2>
                <p>{t.successText}</p>
                <p className="notice">
                  <strong>
                    {t.reference}: {confirmation.reference}
                  </strong>
                  <br />
                  {service?.name[lang]} · {barber?.name} · {dateDisplay} ·{" "}
                  {time}
                </p>
                <Link className="btn" href="/">
                  {t.home}
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="wizard-progress"
                  aria-label={`Step ${step + 1} of 4`}
                >
                  {[t.stepService, t.stepBarber, t.stepDate, t.stepDetails].map(
                    (name, i) => (
                      <div
                        key={name}
                        className={`progress-dot ${step === i ? "active" : ""}`}
                        aria-current={step === i ? "step" : undefined}
                      >
                        0{i + 1} · {name}
                      </div>
                    ),
                  )}
                </div>
                <div aria-live="polite">
                  <div className="eyebrow">STEP 0{step + 1} / 04</div>
                  <h2
                    className="serif"
                    style={{ fontSize: 40, margin: "8px 0 23px" }}
                  >
                    {
                      [t.stepService, t.stepBarber, t.stepDate, t.stepDetails][
                        step
                      ]
                    }
                  </h2>
                </div>
                {step === 0 && (
                  <div className="choice-grid">
                    {services.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        className={`choice ${serviceId === s.id ? "selected" : ""}`}
                        onClick={() => {
                          setService(s.id);
                          setTime("");
                        }}
                        aria-pressed={serviceId === s.id}
                      >
                        <div>
                          <h3>{s.name[lang]}</h3>
                          <p>{s.description[lang]}</p>
                          <small>
                            {s.duration} {t.minutes}
                          </small>
                        </div>
                        <strong>
                          {money(s.price, lang === "de" ? "de-AT" : "en-IE")}
                        </strong>
                      </button>
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="choice-grid">
                    {[
                      { id: "any", name: t.any, description: t.anyText },
                      ...barbers.map((b) => ({
                        id: b.id,
                        name: b.name,
                        description: b.bio[lang],
                      })),
                    ].map((b) => (
                      <button
                        type="button"
                        key={b.id}
                        className={`choice ${barberId === b.id ? "selected" : ""}`}
                        aria-pressed={barberId === b.id}
                        onClick={() => {
                          setBarber(b.id);
                          setTime("");
                        }}
                      >
                        <div>
                          <h3>{b.name}</h3>
                          <p>{b.description}</p>
                        </div>
                        {barberId === b.id && (
                          <Check className="tick" size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <>
                    <label className="field date-input">
                      <span>{t.date}</span>
                      <input
                        type="date"
                        min={todayVienna()}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setTime("");
                        }}
                      />
                    </label>
                    <h3
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: ".1em",
                      }}
                    >
                      {t.selectTime}
                    </h3>
                    <div className="times">
                      {slots.map((s, i) => (
                        <button
                          type="button"
                          key={`${s.barberId}-${s.time}-${i}`}
                          className={`time-button ${time === s.time && concreteBarber === s.barberId ? "selected" : ""}`}
                          onClick={() => {
                            setTime(s.time);
                            setConcrete(s.barberId);
                          }}
                          aria-pressed={
                            time === s.time && concreteBarber === s.barberId
                          }
                        >
                          {s.time}
                          <small
                            style={{
                              display: "block",
                              fontSize: 9,
                              opacity: 0.75,
                            }}
                          >
                            {barberId === "any" ? s.barberName : ""}
                          </small>
                        </button>
                      ))}
                    </div>
                    {slots.length === 0 && (
                      <div className="notice">{t.emptySlots}</div>
                    )}
                  </>
                )}
                {step === 3 && (
                  <form
                    id="customer-form"
                    onSubmit={submit}
                    style={{ display: "grid", gap: 15 }}
                  >
                    <Field label={t.name} name="name" required>
                      <input
                        id="name"
                        required
                        minLength={2}
                        maxLength={80}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </Field>
                    <Field label={t.email} name="email" type="email" required>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </Field>
                    <Field label={t.phone} name="phone" required>
                      <input
                        id="phone"
                        type="tel"
                        required
                        minLength={5}
                        maxLength={32}
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </Field>
                    <Field label={t.notes} name="notes">
                      <textarea
                        id="notes"
                        maxLength={500}
                        value={form.notes}
                        onChange={(e) =>
                          setForm({ ...form, notes: e.target.value })
                        }
                      />
                    </Field>
                    <p className="muted" style={{ fontSize: 11 }}>
                      {t.demo}. No email or SMS confirmation is sent.
                    </p>
                  </form>
                )}
                {error && (
                  <p role="alert" className="notice">
                    {error}
                  </p>
                )}
                <div className="wizard-actions">
                  {step > 0 ? (
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={() => {
                        setStep((s) => s - 1);
                        setError("");
                      }}
                    >
                      <ChevronLeft size={15} />
                      {t.back}
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 3 ? (
                    <button className="btn" type="button" onClick={advance}>
                      {t.next}
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-copper"
                      type="submit"
                      form="customer-form"
                      disabled={busy}
                    >
                      {busy ? t.loading : t.submit}
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <aside className="summary-card card">
            <div className="eyebrow">{t.summary}</div>
            <h3>{service?.name[lang] || t.none}</h3>
            <div className="summary-line">
              <span>{t.barber}</span>
              <strong>
                {barber?.name || (barberId === "any" ? t.anySummary : t.none)}
              </strong>
            </div>
            <div className="summary-line">
              <span>{t.date}</span>
              <strong>{dateDisplay}</strong>
            </div>
            <div className="summary-line">
              <span>{t.time}</span>
              <strong>{time || t.none}</strong>
            </div>
            <div className="summary-line">
              <span>{t.duration}</span>
              <strong>
                {service ? `${service.duration} ${t.minutes}` : t.none}
              </strong>
            </div>
            <div className="summary-line">
              <span>{t.total}</span>
              <strong>
                {service
                  ? money(service.price, lang === "de" ? "de-AT" : "en-IE")
                  : t.none}
              </strong>
            </div>
            <p className="muted" style={{ fontSize: 10, marginTop: 18 }}>
              {t.studioTime}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
export default function PublicSite({ page }: { page: string }) {
  const [lang, setLanguage] = useState<Lang>("de");
  useEffect(() => {
    const saved = localStorage.getItem("vc-language") as Lang | null;
    if (saved === "en" || saved === "de") setLanguage(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLanguage(l);
    localStorage.setItem("vc-language", l);
    document.documentElement.lang = l === "de" ? "de" : "en";
  };
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <PublicHeader />
      <main id="main-content">
        <StaticPage page={page} />
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
