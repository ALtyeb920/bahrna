import { BookingStatusButtons } from "@/components/actions/booking-status-buttons";
import { getOperatorBookings } from "@/lib/server-data";

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "مؤكد",
  PENDING: "معلق",
  CANCELLED: "ملغي",
  COMPLETED: "مكتمل",
  PAID: "مدفوع",
  REFUNDED: "مسترجع",
};

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "badge-confirmed",
  PENDING: "badge-pending",
  CANCELLED: "badge-cancelled",
  COMPLETED: "badge-completed",
};

export default async function OperatorBookingsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  let bookings: Awaited<ReturnType<typeof getOperatorBookings>> = [];
  try {
    bookings = await getOperatorBookings(searchParams?.status);
  } catch {
    // DB not ready
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-brand-primary">الحجوزات</h1>
        <p className="mt-1 text-sm text-slate-500">إدارة جميع حجوزات يخوتك من قاعدة البيانات</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                <th className="px-5 py-3 text-right font-medium">رقم الحجز</th>
                <th className="px-5 py-3 text-right font-medium">العميل</th>
                <th className="px-5 py-3 text-right font-medium">اليخت</th>
                <th className="px-5 py-3 text-right font-medium">التاريخ</th>
                <th className="px-5 py-3 text-right font-medium">المدة</th>
                <th className="px-5 py-3 text-right font-medium">المبلغ</th>
                <th className="px-5 py-3 text-right font-medium">الحالة</th>
                <th className="px-5 py-3 text-right font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    لا توجد حجوزات مطابقة
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-brand-primary">{booking.bookingNumber}</td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-brand-primary">{booking.customerName}</p>
                      <p className="text-xs text-slate-400">{booking.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{booking.yacht.name}</td>
                    <td className="px-5 py-3 text-slate-600">{booking.date}</td>
                    <td className="px-5 py-3 text-slate-600">{booking.duration} ساعات</td>
                    <td className="px-5 py-3 font-bold text-brand-primary">{booking.total.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[booking.status] || "bg-slate-100 text-slate-600"}`}>
                        {STATUS_LABELS[booking.status] || booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <BookingStatusButtons bookingId={booking.id} currentStatus={booking.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
