import { requireCustomer } from "@/lib/session";
import { getCustomerBookings } from "@/lib/server-data";
import { StatusBadge, EmptyBookings } from "@/components/ui/states";
import Link from "next/link";

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const session = await requireCustomer();
  let bookings: Awaited<ReturnType<typeof getCustomerBookings>> = [];
  try { bookings = await getCustomerBookings(session.user.id); } catch {}

  const filtered = searchParams?.status ? bookings.filter(b => b.status === searchParams.status) : bookings;

  return (
    <div className="container-shell py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">حجوزاتي</h1>
        <p className="text-sm text-slate-500 mt-1">{bookings.length} حجز إجمالي</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {[
          { value: "", label: "الكل" },
          { value: "CONFIRMED", label: "مؤكدة" },
          { value: "PENDING", label: "معلقة" },
          { value: "COMPLETED", label: "مكتملة" },
          { value: "CANCELLED", label: "ملغية" },
        ].map(t => (
          <a key={t.value} href={t.value ? `?status=${t.value}` : "/my-bookings"}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${(searchParams?.status ?? "") === t.value ? "bg-white text-[var(--navy)] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyBookings />
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-[var(--navy)] bg-slate-100 px-2 py-0.5 rounded">{b.bookingNumber}</span>
                    <StatusBadge status={b.status} />
                    <StatusBadge status={b.paymentStatus} />
                  </div>
                  <h3 className="font-extrabold text-[var(--navy)]">{b.yacht.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                    <span>📅 {b.date}</span>
                    <span>🕐 {b.startTime}</span>
                    <span>⏱️ {b.duration} ساعات</span>
                    <span>👥 {b.numberOfGuests} أشخاص</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-[var(--navy)]">{b.total.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">ريال سعودي</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">{b.store.name}</p>
                <div className="flex gap-2">
                  <Link href={`/yachts/${b.yacht.slug}`} className="text-xs font-bold text-[var(--ocean)] hover:underline">عرض اليخت</Link>
                  {b.status === "PENDING" && (
                    <button className="text-xs font-bold text-red-500 hover:underline">إلغاء الحجز</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
