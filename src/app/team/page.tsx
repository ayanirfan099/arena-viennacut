import PublicSite from "@/components/PublicSite";
export const metadata = {
  title: "Das Team — VIENNA CUTS",
  description: "Das Team im fiktiven Premium Barber Studio Vienna Cuts.",
  robots: { index: false, follow: false },
};
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<main className="wrap section">Vienna Cuts</main>}>
      <PublicSite page="team" />
    </Suspense>
  );
}
