import type { Metadata } from "next";
import { requireOperator } from "@/lib/session";
import { OwnerShell } from "@/components/dashboard/owner-shell";

export const metadata: Metadata = {
  title: "لوحة المشغّل | بحرنا",
};

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireOperator();
  return <OwnerShell session={session}>{children}</OwnerShell>;
}
