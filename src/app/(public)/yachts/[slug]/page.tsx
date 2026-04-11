import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, Users, BedDouble, Bath, Ruler, Calendar,
  ShipWheel, CheckCircle2, Phone, Shield, ArrowRight,
  Wifi, Wind, Utensils, Waves, Music, Fish, Anchor, Zap
} from "lucide-react";
import { getYachtBySlug, getAllYachts } from "@/lib/server-data";
import { ImageSlider } from "@/components/ui/image-slider";
import { YachtCard } from "@/components/ui/yacht-card";

const MOCK_REVIEWS = [
  { name: "أحمد العمري", rating: 5, date: "مارس 2026", comment: "تجربة استثنائية! اليخت نظيف جداً والطاقم محترف. سنعود بالتأكيد." },
  { name: "سارة الزهراني", rating: 5, date: "فبراير 2026", comment: "قضينا وقتاً رائعاً، الخدمة ممتازة والأسعار معقولة جداً." },
  { name: "خالد المالكي", rating: 4, date: "يناير 2026", comment: "تجربة جيدة جداً، بعض التأخير في البداية ولكن بشكل عام ممتاز." },
];

export default async function YachtDetailsPage({ params }: { params: { slug: string } }) {
  let yacht: Awaited<ReturnType<typeof getYachtBySlug>> = null;
  let similar: Awaited<ReturnType<typeof getAllYachts>> = [];
  try {
    yacht = await getYachtBySlug(params.slug);
    if (!yacht) notFound();
    similar = (await getAllYachts()).filter(y => y.id !== yacht!.id && y.type === yacht!.type).slice(0, 3);
    if (similar.length < 2) similar = (await getAllYachts()).filter(y => y.id !== yacht!.id).slice(0, 3);
  } catch { notFound(); }
  if (!yacht) notFound();

  const amenities = [
    { label: "تكييف مركزي", icon: Wind, active: yacht.hasAC },
    { label: "واي فاي", icon: Wifi, active: yacht.hasWifi },
    { label: "مطبخ مجهز", icon: Utensils, active: yacht.hasKitchen },
    { label: "رياضات مائية", icon: Waves, active: yacht.hasWaterSports },
    { label: "جت سكي", icon: Zap, active: yacht.hasJetSki },
    { label: "موسيقى DJ", icon: Music, active: yacht.hasMusic },
    { label: "صيد السمك", icon: Fish, active: yacht.hasFishing },
    { label: "غطس", icon: Anchor, active: yacht.hasDiving },
  ].filter(a => a.active);

  const pricePerHour = yacht.pricePerHour;
  const minHours = yacht.minimumHours;
  const commission = yacht.store.commissionRate;

  return (
    <div className="container-shell py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-[var(--navy)]">الرئيسية</Link>
        <ArrowRight className="h-3 w-3 rotate-180" />
        <Link href="/yachts" className="hover:text-[var(--navy)]">اليخوت</Link>
        <ArrowRight className="h-3 w-3 rotate-180" />
        <Link href={`/stores/${yacht.store.slug}`} className="hover:text-[var(--navy)]">{yacht.store.name}</Link>
        <ArrowRight className="h-3 w-3 rotate-180" />
        <span className="font-bold text-[var(--navy)]">{yacht.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* ── Left ─────────────────────────────────────────────────────── */}
        <div className="space-y-8">
          {/* Image Slider */}
          <ImageSlider images={yacht.images} alt={yacht.name} />

          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <MapPin className="h-4 w-4" /> {yacht.location}
                <span>•</span>
                <Link href={`/stores/${yacht.store.slug}`} className="text-[var(--ocean)] hover:underline font-medium">
                  {yacht.store.name}
                </Link>
              </div>
              <h1 className="text-3xl font-extrabold text-[var(--navy)]">{yacht.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(yacht.rating)) ? "star-filled" : "star-empty"}`} />
                  ))}
                  <span className="mr-1.5 font-bold text-sm text-[var(--navy)]">{yacht.rating}</span>
                </div>
                <span className="text-sm text-slate-400">({yacht.reviews} تقييم)</span>
                <span className="badge badge-active">{yacht.typeLabel}</span>
              </div>
            </div>
            <div className="text-left shrink-0">
              <p className="text-xs text-slate-400">السعر</p>
              <p className="text-3xl font-extrabold text-[var(--navy)]">{pricePerHour.toLocaleString()}</p>
              <p className="text-sm text-slate-400">ريال / ساعة</p>
              <p className="text-xs text-slate-400 mt-1">حد أدنى {minHours} ساعات</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-[var(--navy)] mb-3">عن اليخت</h2>
            <p className="text-sm leading-8 text-slate-600">{yacht.description}</p>
          </div>

          {/* Specs */}
          <div>
            <h2 className="font-bold text-[var(--navy)] mb-4">المواصفات التقنية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Users, label: "السعة", value: `${yacht.capacity} شخص` },
                { icon: Ruler, label: "الطول", value: yacht.length ? `${yacht.length} متر` : "—" },
                { icon: BedDouble, label: "الكبائن", value: yacht.cabins ?? "—" },
                { icon: Bath, label: "الحمامات", value: yacht.bathrooms ?? "—" },
                { icon: ShipWheel, label: "الطاقم", value: yacht.crew ? `${yacht.crew} أشخاص` : "—" },
                { icon: Calendar, label: "سنة الصنع", value: yacht.buildYear ?? "—" },
                { icon: MapPin, label: "مكان الانطلاق", value: yacht.departurePoint ?? "—" },
                { icon: Anchor, label: "النوع", value: yacht.typeLabel },
              ].map(spec => (
                <div key={spec.label} className="rounded-2xl bg-white border border-slate-100 p-4 text-center hover-lift">
                  <spec.icon className="h-5 w-5 text-[var(--ocean)] mx-auto mb-2" />
                  <p className="text-xs text-slate-400">{spec.label}</p>
                  <p className="font-bold text-[var(--navy)] text-sm mt-1">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="font-bold text-[var(--navy)] mb-4">المميزات والخدمات</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <div key={a.label} className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 rounded-full px-4 py-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          {yacht.cancellationPolicy && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" /> سياسة الإلغاء
              </h3>
              <p className="text-sm text-amber-700 leading-7">{yacht.cancellationPolicy}</p>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="font-bold text-[var(--navy)] mb-4">آراء العملاء</h2>
            <div className="space-y-4">
              {MOCK_REVIEWS.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--sand)] flex items-center justify-center font-bold text-[var(--navy)] text-sm">{r.name[0]}</div>
                      <div>
                        <p className="font-bold text-sm text-[var(--navy)]">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({length: r.rating}, (_, i) => <Star key={i} className="h-3.5 w-3.5 star-filled" />)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-7">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Booking Card ──────────────────────────────────────── */}
        <div>
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-luxury">
              <h3 className="font-extrabold text-[var(--navy)] text-lg mb-1">احجز هذا اليخت</h3>
              <p className="text-xs text-slate-400 mb-5">سيُحسب السعر النهائي بعد اختيار الخيارات</p>

              {/* Quick Price Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{pricePerHour.toLocaleString()} × {minHours} ساعات (الحد الأدنى)</span>
                  <span className="font-bold">{(pricePerHour * minHours).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">عمولة المنصة ({commission}%)</span>
                  <span className="font-bold">{Math.round(pricePerHour * minHours * commission / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-bold">{Math.round(pricePerHour * minHours * (1 + commission / 100) * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[var(--navy)] pt-2 border-t border-slate-200">
                  <span>الإجمالي ({minHours} ساعات)</span>
                  <span>{Math.round(pricePerHour * minHours * (1 + commission / 100) * 1.15).toLocaleString()} ريال</span>
                </div>
              </div>

              <Link href={`/book/${yacht.slug}`} className="block w-full bg-[var(--navy)] text-white rounded-2xl py-4 text-center font-bold text-sm hover:bg-[#091d4f] transition mb-4">
                أكمل الحجز والدفع
              </Link>

              <div className="space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-green-500" />دفع آمن ومشفر</div>
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-[var(--ocean)]" />إلغاء مجاني قبل 48 ساعة</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[var(--ocean)]" />دعم فوري على مدار الساعة</div>
              </div>
            </div>

            {/* Store Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-3">المتجر</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--navy)] flex items-center justify-center text-[var(--gold)] font-extrabold text-base">
                  {yacht.store.name[0]}
                </div>
                <div>
                  <p className="font-bold text-[var(--navy)] text-sm">{yacht.store.name}</p>
                  <p className="text-xs text-slate-400">{yacht.store.city}</p>
                </div>
              </div>
              <Link href={`/stores/${yacht.store.slug}`} className="mt-3 block text-center text-xs font-bold text-[var(--ocean)] hover:underline">
                عرض صفحة المتجر
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-[var(--navy)] mb-6">يخوت مشابهة</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similar.map(y => <YachtCard key={y.id} yacht={y} />)}
          </div>
        </div>
      )}
    </div>
  );
}
