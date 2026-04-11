import { getAllYachts } from "@/lib/server-data";
import { StatusBadge, EmptyState } from "@/components/ui/states";
import { Star, Users, TrendingUp } from "lucide-react";

export default async function AdminYachtsPage() {
  let yachts: Awaited<ReturnType<typeof getAllYachts>> = [];
  try { yachts = await getAllYachts(); } catch {}

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">اليخوت</h1>
        <p className="text-sm text-slate-500 mt-1">{yachts.length} يخت مُدرج</p>
      </div>

      {yachts.length === 0 ? (
        <EmptyState icon="⚓" title="لا توجد يخوت بعد" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 border-b">
                  {["اليخت","المتجر","النوع","السعة","السعر/ساعة","التقييم","الحالة"].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {yachts.map(y => (
                  <tr key={y.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${y.image})` }} />
                        <div>
                          <p className="font-bold text-[var(--navy)] text-sm">{y.name}</p>
                          <p className="text-xs text-slate-400">{y.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs">{y.store.name}</td>
                    <td className="px-5 py-3 text-xs">{y.typeLabel}</td>
                    <td className="px-5 py-3 text-xs">{y.capacity} شخص</td>
                    <td className="px-5 py-3 text-xs font-bold text-[var(--navy)]">{y.pricePerHour.toLocaleString()} ﷼</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3.5 w-3.5 star-filled" />
                        <span className="font-bold">{y.rating}</span>
                        <span className="text-slate-400">({y.reviews})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={y.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
