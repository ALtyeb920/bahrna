import Link from "next/link";
import { requireOperator } from "@/lib/session";
import { getOwnerStats, getOwnerBookings, getOwnerStore } from "@/lib/server-data";
import { CommissionCard } from "@/components/ui/commission-card";
import { StatusBadge, EmptyState } from "@/components/ui/states";
import { Ship, Wallet, AlertCircle, CalendarDays, ArrowUpRight, Plus, TrendingUp } from "lucide-react";

export default async function OwnerPage() {
  const session = await requireOperator();
  const ownerId = session.user.id;

  let stats: Awaited<ReturnType<typeof getOwnerStats>> = null;
  let bookings: Awaited<ReturnType<typeof getOwnerBookings>> = [];
  let store: Awaited<ReturnType<typeof getOwnerStore>> = null;

  try {
    [stats, bookings, store] = await Promise.all([
      getOwnerStats(ownerId),
      getOwnerBookings(ownerId),
      getOwnerStore(ownerId),
    ]);
  } catch {}

  // If no store, show onboarding
  if (!store) {
    return (
      <div className="max-w-2xl mx-auto p-6 pt-20 text-center">
        <div className="text-6xl mb-6">⚓</div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">أنشئ متجرك الأول</h1>
        <p className="text-slate-500 mt-3 leading-7">
          لم يتم إعداد متجرك بعد. قم بإنشاء متجرك لتتمكن من إضافة اليخوت واستقبال الحجوزات.
        </p>
        <Link href="/owner/store/new" className="mt-6 inline-flex items-center gap-2 bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
          <Plus className="h-4 w-4" /> إنشاء متجر
        </Link>
      </div>
    );
  }

  const paidBookings = bookings.filter(b => b.paymentStatus === "PAID");
  const totalRevenue = paidBookings.reduce((s, b) => s + b.total, 0);
  const totalCommission = paidBookings.reduce((s, b) => s + b.platformCommission, 0);
  const totalPayout = paidBookings.reduce((s, b) => s + b.ownerPayout, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            🚢 مشغّل يخوت
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">{store.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{store.city}{store.marina ? ` — ${store.marina}` : ""}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/owner/yachts/new" className="flex items-center gap-2 bg-[var(--navy)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
            <Ship className="h-4 w-4" /> إضافة يخت
          </Link>
        </div>
      </div>

      {/* Store pending warning */}
      {store.status === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800">متجرك قيد المراجعة</p>
            <p className="text-sm text-amber-700 mt-0.5">سيقوم فريق بحرنا بمراجعة متجرك قريباً. يمكنك إضافة يخوتك في هذه الأثناء.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "إجمالي الإيرادات", value: `${totalRevenue.toLocaleString()} ﷼`, sub: "من الحجوزات المدفوعة", icon: TrendingUp, color: "bg-[var(--navy)]" },
          { title: "صافي أرباحك", value: `${totalPayout.toLocaleString()} ﷼`, sub: `بعد خصم ${store.commissionRate}% عمولة`, icon: Wallet, color: "bg-green-500" },
          { title: "الحجوزات المعلقة", value: String(stats?.pendingBookings ?? 0), sub: "تحتاج موافقتك", icon: AlertCircle, color: "bg-amber-500" },
          { title: "اليخوت النشطة", value: String(stats?.activeYachts ?? 0), sub: `من أصل ${stats?.totalYachts ?? 0} يخت`, icon: Ship, color: "bg-[var(--ocean)]" },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-11 h-11 rounded-2xl ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-[var(--navy)]">{s.value}</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{s.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Commission Summary */}
      {totalRevenue > 0 && (
        <div>
          <h2 className="font-extrabold text-[var(--navy)] mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-[var(--gold)]" /> ملخص الأرباح والعمولات
          </h2>
          <CommissionCard total={totalRevenue} commission={totalCommission} payout={totalPayout} commissionRate={store.commissionRate} variant="summary" />
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "معلقة", count: stats?.pendingBookings ?? 0, href: "/owner/bookings?status=PENDING", color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "مؤكدة", count: stats?.confirmedBookings ?? 0, href: "/owner/bookings?status=CONFIRMED", color: "text-green-600 bg-green-50 border-green-100" },
          { label: "مكتملة", count: stats?.completedBookings ?? 0, href: "/owner/bookings?status=COMPLETED", color: "text-blue-600 bg-blue-50 border-blue-100" },
        ].map(item => (
          <Link key={item.label} href={item.href} className="group flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-4 hover:border-[var(--navy)] transition">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color}`}>
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--navy)]">حجوزات {item.label}</p>
              <p className="text-2xl font-extrabold text-[var(--navy)]">{item.count}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-[var(--navy)] transition" />
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-[var(--navy)]">أحدث الحجوزات</h2>
          <Link href="/owner/bookings" className="text-sm font-bold text-[var(--ocean)] hover:underline flex items-center gap-1">
            عرض الكل <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="font-bold text-[var(--navy)]">لا توجد حجوزات بعد</p>
            <p className="text-sm text-slate-400 mt-1">ستظهر الحجوزات هنا عند وصولها</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500">
                  {["رقم","العميل","اليخت","التاريخ","الإجمالي","عمولة","صافيك","الحالة","إجراء"].map(h => (
                    <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                    <td className="px-4 py-3"><p className="font-bold text-xs">{b.customerName}</p><p className="text-xs text-slate-400">{b.customerPhone}</p></td>
                    <td className="px-4 py-3 text-xs text-slate-600">{b.yacht.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{b.date}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[var(--navy)]">{b.total.toLocaleString()} ﷼</td>
                    <td className="px-4 py-3 text-xs font-bold text-amber-600">−{b.platformCommission.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-bold text-green-600">+{b.ownerPayout.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/owner/bookings/${b.id}`} className="text-xs font-bold text-[var(--ocean)] hover:underline">عرض</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
