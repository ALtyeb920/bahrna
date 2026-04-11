import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Anchor, Target, Users, TrendingUp, Shield, Star } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "100+", label: "يخت مسجّل" },
    { value: "500+", label: "حجز ناجح" },
    { value: "3", label: "مدن ساحلية" },
    { value: "4.8★", label: "متوسط التقييم" },
  ];

  const values = [
    { icon: Shield, title: "الأمان والثقة", desc: "دفع آمن مشفر، وعمولات شفافة 100% — لا رسوم خفية." },
    { icon: Star, title: "الجودة أولاً", desc: "كل يخت يمر بمراجعة دقيقة قبل نشره على المنصة." },
    { icon: Users, title: "مجتمع بحري", desc: "نربط أصحاب اليخوت بالعملاء بطريقة احترافية وسهلة." },
    { icon: TrendingUp, title: "نمو مشترك", desc: "نجاح المشغّل هو نجاحنا — لذلك نسبتنا مدروسة وعادلة." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-sea-glow text-white py-20">
          <div className="container-shell text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--gold)] mb-6">
              <Anchor className="h-8 w-8 text-[var(--navy)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">من نحن</h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto leading-8">
              بحرنا منصة سعودية متخصصة تجمع بين ملّاك اليخوت والباحثين عن تجربة بحرية استثنائية
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="container-shell py-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold text-[var(--ocean)] mb-2">قصتنا</p>
            <h2 className="text-3xl font-extrabold text-[var(--navy)] mb-5">لماذا بحرنا؟</h2>
            <div className="space-y-4 text-slate-600 leading-8">
              <p>
                ولدت فكرة بحرنا من مشكلة حقيقية — كان حجز يخت في السعودية يعني التواصل عبر واتساب، ومفاوضة بدون أسعار واضحة، ودفع بطرق غير مضمونة.
              </p>
              <p>
                قررنا بناء السوق الذي يستحقه البحر الأحمر — منصة احترافية تُعطي ملّاك اليخوت متجراً كاملاً، وتُعطي العملاء ثقة حقيقية وتجربة سلسة.
              </p>
              <p>
                اليوم، بحرنا تربط أفضل اليخوت السعودية بالعملاء في جدة وينبع والدمام — بدفع آمن وعمولات شفافة.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover-lift">
                <p className="text-4xl font-extrabold text-[var(--navy)]">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-16">
          <div className="container-shell">
            <div className="text-center mb-10">
              <p className="text-sm font-bold text-[var(--ocean)] mb-2">مبادئنا</p>
              <h2 className="text-3xl font-extrabold text-[var(--navy)]">ما الذي يُميّزنا</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map(v => (
                <div key={v.title} className="rounded-2xl border border-slate-200 p-6 hover-lift">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--sand)] flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6 text-[var(--navy)]" />
                  </div>
                  <h3 className="font-extrabold text-[var(--navy)] mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-7">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--navy)] py-16 text-white text-center">
          <div className="container-shell">
            <h2 className="text-3xl font-extrabold mb-4">انضم إلى بحرنا اليوم</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">سواء كنت تبحث عن يخت أو تمتلك واحداً، بحرنا هو مكانك.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/yachts" className="bg-[var(--gold)] text-[var(--navy)] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition">استكشف اليخوت</a>
              <a href="/register?role=operator" className="border border-white/25 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition">أنشئ متجرك</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
