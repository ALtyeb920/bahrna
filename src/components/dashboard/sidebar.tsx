"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor, LayoutDashboard, Ship, CalendarDays, Users, Star,
  BarChart2, Wallet, Settings, ChevronLeft, LogOut, ShieldCheck,
  Store, CreditCard, FileText, Menu, X
} from "lucide-react";

const operatorLinks = [
  { href: "/dashboard/operator", label: "???? ?????????", icon: LayoutDashboard },
  { href: "/dashboard/operator/yachts", label: "??????", icon: Ship },
  { href: "/dashboard/operator/bookings", label: "????????", icon: CalendarDays },
  { href: "/dashboard/operator/analytics", label: "??????????", icon: BarChart2 },
  { href: "/dashboard/operator/settings", label: "?????????", icon: Settings },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "???? ?????????", icon: LayoutDashboard },
  { href: "/dashboard/admin/stores", label: "???????", icon: Store },
  { href: "/dashboard/admin/users", label: "??????????", icon: Users },
  { href: "/dashboard/admin/bookings", label: "????????", icon: CalendarDays },
  { href: "/dashboard/admin/payments", label: "?????????", icon: CreditCard },
  { href: "/dashboard/admin/reports", label: "????????", icon: FileText },
  { href: "/dashboard/admin/settings", label: "?????????", icon: Settings },
];

interface DashboardSidebarProps {
  role: "operator" | "admin";
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const links = isAdmin ? adminLinks : operatorLinks;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-secondary text-brand-primary shrink-0">
            <Anchor className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-extrabold text-white text-sm">?????</p>
              <p className="text-xs text-white/50">
                {isAdmin ? "???? ???????" : "???? ??????"}
              </p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 items-center justify-center hover:bg-white/20 transition"
        >
          <ChevronLeft className={`h-4 w-4 text-white/70 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${isAdmin ? "bg-purple-500/20 text-purple-200" : "bg-amber-500/20 text-amber-200"}`}>
            {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ship className="h-3.5 w-3.5" />}
            {isAdmin ? "????? ??????" : "???? ????"}
          </div>
          {/* Switch role */}
          <div className="flex rounded-xl overflow-hidden mt-2">
            <Link
              href="/dashboard/operator"
              className={`flex-1 py-1.5 text-xs font-bold text-center transition ${!isAdmin ? "bg-white text-brand-primary" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
            >
              ??????
            </Link>
            <Link
              href="/dashboard/admin"
              className={`flex-1 py-1.5 text-xs font-bold text-center transition ${isAdmin ? "bg-white text-brand-primary" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
            >
              ???????
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== "/dashboard/operator" && link.href !== "/dashboard/admin");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? "bg-white text-brand-primary font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
              {isAdmin ? "?" : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {isAdmin ? "???? ??????" : "???? ??????"}
              </p>
              <p className="text-xs text-white/50 truncate">
                {isAdmin ? "admin@bahrna.sa" : "operator@bahrna.sa"}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/50 hover:text-white/80 rounded-xl hover:bg-white/10 transition"
          >
            <LogOut className="h-4 w-4" />
            ?????? ??????
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 right-0 z-40 h-full bg-brand-primary transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`} style={{ width: 260 }}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col bg-brand-primary transition-all duration-300 shrink-0"
        style={{ width: collapsed ? 64 : 260 }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
