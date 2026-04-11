import { notFound } from "next/navigation";
import { YachtForm } from "@/components/forms/yacht-form";
import { getStoreOptions, getYachtById } from "@/lib/server-data";

export default async function EditYachtPage({ params }: { params: { id: string } }) {
  const [stores, yacht] = await Promise.all([getStoreOptions(), getYachtById(params.id)]);

  if (!yacht) notFound();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-brand-primary">تعديل اليخت</h1>
        <p className="mt-1 text-sm text-slate-500">يمكنك تعديل البيانات ثم حفظها في القاعدة مباشرة</p>
      </div>
      <YachtForm mode="edit" stores={stores} initialValues={yacht} />
    </div>
  );
}
