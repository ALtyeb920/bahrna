export default function AdminPlaceholderPage({ params }: { params: { slug: string[] } }) {
  const titles: Record<string, string> = {
    users: "إدارة المستخدمين",
    yachts: "إدارة اليخوت",
    bookings: "إدارة الحجوزات",
    payments: "المدفوعات",
    reports: "التقارير والإحصائيات",
    settings: "الإعدادات",
  };
  const slug = params.slug?.[0] ?? "";
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">{titles[slug] ?? "هذه الصفحة قيد التطوير"}</h1>
        <p className="mt-2 text-sm text-slate-500">سيتم إضافة هذه الميزة في التحديث القادم.</p>
      </div>
    </div>
  );
}
