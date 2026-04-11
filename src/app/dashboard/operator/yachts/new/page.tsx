import { YachtForm } from "@/components/forms/yacht-form";
import { getStoreOptions } from "@/lib/server-data";

export default async function NewYachtPage() {
  let stores: Awaited<ReturnType<typeof getStoreOptions>> = [];
  try {
    stores = await getStoreOptions();
  } catch {
    // DB not ready - show form with empty stores
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-brand-primary">إضافة يخت جديد</h1>
        <p className="mt-1 text-sm text-slate-500">هذا النموذج يحفظ اليخت مباشرة في قاعدة البيانات المحلية</p>
      </div>
      <YachtForm mode="create" stores={stores} />
    </div>
  );
}
