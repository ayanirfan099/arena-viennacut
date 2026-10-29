import PublicSite from "@/components/PublicSite";
export const metadata = {
  title: "Termin buchen — VIENNA CUTS",
  description: "Termin buchen im fiktiven Premium Barber Studio Vienna Cuts.",
  robots: { index: false, follow: false },
};
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<main className="wrap section">Vienna Cuts</main>}>
      <PublicSite page="book" />
    </Suspense>
  );
}
