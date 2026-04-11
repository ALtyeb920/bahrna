import { getAdminStores } from "@/lib/server-data";
import { StoreStatusActions } from "@/components/actions/store-status-actions";
import { Ship, TrendingUp, Star, Wallet } from "lucide-react";

export default async function AdminStoresPage() {
  let stores: Awaited<ReturnType<typeof getAdminStores>> = [];
  try { stores = await getAdminStores(); } catch {}

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">إدارة المتاجر</h1>
        <p className="text-sm text-slate-500 mt-1">{stores.length} متجر مسجل — {stores.filter(s=>s.status==="UNDER_REVIEW").length} ينتظر الموافقة</p>
      </div>

      <div className="grid gap-5">
        {stores.map(store => (
          <div key={store.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover-lift">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--navy)] flex items-center justify-center text-[var(--gold)] font-extrabold text-2xl shrink-0">
                  {store.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-[var(--navy)] text-lg">{store.name}</h3>
                  <p className="text-sm text-slate-500">{store.city}{store.marina ? ` — ${store.marina}` : ""} • صاحب: {store.owner}</p>
                  <div className="flex gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Ship className="h-3 w-3" />{store.yachtCount} يخت</span>
                    {store.averageRating && <span className="flex items-center gap-1"><Star className="h-3 w-3 star-filled" />{Number(store.averageRating).toFixed(1)}</span>}
                    <span>عمولة {store.commissionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-slate-50 rounded-xl p-3 min-w-[80px]">
                  <p className="text-xs text-slate-400">الإيرادات</p>
                  <p className="font-extrabold text-[var(--navy)]">{store.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">﷼</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 min-w-[80px]">
                  <p className="text-xs text-amber-600">العمولة</p>
                  <p className="font-extrabold text-amber-700">{store.totalCommission.toLocaleString()}</p>
                  <p className="text-xs text-amber-400">﷼</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100 min-w-[80px]">
                  <p className="text-xs text-green-600">الصافي</p>
                  <p className="font-extrabold text-green-700">{store.totalPayout.toLocaleString()}</p>
                  <p className="text-xs text-green-400">﷼</p>
                </div>
              </div>
            </div>

            <StoreStatusActions storeId={store.id} storeSlug={store.slug} status={store.status} />
          </div>
        ))}
        {stores.length === 0 && <p className="text-center text-slate-400 py-10">لا توجد متاجر</p>}
      </div>
    </div>
  );
}
