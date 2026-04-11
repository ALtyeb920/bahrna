import { getAdminStats, getAllBookings, getAdminStores } from "@/lib/server-data";
import { TrendingUp, Calendar, Store, Ship } from "lucide-react";

export default async function AdminReportsPage() {
  let stats = { totalRevenue: 0, totalCommissions: 0, totalPayouts: 0, totalBookings: 0, totalStores: 0, totalYachts: 0 };
  let bookings: Awaited<ReturnType<typeof getAllBookings>> = [];
  let stores: Awaited<ReturnType<typeof getAdminStores>> = [];

  try {
    [stats, bookings, stores] = await Promise.all([getAdminStats(), getAllBookings(), getAdminStores()]);
  } catch {}

  const monthlyData: Record<string, { revenue: number; bookings: number; commission: number }> = {};
  bookings.forEach(b => {
    const month = b.date.slice(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, bookings: 0, commission: 0 };
    if (b.paymentStatus === "PAID") {
      monthlyData[month].revenue += b.total;
      monthlyData[month].commission += b.platformCommission;
    }
    monthlyData[month].bookings++;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">التقارير والإحصائيات</h1>
        <p className="text-sm text-slate-500 mt-1">ملخص شامل لأداء المنصة</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "إجمالي الإيرادات", value: `${stats.totalRevenue.toLocaleString()} ﷼`, icon: TrendingUp, color: "bg-[var(--navy)]" },
          { label: "عمولات المنصة", value: `${stats.totalCommissions.toLocaleString()} ﷼`, icon: TrendingUp, color: "bg-purple-600" },
          { label: "إجمالي الحجوزات", value: String(stats.totalBookings), icon: Calendar, color: "bg-[var(--ocean)]" },
          { label: "المتاجر النشطة", value: String(stats.activeStores ?? 0), icon: Store, color: "bg-green-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-11 h-11 rounded-2xl ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-[var(--navy)]">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Breakdown */}
      {Object.keys(monthlyData).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-[var(--navy)]">التفصيل الشهري</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500">
                  {["الشهر","عدد الحجوزات","الإيرادات","عمولة المنصة","مدفوعات المشغلين"].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(monthlyData).sort((a,b) => b[0].localeCompare(a[0])).map(([month, data]) => (
                  <tr key={month} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-bold text-[var(--navy)]">{month}</td>
                    <td className="px-5 py-3 text-slate-600">{data.bookings}</td>
                    <td className="px-5 py-3 font-bold text-[var(--navy)]">{data.revenue.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3 font-bold text-amber-600">{data.commission.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3 font-bold text-green-600">{(data.revenue - data.commission).toLocaleString()} ﷼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Per Store */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-[var(--navy)]">الأداء بالمتجر</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                {["المتجر","المدينة","اليخوت","الحجوزات","الإيرادات","العمولة","الصافي","نسبة العمولة"].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stores.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-[var(--navy)] text-sm">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{s.city}</td>
                  <td className="px-4 py-3 text-xs">{s.yachtCount}</td>
                  <td className="px-4 py-3 text-xs">{s.bookingCount}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[var(--navy)]">{s.totalRevenue.toLocaleString()} ﷼</td>
                  <td className="px-4 py-3 text-xs font-bold text-amber-600">{s.totalCommission.toLocaleString()} ﷼</td>
                  <td className="px-4 py-3 text-xs font-bold text-green-600">{s.totalPayout.toLocaleString()} ﷼</td>
                  <td className="px-4 py-3 text-xs">{s.commissionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
