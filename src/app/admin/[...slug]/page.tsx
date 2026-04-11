import Link from "next/link";

export default function AdminFallbackPage({ params }: { params: { slug: string[] } }) {
  const titles: Record<string, string> = {
    notifications: "الإشعارات",
    "stores/new": "إضافة متجر",
  };
  const key = params.slug?.join("/") ?? "";
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-4xl mb-4">🚧</p>
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">{titles[key] ?? "قيد التطوير"}</h1>
        <p className="mt-2 text-sm text-slate-500">سيتم إضافة هذه الميزة في التحديث القادم.</p>
        <Link href="/admin" className="mt-4 inline-block text-sm font-bold text-[var(--ocean)] hover:underline">← العودة</Link>
      </div>
    </div>
  );
}
