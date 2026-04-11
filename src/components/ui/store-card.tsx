import Link from "next/link";
import { MapPin, Star, Ship, ArrowLeft } from "lucide-react";
import type { AppStore } from "@/lib/server-data";

export function StoreCard({ store }: { store: AppStore }) {
  return (
    <Link href={`/stores/${store.slug}`} className="block">
      <article className="card-premium group cursor-pointer overflow-hidden">
        {/* Cover */}
        <div className="img-zoom-wrap relative h-44 overflow-hidden">
          {store.coverImage ? (
            <div
              className="bg-img absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${store.coverImage})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-sea-glow" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status */}
          <div className="absolute top-3 left-3">
            <span className={`badge ${store.status === "ACTIVE" ? "badge-active" : "badge-review"}`}>
              {store.status === "ACTIVE" ? "نشط" : "قيد المراجعة"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex gap-4">
          {/* Logo */}
          {store.logo ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md -mt-10 shrink-0 relative z-10 bg-white">
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[var(--navy)] flex items-center justify-center text-[var(--gold)] font-extrabold text-xl -mt-10 shrink-0 relative z-10 shadow-md border-2 border-white">
              {store.name[0]}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-[var(--navy)] group-hover:text-[var(--ocean)] transition-colors truncate">
              {store.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {store.city}
                {store.marina && ` • ${store.marina}`}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 pb-5 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "يخت", value: store.yachtCount },
            { label: "تقييم", value: store.averageRating ? Number(store.averageRating).toFixed(1) : "—" },
            { label: "حجز", value: store.bookingCount },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-50 rounded-xl py-2">
              <p className="font-extrabold text-[var(--navy)] text-base">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1"><Ship className="h-3.5 w-3.5" /> {store.yachtCount} يخت</span>
            <span className="flex items-center gap-1 font-bold text-[var(--navy)] group-hover:text-[var(--ocean)] transition-colors">
              تصفح المتجر <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
