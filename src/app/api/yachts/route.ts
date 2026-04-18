import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  const body = await request.json();
  const stores = await db.store.findMany({ orderBy: { createdAt: "asc" } });
  const store = stores.find((item) => item.slug === body.storeSlug) ?? stores[0];

  if (!store) {
    return NextResponse.json({ message: "لا يوجد متجر متاح لربط اليخت." }, { status: 400 });
  }

  const yacht = await db.yacht.create({
    data: {
      name: body.name,
      slug: slugify(body.slug || body.name),
      location: body.location,
      city: body.city,
      description: body.description,
      type: body.type,
      typeLabel: body.typeLabel,
      status: body.status || "ACTIVE",
      capacity: Number(body.capacity),
      pricePerHour: Number(body.pricePerHour),
      rating: Number(body.rating || 4.5),
      reviews: Number(body.reviews || 0),
      length: body.length ? Number(body.length) : null,
      cabins: body.cabins ? Number(body.cabins) : null,
      hasAC: Boolean(body.hasAC),
      hasWifi: Boolean(body.hasWifi),
      hasKitchen: Boolean(body.hasKitchen),
      hasWaterSports: Boolean(body.hasWaterSports),
      hasJetSki: Boolean(body.hasJetSki),
      isFeatured: Boolean(body.isFeatured),
      storeId: store.id,
      images: body.image ? {
        create: { url: body.image, isPrimary: true, sortOrder: 0 },
      } : undefined,
    },
  });

  return NextResponse.json(yacht, { status: 201 });
}
