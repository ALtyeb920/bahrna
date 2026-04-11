"use client";

import { useState } from "react";
import { CheckCircle2, Calendar, Users, CreditCard, Star, MapPin, Shield, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBooking } from "@/lib/actions/booking";
import type { AppYacht } from "@/lib/server-data";

const STEP_LABELS = ["التاريخ والوقت", "الخدمات الإضافية", "بياناتك", "الدفع والتأكيد"];

const ADDONS = [
  { id: "a1", name: "ضيافة ومشروبات", price: 350, desc: "مشروبات باردة وتمر وضيافة سعودية" },
  { id: "a2", name: "تصوير احترافي", price: 800, desc: "مصور محترف لتوثيق رحلتك" },
  { id: "a3", name: "رياضات مائية", price: 600, desc: "جت سكي وألواح ماء وتجهيزات" },
  { id: "a4", name: "زينة وديكور", price: 400, desc: "تزيين اليخت للمناسبات الخاصة" },
];

type Step = 1 | 2 | 3 | 4;
interface BookingData {
  date: string; startTime: string; duration: number; guests: number;
  addons: string[]; name: string; phone: string; email: string; notes: string;
}

export function BookingFlow({ yacht }: { yacht: AppYacht }) {
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ bookingNumber: string; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<BookingData>({
    date: "", startTime: "10:00", duration: yacht.minimumHours, guests: 2,
    addons: [], name: "", phone: "", email: "", notes: "",
  });

  const pricePerHour = yacht.pricePerHour;
  const commissionRate = yacht.store.commissionRate;
  const addonsCost = data.addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.price ?? 0), 0);
  const basePrice = pricePerHour * data.duration;
  const commission = Math.round(basePrice * commissionRate / 100);
  const subtotal = basePrice + addonsCost + commission;
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + vat;

  async function handlePay() {
    setSubmitting(true);
    try {
      const res = await createBooking({
        yachtId: yacht.id, date: data.date, startTime: data.startTime,
        duration: data.duration, numberOfGuests: data.guests,
        customerName: data.name, customerPhone: data.phone,
        customerEmail: data.email || null, notes: data.notes || null,
      });
      if (res.success) {
        setResult({ bookingNumber: res.bookingNumber!, total: res.total! });
        setDone(true);
      } else {
        alert(res.error ?? "حدث خطأ في إتمام الحجز");
      }
    } catch {
      alert("حدث خطأ في الاتصال");
    }
    setSubmitting(false);
  }

  if (done && result) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] mb-2">تم الحجز بنجاح!</h1>
        <p className="text-slate-500 mb-6">سيتم التواصل معك خلال ساعتين لتأكيد الحجز</p>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-right space-y-3 mb-8">
          <div className="flex justify-between text-sm"><span className="font-bold text-[var(--navy)]">رقم الحجز</span><span className="font-extrabold text-green-600">{result.bookingNumber}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">اليخت</span><span className="font-bold">{yacht.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">التاريخ</span><span className="font-bold">{data.date}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">المدة</span><span className="font-bold">{data.duration} ساعات</span></div>
          <div className="flex justify-between text-sm border-t border-slate-100 pt-3"><span className="font-extrabold text-[var(--navy)]">الإجمالي</span><span className="font-extrabold text-[var(--navy)]">{result.total.toLocaleString()} ريال</span></div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/yachts" className="rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-bold text-white hover:bg-[#091d4f] transition">استكشاف يخوت أخرى</Link>
          <Link href="/my-bookings" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-[var(--navy)] hover:bg-slate-50 transition">حجوزاتي</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        {/* Progress */}
        <div className="mb-8 flex items-center gap-0">
          {STEP_LABELS.map((label, i) => {
            const s = (i + 1) as Step;
            const isDone = step > s;
            const isActive = step === s;
            return (
              <div key={i} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${isDone ? "bg-green-500 text-white" : isActive ? "bg-[var(--navy)] text-white" : "bg-slate-200 text-slate-500"}`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : s}
                  </div>
                  <p className={`mt-1 text-xs hidden md:block ${isActive ? "font-bold text-[var(--navy)]" : "text-slate-400"}`}>{label}</p>
                </div>
                {i < STEP_LABELS.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${isDone ? "bg-green-500" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-[var(--navy)] flex items-center gap-2"><Calendar className="h-5 w-5" />اختر التاريخ والوقت</h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الرحلة *</label>
              <input type="date" value={data.date} onChange={e => setData(p => ({...p, date: e.target.value}))} min={new Date().toISOString().split("T")[0]} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">وقت البدء</label>
                <select value={data.startTime} onChange={e => setData(p => ({...p, startTime: e.target.value}))} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]">
                  {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المدة (ساعات)</label>
                <select value={data.duration} onChange={e => setData(p => ({...p, duration: Number(e.target.value)}))} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]">
                  {[2,3,4,5,6,8,10,12].filter(h => h >= yacht.minimumHours).map(h => <option key={h} value={h}>{h} ساعات</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">عدد الأشخاص</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setData(p => ({...p, guests: Math.max(1, p.guests - 1)}))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-lg font-bold hover:bg-slate-50">−</button>
                <div className="flex-1 text-center"><span className="text-2xl font-extrabold text-[var(--navy)]">{data.guests}</span><span className="text-sm text-slate-500 mr-1">شخص</span></div>
                <button onClick={() => setData(p => ({...p, guests: Math.min(yacht.capacity, p.guests + 1)}))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-lg font-bold hover:bg-slate-50">+</button>
              </div>
              <p className="text-xs text-slate-400 mt-1 text-center">الحد الأقصى {yacht.capacity} شخص</p>
            </div>
            <button onClick={() => setStep(2)} disabled={!data.date} className="w-full rounded-2xl bg-[var(--navy)] py-4 text-sm font-bold text-white hover:bg-[#091d4f] disabled:opacity-50 flex items-center justify-center gap-2">
              التالي <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-[var(--navy)]">الخدمات الإضافية <span className="text-sm font-normal text-slate-400">(اختياري)</span></h2>
            <div className="space-y-3">
              {ADDONS.map(a => {
                const selected = data.addons.includes(a.id);
                return (
                  <label key={a.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${selected ? "border-[var(--navy)] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="checkbox" checked={selected} onChange={() => setData(p => ({...p, addons: selected ? p.addons.filter(x => x !== a.id) : [...p.addons, a.id]}))} className="mt-1 w-4 h-4 accent-[var(--navy)]" />
                    <div className="flex-1"><p className="font-bold text-[var(--navy)] text-sm">{a.name}</p><p className="text-xs text-slate-500 mt-0.5">{a.desc}</p></div>
                    <span className="font-bold text-sm text-[var(--navy)]">{a.price.toLocaleString()} ﷼</span>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-3"><button onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-[var(--navy)] hover:bg-slate-50">السابق</button><button onClick={() => setStep(3)} className="flex-1 rounded-2xl bg-[var(--navy)] py-4 text-sm font-bold text-white hover:bg-[#091d4f]">التالي</button></div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-[var(--navy)] flex items-center gap-2"><Users className="h-5 w-5" />بياناتك الشخصية</h2>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل *</label><input type="text" value={data.name} onChange={e => setData(p => ({...p, name: e.target.value}))} placeholder="أدخل اسمك" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">رقم الجوال *</label><input type="tel" value={data.phone} onChange={e => setData(p => ({...p, phone: e.target.value}))} placeholder="+966 5X XXX XXXX" dir="ltr" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label><input type="email" value={data.email} onChange={e => setData(p => ({...p, email: e.target.value}))} placeholder="example@email.com" dir="ltr" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات</label><textarea value={data.notes} onChange={e => setData(p => ({...p, notes: e.target.value}))} rows={3} placeholder="أي طلبات خاصة..." className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] resize-none" /></div>
            <div className="flex gap-3"><button onClick={() => setStep(2)} className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-[var(--navy)] hover:bg-slate-50">السابق</button><button onClick={() => setStep(4)} disabled={!data.name || !data.phone} className="flex-1 rounded-2xl bg-[var(--navy)] py-4 text-sm font-bold text-white hover:bg-[#091d4f] disabled:opacity-50">التالي</button></div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-[var(--navy)] flex items-center gap-2"><CreditCard className="h-5 w-5" />مراجعة الحجز والدفع</h2>
            <div className="bg-[var(--sand)] rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">اليخت</span><span className="font-bold">{yacht.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">التاريخ</span><span className="font-bold">{data.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">الوقت</span><span className="font-bold">{data.startTime} • {data.duration} ساعات</span></div>
              <div className="flex justify-between"><span className="text-slate-600">الأشخاص</span><span className="font-bold">{data.guests}</span></div>
            </div>
            <div>
              <h3 className="font-bold text-[var(--navy)] mb-3">طريقة الدفع</h3>
              <div className="grid grid-cols-2 gap-2">
                {[{ id:"mada", label:"مدى", emoji:"💳" },{ id:"visa", label:"Visa", emoji:"💳" },{ id:"apple_pay", label:"Apple Pay", emoji:"🍎" },{ id:"stc_pay", label:"STC Pay", emoji:"📱" }].map(m => (
                  <label key={m.id} className="flex items-center gap-2 p-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-[var(--navy)]">
                    <input type="radio" name="payment" value={m.id} defaultChecked={m.id === "mada"} className="w-4 h-4 accent-[var(--navy)]" />
                    <span>{m.emoji}</span>
                    <span className="font-bold text-sm">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-green-50 rounded-xl p-3">
              <Shield className="h-4 w-4 text-green-500 shrink-0" />جميع المدفوعات آمنة ومشفرة عبر Moyasar
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-[var(--navy)] hover:bg-slate-50">السابق</button>
              <button onClick={handlePay} disabled={submitting} className="flex-[2] rounded-2xl bg-green-600 py-4 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {submitting ? "جاري الحجز..." : `ادفع الآن — ${total.toLocaleString()} ريال`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div>
        <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-luxury space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${yacht.image})` }} />
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">{yacht.name}</h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin className="h-3 w-3" />{yacht.location}</div>
              <div className="flex items-center gap-1 mt-1"><Star className="h-3 w-3 star-filled" /><span className="text-xs font-bold text-[var(--navy)]">{yacht.rating}</span></div>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
            <div className="flex justify-between text-slate-600"><span>{pricePerHour.toLocaleString()} × {data.duration} ساعات</span><span>{basePrice.toLocaleString()} ﷼</span></div>
            {addonsCost > 0 && <div className="flex justify-between text-slate-600"><span>خدمات إضافية</span><span>{addonsCost.toLocaleString()} ﷼</span></div>}
            <div className="flex justify-between text-slate-600"><span>رسوم المنصة ({commissionRate}%)</span><span>{commission.toLocaleString()} ﷼</span></div>
            <div className="flex justify-between text-slate-600"><span>ضريبة (15%)</span><span>{vat.toLocaleString()} ﷼</span></div>
            <div className="flex justify-between font-extrabold text-[var(--navy)] border-t border-slate-100 pt-2 text-base"><span>الإجمالي</span><span>{total.toLocaleString()} ﷼</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
