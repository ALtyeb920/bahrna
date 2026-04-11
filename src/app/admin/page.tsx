import Link from "next/link";
import { Users, Store, Ship, CalendarDays, TrendingUp, Wallet, AlertCircle, CheckCircle2, ArrowUpRight, Clock } from "lucide-react";
import { getAdminStats, getAdminStores, getAllBookings } from "@/lib/server-data";
import { CommissionCard } from "@/components/ui/commission-card";
import { StatusBadge } from "@/components/ui/states";

function StatCard({ title, value, sub, icon: Icon, color, href }: {
  title: string; value: string; sub: string; icon: React.ElementType; color: string; href?: string;
}) {
  const Wrapper = href ? Link : "div";
  return (
    <Wrapper href={href as string} className={`bg-white rounded-2xl border border-slate-200 p-5 ${href ? "hover:border-[var(--navy)] transition cursor-pointer group" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {href && <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-[var(--navy)] transition" />}
      </div>
      <p className="text-2xl font-extrabold text-[var(--navy)]">{value}</p>
      <p className="text-sm font-bold text-slate-700 mt-1">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </Wrapper>
  );
}

export default async function AdminPage() {
  let stats = {
    totalUsers: 0, customerCount: 0, operatorCount: 0,
    totalStores: 0, activeStores: 0, pendingStores: 0,
    totalYachts: 0, activeYachts: 0,
    totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, completedBookings: 0,
    totalRevenue: 0, totalCommissions: 0, totalPayouts: 0, pendingPayouts: 0,
  };
  let stores: Awaited<ReturnType<typeof getAdminStores>> = [];
  let bookings: Awaited<ReturnType<typeof getAllBookings>> = [];

  try {
    [stats, stores, bookings] = await Promise.all([getAdminStats(), getAdminStores(), getAllBookings()]);
  } catch {}

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">لوحة إدارة المنصة</h1>
          <p className="text-sm text-slate-500 mt-1">نظرة شاملة على كامل المنصة في الوقت الفعلي</p>
        </div>
        {stats.pendingStores > 0 && (
          <Link href="/admin/stores?status=PENDING" className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 transition">
            <AlertCircle className="h-4 w-4" /> {stats.pendingStores} متجر ينتظر الموافقة
          </Link>
        )}
      </div>

      {/* Revenue Banner */}
      <div className="bg-[var(--navy)] rounded-2xl p-6 text-white">
        <p className="text-sm font-bold text-[var(--gold)] mb-1">إجمالي إيرادات المنصة</p>
        <p className="text-4xl font-extrabold">{stats.totalRevenue.toLocaleString("ar-SA")} ﷼</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "عمولات بحرنا", value: stats.totalCommissions, color: "text-[var(--gold)]" },
            { label: "مدفوعات المشغلين", value: stats.totalPayouts, color: "text-green-300" },
            { label: "متوسط الحجز", value: stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0, color: "text-white" },
            { label: "مدفوعات معلقة", value: stats.pendingPayouts, color: "text-amber-300" },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3">
              <p className={`text-xl font-extrabold ${s.color}`}>{s.value.toLocaleString()} ﷼</p>
              <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="إجمالي المستخدمين"  value={String(stats.totalUsers)}    sub={`${stats.customerCount} عميل • ${stats.operatorCount} مشغّل`} icon={Users}      color="bg-[var(--navy)]"  href="/admin/users" />
        <StatCard title="المتاجر"             value={String(stats.totalStores)}   sub={`${stats.activeStores} نشط • ${stats.pendingStores} مراجعة`}  icon={Store}      color="bg-purple-600"    href="/admin/stores" />
        <StatCard title="اليخوت"              value={String(stats.totalYachts)}   sub={`${stats.activeYachts} متاح`}                                  icon={Ship}       color="bg-[var(--ocean)]" href="/admin/yachts" />
        <StatCard title="الحجوزات المعلقة"   value={String(stats.pendingBookings)} sub="تحتاج مراجعة الآن"                                           icon={AlertCircle} color="bg-amber-500"    href="/admin/bookings?status=PENDING" />
      </div>

      {/* Commission Overview */}
      {stats.totalRevenue > 0 && (
        <div>
          <h2 className="font-extrabold text-[var(--navy)] mb-4">توزيع الإيرادات</h2>
          <CommissionCard total={stats.totalRevenue} commission={stats.totalCommissions} payout={stats.totalPayouts} variant="summary" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-[var(--navy)]">أحدث الحجوزات</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-[var(--ocean)] hover:underline flex items-center gap-1">
              عرض الكل <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-bold text-[var(--navy)] text-sm">{b.customerName}</p>
                  <p className="text-xs text-slate-400">{b.yacht.name} • {b.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-bold text-sm text-[var(--navy)]">{b.total.toLocaleString()} ﷼</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
            {bookings.length === 0 && <p className="py-8 text-center text-slate-400 text-sm">لا توجد حجوزات بعد</p>}
          </div>
        </div>

        {/* Stores */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-[var(--navy)]">المتاجر</h2>
            <Link href="/admin/stores" className="text-sm font-bold text-[var(--ocean)] hover:underline">إدارة</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stores.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-bold text-[var(--navy)] text-sm">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.city} • {s.yachtCount} يخت • عمولة {s.commissionRate}%</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs font-bold text-green-600">{s.totalPayout.toLocaleString()} ﷼</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
