import { requireOperator } from "@/lib/session";
import { getBookingById } from "@/lib/server-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Ship, Calendar, Users, Clock, CreditCard, MessageSquare, Phone, Mail } from "lucide-react";
import { BookingStatusButtons } from "@/components/actions/booking-status-buttons";
import { StatusBadge } from "@/components/ui/states";
import { CommissionCard as CommCard } from "@/components/ui/commission-card";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  await requireOperator();

  let booking: Awaited<ReturnType<typeof getBookingById>> = null;
  try { booking = await getBookingById(params.id); } catch {}
  if (!booking) notFound();

  const timeline = [
    { label: "تم إنشاء الحجز", date: booking.createdAt, done: true },
    { label: "تم الدفع", date: booking.paidAt, done: !!booking.paidAt },
    { label: "تم التأكيد", date: booking.confirmedAt, done: !!booking.confirmedAt },
    { label: "اكتملت الرحلة", date: booking.completedAt, done: !!booking.completedAt },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/owner/bookings" className="p-2 rounded-xl hover:bg-slate-100 transition">
            <ChevronRight className="h-5 w-5 text-slate-500" />
          </Link>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">تفاصيل الحجز</p>
            <h1 className="text-2xl font-extrabold text-[var(--navy)]">{booking.bookingNumber}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} />
          <StatusBadge status={booking.paymentStatus} />
          <BookingStatusButtons bookingId={booking.id} currentStatus={booking.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main */}
        <div className="space-y-5">
          {/* Trip Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-[var(--navy)] mb-4 flex items-center gap-2">
              <Ship className="h-5 w-5 text-[var(--ocean)]" /> تفاصيل الرحلة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Ship, label: "اليخت", value: booking.yacht.name },
                { icon: Calendar, label: "التاريخ", value: booking.date },
                { icon: Clock, label: "الوقت والمدة", value: `${booking.startTime} • ${booking.duration}h` },
                { icon: Users, label: "عدد الأشخاص", value: `${booking.numberOfGuests} شخص` },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4">
                  <s.icon className="h-4 w-4 text-[var(--ocean)] mb-2" />
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="font-bold text-[var(--navy)] text-sm mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-[var(--navy)] mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--ocean)]" /> معلومات العميل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">الاسم</p>
                <p className="font-bold text-[var(--navy)]">{booking.customerName}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <Phone className="h-4 w-4 text-[var(--ocean)] mb-1" />
                <p className="text-xs text-slate-400">الجوال</p>
                <a href={`tel:${booking.customerPhone}`} className="font-bold text-[var(--navy)] hover:text-[var(--ocean)]">{booking.customerPhone}</a>
              </div>
              {booking.customerEmail && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <Mail className="h-4 w-4 text-[var(--ocean)] mb-1" />
                  <p className="text-xs text-slate-400">البريد</p>
                  <a href={`mailto:${booking.customerEmail}`} className="font-bold text-[var(--navy)] hover:text-[var(--ocean)] text-sm truncate block">{booking.customerEmail}</a>
                </div>
              )}
            </div>
            {booking.notes && (
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs text-amber-600 font-bold mb-1 flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> ملاحظات العميل</p>
                <p className="text-sm text-amber-800">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-[var(--navy)] mb-4">مراحل الحجز</h2>
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${t.done ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                    {t.done ? "✓" : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${t.done ? "text-green-700" : "text-slate-400"}`}>{t.label}</p>
                    {t.date && (
                      <p className="text-xs text-slate-400">
                        {new Date(t.date).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-[var(--navy)] mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[var(--ocean)]" /> ملاحظاتك على الحجز
            </h2>
            <textarea
              defaultValue={booking.operatorNotes ?? ""}
              rows={3}
              placeholder="أضف ملاحظات داخلية على هذا الحجز..."
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] resize-none"
            />
            <button className="mt-3 px-4 py-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 transition">
              حفظ الملاحظات
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-[var(--navy)] mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[var(--ocean)]" /> تفاصيل المبلغ
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">المبلغ الأساسي</span><span className="font-bold">{booking.baseAmount.toLocaleString()} ﷼</span></div>
              {booking.addonAmount > 0 && <div className="flex justify-between"><span className="text-slate-500">خدمات إضافية</span><span className="font-bold">{booking.addonAmount.toLocaleString()} ﷼</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">ضريبة القيمة المضافة</span><span className="font-bold">{booking.vatAmount.toLocaleString()} ﷼</span></div>
              <div className="flex justify-between font-extrabold text-[var(--navy)] border-t border-slate-100 pt-2">
                <span>الإجمالي</span><span>{booking.total.toLocaleString()} ﷼</span>
              </div>
            </div>
          </div>

          {/* Commission Breakdown */}
          <CommCard
            total={booking.total}
            commission={booking.platformCommission}
            payout={booking.ownerPayout}
            commissionRate={booking.store.commissionRate}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-[var(--navy)] mb-3">إجراءات سريعة</h2>
            <div className="space-y-2">
              <a href={`tel:${booking.customerPhone}`} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100 transition">
                <Phone className="h-4 w-4" /> الاتصال بالعميل
              </a>
              <a href={`https://wa.me/${booking.customerPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100 transition">
                💬 واتساب
              </a>
              <Link href={`/yachts/${booking.yacht.slug}`} target="_blank" className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-bold hover:bg-slate-100 transition">
                <Ship className="h-4 w-4" /> عرض صفحة اليخت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
