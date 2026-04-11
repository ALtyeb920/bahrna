"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
  }

  const contactInfo = [
    { icon: Phone, label: "الهاتف", value: "966-11-000-0000+", href: "tel:+966110000000" },
    { icon: MessageCircle, label: "واتساب", value: "966-50-000-0000+", href: "https://wa.me/966500000000" },
    { icon: Mail, label: "البريد الإلكتروني", value: "support@bahrna.sa", href: "mailto:support@bahrna.sa" },
    { icon: MapPin, label: "الموقع", value: "جدة، المملكة العربية السعودية", href: "#" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-sea-glow text-white py-16 text-center">
          <div className="container-shell">
            <h1 className="text-4xl font-extrabold mb-3">تواصل معنا</h1>
            <p className="text-white/70 text-lg">فريق بحرنا جاهز لمساعدتك في أي وقت</p>
          </div>
        </section>

        <section className="container-shell py-16 grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            {sent ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-extrabold text-[var(--navy)] mb-2">تم إرسال رسالتك!</h3>
                <p className="text-slate-500">سنردّ عليك خلال 24 ساعة على الأكثر.</p>
              </div>
            ) : (
              <>
                <h2 className="font-extrabold text-[var(--navy)] text-xl mb-5">أرسل لنا رسالة</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الاسم *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الجوال</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} dir="ltr" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} dir="ltr" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الموضوع</label>
                    <select value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]">
                      <option value="">اختر الموضوع</option>
                      <option>استفسار عن الحجز</option>
                      <option>مشكلة في الدفع</option>
                      <option>انضمام كمشغّل يخوت</option>
                      <option>تقييم أو شكوى</option>
                      <option>غير ذلك</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة *</label>
                    <textarea required value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} rows={5} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] resize-none" />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[var(--navy)] text-white rounded-xl py-3.5 text-sm font-bold hover:bg-[#091d4f] transition">
                    <Send className="h-4 w-4" /> إرسال الرسالة
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <h2 className="font-extrabold text-[var(--navy)] text-xl mb-4">معلومات التواصل</h2>
              <div className="space-y-3">
                {contactInfo.map(c => (
                  <a key={c.label} href={c.href} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-4 hover:border-[var(--navy)] transition group">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--sand)] flex items-center justify-center shrink-0 group-hover:bg-[var(--navy)] transition">
                      <c.icon className="h-5 w-5 text-[var(--navy)] group-hover:text-white transition" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{c.label}</p>
                      <p className="font-bold text-[var(--navy)] text-sm">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[var(--navy)] rounded-2xl p-5 text-white">
              <h3 className="font-extrabold mb-2">ساعات العمل</h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between"><span>السبت — الخميس</span><span className="font-bold text-white">8:00 ص — 10:00 م</span></div>
                <div className="flex justify-between"><span>الجمعة</span><span className="font-bold text-white">2:00 م — 10:00 م</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">
                متوسط وقت الرد: أقل من 2 ساعة خلال أوقات العمل
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
