import Link from "next/link";
import { MapPin, Star, Users, Wifi, Wind, Waves, ArrowLeft } from "lucide-react";
import type { AppYacht } from "@/lib/server-data";

interface Props { yacht: AppYacht; variant?: "default" | "compact" }

export function YachtCard({ yacht, variant = "default" }: Props) {
  const amenities = [
    yacht.hasAC && { icon: Wind, label: "تكييف" },
    yacht.hasWifi && { icon: Wifi, label: "واي فاي" },
    yacht.hasWaterSports && { icon: Waves, label: "رياضات" },
  ].filter(Boolean) as { icon: React.ElementType; label: string }[];

  return (
    <Link href={`/yachts/${yacht.slug}`} className="block h-full">
      <article className="card-premium h-full flex flex-col group cursor-pointer">
        {/* Image */}
        <div className="img-zoom-wrap relative h-56 overflow-hidden">
          <div
            className="bg-img absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${yacht.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {yacht.isFeatured && (
              <span className="bg-[var(--gold)] text-[var(--navy)] text-xs font-bold px-2.5 py-1 rounded-full">
                ⭐ مميز
              </span>
            )}
          </div>

          {/* Type pill */}
          <div className="absolute bottom-3 right-3">
            <span className="glass text-xs font-bold px-3 py-1 rounded-full text-[var(--navy)]">
              {yacht.typeLabel}
            </span>
          </div>

          {/* City */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/80 text-xs">
            <MapPin className="h-3 w-3" />
            {yacht.location}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-extrabold text-[var(--navy)] text-lg leading-tight group-hover:text-[var(--ocean)] transition-colors">
              {yacht.name}
            </h3>
            <div className="shrink-0 text-left">
              <p className="text-[var(--gold)] font-extrabold text-base">{yacht.pricePerHour.toLocaleString()}</p>
              <p className="text-slate-400 text-xs">ريال/ساعة</p>
            </div>
          </div>

          {/* Rating + Capacity */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 star-filled" />
              <span className="font-bold text-[var(--navy)]">{yacht.rating}</span>
              <span className="text-slate-400">({yacht.reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4 text-[var(--ocean)]" />
              حتى {yacht.capacity} شخص
            </span>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {amenities.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1 bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded-lg border border-slate-100">
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">{yacht.store.name}</p>
            <span className="flex items-center gap-1 text-xs font-bold text-[var(--navy)] group-hover:text-[var(--ocean)] transition-colors">
              احجز الآن <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
