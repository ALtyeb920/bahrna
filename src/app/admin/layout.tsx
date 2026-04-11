import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/dashboard/admin-shell";

export const metadata: Metadata = {
  title: "إدارة المنصة | بحرنا",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell session={session}>{children}</AdminShell>;
}
