"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateStore(storeId: string, data: { status?: string; commissionRate?: number; name?: string; description?: string; marina?: string }) {
  try {
    await db.store.update({ where: { id: storeId }, data });
    revalidatePath("/dashboard/admin/stores");
    revalidatePath("/dashboard/owner/store");
    return { success: true };
  } catch {
    return { success: false };
  }
}
