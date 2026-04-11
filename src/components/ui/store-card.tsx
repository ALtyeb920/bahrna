import Link from "next/link";
import { MapPin, Star, Ship, ArrowLeft, MessageCircle, Phone } from "lucide-react";
import type { AppStore } from "@/lib/server-data";

export function StoreCard({ store }: { store: AppStore }) {
  return (
    <Link href={`/stores/${store.slug}`} className="block">
      <article className="card-premium group cursor-pointer overflow-hidden">

        {/* Cover */}
        <div className="img-zoom-wrap relative h-40 overflow-hidden">
          {store.coverImage ? (
            <div
              className="bg-img absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${store.coverImage})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-sea-glow" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute top-3 right-3">
            <span className={`badge ${store.status === "ACTIVE" ? "badge-active" : "badge-review"}`}>
              {store.status === "ACTIVE" ? "نشط" : "قيد المراجعة"}
            </span>
          </div>

          {/* City */}
          <div className="absolute bottom-3 left-3 text-white/80 text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {store.city}
            {store.marina && ` — ${store.marina}`}
          </div>
        </div>

        {/* Logo + Info */}
        <div className="px-5 pb-0 flex gap-4 -mt-6 relative z-10">
          {store.logo ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-white">
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[var(--navy)] border-2 border-white shadow-md shrink-0 flex items-center justify-center text-[var(--gold)] font-extrabold text-2xl">
              {store.name[0]}
            </div>
          )}
          <div className="pt-7 flex-1 min-w-0">
            <h3 className="font-extrabold text-[var(--navy)] group-hover:text-[var(--ocean)] transition-colors truncate">
              {store.name}
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 py-4 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "يخت",    value: store.yachtCount },
            { label: "تقييم",  value: store.averageRating ? Number(store.averageRating).toFixed(1) : "—" },
            { label: "حجز",    value: store.bookingCount },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl py-2.5">
              <p className="font-extrabold text-[var(--navy)]">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Ship className="h-3.5 w-3.5" /> {store.yachtCount} يخت
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-[var(--navy)] group-hover:text-[var(--ocean)] transition-colors">
            تصفح المتجر <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
