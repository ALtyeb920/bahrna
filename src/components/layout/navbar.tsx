"use client";

import { Anchor, Menu, X, User, LogIn, Store, Ship, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/yachts", label: "اليخوت", icon: Ship },
  { href: "/stores", label: "المتاجر", icon: Store },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const getDashboardLink = () => {
    if (!session) return null;
    const role = session.user?.role;
    if (role === "ADMIN") return { href: "/admin", label: "لوحة الإدارة" };
    if (role === "OPERATOR") return { href: "/owner", label: "لوحة المشغّل" };
    return { href: "/account", label: "حسابي" };
  };

  const dashLink = getDashboardLink();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100" style={{ boxShadow: "0 1px 12px rgba(10,36,99,0.06)" }}>
      <div className="container-shell flex items-center justify-between py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--navy)]">
            <Anchor className="h-5 w-5 text-[var(--gold)]" />
          </div>
          <div>
            <p className="font-extrabold text-[var(--navy)] leading-none text-lg">بحرنا</p>
            <p className="text-xs text-slate-400 mt-0.5">حجوزات اليخوت السعودية</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${isActive(link.href) ? "bg-[var(--navy)] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[var(--navy)]"}`}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? (
            <div className="w-6 h-6 border-2 border-slate-200 border-t-[var(--navy)] rounded-full animate-spin" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--sand)] flex items-center justify-center text-[var(--navy)] font-bold text-sm">
                  {session.user?.name?.[0] ?? "U"}
                </div>
                <span className="text-sm font-bold text-slate-700 max-w-[120px] truncate">{session.user?.name}</span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-luxury z-40 overflow-hidden">
                    {dashLink && (
                      <Link href={dashLink.href} className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[var(--navy)] hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" /> {dashLink.label}
                      </Link>
                    )}
                    {session.user?.role === "CUSTOMER" && (
                      <Link href="/my-bookings" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                        <Ship className="h-4 w-4" /> حجوزاتي
                      </Link>
                    )}
                    <div className="border-t border-slate-100">
                      <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full">
                        <LogOut className="h-4 w-4" /> تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[var(--navy)] rounded-xl border border-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition">
                <LogIn className="h-4 w-4" /> دخول
              </Link>
              <Link href="/register" className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[var(--navy)] rounded-xl hover:bg-[#091d4f] transition">
                <User className="h-4 w-4" /> تسجيل
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-2 py-2 px-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50"
              onClick={() => setOpen(false)}>
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100">
            {session ? (
              <>
                {dashLink && (
                  <Link href={dashLink.href} className="block py-2 px-3 text-sm font-bold text-[var(--navy)] rounded-xl hover:bg-slate-50" onClick={() => setOpen(false)}>
                    {dashLink.label}
                  </Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-right py-2 px-3 text-sm text-red-500 font-bold rounded-xl hover:bg-red-50">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="text-center py-2 text-sm font-bold text-[var(--navy)] border border-[var(--navy)] rounded-xl" onClick={() => setOpen(false)}>دخول</Link>
                <Link href="/register" className="text-center py-2 text-sm font-bold text-white bg-[var(--navy)] rounded-xl" onClick={() => setOpen(false)}>تسجيل</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
