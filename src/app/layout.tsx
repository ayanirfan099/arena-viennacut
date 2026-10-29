import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "VIENNA CUTS — Premium Barber Studio",
  description:
    "Ein fiktives Premium-Barber-Studio-Konzept aus Wien. Entdecke Services und buche einen Demo-Termin.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "VIENNA CUTS — Premium Barber Studio",
    description: "Craft. Character. A considered cut.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <a className="skip-link" href="#main-content">
          Zum Inhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
