import { getSettings } from "@/lib/server-data";
import { Settings, Save } from "lucide-react";

export default async function AdminSettingsPage() {
  let settings: Record<string, string> = {};
  try { settings = await getSettings(); } catch {}

  const fields = [
    { key: "platform_name", label: "اسم المنصة", type: "text" },
    { key: "default_commission_rate", label: "نسبة العمولة الافتراضية (%)", type: "number" },
    { key: "vat_rate", label: "نسبة ضريبة القيمة المضافة (%)", type: "number" },
    { key: "min_booking_hours", label: "الحد الأدنى لساعات الحجز", type: "number" },
    { key: "support_email", label: "بريد الدعم الفني", type: "email" },
    { key: "support_phone", label: "هاتف الدعم الفني", type: "tel" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">إعدادات المنصة</h1>
        <p className="text-sm text-slate-500 mt-1">التحكم في الإعدادات العامة للنظام</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-bold text-[var(--navy)]">الإعدادات العامة</p>
            <p className="text-xs text-slate-400">هذه الإعدادات تؤثر على كامل المنصة</p>
          </div>
        </div>

        <form className="space-y-5">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-bold text-slate-700 mb-2">{f.label}</label>
              <input
                type={f.type}
                name={f.key}
                defaultValue={settings[f.key] ?? ""}
                className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
              />
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" className="flex items-center gap-2 bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
              <Save className="h-4 w-4" /> حفظ الإعدادات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
