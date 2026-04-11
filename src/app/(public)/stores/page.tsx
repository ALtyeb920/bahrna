import { getStores } from "@/lib/server-data";
import { StoreCard } from "@/components/ui/store-card";
import { cities } from "@/lib/data";

export default async function StoresPage({ searchParams }: { searchParams?: { city?: string } }) {
  let stores: Awaited<ReturnType<typeof getStores>> = [];
  try {
    stores = await getStores({ city: searchParams?.city, status: "ACTIVE" });
  } catch {}

  return (
    <div className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-[var(--ocean)]">السوق</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[var(--navy)]">متاجر اليخوت</h1>
        <p className="mt-2 text-sm text-slate-500">{stores.length} متجر متاح</p>
      </div>

      {/* City Filter */}
      <form className="mb-8 flex flex-wrap gap-2">
        <a href="/stores" className={`px-4 py-2 rounded-full text-sm font-bold border transition ${!searchParams?.city ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-slate-600 border-slate-200 hover:border-[var(--navy)]"}`}>
          جميع المدن
        </a>
        {cities.map(city => (
          <a key={city} href={`/stores?city=${city}`} className={`px-4 py-2 rounded-full text-sm font-bold border transition ${searchParams?.city === city ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-slate-600 border-slate-200 hover:border-[var(--navy)]"}`}>
            {city}
          </a>
        ))}
      </form>

      {stores.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stores.map(store => <StoreCard key={store.id} store={store} />)}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200 bg-white">
          <p className="text-4xl mb-4">⚓</p>
          <h3 className="text-xl font-bold text-[var(--navy)]">لا توجد متاجر</h3>
          <p className="mt-2 text-sm text-slate-500">جرب تغيير المدينة أو العودة لاحقاً</p>
        </div>
      )}
    </div>
  );
}
