"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

function calcBookingAmounts(pricePerHour: number, duration: number, commissionRate: number) {
  const base = pricePerHour * duration;
  const commission = Math.round(base * commissionRate / 100);
  const payout = base - commission;
  const vat = Math.round((base + commission) * 0.15);
  return { base, commission, payout, vat, total: base + vat };
}

export async function createBooking(data: {
  yachtId: string; date: string; startTime: string;
  duration: number; numberOfGuests: number;
  customerName: string; customerPhone: string;
  customerEmail?: string | null; notes?: string | null;
}) {
  try {
    const yacht = await db.yacht.findUnique({
      where: { id: data.yachtId },
      include: { store: true },
    });
    if (!yacht) return { success: false, error: "اليخت غير موجود" };

    const amounts = calcBookingAmounts(yacht.pricePerHour, data.duration, yacht.store.commissionRate);
    const bookingNumber = `YB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = await db.booking.create({
      data: {
        bookingNumber,
        date: data.date,
        startTime: data.startTime,
        duration: Number(data.duration),
        numberOfGuests: Number(data.numberOfGuests),
        baseAmount: amounts.base,
        subtotal: amounts.base,
        platformCommission: amounts.commission,
        ownerPayout: amounts.payout,
        vatAmount: amounts.vat,
        total: amounts.total,
        status: "PENDING",
        paymentStatus: "PENDING",
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail ?? null,
        notes: data.notes ?? null,
        yachtId: yacht.id,
        storeId: yacht.storeId,
      },
    });

    revalidatePath("/dashboard/owner/bookings");
    revalidatePath("/dashboard/admin/bookings");
    return { success: true, bookingId: booking.id, bookingNumber: booking.bookingNumber, total: amounts.total };
  } catch (e) {
    console.error(e);
    return { success: false, error: "فشل في إنشاء الحجز" };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
  paymentStatus?: string
) {
  try {
    const extra: Record<string, unknown> = {};
    if (status === "CONFIRMED") extra.confirmedAt = new Date();
    if (status === "CANCELLED") extra.cancelledAt = new Date();
    if (paymentStatus === "PAID") extra.paidAt = new Date();

    await db.booking.update({
      where: { id: bookingId },
      data: { status, ...(paymentStatus && { paymentStatus }), ...extra },
    });

    revalidatePath("/dashboard/owner/bookings");
    revalidatePath("/dashboard/admin/bookings");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
