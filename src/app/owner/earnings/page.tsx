import { requireOperator } from "@/lib/session";
import { getOwnerBookings, getOwnerStore } from "@/lib/server-data";
import { CommissionCard } from "@/components/ui/commission-card";
import { StatusBadge, EmptyState } from "@/components/ui/states";
import { Wallet, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default async function OwnerEarningsPage() {
  const session = await requireOperator();
  let bookings: Awaited<ReturnType<typeof getOwnerBookings>> = [];
  let store: Awaited<ReturnType<typeof getOwnerStore>> = null;
  try {
    [bookings, store] = await Promise.all([getOwnerBookings(session.user.id), getOwnerStore(session.user.id)]);
  } catch {}

  const paid = bookings.filter(b => b.paymentStatus === "PAID");
  const totalRevenue = paid.reduce((s, b) => s + b.total, 0);
  const totalCommission = paid.reduce((s, b) => s + b.platformCommission, 0);
  const totalPayout = paid.reduce((s, b) => s + b.ownerPayout, 0);
  const pendingPayout = bookings.filter(b => b.status === "PENDING").reduce((s, b) => s + b.ownerPayout, 0);
  const commissionRate = store?.commissionRate ?? 12;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">الأرباح والمدفوعات</h1>
        <p className="text-sm text-slate-500 mt-1">تفاصيل إيراداتك وعمولات المنصة</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "إجمالي المدفوعات", value: totalRevenue, icon: TrendingUp, color: "bg-[var(--navy)]" },
          { label: "عمولة المنصة", value: totalCommission, icon: Wallet, color: "bg-amber-500" },
          { label: "صافي أرباحك", value: totalPayout, icon: CheckCircle2, color: "bg-green-500" },
          { label: "مدفوعات معلقة", value: pendingPayout, icon: Clock, color: "bg-slate-300" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xl font-extrabold text-[var(--navy)]">{s.value.toLocaleString()} ﷼</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      {totalRevenue > 0 && (
        <>
          <CommissionCard total={totalRevenue} commission={totalCommission} payout={totalPayout} commissionRate={commissionRate} variant="summary" />

          {/* How it works */}
          <div className="bg-[var(--navy)] rounded-2xl p-6 text-white">
            <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[var(--gold)]" /> كيف تُحسب العمولة؟
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: "1", title: "قيمة الحجز", desc: "سعر الساعة × عدد الساعات = قيمة الحجز الأساسية" },
                { step: "2", title: `عمولة بحرنا (${commissionRate}%)`, desc: `يُخصم ${commissionRate}% تلقائياً عند تأكيد الحجز` },
                { step: "3", title: "صافي أرباحك", desc: `تستلم ${100 - commissionRate}% خلال 7 أيام من الاكتمال` },
              ].map(s => (
                <div key={s.step} className="bg-white/10 rounded-xl p-4">
                  <p className="font-bold text-[var(--gold)] mb-2">{s.step}. {s.title}</p>
                  <p className="text-white/80 leading-6 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* History */}
      {bookings.length === 0 ? (
        <EmptyState icon="💰" title="لا توجد إيرادات بعد" description="ستظهر إيراداتك هنا بعد أول حجز مؤكد" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-[var(--navy)]">سجل الإيرادات</h2>
            <span className="text-xs text-slate-400">{paid.length} حجز مكتمل</span>
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
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                    <td className="px-5 py-3 text-xs">{b.yacht.name}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{b.date}</td>
                    <td className="px-5 py-3 text-xs font-bold text-[var(--navy)]">{b.total.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3 text-xs font-bold text-amber-600">−{b.platformCommission.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3 text-xs font-bold text-green-600">+{b.ownerPayout.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3"><StatusBadge status={b.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
