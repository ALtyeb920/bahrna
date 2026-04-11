import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Mail, Star, Ship, MessageCircle, ArrowRight } from "lucide-react";
import { getStoreBySlug, getAllYachts } from "@/lib/server-data";
import { YachtCard } from "@/components/ui/yacht-card";

export default async function StoreDetailPage({ params }: { params: { slug: string } }) {
  let store: Awaited<ReturnType<typeof getStoreBySlug>> = null;
  let yachts: Awaited<ReturnType<typeof getAllYachts>> = [];
  try {
    store = await getStoreBySlug(params.slug);
    if (!store) notFound();
    yachts = await getAllYachts({ storeSlug: params.slug });
  } catch { notFound(); }
  if (!store) notFound();

  return (
    <div>
      {/* Hero Cover */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {store.coverImage ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${store.coverImage})` }} />
        ) : (
          <div className="absolute inset-0 bg-sea-glow" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 right-0 container-shell">
          <nav className="flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">الرئيسية</Link>
            <ArrowRight className="h-3 w-3 rotate-180" />
            <Link href="/stores" className="hover:text-white">المتاجر</Link>
            <ArrowRight className="h-3 w-3 rotate-180" />
            <span className="text-white font-bold">{store.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-shell">
        {/* Store Header */}
        <div className="relative -mt-12 mb-10 glass rounded-3xl p-6 shadow-luxury">
          <div className="flex flex-wrap items-start gap-5">
            {/* Logo */}
            {store.logo ? (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0">
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[var(--navy)] flex items-center justify-center text-[var(--gold)] font-extrabold text-3xl shrink-0 shadow-md border-2 border-white">
                {store.name[0]}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[var(--navy)]">{store.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{store.city}{store.marina && ` — ${store.marina}`}</span>
                    {store.averageRating && (
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 star-filled" />{Number(store.averageRating).toFixed(1)}</span>
                    )}
                    <span className="flex items-center gap-1"><Ship className="h-4 w-4 text-[var(--ocean)]" />{store.yachtCount} يخت</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {store.whatsapp && (
                    <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition">
                      <MessageCircle className="h-4 w-4" /> واتساب
                    </a>
                  )}
                  {store.phone && (
                    <a href={`tel:${store.phone}`} className="flex items-center gap-2 bg-[var(--navy)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
                      <Phone className="h-4 w-4" /> اتصال
                    </a>
                  )}
                </div>
              </div>

              {store.description && (
                <p className="mt-3 text-sm leading-7 text-slate-600 max-w-2xl">{store.description}</p>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
            {[
              { label: "اليخوت المتاحة", value: store.yachtCount, icon: Ship },
              { label: "إجمالي الحجوزات", value: store.bookingCount, icon: null },
              { label: "متوسط التقييم", value: store.averageRating ? `${Number(store.averageRating).toFixed(1)}/5` : "—", icon: null },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-[var(--navy)]">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Yachts Section */}
        <div className="pb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--navy)]">يخوت المتجر</h2>
              <p className="text-sm text-slate-500 mt-1">{yachts.length} يخت متاح للحجز</p>
            </div>
            <Link href={`/yachts?store=${store.slug}`} className="text-sm font-bold text-[var(--ocean)] hover:underline">
              عرض الكل
            </Link>
          </div>

          {yachts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {yachts.map(yacht => <YachtCard key={yacht.id} yacht={yacht} />)}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
              <p className="text-3xl mb-3">⚓</p>
              <p className="font-bold text-[var(--navy)]">لا توجد يخوت متاحة حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
