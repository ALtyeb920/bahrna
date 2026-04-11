import { Sparkles, ShieldCheck, CalendarDays, Users, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { YachtCard } from "@/components/ui/yacht-card";
import { StoreCard } from "@/components/ui/store-card";
import { getFeaturedYachts, getStores } from "@/lib/server-data";
import { steps, highlights } from "@/lib/data";

export default async function HomePage() {
  let yachts: Awaited<ReturnType<typeof getFeaturedYachts>> = [];
  let stores: Awaited<ReturnType<typeof getStores>> = [];
  try {
    [yachts, stores] = await Promise.all([getFeaturedYachts(), getStores({ status: "ACTIVE" })]);
  } catch {}

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="bg-sea-glow text-white overflow-hidden">
          <div className="container-shell py-16 pb-24">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="fade-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm mb-6">
                  <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                  <span>منصة متخصصة لحجز اليخوت في السوق السعودي</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] max-w-xl">
                  احجز يختك <span className="text-[var(--gold)]">المثالي</span> بثقة ودفع آمن
                </h1>
                <p className="mt-6 text-lg text-white/75 max-w-lg leading-8">
                  سوق عربي احترافي يجمع بين متاجر اليخوت، نظام حجز متكامل، وعمولات شفافة.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm">
                  {[
                    { icon: ShieldCheck, label: "دفع آمن عبر Moyasar" },
                    { icon: CalendarDays, label: "تقويم التوافر المباشر" },
                    { icon: Users, label: "إدارة كاملة للمشغلين" },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                      <f.icon className="h-4 w-4 text-[var(--gold)]" /> {f.label}
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/yachts" className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--navy)] px-7 py-3.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition shadow-lg">
                    استكشف اليخوت <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <Link href="/stores" className="inline-flex items-center gap-2 border border-white/25 px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition">
                    تصفح المتاجر
                  </Link>
                </div>
              </div>

              {/* Hero card */}
              <div className="glass rounded-[2rem] overflow-hidden shadow-luxury">
                <div
                  className="h-56 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 right-4 glass-dark rounded-2xl px-4 py-3 text-white">
                    <p className="text-xs text-white/60">تقييم المنصة</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 star-filled" />)}
                      <span className="mr-2 font-extrabold text-white">4.9</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { val: stores.length || "3", label: "متجر" },
                      { val: yachts.length || "5", label: "يخت" },
                      { val: "500+", label: "حجز ناجح" },
                    ].map(s => (
                      <div key={s.label} className="bg-slate-50 rounded-xl py-3">
                        <p className="text-2xl font-extrabold text-[var(--navy)]">{s.val}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/yachts" className="mt-4 block w-full bg-[var(--navy)] text-white rounded-2xl py-3 text-center text-sm font-bold hover:bg-[#091d4f] transition">
                    ابدأ البحث الآن
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Yachts ───────────────────────────────────────── */}
        {yachts.length > 0 && (
          <section className="container-shell py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-bold text-[var(--ocean)]">مختارات السوق</p>
                <h2 className="mt-1 text-3xl font-extrabold text-[var(--navy)]">اليخوت المميزة</h2>
              </div>
              <Link href="/yachts" className="text-sm font-bold text-[var(--navy)] hover:text-[var(--ocean)] transition flex items-center gap-1">
                عرض الكل <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {yachts.slice(0, 3).map(y => <YachtCard key={y.id} yacht={y} />)}
            </div>
          </section>
        )}

        {/* ── Stores ────────────────────────────────────────────────── */}
        {stores.length > 0 && (
          <section className="bg-white py-20">
            <div className="container-shell">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm font-bold text-[var(--ocean)]">المتاجر المعتمدة</p>
                  <h2 className="mt-1 text-3xl font-extrabold text-[var(--navy)]">تصفح بالمتجر</h2>
                </div>
                <Link href="/stores" className="text-sm font-bold text-[var(--navy)] hover:text-[var(--ocean)] transition flex items-center gap-1">
                  جميع المتاجر <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {stores.slice(0, 3).map(s => <StoreCard key={s.id} store={s} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── How it Works ──────────────────────────────────────────── */}
        <section id="how-it-works" className="container-shell py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-[var(--ocean)]">الخطوات</p>
            <h2 className="mt-1 text-3xl font-extrabold text-[var(--navy)]">رحلة حجز واضحة وبسيطة</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="glass rounded-[1.75rem] p-6 relative overflow-hidden hover-lift">
                <div className="absolute top-3 left-3 text-6xl font-extrabold text-slate-100 select-none leading-none">{i + 1}</div>
                <div className="w-12 h-12 bg-[var(--navy)] rounded-2xl flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-extrabold text-[var(--navy)] relative z-10">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500 relative z-10">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Highlights ────────────────────────────────────────────── */}
        <section className="bg-white py-20">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[var(--navy)] rounded-3xl p-8 text-white shadow-luxury flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--gold)]">لماذا بحرنا؟</p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight">البديل الاحترافي عن الإعلانات العشوائية.</h2>
                <p className="mt-4 text-white/70 text-sm leading-7">نظام متكامل بعمولات شفافة، متاجر مستقلة لكل مشغل، ودفع آمن يناسب السوق السعودي.</p>
              </div>
              <Link href="/register?role=operator" className="mt-6 inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--navy)] px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-400 transition w-fit">
                أنشئ متجرك الآن <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map(item => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 hover-lift">
                  <div className="w-11 h-11 bg-[var(--sand)] rounded-2xl flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-[var(--navy)]" />
                  </div>
                  <h3 className="font-bold text-[var(--navy)]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section id="operators" className="bg-[var(--navy)] py-20 text-white">
          <div className="container-shell flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-sm font-bold text-[var(--gold)]">للمشغلين وملاك اليخوت</p>
              <h2 className="mt-2 text-3xl font-extrabold">أنشئ متجرك الخاص واستقبل الحجوزات مباشرة.</h2>
              <p className="mt-3 text-white/70 text-sm leading-7">عمولة شفافة، لوحة تحكم احترافية، وبوابة دفع آمنة — كل ما تحتاجه لإدارة عملك البحري.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link href="/register?role=operator" className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--navy)] px-8 py-4 rounded-full font-bold text-sm hover:bg-yellow-400 transition whitespace-nowrap">
                ابدأ تسجيل متجرك
              </Link>
              <Link href="/dashboard/owner" className="text-center text-xs text-white/50 hover:text-white transition">
                أو تسجيل الدخول للوحة التحكم ←
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
