import { getAllBookings, getAdminStores } from "@/lib/server-data";
import { Wallet, TrendingDown, CheckCircle2, ArrowDownRight } from "lucide-react";
import { CommissionCard } from "@/components/ui/commission-card";

export default async function AdminCommissionsPage() {
  let bookings: Awaited<ReturnType<typeof getAllBookings>> = [];
  let stores: Awaited<ReturnType<typeof getAdminStores>> = [];
  try {
    [bookings, stores] = await Promise.all([getAllBookings(), getAdminStores()]);
  } catch {}

  const paid = bookings.filter(b => b.paymentStatus === "PAID");
  const totalRevenue = paid.reduce((s, b) => s + b.total, 0);
  const totalCommissions = paid.reduce((s, b) => s + b.platformCommission, 0);
  const totalPayouts = paid.reduce((s, b) => s + b.ownerPayout, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">العمولات والمدفوعات</h1>
        <p className="text-sm text-slate-500 mt-1">تفاصيل جميع العمولات المحصلة ومدفوعات المشغلين</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "إجمالي الإيرادات", value: totalRevenue, icon: TrendingDown, color: "bg-[var(--navy)]" },
          { label: "عمولات بحرنا", value: totalCommissions, icon: Wallet, color: "bg-purple-600" },
          { label: "مدفوعات المشغلين", value: totalPayouts, icon: CheckCircle2, color: "bg-green-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[var(--navy)]">{s.value.toLocaleString()} ﷼</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <CommissionCard total={totalRevenue} commission={totalCommissions} payout={totalPayouts} variant="summary" />

      {/* Per Store Breakdown */}
      <div className="mt-8">
        <h2 className="font-extrabold text-[var(--navy)] mb-4">التفصيل بالمتجر</h2>
        <div className="grid gap-4">
          {stores.map(store => {
            const storeBookings = paid.filter(b => b.store.id === store.id);
            const rev = storeBookings.reduce((s, b) => s + b.total, 0);
            const comm = storeBookings.reduce((s, b) => s + b.platformCommission, 0);
            const pay = storeBookings.reduce((s, b) => s + b.ownerPayout, 0);
            return (
              <div key={store.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-[var(--navy)]">{store.name}</h3>
                    <p className="text-xs text-slate-400">{store.city} • {storeBookings.length} حجز مدفوع • عمولة {store.commissionRate}%</p>
                  </div>
                  <span className={`badge ${store.status === "ACTIVE" ? "badge-active" : "badge-review"}`}>
                    {store.status === "ACTIVE" ? "نشط" : "مراجعة"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">إجمالي الإيرادات</p>
                    <p className="font-extrabold text-[var(--navy)]">{rev.toLocaleString()} ﷼</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-amber-600">عمولة بحرنا</p>
                    <p className="font-extrabold text-amber-700">{comm.toLocaleString()} ﷼</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs text-green-600">مدفوع للمشغل</p>
                    <p className="font-extrabold text-green-700">{pay.toLocaleString()} ﷼</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Booking Table */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-[var(--navy)]">جميع معاملات العمولات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                {["رقم الحجز","المتجر","العميل","التاريخ","الإجمالي","عمولة","مدفوع للمشغل","الحالة"].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                  <td className="px-4 py-3 text-xs">{b.store.name}</td>
                  <td className="px-4 py-3 text-xs">{b.customerName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{b.date}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[var(--navy)]">{b.total.toLocaleString()} ﷼</td>
                  <td className="px-4 py-3 text-xs font-bold text-amber-600">{b.platformCommission.toLocaleString()} ﷼</td>
                  <td className="px-4 py-3 text-xs font-bold text-green-600">{b.ownerPayout.toLocaleString()} ﷼</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${b.paymentStatus === "PAID" ? "badge-paid" : "badge-pending"}`}>
                      {b.paymentStatus === "PAID" ? "مدفوع" : "معلق"}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-slate-400 text-sm">لا توجد معاملات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
