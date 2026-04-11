import Link from "next/link";
import { Edit, Eye, Plus, Star, TrendingUp, Users } from "lucide-react";
import { YachtStatusToggle } from "@/components/actions/yacht-status-toggle";
import { getOperatorYachts } from "@/lib/server-data";

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "متاح",
  UNAVAILABLE: "غير متاح",
  MAINTENANCE: "صيانة",
  UNDER_REVIEW: "قيد المراجعة",
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "badge-confirmed",
  UNAVAILABLE: "badge-cancelled",
  MAINTENANCE: "badge-pending",
  UNDER_REVIEW: "bg-purple-100 text-purple-700",
};

export default async function OperatorYachtsPage() {
  let yachts: Awaited<ReturnType<typeof getOperatorYachts>> = [];
  try {
    yachts = await getOperatorYachts();
  } catch {
    // DB not ready
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-primary">اليخوت</h1>
          <p className="mt-1 text-sm text-slate-500">{yachts.length} يخت في قاعدة البيانات</p>
        </div>
        <Link href="/dashboard/operator/yachts/new" className="flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white">
          <Plus className="h-4 w-4" />
          إضافة يخت جديد
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {yachts.map((yacht) => (
          <div key={yacht.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex gap-4 p-4">
              <div className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${yacht.image})` }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-extrabold text-brand-primary">{yacht.name}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[yacht.status] || "bg-slate-100 text-slate-600"}`}>
                    {STATUS_LABELS[yacht.status] || yacht.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {yacht.location} • {yacht.typeLabel}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-brand-secondary text-brand-secondary" />
                    <span className="font-bold">{yacht.rating}</span>
                    <span className="text-slate-400">({yacht.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-brand-accent" />
                    {yacht.capacity} أشخاص
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                    {yacht.pricePerHour.toLocaleString()} ﷼/ساعة
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
              <Link href={`/yachts/${yacht.slug}`} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-primary hover:text-brand-primary">
                <Eye className="h-3.5 w-3.5" /> معاينة
              </Link>
              <Link href={`/dashboard/operator/yachts/${yacht.id}/edit`} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-primary hover:text-brand-primary">
                <Edit className="h-3.5 w-3.5" /> تعديل
              </Link>
              <YachtStatusToggle yachtId={yacht.id} currentStatus={yacht.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
