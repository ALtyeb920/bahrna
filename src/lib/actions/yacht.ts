"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const TYPE_LABELS: Record<string, string> = {
  LUXURY_YACHT: "يخت فاخر", MOTOR_YACHT: "يخت بمحرك",
  CATAMARAN: "كاتاماران", SPEEDBOAT: "قارب سريع",
  SAILING_YACHT: "يخت شراعي", PARTY_BOAT: "قارب حفلات",
};

export async function createYacht(storeId: string, data: Record<string, unknown>) {
  try {
    const baseName = String(data.name ?? "yacht").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const slug = `${baseName}-${Math.floor(Math.random() * 10000)}`;
    const yacht = await db.yacht.create({
      data: {
        storeId, slug,
        name: String(data.name), location: String(data.location ?? ""), city: String(data.city ?? ""),
        description: String(data.description ?? ""), type: String(data.type),
        typeLabel: TYPE_LABELS[String(data.type)] ?? "يخت",
        capacity: Number(data.capacity), pricePerHour: Number(data.pricePerHour),
        minimumHours: Number(data.minimumHours ?? 2),
        image: String(data.image ?? "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&q=80"),
        imagesJson: data.imagesJson ? String(data.imagesJson) : null,
        length: data.length ? Number(data.length) : null,
        cabins: data.cabins ? Number(data.cabins) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        hasAC: Boolean(data.hasAC), hasWifi: Boolean(data.hasWifi),
        hasKitchen: Boolean(data.hasKitchen), hasWaterSports: Boolean(data.hasWaterSports),
        hasJetSki: Boolean(data.hasJetSki), hasMusic: Boolean(data.hasMusic),
        isFeatured: Boolean(data.isFeatured), departurePoint: data.departurePoint ? String(data.departurePoint) : null,
        cancellationPolicy: data.cancellationPolicy ? String(data.cancellationPolicy) : null,
      },
    });
    revalidatePath("/dashboard/owner/yachts");
    return { success: true, yachtId: yacht.id };
  } catch (e) { console.error(e); return { success: false, error: "فشل الإنشاء" }; }
}

export async function updateYacht(yachtId: string, data: Record<string, unknown>) {
  try {
    await db.yacht.update({
      where: { id: yachtId },
      data: {
        name: String(data.name), location: String(data.location ?? ""), city: String(data.city ?? ""),
        description: String(data.description ?? ""), type: String(data.type),
        typeLabel: TYPE_LABELS[String(data.type)] ?? "يخت",
        status: String(data.status ?? "AVAILABLE"),
        capacity: Number(data.capacity), pricePerHour: Number(data.pricePerHour),
        minimumHours: Number(data.minimumHours ?? 2),
        image: String(data.image), imagesJson: data.imagesJson ? String(data.imagesJson) : null,
        length: data.length ? Number(data.length) : null,
        cabins: data.cabins ? Number(data.cabins) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        hasAC: Boolean(data.hasAC), hasWifi: Boolean(data.hasWifi),
        hasKitchen: Boolean(data.hasKitchen), hasWaterSports: Boolean(data.hasWaterSports),
        hasJetSki: Boolean(data.hasJetSki), hasMusic: Boolean(data.hasMusic),
        isFeatured: Boolean(data.isFeatured), departurePoint: data.departurePoint ? String(data.departurePoint) : null,
        cancellationPolicy: data.cancellationPolicy ? String(data.cancellationPolicy) : null,
      },
    });
    revalidatePath("/dashboard/owner/yachts");
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function toggleYachtStatus(yachtId: string, status: string) {
  try {
    await db.yacht.update({ where: { id: yachtId }, data: { status } });
    revalidatePath("/dashboard/owner/yachts");
    return { success: true };
  } catch { return { success: false }; }
}
