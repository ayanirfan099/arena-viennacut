import { OwnerDashboard } from "@/components/OwnerApp";
import { isOwner } from "@/lib/auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Appointments — Vienna Cuts",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  if (!(await isOwner())) redirect("/owner");
  return <OwnerDashboard />;
}
