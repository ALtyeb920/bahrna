import Link from "next/link";
import { MapPin, Star, Users, Wifi, Wind, Waves, ArrowLeft, Anchor } from "lucide-react";
import type { AppYacht } from "@/lib/server-data";

interface Props { yacht: AppYacht }

export function YachtCard({ yacht }: Props) {
  const amenities = [
    yacht.hasAC          && { icon: Wind,  label: "تكييف" },
    yacht.hasWifi        && { icon: Wifi,  label: "واي فاي" },
    yacht.hasWaterSports && { icon: Waves, label: "رياضات" },
  ].filter(Boolean) as { icon: React.ElementType; label: string }[];

  return (
    <Link href={`/yachts/${yacht.slug}`} className="block h-full">
      <article className="card-premium h-full flex flex-col cursor-pointer group">

        {/* Image */}
        <div className="img-zoom-wrap relative h-52 overflow-hidden">
          <div
            className="bg-img absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${yacht.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {yacht.isFeatured && (
              <span className="bg-[var(--gold)] text-[var(--navy)] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                مميز
              </span>
            )}
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5 flex items-end justify-between">
            <span className="glass text-[11px] font-bold px-3 py-1 rounded-full text-[var(--navy)]">
              {yacht.typeLabel}
            </span>
            <div className="text-right">
              <p className="text-white font-extrabold text-lg leading-none">{yacht.pricePerHour.toLocaleString()}</p>
              <p className="text-white/70 text-[11px]">ريال / ساعة</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title + location */}
          <div>
            <h3 className="font-extrabold text-[var(--navy)] text-lg leading-snug group-hover:text-[var(--ocean)] transition-colors">
              {yacht.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{yacht.location}</span>
            </div>
          </div>

          {/* Rating + capacity */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 star-filled" />
              <span className="font-bold text-[var(--navy)]">{yacht.rating}</span>
              <span className="text-slate-400">({yacht.reviews})</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Users className="h-4 w-4 text-[var(--ocean)]" />
              حتى {yacht.capacity} شخص
            </span>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {amenities.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1 bg-slate-50 text-slate-500 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-100"
                >
                  <Icon className="h-3 w-3" /> {label}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Anchor className="h-3 w-3" /> {yacht.store.name}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-[var(--navy)] group-hover:text-[var(--ocean)] transition-colors">
              احجز الآن <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
