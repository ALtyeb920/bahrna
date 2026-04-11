"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { toggleYachtStatus } from "@/lib/actions/yacht";

export function YachtStatusToggle({ yachtId, currentStatus }: { yachtId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const isActive = currentStatus === "AVAILABLE";

  async function toggle() {
    setLoading(true);
    await toggleYachtStatus(yachtId, isActive ? "UNAVAILABLE" : "AVAILABLE");
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50 ${isActive ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"}`}
    >
      {isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
      {isActive ? "إيقاف مؤقت" : "تفعيل"}
    </button>
  );
}
