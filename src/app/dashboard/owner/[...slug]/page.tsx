export default function OwnerPlaceholderPage({ params }: { params: { slug: string[] } }) {
  const title: Record<string, string> = {
    "store": "إعدادات المتجر",
    "settings": "الإعدادات",
    "new": "إضافة يخت جديد",
  };
  const slug = params.slug?.[0] ?? "";
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">{title[slug] ?? "هذه الصفحة قيد التطوير"}</h1>
        <p className="mt-2 text-sm text-slate-500">سيتم إتاحة هذه الخاصية قريباً. يمكنك العودة للوحة الرئيسية.</p>
      </div>
    </div>
  );
}
