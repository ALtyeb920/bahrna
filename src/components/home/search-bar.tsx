"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cities } from "@/lib/data";

export function SearchBarHome() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (date) params.set("date", date);
    if (guests) params.set("guests", guests);
    router.push(`/yachts?${params.toString()}`);
  }

  return (
    <div className="mt-4 rounded-[1.5rem] bg-white p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500 mb-1">المدينة</p>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full font-bold text-brand-primary bg-transparent outline-none text-sm"
          >
            <option value="">جميع المدن</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500 mb-1">التاريخ</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full font-bold text-brand-primary bg-transparent outline-none text-sm"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500 mb-1">عدد الأشخاص</p>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full font-bold text-brand-primary bg-transparent outline-none text-sm"
          >
            {[1,2,4,6,8,10,15,20,25,30].map((n) => (
              <option key={n} value={n}>{n} أشخاص</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="mt-4 w-full rounded-2xl bg-brand-primary px-5 py-4 text-sm font-bold text-white transition hover:bg-[#091d4f]"
      >
        ابدأ البحث الآن
      </button>
    </div>
  );
}
