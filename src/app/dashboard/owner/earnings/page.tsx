import { getOwnerBookings, getOwnerStore } from "@/lib/server-data";
import { Wallet, TrendingUp, TrendingDown, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { CommissionCard } from "@/components/ui/commission-card";

export default async function OwnerEarningsPage() {
  let bookings: Awaited<ReturnType<typeof getOwnerBookings>> = [];
  let store: Awaited<ReturnType<typeof getOwnerStore>> = null;
  try {
    const { db } = await import("@/lib/db");
    const owner = await db.user.findFirst({ where: { role: "OPERATOR" } });
    if (owner) {
      [bookings, store] = await Promise.all([getOwnerBookings(owner.id), getOwnerStore(owner.id)]);
    }
  } catch {}

  const paid = bookings.filter(b => b.paymentStatus === "PAID");
  const pending = bookings.filter(b => b.status === "PENDING");

  const totalRevenue = paid.reduce((s, b) => s + b.total, 0);
  const totalCommission = paid.reduce((s, b) => s + b.platformCommission, 0);
  const totalPayout = paid.reduce((s, b) => s + b.ownerPayout, 0);
  const pendingPayout = pending.reduce((s, b) => s + b.ownerPayout, 0);
  const commissionRate = store?.commissionRate ?? 12;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Wallet className="h-3.5 w-3.5" /> الأرباح والعمولات
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">تفاصيل الأرباح</h1>
        <p className="text-sm text-slate-500 mt-1">نظرة شاملة على إيراداتك وعمولات المنصة</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "إجمالي المدفوعات", value: totalRevenue, icon: TrendingUp, bg: "bg-[var(--navy)]", text: "text-white" },
          { label: "عمولة المنصة", value: totalCommission, icon: TrendingDown, bg: "bg-amber-500", text: "text-white" },
          { label: "صافي أرباحك", value: totalPayout, icon: CheckCircle2, bg: "bg-green-500", text: "text-white" },
          { label: "مبالغ معلقة", value: pendingPayout, icon: Clock, bg: "bg-slate-200", text: "text-[var(--navy)]" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`h-5 w-5 ${s.text}`} />
            </div>
            <p className="text-xl font-extrabold text-[var(--navy)]">{s.value.toLocaleString()} ﷼</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Commission Breakdown */}
      <div className="mb-8">
        <h2 className="font-extrabold text-[var(--navy)] mb-4">تفصيل توزيع الإيرادات</h2>
        <CommissionCard
          total={totalRevenue}
          commission={totalCommission}
          payout={totalPayout}
          commissionRate={commissionRate}
          variant="summary"
        />
      </div>

      {/* Commission Explained */}
      <div className="mb-8 bg-[var(--navy)] text-white rounded-2xl p-6">
        <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[var(--gold)]" /> كيف تُحسب العمولة؟
        </h3>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-bold text-[var(--gold)] mb-2">1. قيمة الحجز</p>
            <p className="text-white/80 leading-6">سعر الساعة × عدد الساعات = قيمة الحجز الأساسية</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-bold text-[var(--gold)] mb-2">2. عمولة بحرنا ({commissionRate}%)</p>
            <p className="text-white/80 leading-6">يُخصم {commissionRate}% من قيمة الحجز تلقائياً عند التأكيد</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-bold text-[var(--gold)] mb-2">3. صافي أرباحك</p>
            <p className="text-white/80 leading-6">تستلم {100 - commissionRate}% من قيمة كل حجز خلال 7 أيام</p>
          </div>
        </div>
      </div>

      {/* Booking History with Commission */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-[var(--navy)]">تاريخ الحجوزات والمدفوعات</h2>
          <span className="text-xs text-slate-400">{paid.length} حجز مدفوع</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                {["رقم الحجز","اليخت","التاريخ","الإجمالي",`عمولة ${commissionRate}%`,"صافيك","الحالة"].map(h => (
                  <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                  <td className="px-5 py-3 text-xs text-slate-600">{b.yacht.name}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{b.date}</td>
                  <td className="px-5 py-3 text-xs font-bold text-[var(--navy)]">{b.total.toLocaleString()} ﷼</td>
                  <td className="px-5 py-3 text-xs font-bold text-amber-600">−{b.platformCommission.toLocaleString()} ﷼</td>
                  <td className="px-5 py-3 text-xs font-bold text-green-600">+{b.ownerPayout.toLocaleString()} ﷼</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${b.paymentStatus === "PAID" ? "badge-paid" : "badge-pending"}`}>
                      {b.paymentStatus === "PAID" ? "مدفوع" : "معلق"}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-slate-400 text-sm">لا توجد بيانات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
