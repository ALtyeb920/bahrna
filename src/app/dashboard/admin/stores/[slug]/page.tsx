import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/server-data";

export default async function StoreDetailsPage({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug);

  if (!store) notFound();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-extrabold text-brand-primary">{store.name}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {store.city} • المالك: {store.owner}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">الحالة</p>
            <p className="mt-1 font-bold text-brand-primary">{store.status}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">العمولة</p>
            <p className="mt-1 font-bold text-brand-primary">{store.commissionRate}%</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">عدد اليخوت</p>
            <p className="mt-1 font-bold text-brand-primary">{store.yachtCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">عدد الحجوزات</p>
            <p className="mt-1 font-bold text-brand-primary">{store.bookingCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
