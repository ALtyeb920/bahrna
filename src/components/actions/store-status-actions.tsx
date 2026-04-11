"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Eye, Pencil } from "lucide-react";
import { updateStore } from "@/lib/actions/store";

export function StoreStatusActions({
  storeId,
  storeSlug,
  status,
}: {
  storeId: string;
  storeSlug: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);

  async function update(payload: { status?: string; commissionRate?: number }) {
    setLoading(true);
    await updateStore(storeId, payload);
    setLoading(false);
  }

  function editCommission() {
    const val = window.prompt("أدخل نسبة العمولة الجديدة (%):", "12");
    const rate = Number(val);
    if (!Number.isFinite(rate) || rate <= 0 || rate > 50) {
      window.alert("نسبة غير صحيحة. يجب أن تكون بين 1 و50.");
      return;
    }
    update({ commissionRate: rate });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "PENDING" && (
        <>
          <button disabled={loading} onClick={() => update({ status: "ACTIVE" })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition disabled:opacity-50">
            <CheckCircle2 className="h-3.5 w-3.5" /> موافقة
          </button>
          <button disabled={loading} onClick={() => update({ status: "REJECTED" })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition disabled:opacity-50">
            <XCircle className="h-3.5 w-3.5" /> رفض
          </button>
        </>
      )}

      <Link href={`/stores/${storeSlug}`} target="_blank"
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--navy)] hover:text-[var(--navy)] transition">
        <Eye className="h-3.5 w-3.5" /> عرض المتجر
      </Link>

      <button disabled={loading} onClick={editCommission}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--navy)] hover:text-[var(--navy)] transition disabled:opacity-50">
        <Pencil className="h-3.5 w-3.5" /> تعديل العمولة
      </button>

      {status === "ACTIVE" && (
        <button disabled={loading} onClick={() => update({ status: "SUSPENDED" })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition disabled:opacity-50 mr-auto">
          تعليق المتجر
        </button>
      )}
      {status === "SUSPENDED" && (
        <button disabled={loading} onClick={() => update({ status: "ACTIVE" })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-200 text-xs font-bold text-green-600 hover:bg-green-50 transition disabled:opacity-50 mr-auto">
          إعادة تفعيل
        </button>
      )}
    </div>
  );
}
