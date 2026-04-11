"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createYacht } from "@/lib/actions/yacht";
import { Ship, Image, DollarSign, CheckSquare, FileText, ChevronRight, ChevronLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

const YACHT_TYPES = [
  { value: "LUXURY_YACHT", label: "🛥️ يخت فاخر" },
  { value: "MOTOR_YACHT", label: "⚡ يخت بمحرك" },
  { value: "SAILING_YACHT", label: "⛵ يخت شراعي" },
  { value: "CATAMARAN", label: "🚤 كاتاماران" },
  { value: "PARTY_BOAT", label: "🎉 قارب حفلات" },
  { value: "SPEEDBOAT", label: "💨 قارب سريع" },
];

const CITIES = ["جدة", "ينبع", "الدمام", "جازان", "الوجه", "القنفذة"];

const AMENITIES = [
  { key: "hasAC", label: "تكييف مركزي" },
  { key: "hasWifi", label: "واي فاي" },
  { key: "hasKitchen", label: "مطبخ مجهز" },
  { key: "hasWaterSports", label: "رياضات مائية" },
  { key: "hasJetSki", label: "جت سكي" },
  { key: "hasFishing", label: "معدات صيد" },
  { key: "hasDiving", label: "معدات غوص" },
  { key: "hasMusic", label: "نظام موسيقى" },
  { key: "hasSunDeck", label: "سطح شمسي" },
  { key: "hasTV", label: "شاشة تلفزيون" },
];

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { label: "المعلومات الأساسية", icon: Ship },
  { label: "الصور والموقع", icon: Image },
  { label: "التسعير والمميزات", icon: DollarSign },
  { label: "السياسات والحفظ", icon: FileText },
];

export default function NewYachtPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "LUXURY_YACHT",
    description: "",
    city: "جدة",
    location: "",
    capacity: "",
    crewCount: "2",
    length: "",
    cabins: "",
    bathrooms: "",
    buildYear: "",
    manufacturer: "",
    image: "",
    imagesJson: "",
    pricePerHour: "",
    minimumHours: "3",
    departurePoint: "",
    cancellationPolicy: "إلغاء مجاني قبل 48 ساعة من موعد الرحلة.",
    hasAC: false,
    hasWifi: false,
    hasKitchen: false,
    hasWaterSports: false,
    hasJetSki: false,
    hasFishing: false,
    hasDiving: false,
    hasMusic: false,
    hasSunDeck: false,
    hasTV: false,
    isFeatured: false,
  });

  function update(key: string, value: string | boolean) {
    setForm(p => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.type || !form.description || !form.pricePerHour || !form.capacity || !form.image) {
      setError("يرجى ملء جميع الحقول الإلزامية");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Get store ID for current owner - using first store for demo
      const res = await fetch("/api/owner/store");
      const storeData = await res.json();
      const storeId = storeData?.id;

      if (!storeId) {
        setError("لا يوجد متجر. يرجى إنشاء متجرك أولاً.");
        setSaving(false);
        return;
      }

      const result = await createYacht(storeId, {
        ...form,
        capacity: Number(form.capacity),
        crewCount: Number(form.crewCount),
        pricePerHour: Number(form.pricePerHour),
        minimumHours: Number(form.minimumHours),
        length: form.length ? Number(form.length) : null,
        cabins: form.cabins ? Number(form.cabins) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        buildYear: form.buildYear ? Number(form.buildYear) : null,
        imagesJson: form.image ? JSON.stringify([form.image]) : null,
      });

      if (result.success) {
        router.push("/owner/yachts?created=true");
      } else {
        setError(result.error ?? "حدث خطأ في الحفظ");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    }
    setSaving(false);
  }

  const inputCls = "w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] transition";
  const labelCls = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link href="/owner/yachts" className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ChevronRight className="h-5 w-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">إضافة يخت جديد</h1>
          <p className="text-sm text-slate-500 mt-0.5">أكمل الخطوات الأربع لنشر يختك</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => {
          const n = (i + 1) as Step;
          const isDone = step > n;
          const isActive = step === n;
          return (
            <div key={i} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isDone && setStep(n)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${isDone ? "bg-green-500 text-white cursor-pointer hover:bg-green-600" : isActive ? "bg-[var(--navy)] text-white" : "bg-slate-200 text-slate-400"}`}
                >
                  {isDone ? "✓" : n}
                </button>
                <p className={`mt-1.5 text-xs text-center hidden md:block max-w-[80px] ${isActive ? "font-bold text-[var(--navy)]" : isDone ? "text-green-600" : "text-slate-400"}`}>
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${isDone ? "bg-green-500" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-extrabold text-[var(--navy)] text-lg flex items-center gap-2">
            <Ship className="h-5 w-5 text-[var(--ocean)]" /> المعلومات الأساسية
          </h2>

          <div>
            <label className={labelCls}>اسم اليخت *</label>
            <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="مثال: لؤلؤة البحر" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>نوع اليخت *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {YACHT_TYPES.map(t => (
                <label key={t.value} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition text-sm font-bold ${form.type === t.value ? "border-[var(--navy)] bg-blue-50 text-[var(--navy)]" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                  <input type="radio" name="type" value={t.value} checked={form.type === t.value} onChange={() => update("type", t.value)} className="hidden" />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>الوصف التفصيلي *</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4} placeholder="اكتب وصفاً جذاباً للتجربة التي ينتظرها العميل..." className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>السعة القصوى (شخص) *</label>
              <input type="number" value={form.capacity} onChange={e => update("capacity", e.target.value)} placeholder="12" min="1" max="100" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>عدد أفراد الطاقم</label>
              <input type="number" value={form.crewCount} onChange={e => update("crewCount", e.target.value)} placeholder="2" min="0" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>الطول (متر)</label>
              <input type="number" value={form.length} onChange={e => update("length", e.target.value)} placeholder="18" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>الكبائن</label>
              <input type="number" value={form.cabins} onChange={e => update("cabins", e.target.value)} placeholder="3" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>الحمامات</label>
              <input type="number" value={form.bathrooms} onChange={e => update("bathrooms", e.target.value)} placeholder="2" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>سنة الصنع</label>
              <input type="number" value={form.buildYear} onChange={e => update("buildYear", e.target.value)} placeholder="2020" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>الشركة المصنّعة</label>
              <input type="text" value={form.manufacturer} onChange={e => update("manufacturer", e.target.value)} placeholder="Sunseeker" className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Images & Location */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-extrabold text-[var(--navy)] text-lg flex items-center gap-2">
            <Image className="h-5 w-5 text-[var(--ocean)]" /> الصور والموقع
          </h2>

          <div>
            <label className={labelCls}>رابط الصورة الرئيسية *</label>
            <input type="url" value={form.image} onChange={e => update("image", e.target.value)} placeholder="https://..." dir="ltr" className={inputCls} />
            {form.image && (
              <div className="mt-3 h-40 rounded-xl bg-cover bg-center border border-slate-200 relative overflow-hidden" style={{ backgroundImage: `url(${form.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-2 right-2 text-white text-xs bg-black/40 px-2 py-1 rounded-full">معاينة</div>
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>صور إضافية (روابط مفصولة بسطر جديد)</label>
            <textarea
              placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
              rows={3} dir="ltr"
              onChange={e => {
                const urls = e.target.value.split("\n").filter(Boolean);
                update("imagesJson", JSON.stringify(urls));
              }}
              className={`${inputCls} resize-none font-mono text-xs`}
            />
            <p className="text-xs text-slate-400 mt-1">ضع رابط كل صورة في سطر منفصل</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>المدينة *</label>
              <select value={form.city} onChange={e => update("city", e.target.value)} className={inputCls}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>الموقع التفصيلي (مارينا)</label>
              <input type="text" value={form.location} onChange={e => update("location", e.target.value)} placeholder="مارينا أبحر الشمالية" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>نقطة الانطلاق (رصيف)</label>
            <input type="text" value={form.departurePoint} onChange={e => update("departurePoint", e.target.value)} placeholder="رصيف A-12، مارينا جدة" className={inputCls} />
          </div>
        </div>
      )}

      {/* Step 3: Pricing & Amenities */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-extrabold text-[var(--navy)] text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[var(--ocean)]" /> التسعير والمميزات
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>سعر الساعة (ريال) *</label>
              <div className="relative">
                <input type="number" value={form.pricePerHour} onChange={e => update("pricePerHour", e.target.value)} placeholder="2500" min="100" className={`${inputCls} pl-12`} />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">﷼</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>الحد الأدنى للساعات</label>
              <select value={form.minimumHours} onChange={e => update("minimumHours", e.target.value)} className={inputCls}>
                {[2,3,4,5,6,8].map(h => <option key={h} value={h}>{h} ساعات</option>)}
              </select>
            </div>
          </div>

          {form.pricePerHour && (
            <div className="bg-[var(--sand)] rounded-xl p-4 text-sm">
              <p className="font-bold text-[var(--navy)] mb-2">حساب تقديري للحجز (بالحد الأدنى)</p>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>{Number(form.pricePerHour).toLocaleString()} × {form.minimumHours} ساعات</span>
                  <span className="font-bold">{(Number(form.pricePerHour) * Number(form.minimumHours)).toLocaleString()} ﷼</span>
                </div>
                <div className="flex justify-between text-amber-600">
                  <span>عمولة بحرنا (12%)</span>
                  <span>−{Math.round(Number(form.pricePerHour) * Number(form.minimumHours) * 0.12).toLocaleString()} ﷼</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold border-t border-slate-200 pt-1 mt-1">
                  <span>صافي أرباحك</span>
                  <span>+{Math.round(Number(form.pricePerHour) * Number(form.minimumHours) * 0.88).toLocaleString()} ﷼</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>المميزات والخدمات المتاحة</label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map(a => (
                <label key={a.key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${(form as any)[a.key] ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="checkbox" checked={(form as any)[a.key]} onChange={e => update(a.key, e.target.checked)} className="w-4 h-4 accent-green-600" />
                  <span className={`text-sm font-bold ${(form as any)[a.key] ? "text-green-700" : "text-slate-600"}`}>{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-[var(--gold)] bg-amber-50">
            <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => update("isFeatured", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="featured" className="cursor-pointer">
              <p className="font-bold text-amber-800">⭐ جعل هذا اليخت مميزاً في الصفحة الرئيسية</p>
              <p className="text-xs text-amber-600 mt-0.5">سيظهر في قسم "اليخوت المميزة" على الصفحة الرئيسية</p>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Policies */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-extrabold text-[var(--navy)] text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--ocean)]" /> السياسات والمراجعة
          </h2>

          <div>
            <label className={labelCls}>سياسة الإلغاء</label>
            <textarea value={form.cancellationPolicy} onChange={e => update("cancellationPolicy", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </div>

          {/* Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <p className="font-extrabold text-[var(--navy)] mb-4">📋 ملخص اليخت قبل النشر</p>
            <div className="space-y-2 text-sm">
              {[
                { label: "الاسم", value: form.name || "—" },
                { label: "النوع", value: YACHT_TYPES.find(t => t.value === form.type)?.label || "—" },
                { label: "المدينة", value: `${form.city}${form.location ? ` — ${form.location}` : ""}` },
                { label: "السعة", value: form.capacity ? `${form.capacity} شخص` : "—" },
                { label: "السعر", value: form.pricePerHour ? `${Number(form.pricePerHour).toLocaleString()} ﷼/ساعة` : "—" },
                { label: "الحد الأدنى", value: `${form.minimumHours} ساعات` },
                { label: "المميزات", value: AMENITIES.filter(a => (form as any)[a.key]).map(a => a.label).join("، ") || "لا يوجد" },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-bold text-[var(--navy)] text-left max-w-[60%] truncate">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {!form.image && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              لم تُضف صورة رئيسية. اليخت لن يظهر بشكل جيد بدون صورة.
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button onClick={() => setStep((step - 1) as Step)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
            <ChevronRight className="h-4 w-4" /> السابق
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={() => {
              setError("");
              if (step === 1 && (!form.name || !form.description || !form.capacity)) {
                setError("يرجى ملء: الاسم، الوصف، والسعة");
                return;
              }
              if (step === 2 && !form.image) {
                setError("يرجى إضافة صورة رئيسية");
                return;
              }
              if (step === 3 && !form.pricePerHour) {
                setError("يرجى إدخال سعر الساعة");
                return;
              }
              setStep((step + 1) as Step);
            }}
            className="mr-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--navy)] text-white text-sm font-bold hover:bg-[#091d4f] transition"
          >
            التالي <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="mr-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition disabled:opacity-60"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "جاري النشر..." : "نشر اليخت"}
          </button>
        )}
      </div>
    </div>
  );
}
