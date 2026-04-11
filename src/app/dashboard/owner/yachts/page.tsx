import Link from "next/link";
import { Plus, Edit, Eye, Star, Users, TrendingUp } from "lucide-react";
import { YachtStatusToggle } from "@/components/actions/yacht-status-toggle";
import { getOwnerYachts } from "@/lib/server-data";

const S_STYLES: Record<string,string> = { AVAILABLE:"badge-active", UNAVAILABLE:"badge-cancelled", MAINTENANCE:"badge-pending", UNDER_REVIEW:"badge-review" };
const S_LABELS: Record<string,string> = { AVAILABLE:"متاح", UNAVAILABLE:"غير متاح", MAINTENANCE:"صيانة", UNDER_REVIEW:"مراجعة" };

export default async function OwnerYachtsPage() {
  let yachts: Awaited<ReturnType<typeof getOwnerYachts>> = [];
  try {
    const { db } = await import("@/lib/db");
    const owner = await db.user.findFirst({ where: { role: "OPERATOR" } });
    if (owner) yachts = await getOwnerYachts(owner.id);
  } catch {}

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">اليخوت</h1>
          <p className="text-sm text-slate-500 mt-1">{yachts.length} يخت مُدرج</p>
        </div>
        <Link href="/dashboard/owner/yachts/new" className="flex items-center gap-2 bg-[var(--navy)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
          <Plus className="h-4 w-4" /> إضافة يخت جديد
        </Link>
      </div>

      {yachts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
          <p className="text-4xl mb-4">🚢</p>
          <h3 className="font-bold text-[var(--navy)]">لا يوجد يخوت بعد</h3>
          <p className="text-sm text-slate-400 mt-2">أضف أول يخت لك وابدأ في استقبال الحجوزات</p>
          <Link href="/dashboard/owner/yachts/new" className="mt-4 inline-flex items-center gap-2 bg-[var(--navy)] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
            <Plus className="h-4 w-4" /> إضافة يخت
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {yachts.map(yacht => (
            <div key={yacht.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover-lift">
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${yacht.image})` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-extrabold text-[var(--navy)] truncate">{yacht.name}</h3>
                    <span className={`badge ${S_STYLES[yacht.status] || "badge-pending"} shrink-0`}>{S_LABELS[yacht.status] || yacht.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{yacht.location} • {yacht.typeLabel}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 star-filled" />{yacht.rating} ({yacht.reviews})</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[var(--ocean)]" />{yacht.capacity}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-green-500" />{yacht.pricePerHour.toLocaleString()} ﷼/h</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
                <Link href={`/yachts/${yacht.slug}`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--navy)] hover:text-[var(--navy)] transition">
                  <Eye className="h-3.5 w-3.5" /> معاينة
                </Link>
                <Link href={`/dashboard/owner/yachts/${yacht.id}/edit`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--navy)] hover:text-[var(--navy)] transition">
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
