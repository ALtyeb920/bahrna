import type { Metadata } from "next";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export const metadata: Metadata = {
  title: "إدارة المنصة | بحرنا",
  description: "لوحة تحكم الإدارة — منصة بحرنا",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
