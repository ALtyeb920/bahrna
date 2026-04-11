import { requireOperator } from "@/lib/session";
import { getOwnerStore } from "@/lib/server-data";
import { Store, MapPin, Phone, Mail, FileText } from "lucide-react";

export default async function OwnerStorePage() {
  const session = await requireOperator();
  const store = await getOwnerStore(session.user.id).catch(() => null);

  if (!store) {
    return (
      <div className="max-w-3xl mx-auto p-6 pt-20 text-center">
        <p className="text-5xl mb-4">🏪</p>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">لا يوجد متجر بعد</h1>
        <p className="text-slate-500 mt-2">أنشئ متجرك لتبدأ في استقبال الحجوزات</p>
        <a href="/owner/store/new" className="mt-4 inline-block bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold">
          + إنشاء متجر
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">إعدادات المتجر</h1>
        <p className="text-sm text-slate-500 mt-1">تحديث معلومات متجرك وسياساته</p>
      </div>

      {/* Store Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {store.coverImage && (
          <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${store.coverImage})` }} />
        )}
        <div className="p-5 flex items-center gap-4">
          {store.logo ? (
            <img src={store.logo} alt={store.name} className="w-14 h-14 rounded-2xl border border-slate-100 object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[var(--navy)] flex items-center justify-center text-[var(--gold)] font-extrabold text-2xl">{store.name[0]}</div>
          )}
          <div>
            <h2 className="font-extrabold text-[var(--navy)]">{store.name}</h2>
            <p className="text-sm text-slate-500">{store.city}{store.marina ? ` • ${store.marina}` : ""}</p>
            <span className={`badge ${store.status === "ACTIVE" ? "badge-active" : "badge-pending"} mt-1 inline-block`}>
              {store.status === "ACTIVE" ? "نشط" : store.status === "PENDING" ? "قيد المراجعة" : store.status}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h3 className="font-bold text-[var(--navy)] border-b border-slate-100 pb-3 flex items-center gap-2">
          <Store className="h-4 w-4" /> المعلومات الأساسية
        </h3>

        {[
          { label: "اسم المتجر *", name: "name", defaultValue: store.name, type: "text" },
          { label: "الوصف", name: "description", defaultValue: store.description ?? "", type: "textarea" },
          { label: "رابط الشعار (URL)", name: "logo", defaultValue: store.logo ?? "", type: "url" },
          { label: "رابط صورة الغلاف (URL)", name: "coverImage", defaultValue: store.coverImage ?? "", type: "url" },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-bold text-slate-700 mb-2">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea name={f.name} defaultValue={f.defaultValue} rows={3} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] resize-none" />
            ) : (
              <input type={f.type} name={f.name} defaultValue={f.defaultValue} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
            )}
          </div>
        ))}

        <h3 className="font-bold text-[var(--navy)] border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" /> الموقع والتواصل
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "المدينة", name: "city", defaultValue: store.city },
            { label: "المارينا / الرصيف", name: "marina", defaultValue: store.marina ?? "" },
            { label: "العنوان التفصيلي", name: "address", defaultValue: store.address ?? "" },
            { label: "رقم الهاتف", name: "phone", defaultValue: store.phone ?? "" },
            { label: "واتساب", name: "whatsapp", defaultValue: store.whatsapp ?? "" },
            { label: "البريد الإلكتروني", name: "email", defaultValue: store.email ?? "" },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-bold text-slate-700 mb-2">{f.label}</label>
              <input type="text" name={f.name} defaultValue={f.defaultValue} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
            </div>
          ))}
        </div>

        <h3 className="font-bold text-[var(--navy)] border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
          <FileText className="h-4 w-4" /> السياسات
        </h3>

        {[
          { label: "سياسات المتجر", name: "policies", defaultValue: store.policies ?? "" },
          { label: "شروط الإلغاء", name: "cancellationTerms", defaultValue: store.cancellationTerms ?? "" },
          { label: "ساعات العمل", name: "operatingHours", defaultValue: store.operatingHours ?? "" },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-bold text-slate-700 mb-2">{f.label}</label>
            <textarea name={f.name} defaultValue={f.defaultValue} rows={2} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] resize-none" />
          </div>
        ))}

        <div className="pt-4 border-t border-slate-100">
          <button type="submit" className="bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}
