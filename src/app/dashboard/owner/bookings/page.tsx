import { getOwnerBookings } from "@/lib/server-data";
import { BookingStatusButtons } from "@/components/actions/booking-status-buttons";
import Link from "next/link";

const STATUS_LABELS: Record<string,string> = { CONFIRMED:"مؤكد", PENDING:"معلق", CANCELLED:"ملغي", COMPLETED:"مكتمل" };
const STATUS_STYLES: Record<string,string> = { CONFIRMED:"badge-confirmed", PENDING:"badge-pending", CANCELLED:"badge-cancelled", COMPLETED:"badge-completed" };
const PAY_LABELS: Record<string,string> = { PAID:"مدفوع", PENDING:"لم يُدفع", REFUNDED:"مسترجع" };

export default async function OwnerBookingsPage({ searchParams }: { searchParams?: { status?: string } }) {
  let bookings: Awaited<ReturnType<typeof getOwnerBookings>> = [];
  try {
    const { db } = await import("@/lib/db");
    const owner = await db.user.findFirst({ where: { role: "OPERATOR" } });
    if (owner) bookings = await getOwnerBookings(owner.id, searchParams?.status);
  } catch {}

  const TABS = [
    { value: "", label: "الكل", count: bookings.length },
    { value: "PENDING", label: "معلقة", count: bookings.filter(b => b.status === "PENDING").length },
    { value: "CONFIRMED", label: "مؤكدة", count: bookings.filter(b => b.status === "CONFIRMED").length },
    { value: "COMPLETED", label: "مكتملة", count: bookings.filter(b => b.status === "COMPLETED").length },
    { value: "CANCELLED", label: "ملغية", count: bookings.filter(b => b.status === "CANCELLED").length },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">الحجوزات</h1>
        <p className="text-sm text-slate-500 mt-1">إدارة جميع الحجوزات الواردة</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {TABS.map(t => (
          <a key={t.value} href={t.value ? `?status=${t.value}` : "/dashboard/owner/bookings"}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${(searchParams?.status ?? "") === t.value ? "bg-white text-[var(--navy)] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label} <span className="text-xs text-slate-400">({t.count})</span>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 border-b border-slate-100">
                {["رقم الحجز","العميل","اليخت","التاريخ","المدة","الإجمالي","عمولة","صافيك","الحالة","الدفع","إجراء"].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr><td colSpan={11} className="py-12 text-center text-slate-400">لا توجد حجوزات مطابقة</td></tr>
              ) : bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--navy)]">{b.bookingNumber}</td>
                  <td className="px-4 py-3"><p className="font-bold text-xs text-[var(--navy)]">{b.customerName}</p><p className="text-xs text-slate-400">{b.customerPhone}</p></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{b.yacht.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{b.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{b.duration}h</td>
                  <td className="px-4 py-3 text-xs font-bold text-[var(--navy)]">{b.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-amber-600">−{b.platformCommission.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-green-600">+{b.ownerPayout.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`badge ${STATUS_STYLES[b.status] || "badge-pending"}`}>{STATUS_LABELS[b.status] || b.status}</span></td>
                  <td className="px-4 py-3"><span className={`badge ${b.paymentStatus === "PAID" ? "badge-paid" : "badge-pending"}`}>{PAY_LABELS[b.paymentStatus] || b.paymentStatus}</span></td>
                  <td className="px-4 py-3"><BookingStatusButtons bookingId={b.id} currentStatus={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
