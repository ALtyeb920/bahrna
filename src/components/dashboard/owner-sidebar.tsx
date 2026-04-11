"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor, LayoutDashboard, Ship, CalendarDays,
  Store, BarChart2, Settings, ChevronLeft,
  LogOut, Menu, X, Wallet, Users
} from "lucide-react";

const links = [
  { href: "/dashboard/owner", label: "???? ?????????", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/owner/store", label: "??????? ??????", icon: Store },
  { href: "/dashboard/owner/yachts", label: "??????", icon: Ship },
  { href: "/dashboard/owner/bookings", label: "????????", icon: CalendarDays },
  { href: "/dashboard/owner/earnings", label: "??????? ?????????", icon: Wallet },
  { href: "/dashboard/owner/settings", label: "?????????", icon: Settings },
];

export function OwnerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const Nav = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--gold)] flex items-center justify-center shrink-0">
            <Anchor className="h-5 w-5 text-[var(--navy)]" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-extrabold text-white text-sm leading-none">?????</p>
              <p className="text-xs text-white/50 mt-0.5">???? ???????</p>
            </div>
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 items-center justify-center hover:bg-white/20 transition">
          <ChevronLeft className={`h-4 w-4 text-white/70 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Switch to Admin */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-white/10">
          <Link href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white/50 hover:bg-white/10 hover:text-white/80 transition">
            <Users className="h-4 w-4" /> ??????? ??? ???? ???????
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => {
          const active = isActive(link.href, link.exact);
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-white text-[var(--navy)] font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
              {active && !collapsed && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-[var(--navy)] font-bold text-sm shrink-0">?</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">???? ??????</p>
              <p className="text-xs text-white/50 truncate">operator@bahrna.sa</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white/80 rounded-xl hover:bg-white/10 transition">
            <LogOut className="h-4 w-4" /> ?????? ??????
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-[var(--navy)] rounded-xl flex items-center justify-center text-white shadow-lg" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />}
      <aside className={`lg:hidden fixed top-0 right-0 z-40 h-full bg-[var(--navy)] transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`} style={{ width: 260 }}>
        <Nav />
      </aside>
      <aside className="hidden lg:flex flex-col bg-[var(--navy)] transition-all duration-300 shrink-0" style={{ width: collapsed ? 64 : 260 }}>
        <Nav />
      </aside>
    </>
  );
}
