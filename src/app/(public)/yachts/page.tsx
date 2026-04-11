import { getAllYachts } from "@/lib/server-data";
import { YachtCard } from "@/components/ui/yacht-card";
import { cities, yachtTypes } from "@/lib/data";
import { SlidersHorizontal } from "lucide-react";

export default async function YachtsPage({
  searchParams,
}: {
  searchParams?: { city?: string; type?: string; search?: string; minPrice?: string; maxPrice?: string; minCapacity?: string };
}) {
  let yachts: Awaited<ReturnType<typeof getAllYachts>> = [];
  try {
    yachts = await getAllYachts({
      city: searchParams?.city,
      type: searchParams?.type,
      search: searchParams?.search,
      minPrice: searchParams?.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined,
      minCapacity: searchParams?.minCapacity ? Number(searchParams.minCapacity) : undefined,
    });
  } catch {}

  return (
    <div className="container-shell py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-bold text-[var(--ocean)]">السوق</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[var(--navy)]">استكشاف اليخوت</h1>
        <p className="mt-2 text-sm text-slate-500">{yachts.length} يخت متاح للحجز</p>
      </div>

      {/* Filters */}
      <form method="GET" className="mb-8 bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-600">
          <SlidersHorizontal className="h-4 w-4" /> فلترة النتائج
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <input name="search" defaultValue={searchParams?.search ?? ""} type="text" placeholder="ابحث..." className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]" />
          <select name="city" defaultValue={searchParams?.city ?? ""} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]">
            <option value="">جميع المدن</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="type" defaultValue={searchParams?.type ?? ""} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]">
            <option value="">جميع الأنواع</option>
            {yachtTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <input name="minCapacity" defaultValue={searchParams?.minCapacity ?? ""} type="number" placeholder="أقل سعة" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]" />
          <button type="submit" className="rounded-xl bg-[var(--navy)] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#091d4f] transition">
            تطبيق
          </button>
        </div>

        {/* Active filter chips */}
        {(searchParams?.city || searchParams?.type || searchParams?.search) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            {searchParams?.city && (
              <span className="flex items-center gap-1 bg-[var(--sand)] text-[var(--navy)] text-xs font-bold px-3 py-1 rounded-full">
                {searchParams.city} <a href="/yachts" className="text-slate-400 hover:text-red-500 mr-1">×</a>
              </span>
            )}
            {searchParams?.type && (
              <span className="flex items-center gap-1 bg-[var(--sand)] text-[var(--navy)] text-xs font-bold px-3 py-1 rounded-full">
                {yachtTypes.find(t => t.value === searchParams.type)?.label}
                <a href="/yachts" className="text-slate-400 hover:text-red-500 mr-1">×</a>
              </span>
            )}
          </div>
        )}
      </form>

      {yachts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {yachts.map(yacht => <YachtCard key={yacht.id} yacht={yacht} />)}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200 bg-white">
          <p className="text-5xl mb-4">⚓</p>
          <h3 className="text-xl font-bold text-[var(--navy)]">لا توجد يخوت مطابقة</h3>
          <p className="mt-2 text-sm text-slate-500">جرّب تغيير الفلاتر</p>
          <a href="/yachts" className="mt-4 inline-block text-sm font-bold text-[var(--ocean)] hover:underline">مسح الفلاتر</a>
        </div>
      )}
    </div>
  );
}
