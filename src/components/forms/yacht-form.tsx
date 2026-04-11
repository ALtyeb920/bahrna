"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createYacht } from "@/lib/actions/yacht";
import { Anchor, Building2, CheckSquare, Image, Info, Layers, Save } from "lucide-react";

type StoreOption = {
  id: string;
  name: string;
  slug: string;
  city: string;
};

type InitialValues = {
  id?: string;
  name?: string;
  slug?: string;
  location?: string;
  city?: string;
  description?: string;
  type?: string;
  typeLabel?: string;
  status?: string;
  capacity?: number;
  pricePerHour?: number;
  image?: string;
  length?: number | null;
  cabins?: number | null;
  hasAC?: boolean;
  hasWifi?: boolean;
  hasKitchen?: boolean;
  hasWaterSports?: boolean;
  hasJetSki?: boolean;
  isFeatured?: boolean;
  store?: { slug: string };
};

const YACHT_TYPES = [
  { value: "LUXURY_YACHT",  label: "🛥️ يخت فاخر" },
  { value: "MOTOR_YACHT",   label: "⚡ يخت بمحرك" },
  { value: "SAILING_YACHT", label: "⛵ يخت شراعي" },
  { value: "PARTY_BOAT",    label: "🎉 قارب حفلات" },
  { value: "SPEEDBOAT",     label: "🚤 قارب سريع" },
];

const YACHT_STATUSES = [
  { value: "AVAILABLE",    label: "✅ متاح للحجز" },
  { value: "UNAVAILABLE",  label: "🚫 غير متاح" },
  { value: "MAINTENANCE",  label: "🔧 في الصيانة" },
  { value: "UNDER_REVIEW", label: "⏳ قيد المراجعة" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/10";

const labelClass = "mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className={labelClass}>{label}</span>
      {children}
    </div>
  );
}

export function YachtForm({
  mode,
  stores,
  initialValues,
}: {
  mode: "create" | "edit";
  stores: StoreOption[];
  initialValues?: InitialValues;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    location: initialValues?.location ?? "",
    city: initialValues?.city ?? stores[0]?.city ?? "جدة",
    description: initialValues?.description ?? "",
    type: initialValues?.type ?? "LUXURY_YACHT",
    typeLabel: initialValues?.typeLabel ?? "يخت فاخر",
    status: initialValues?.status ?? "AVAILABLE",
    capacity: initialValues?.capacity ?? 8,
    pricePerHour: initialValues?.pricePerHour ?? 2500,
    image: initialValues?.image ?? "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80",
    length: initialValues?.length ?? 18,
    cabins: initialValues?.cabins ?? 2,
    hasAC: initialValues?.hasAC ?? true,
    hasWifi: initialValues?.hasWifi ?? true,
    hasKitchen: initialValues?.hasKitchen ?? true,
    hasWaterSports: initialValues?.hasWaterSports ?? false,
    hasJetSki: initialValues?.hasJetSki ?? false,
    isFeatured: initialValues?.isFeatured ?? false,
    storeSlug: initialValues?.store?.slug ?? stores[0]?.slug ?? "",
  });

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const selectedStoreId = stores.find((s) => s.slug === form.storeSlug)?.id;
      if (!selectedStoreId) throw new Error("يرجى اختيار المتجر");

      const response = await createYacht(selectedStoreId, form);

      if (!response.success) {
        setError(response.error || "تعذر حفظ بيانات اليخت.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/operator/yachts");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(msg);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckSquare className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-extrabold text-brand-primary">
          {mode === "create" ? "تم إضافة اليخت بنجاح!" : "تم حفظ التعديلات!"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">جارٍ تحويلك إلى قائمة اليخوت...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2 text-brand-primary">
          <Info className="h-5 w-5" />
          <h2 className="font-extrabold">المعلومات الأساسية</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="اسم اليخت *">
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="مثال: لؤلؤة البحر الأحمر" className={inputClass} />
          </Field>

          <Field label="الموقع / البحرنا *">
            <input required value={form.location} onChange={(e) => set("location", e.target.value)}
              placeholder="مثال: بحرنا جدة" className={inputClass} />
          </Field>

          <Field label="المدينة *">
            <input required value={form.city} onChange={(e) => set("city", e.target.value)}
              placeholder="مثال: جدة" className={inputClass} />
          </Field>

          <Field label="المتجر المالك">
            <select value={form.storeSlug} onChange={(e) => set("storeSlug", e.target.value)} className={inputClass}>
              {stores.length === 0 && (
                <option value="">لا يوجد متاجر - يرجى إنشاء متجر أولاً</option>
              )}
              {stores.map((store) => (
                <option key={store.id} value={store.slug}>
                  🏪 {store.name} — {store.city}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Section 2: Type & Status */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2 text-brand-primary">
          <Layers className="h-5 w-5" />
          <h2 className="font-extrabold">النوع والحالة</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="نوع اليخت">
            <select value={form.type}
              onChange={(e) => {
                const found = YACHT_TYPES.find((t) => t.value === e.target.value);
                set("type", e.target.value);
                if (found) set("typeLabel", found.label.replace(/^.+?\s/, ""));
              }}
              className={inputClass}
            >
              {YACHT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>

          <Field label="حالة اليخت">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
              {YACHT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>

          <Field label="السعة (عدد الأشخاص)">
            <input type="number" min={1} max={200} value={form.capacity}
              onChange={(e) => set("capacity", Number(e.target.value))}
              placeholder="8" title="السعة (عدد الأشخاص)"
              className={inputClass} />
          </Field>

          <Field label="السعر لكل ساعة (ريال)">
            <input type="number" min={100} value={form.pricePerHour}
              onChange={(e) => set("pricePerHour", Number(e.target.value))}
              placeholder="2500" title="السعر لكل ساعة بالريال"
              className={inputClass} />
          </Field>

          <Field label="الطول (متر)">
            <input type="number" min={5} value={form.length ?? ""}
              onChange={(e) => set("length", Number(e.target.value))}
              placeholder="18" title="الطول بالمتر"
              className={inputClass} />
          </Field>

          <Field label="عدد الكبائن">
            <input type="number" min={0} value={form.cabins ?? ""}
              onChange={(e) => set("cabins", Number(e.target.value))}
              placeholder="2" title="عدد الكبائن"
              className={inputClass} />
          </Field>
        </div>
      </section>

      {/* Section 3: Description */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2 text-brand-primary">
          <Building2 className="h-5 w-5" />
          <h2 className="font-extrabold">الوصف والصورة</h2>
        </div>
        <div className="space-y-4">
          <Field label="وصف اليخت *">
            <textarea required value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="اكتب وصفاً جذاباً يصف اليخت ومميزاته وتجربة الاستئجار..."
              className={`${inputClass} min-h-[120px] resize-none`} />
          </Field>

          <Field label="رابط الصورة الرئيسية">
            <input value={form.image} onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/..." className={inputClass} dir="ltr" />
          </Field>

          {form.image && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img src={form.image} alt="معاينة الصورة"
                className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Features */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2 text-brand-primary">
          <Image className="h-5 w-5" />
          <h2 className="font-extrabold">المميزات والخدمات</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            { key: "hasAC",         label: "❄️ تكييف هواء" },
            { key: "hasWifi",       label: "📶 واي فاي" },
            { key: "hasKitchen",    label: "🍽️ مطبخ متكامل" },
            { key: "hasWaterSports",label: "🏄 رياضات مائية" },
            { key: "hasJetSki",     label: "🛥️ جت سكي" },
            { key: "isFeatured",    label: "⭐ يخت مميز" },
          ].map((item) => (
            <label
              key={item.key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                (form[item.key as keyof typeof form] as boolean)
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                  : "border-slate-200 text-slate-600 hover:border-brand-primary/40"
              }`}
            >
              <input
                type="checkbox"
                checked={form[item.key as keyof typeof form] as boolean}
                onChange={(e) => set(item.key, e.target.checked)}
                className="h-4 w-4 accent-brand-primary"
              />
              {item.label}
            </label>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading || stores.length === 0}
          className="flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d2f7a] disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {loading ? "جارٍ الحفظ..." : mode === "create" ? "إضافة اليخت" : "حفظ التعديلات"}
        </button>
      </div>
    </form>
  );
}
