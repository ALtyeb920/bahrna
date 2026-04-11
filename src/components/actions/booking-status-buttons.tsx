"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import { updateBookingStatus } from "@/lib/actions/booking";

export function BookingStatusButtons({
  bookingId,
  currentStatus,
  basePath = "/owner",
}: {
  bookingId: string;
  currentStatus: string;
  basePath?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function update(status: string, paymentStatus?: string) {
    setLoading(true);
    await updateBookingStatus(bookingId, status, paymentStatus);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus === "PENDING" && (
        <>
          <button
            disabled={loading}
            onClick={() => update("CONFIRMED", "PAID")}
            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
            title="قبول"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button
            disabled={loading}
            onClick={() => update("CANCELLED")}
            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
            title="رفض"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </>
      )}
      <Link
        href={`${basePath}/bookings/${bookingId}`}
        className="p-1.5 rounded-lg bg-blue-50 text-[var(--ocean)] hover:bg-blue-100 transition"
        title="عرض"
      >
        <Eye className="h-4 w-4" />
      </Link>
    </div>
  );
}
