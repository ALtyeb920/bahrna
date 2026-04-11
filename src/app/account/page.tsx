import { requireCustomer } from "@/lib/session";
import { getCustomerStats, getCustomerBookings } from "@/lib/server-data";
import { StatusBadge, EmptyBookings } from "@/components/ui/states";
import Link from "next/link";
import { User, CalendarDays, TrendingUp, CheckCircle2 } from "lucide-react";

export default async function AccountPage() {
  const session = await requireCustomer();
  const userId = session.user.id;

  let stats = { totalBookings: 0, confirmedBookings: 0, completedBookings: 0, cancelledBookings: 0, totalSpent: 0 };
  let bookings: Awaited<ReturnType<typeof getCustomerBookings>> = [];
  try {
    [stats, bookings] = await Promise.all([getCustomerStats(userId), getCustomerBookings(userId)]);
  } catch {}

  return (
    <div className="container-shell py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 flex flex-wrap items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[var(--sand)] flex items-center justify-center text-[var(--navy)] font-extrabold text-2xl">
          {session.user.name?.[0] ?? "E"}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[var(--navy)]">{session.user.name}</h1>
          <p className="text-sm text-slate-500">{session.user.email}</p>
          <span className="badge bg-blue-100 text-blue-700 mt-1 inline-block">عميل</span>
        </div>
        <div className="mr-auto flex gap-3">
          <Link href="/account/settings" className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-[var(--navy)] transition">
            تعديل الملف
          </Link>
          <Link href="/api/auth/signout" className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-bold hover:bg-red-100 transition">
            تسجيل الخروج
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "إجمالي الحجوزات", value: stats.totalBookings, icon: CalendarDays, color: "bg-[var(--navy)]" },
          { label: "مؤكدة", value: stats.confirmedBookings, icon: CheckCircle2, color: "bg-green-500" },
          { label: "مكتملة", value: stats.completedBookings, icon: CheckCircle2, color: "bg-blue-500" },
          { label: "إجمالي الإنفاق", value: `${stats.totalSpent.toLocaleString()} ﷼`, icon: TrendingUp, color: "bg-amber-500", isText: true },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xl font-extrabold text-[var(--navy)]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* My Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-[var(--navy)]">حجوزاتي</h2>
          <Link href="/my-bookings" className="text-sm font-bold text-[var(--ocean)] hover:underline">عرض الكل</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-3xl mb-3">🛥️</p>
            <p className="font-bold text-[var(--navy)]">لا توجد حجوزات بعد</p>
            <Link href="/yachts" className="mt-3 inline-block text-sm font-bold text-[var(--ocean)] hover:underline">ابدأ باستكشاف اليخوت</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-bold text-[var(--navy)] text-sm">{b.yacht.name}</p>
                  <p className="text-xs text-slate-400">{b.bookingNumber} • {b.date} • {b.duration} ساعات</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-bold text-sm text-[var(--navy)]">{b.total.toLocaleString()} ﷼</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
