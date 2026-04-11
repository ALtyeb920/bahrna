import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  const store = await db.store.update({
    where: { id: params.id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.commissionRate ? { commissionRate: Number(body.commissionRate) } : {}),
    },
  });

  return NextResponse.json(store);
}
