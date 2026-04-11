import type { Metadata } from "next";
import { OwnerSidebar } from "@/components/dashboard/owner-sidebar";

export const metadata: Metadata = {
  title: "لوحة المشغّل | بحرنا",
  description: "لوحة تحكم مالك اليخوت — منصة بحرنا",
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <OwnerSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
