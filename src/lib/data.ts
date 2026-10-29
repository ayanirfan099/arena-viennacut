export const services = [
  {
    id: "classic",
    name: { de: "Classic Haircut", en: "Classic Haircut" },
    description: {
      de: "Ein präziser Schnitt, persönlich auf deinen Stil abgestimmt.",
      en: "A precise cut, tailored to the way you wear your style.",
    },
    price: 35,
    duration: 45,
    image: "service-cut.jpg",
  },
  {
    id: "fade",
    name: { de: "Skin Fade", en: "Skin Fade" },
    description: {
      de: "Nahtlose Übergänge und ein sauberer, markanter Abschluss.",
      en: "Seamless transitions and a clean, confident finish.",
    },
    price: 40,
    duration: 50,
    image: "service-fade.jpg",
  },
  {
    id: "beard",
    name: { de: "Bart trimmen", en: "Beard Trim" },
    description: {
      de: "Konturen, Länge und Pflege – sorgfältig in Balance gebracht.",
      en: "Shape, length and care, brought into considered balance.",
    },
    price: 15,
    duration: 20,
    image: "service-beard.jpg",
  },
  {
    id: "combo",
    name: { de: "Haarschnitt & Bart", en: "Haircut & Beard" },
    description: {
      de: "Ein abgestimmtes Gesamtbild in einem entspannten Termin.",
      en: "A considered all-in-one appointment for a complete look.",
    },
    price: 45,
    duration: 60,
    image: "service-combo.jpg",
  },
  {
    id: "grooming",
    name: { de: "Premium Grooming", en: "Premium Grooming" },
    description: {
      de: "Schnitt, Bart und ein Moment zusätzlicher Aufmerksamkeit.",
      en: "Cut, beard and a little more time for the finer details.",
    },
    price: 60,
    duration: 75,
    image: "service-premium.jpg",
  },
] as const;
export const barbers = [
  {
    id: "otto",
    name: "Otto",
    role: { de: "Form & Proportion", en: "Shape & proportion" },
    bio: {
      de: "Ruhige Präzision und ein Gespür für zeitlose Formen.",
      en: "Quiet precision and an eye for timeless shape.",
    },
    specialties: {
      de: "Klassische Schnitte · Schere",
      en: "Classic cuts · Scissor work",
    },
    image: "barber-otto.jpg",
  },
  {
    id: "milan",
    name: "Milan",
    role: { de: "Fade Specialist", en: "Fade specialist" },
    bio: {
      de: "Klare Übergänge, sorgfältige Details, entspannte Beratung.",
      en: "Clean transitions, considered detail and relaxed consultation.",
    },
    specialties: { de: "Skin Fades · Textur", en: "Skin fades · Texture" },
    image: "barber-milan.jpg",
  },
  {
    id: "leon",
    name: "Leon",
    role: { de: "Bart & Kontur", en: "Beard & contour" },
    bio: {
      de: "Bartpflege mit Balance zwischen Charakter und Form.",
      en: "Beard care balancing character with a thoughtful shape.",
    },
    specialties: { de: "Bart · Konturen", en: "Beard · Line-ups" },
    image: "barber-leon.jpg",
  },
  {
    id: "jules",
    name: "Jules",
    role: { de: "Moderner Klassiker", en: "Modern classic" },
    bio: {
      de: "Persönliche Looks, die auch am Montagmorgen funktionieren.",
      en: "Personal looks that still work on a Monday morning.",
    },
    specialties: {
      de: "Kombinationen · Styling",
      en: "Combinations · Styling",
    },
    image: "barber-jules.jpg",
  },
] as const;
export type Service = (typeof services)[number];
export type Barber = (typeof barbers)[number];
export const money = (value: number, locale = "de-AT") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
export const localeDate = (
  value: string,
  locale = "de-AT",
  opts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  },
) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Vienna",
    ...opts,
  }).format(new Date(value));
export const TZ = "Europe/Vienna";
