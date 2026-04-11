import Link from "next/link";
import { requireOperator } from "@/lib/session";
import { getOwnerYachts } from "@/lib/server-data";
import { YachtStatusToggle } from "@/components/actions/yacht-status-toggle";
import { StatusBadge, EmptyYachts } from "@/components/ui/states";
import { Plus, Edit, Eye, Star, Users, TrendingUp } from "lucide-react";

export default async function OwnerYachtsPage() {
  const session = await requireOperator();
  let yachts: Awaited<ReturnType<typeof getOwnerYachts>> = [];
  try { yachts = await getOwnerYachts(session.user.id); } catch {}

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">اليخوت</h1>
          <p className="text-sm text-slate-500 mt-1">{yachts.length} يخت مُدرج</p>
        </div>
        <Link href="/owner/yachts/new" className="flex items-center gap-2 bg-[var(--navy)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
          <Plus className="h-4 w-4" /> إضافة يخت جديد
        </Link>
      </div>

      {yachts.length === 0 ? (
        <EmptyYachts />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {yachts.map(yacht => (
            <div key={yacht.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition">
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 relative" style={{ backgroundImage: `url(${yacht.image})` }}>
                  {yacht.isFeatured && (
                    <div className="absolute top-1 right-1 bg-[var(--gold)] text-[var(--navy)] text-xs font-bold px-1.5 py-0.5 rounded-full text-[10px]">⭐</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-extrabold text-[var(--navy)] truncate">{yacht.name}</h3>
                    <StatusBadge status={yacht.status} />
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{yacht.location} • {yacht.typeLabel}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 star-filled" />{yacht.rating} ({yacht.reviews})</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[var(--ocean)]" />{yacht.capacity} شخص</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-green-500" />{yacht.pricePerHour.toLocaleString()} ﷼/h</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
                <Link href={`/yachts/${yacht.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--navy)] transition">
                  <Eye className="h-3.5 w-3.5" /> معاينة
                </Link>
                <Link href={`/owner/yachts/${yacht.id}/edit`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--navy)] transition">
                  <Edit className="h-3.5 w-3.5" /> تعديل
                </Link>
                <div className="mr-auto">
                  <YachtStatusToggle yachtId={yacht.id} currentStatus={yacht.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
