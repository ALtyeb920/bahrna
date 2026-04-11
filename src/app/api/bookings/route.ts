import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const bookings = await db.booking.findMany({
    include: {
      yacht: { select: { id: true, name: true, slug: true } },
      store: { select: { id: true, name: true, slug: true, commissionRate: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const yacht = await db.yacht.findUnique({ where: { slug: body.yachtSlug }, include: { store: true } });
  if (!yacht) return NextResponse.json({ message: "اليخت غير موجود" }, { status: 404 });

  const dur = Number(body.duration || 4);
  const base = yacht.pricePerHour * dur;
  const commission = Math.round(base * yacht.store.commissionRate / 100);
  const payout = base - commission;
  const vat = Math.round((base + commission) * 0.15);
  const total = base + vat;

  const booking = await db.booking.create({
    data: {
      bookingNumber: `YB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: body.date, startTime: body.startTime,
      duration: dur, numberOfGuests: Number(body.numberOfGuests || 1),
      baseAmount: base, subtotal: base,
      platformCommission: commission, ownerPayout: payout,
      vatAmount: vat, total,
      status: "PENDING", paymentStatus: "PENDING",
      customerName: body.customerName, customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null, notes: body.notes || null,
      yachtId: yacht.id, storeId: yacht.storeId,
    },
    include: {
      yacht: { select: { id: true, name: true, slug: true } },
      store: { select: { id: true, name: true, slug: true, commissionRate: true } },
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
