import Link from "next/link";

export default function OwnerFallbackPage({ params }: { params: { slug: string[] } }) {
  const titles: Record<string, string> = {
    settings: "الإعدادات الشخصية",
    notifications: "الإشعارات",
    "yachts/new": "إضافة يخت جديد",
  };
  const key = params.slug?.join("/") ?? "";
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-4xl mb-4">🚧</p>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">{titles[key] ?? "هذه الصفحة قيد التطوير"}</h1>
        <p className="mt-2 text-sm text-slate-500">سيتم إضافة هذه الميزة قريباً.</p>
        <Link href="/owner" className="mt-4 inline-block text-sm font-bold text-[var(--ocean)] hover:underline">
          العودة للوحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
