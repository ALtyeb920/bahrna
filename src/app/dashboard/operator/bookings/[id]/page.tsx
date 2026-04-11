import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingStatusButtons } from "@/components/actions/booking-status-buttons";
import { getBookingById } from "@/lib/server-data";

export default async function BookingDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { created?: string };
}) {
  let booking: Awaited<ReturnType<typeof getBookingById>> = null;
  try {
    booking = await getBookingById(params.id);
  } catch {
    notFound();
  }

  if (!booking) notFound();


  return (
    <div className="mx-auto max-w-4xl p-6">
      {searchParams?.created ? (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          تم إنشاء الحجز بنجاح وحفظه في قاعدة البيانات.
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">رقم الحجز</p>
            <h1 className="text-2xl font-extrabold text-brand-primary">{booking.bookingNumber}</h1>
          </div>
          <BookingStatusButtons bookingId={booking.id} currentStatus={booking.status} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">العميل</p>
            <p className="mt-1 font-bold text-brand-primary">{booking.customerName}</p>
            <p className="text-sm text-slate-600">{booking.customerPhone}</p>
            <p className="text-sm text-slate-600">{booking.customerEmail || "لا يوجد بريد"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">اليخت</p>
            <p className="mt-1 font-bold text-brand-primary">{booking.yacht.name}</p>
            <Link href={`/yachts/${booking.yacht.slug}`} className="text-sm text-brand-accent">
              عرض صفحة اليخت
            </Link>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">موعد الرحلة</p>
            <p className="mt-1 font-bold text-brand-primary">
              {booking.date} - {booking.startTime}
            </p>
            <p className="text-sm text-slate-600">{booking.duration} ساعات</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">الحالة المالية</p>
            <p className="mt-1 font-bold text-brand-primary">{booking.paymentStatus}</p>
            <p className="text-sm text-slate-600">{booking.total.toLocaleString()} ريال</p>
          </div>
        </div>

        {booking.notes ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">ملاحظات</p>
            <p className="mt-1 text-sm text-slate-700">{booking.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
