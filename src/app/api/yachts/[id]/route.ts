import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  const yacht = await db.yacht.update({
    where: { id: params.id },
    data: {
      ...(body.name ? { name: body.name } : {}),
      ...(body.location ? { location: body.location } : {}),
      ...(body.city ? { city: body.city } : {}),
      ...(body.description ? { description: body.description } : {}),
      ...(body.type ? { type: body.type } : {}),
      ...(body.typeLabel ? { typeLabel: body.typeLabel } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.capacity ? { capacity: Number(body.capacity) } : {}),
      ...(body.pricePerHour ? { pricePerHour: Number(body.pricePerHour) } : {}),
      ...(body.image ? { image: body.image, imagesJson: JSON.stringify([body.image]) } : {}),
      ...(body.length ? { length: Number(body.length) } : {}),
      ...(body.cabins ? { cabins: Number(body.cabins) } : {}),
      ...(typeof body.hasAC === "boolean" ? { hasAC: body.hasAC } : {}),
      ...(typeof body.hasWifi === "boolean" ? { hasWifi: body.hasWifi } : {}),
      ...(typeof body.hasKitchen === "boolean" ? { hasKitchen: body.hasKitchen } : {}),
      ...(typeof body.hasWaterSports === "boolean" ? { hasWaterSports: body.hasWaterSports } : {}),
      ...(typeof body.hasJetSki === "boolean" ? { hasJetSki: body.hasJetSki } : {}),
      ...(typeof body.isFeatured === "boolean" ? { isFeatured: body.isFeatured } : {}),
    },
  });

  return NextResponse.json(yacht);
}
