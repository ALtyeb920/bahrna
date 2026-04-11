import Link from "next/link";
import { getAdminStores } from "@/lib/server-data";
import { StoreStatusActions } from "@/components/actions/store-status-actions";
import { StatusBadge, EmptyState } from "@/components/ui/states";
import { Ship, Star, TrendingUp, Wallet, Search } from "lucide-react";

export default async function AdminStoresPage({
  searchParams,
}: {
  searchParams?: { status?: string; city?: string };
}) {
  let stores: Awaited<ReturnType<typeof getAdminStores>> = [];
  try { stores = await getAdminStores(); } catch {}

  const filtered = stores.filter(s => {
    if (searchParams?.status && s.status !== searchParams.status) return false;
    if (searchParams?.city && s.city !== searchParams.city) return false;
    return true;
  });

  const cities = [...new Set(stores.map(s => s.city))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">إدارة المتاجر</h1>
          <p className="text-sm text-slate-500 mt-1">{stores.length} متجر — {stores.filter(s => s.status === "PENDING").length} ينتظر الموافقة</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "الكل", value: "" },
          { label: "نشط", value: "ACTIVE" },
          { label: "قيد المراجعة", value: "PENDING" },
          { label: "موقوف", value: "SUSPENDED" },
        ].map(f => (
          <a key={f.value} href={f.value ? `?status=${f.value}` : "/admin/stores"}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition ${(searchParams?.status ?? "") === f.value ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-slate-600 border-slate-200 hover:border-[var(--navy)]"}`}>
            {f.label}
          </a>
        ))}
        {cities.map(city => (
          <a key={city} href={`?city=${city}`}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition ${searchParams?.city === city ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-slate-600 border-slate-200 hover:border-[var(--navy)]"}`}>
            {city}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🏪" title="لا توجد متاجر مطابقة" />
      ) : (
        <div className="grid gap-5">
          {filtered.map(store => (
            <div key={store.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {store.logo ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                      <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[var(--navy)] flex items-center justify-center text-[var(--gold)] font-extrabold text-2xl shrink-0">
                      {store.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-[var(--navy)] text-lg">{store.name}</h3>
                      <StatusBadge status={store.status} />
                    </div>
                    <p className="text-sm text-slate-500">{store.city}{store.marina ? ` — ${store.marina}` : ""} • {store.owner}</p>
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Ship className="h-3 w-3" />{store.yachtCount} يخت</span>
                      {store.averageRating && <span className="flex items-center gap-1"><Star className="h-3 w-3 star-filled" />{Number(store.averageRating).toFixed(1)}</span>}
                      <span>عمولة {store.commissionRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm min-w-[280px]">
                  {[
                    { label: "الإيرادات", value: store.totalRevenue, color: "bg-slate-50" },
                    { label: "العمولة", value: store.totalCommission, color: "bg-amber-50 border border-amber-100" },
                    { label: "الصافي", value: store.totalPayout, color: "bg-green-50 border border-green-100" },
                  ].map(m => (
                    <div key={m.label} className={`${m.color} rounded-xl p-3`}>
                      <p className="text-xs text-slate-400">{m.label}</p>
                      <p className="font-extrabold text-[var(--navy)] text-sm">{m.value.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">﷼</p>
                    </div>
                  ))}
                </div>
              </div>

              <StoreStatusActions storeId={store.id} storeSlug={store.slug} status={store.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
