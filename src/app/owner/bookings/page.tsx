import { requireOperator } from "@/lib/session";
import { getOwnerBookings } from "@/lib/server-data";
import { BookingStatusButtons } from "@/components/actions/booking-status-buttons";
import { StatusBadge, EmptyBookings } from "@/components/ui/states";

export default async function OwnerBookingsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const session = await requireOperator();
  let bookings: Awaited<ReturnType<typeof getOwnerBookings>> = [];
  try { bookings = await getOwnerBookings(session.user.id, searchParams?.status); } catch {}

  const counts = {
    all: bookings.length,
    PENDING: bookings.filter(b => b.status === "PENDING").length,
    CONFIRMED: bookings.filter(b => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter(b => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">الحجوزات</h1>
        <p className="text-sm text-slate-500 mt-1">{bookings.length} حجز</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {[
          { value: "", label: "الكل", count: counts.all },
          { value: "PENDING", label: "معلقة", count: counts.PENDING },
          { value: "CONFIRMED", label: "مؤكدة", count: counts.CONFIRMED },
          { value: "COMPLETED", label: "مكتملة", count: counts.COMPLETED },
          { value: "CANCELLED", label: "ملغية", count: counts.CANCELLED },
        ].map(t => (
          <a key={t.value} href={t.value ? `?status=${t.value}` : "/owner/bookings"}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${(searchParams?.status ?? "") === t.value ? "bg-white text-[var(--navy)] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label} <span className="text-xs text-slate-400">({t.count})</span>
          </a>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyBookings href="/owner/yachts" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 border-b">
                  {["رقم الحجز","العميل","اليخت","التاريخ","المدة","الإجمالي","عمولة","صافيك","الحالة","الدفع","إجراء"].map(h => (
                    <th key={h} className="px-4 py-3 text-right font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                    <td className="px-4 py-3"><p className="font-bold text-xs">{b.customerName}</p><p className="text-xs text-slate-400">{b.customerPhone}</p></td>
                    <td className="px-4 py-3 text-xs">{b.yacht.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{b.date} {b.startTime}</td>
                    <td className="px-4 py-3 text-xs">{b.duration}h</td>
                    <td className="px-4 py-3 text-xs font-bold text-[var(--navy)]">{b.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-bold text-amber-600">−{b.platformCommission.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-bold text-green-600">+{b.ownerPayout.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                    <td className="px-4 py-3"><BookingStatusButtons bookingId={b.id} currentStatus={b.status} /></td>
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
