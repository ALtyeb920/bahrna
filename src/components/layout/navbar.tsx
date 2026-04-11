"use client";

import {
  Anchor, Menu, X, User, LogIn,
  Store, Ship, LogOut, LayoutDashboard,
  ChevronDown, Bell
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV = [
  { href: "/yachts",  label: "اليخوت",  icon: Ship },
  { href: "/stores",  label: "المتاجر", icon: Store },
  { href: "/about",   label: "عن بحرنا", icon: null },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const dashLink = () => {
    if (!session) return null;
    const r = session.user?.role;
    if (r === "ADMIN")    return { href: "/admin", label: "لوحة الإدارة" };
    if (r === "OPERATOR") return { href: "/owner", label: "لوحة المشغّل" };
    return { href: "/account", label: "حسابي" };
  };
  const dl = dashLink();

  return (
    <header
      className="sticky top-0 z-50 bg-white/96 backdrop-blur-lg border-b border-slate-100/80"
      style={{ boxShadow: "0 1px 16px rgba(10,36,99,0.05)" }}
    >
      <div className="container-shell flex items-center justify-between py-3.5 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--navy)] flex items-center justify-center">
            <Anchor className="h-5 w-5 text-[var(--gold)]" />
          </div>
          <div className="leading-none">
            <p className="font-extrabold text-[var(--navy)] text-lg">بحرنا</p>
            <p className="text-[10px] text-slate-400 mt-0.5">حجوزات اليخوت السعودية</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(link.href)
                  ? "bg-[var(--navy)] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[var(--navy)]"
              }`}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth section */}
        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? (
            <div className="w-5 h-5 border-2 border-slate-200 border-t-[var(--navy)] rounded-full animate-spin" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--sand)] flex items-center justify-center text-[var(--navy)] font-bold text-sm">
                  {session.user?.name?.[0] ?? "U"}
                </div>
                <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate hidden lg:block">
                  {session.user?.name}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-luxury z-40 overflow-hidden py-1">
                    {dl && (
                      <Link
                        href={dl.href}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-[var(--navy)] hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" /> {dl.label}
                      </Link>
                    )}
                    {session.user?.role === "CUSTOMER" && (
                      <Link
                        href="/my-bookings"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Ship className="h-4 w-4" /> حجوزاتي
                      </Link>
                    )}
                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full"
                      >
                        <LogOut className="h-4 w-4" /> تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-[var(--navy)] rounded-xl border-2 border-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition"
              >
                <LogIn className="h-4 w-4" /> دخول
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-[var(--navy)] rounded-xl hover:bg-[#091d4f] transition"
              >
                <User className="h-4 w-4" /> تسجيل
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="القائمة"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1.5">
          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 py-2.5 px-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 hover:text-[var(--navy)]"
              onClick={() => setMobileOpen(false)}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            {session ? (
              <>
                {dl && (
                  <Link
                    href={dl.href}
                    className="col-span-2 text-center py-2.5 text-sm font-bold text-[var(--navy)] border-2 border-[var(--navy)] rounded-xl"
                    onClick={() => setMobileOpen(false)}
                  >
                    {dl.label}
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="col-span-2 text-center py-2 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-center py-2.5 text-sm font-bold text-[var(--navy)] border-2 border-[var(--navy)] rounded-xl" onClick={() => setMobileOpen(false)}>
                  دخول
                </Link>
                <Link href="/register" className="text-center py-2.5 text-sm font-bold text-white bg-[var(--navy)] rounded-xl" onClick={() => setMobileOpen(false)}>
                  تسجيل
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
