import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  const booking = await db.booking.update({
    where: { id: params.id },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
    },
  });

  return NextResponse.json(booking);
}
