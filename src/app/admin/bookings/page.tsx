import { getAllBookings } from "@/lib/server-data";
import { StatusBadge, EmptyState } from "@/components/ui/states";
import Link from "next/link";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  let bookings: Awaited<ReturnType<typeof getAllBookings>> = [];
  try { bookings = await getAllBookings({ status: searchParams?.status }); } catch {}

  const totalRevenue = bookings.filter(b => b.paymentStatus === "PAID").reduce((s, b) => s + b.total, 0);
  const totalCommission = bookings.filter(b => b.paymentStatus === "PAID").reduce((s, b) => s + b.platformCommission, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">الحجوزات</h1>
        <p className="text-sm text-slate-500 mt-1">{bookings.length} حجز • {totalRevenue.toLocaleString()} ﷼ إيرادات • {totalCommission.toLocaleString()} ﷼ عمولات</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {[
          { value: "", label: "الكل" }, { value: "PENDING", label: "معلقة" },
          { value: "CONFIRMED", label: "مؤكدة" }, { value: "COMPLETED", label: "مكتملة" },
          { value: "CANCELLED", label: "ملغية" },
        ].map(t => (
          <a key={t.value} href={t.value ? `?status=${t.value}` : "/admin/bookings"}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${(searchParams?.status ?? "") === t.value ? "bg-white text-[var(--navy)] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label}
          </a>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon="📋" title="لا توجد حجوزات" description="ستظهر الحجوزات هنا عند وصولها" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 border-b border-slate-100">
                  {["رقم الحجز","العميل","اليخت","المتجر","التاريخ","الإجمالي","عمولة","صافي المشغّل","الحالة","الدفع"].map(h => (
                    <th key={h} className="px-4 py-3 text-right font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-xs text-[var(--navy)]">{b.customerName}</p>
                      <p className="text-xs text-slate-400">{b.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{b.yacht.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{b.store.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{b.date}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[var(--navy)] whitespace-nowrap">{b.total.toLocaleString()} ﷼</td>
                    <td className="px-4 py-3 text-xs font-bold text-amber-600 whitespace-nowrap">{b.platformCommission.toLocaleString()} ﷼</td>
                    <td className="px-4 py-3 text-xs font-bold text-green-600 whitespace-nowrap">{b.ownerPayout.toLocaleString()} ﷼</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
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
