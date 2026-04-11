"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Store, Users, Ship, CalendarDays,
  CreditCard, FileText, Settings, ShieldCheck,
  ChevronLeft, LogOut, Menu, X, Bell, Anchor
} from "lucide-react";
import type { Session } from "next-auth";

const NAV = [
  { href: "/admin",              label: "لوحة المعلومات", icon: LayoutDashboard, exact: true },
  { href: "/admin/stores",       label: "المتاجر",         icon: Store },
  { href: "/admin/users",        label: "المستخدمون",      icon: Users },
  { href: "/admin/yachts",       label: "اليخوت",          icon: Ship },
  { href: "/admin/bookings",     label: "الحجوزات",        icon: CalendarDays },
  { href: "/admin/commissions",  label: "العمولات",        icon: CreditCard },
  { href: "/admin/reports",      label: "التقارير",        icon: FileText },
  { href: "/admin/settings",     label: "الإعدادات",       icon: Settings },
];

function Sidebar({ collapsed, onToggle, onMobileClose, session }: { collapsed: boolean; onToggle: () => void; onMobileClose: () => void; session: Session }) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex flex-col h-full bg-[#1a1236]">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[65px]">
        <Link href="/" className="flex items-center gap-2.5" onClick={onMobileClose}>
          <div className="w-9 h-9 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-extrabold text-white text-sm leading-none">بحرنا</p>
              <p className="text-xs text-white/50 mt-0.5">لوحة الإدارة</p>
            </div>
          )}
        </Link>
        <button onClick={onToggle} className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 items-center justify-center hover:bg-white/20 transition">
          <ChevronLeft className={`h-4 w-4 text-white/70 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Switch to Owner */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-white/10">
          <Link href="/owner" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white/50 hover:bg-white/10 hover:text-white/80 transition" onClick={onMobileClose}>
            <Anchor className="h-3.5 w-3.5" /> لوحة المشغّل
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = active(href, exact);
          return (
            <Link key={href} href={href} onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? "bg-white text-[#1a1236] font-bold shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0 h-5 w-5" />
              {!collapsed && <span>{label}</span>}
              {isActive && !collapsed && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session.user.name?.[0] ?? "أ"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
              <p className="text-xs text-white/50 truncate">{session.user.email}</p>
            </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white/80 rounded-xl hover:bg-white/10 transition">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </Link>
        </div>
      )}
    </div>
  );
}

export function AdminShell({ children, session }: { children: React.ReactNode; session: Session }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile toggle */}
      <button className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-[#1a1236] rounded-xl flex items-center justify-center text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 right-0 z-40 w-64 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <Sidebar collapsed={false} onToggle={() => {}} onMobileClose={() => setMobileOpen(false)} session={session} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block shrink-0 transition-all duration-300" style={{ width: collapsed ? 64 : 256 }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onMobileClose={() => {}} session={session} />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-0">
            <div className="lg:hidden w-10" />
          </div>
          <div className="flex items-center gap-3 mr-auto">
            <Link href="/admin/notifications" className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                {session.user.name?.[0] ?? "أ"}
              </div>
              <span className="hidden md:block text-sm font-bold text-slate-700">{session.user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
