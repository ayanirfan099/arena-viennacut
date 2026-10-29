import PublicSite from "@/components/PublicSite";
export const metadata = {
  title: "Services — VIENNA CUTS",
  description: "Services im fiktiven Premium Barber Studio Vienna Cuts.",
  robots: { index: false, follow: false },
};
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<main className="wrap section">Vienna Cuts</main>}>
      <PublicSite page="services" />
    </Suspense>
  );
}
