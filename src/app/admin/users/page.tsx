import { getAllUsers } from "@/lib/server-data";
import { StatusBadge, EmptyState } from "@/components/ui/states";
import { UserX, UserCheck } from "lucide-react";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { role?: string; status?: string };
}) {
  let users: Awaited<ReturnType<typeof getAllUsers>> = [];
  try { users = await getAllUsers({ role: searchParams?.role, status: searchParams?.status }); } catch {}

  const roleLabel: Record<string,string> = { ADMIN:"مسؤول", OPERATOR:"مشغّل", CUSTOMER:"عميل" };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--navy)]">المستخدمون</h1>
        <p className="text-sm text-slate-500 mt-1">{users.length} مستخدم</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "", label: "الكل" },
          { value: "ADMIN", label: "مسؤولون" },
          { value: "OPERATOR", label: "مشغّلون" },
          { value: "CUSTOMER", label: "عملاء" },
        ].map(f => (
          <a key={f.value} href={f.value ? `?role=${f.value}` : "/admin/users"}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition ${(searchParams?.role ?? "") === f.value ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-slate-600 border-slate-200 hover:border-[var(--navy)]"}`}>
            {f.label}
          </a>
        ))}
      </div>

      {users.length === 0 ? (
        <EmptyState icon="👥" title="لا يوجد مستخدمون" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 border-b">
                  {["المستخدم","الدور","الهاتف","المتجر","الحالة","تاريخ الانضمام","إجراءات"].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-[var(--navy)]">{u.name[0]}</div>
                        <div>
                          <p className="font-bold text-[var(--navy)] text-sm">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : u.role === "OPERATOR" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-600">{u.phone}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{u.storeName ?? "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString("ar-SA")}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="تفعيل"><UserCheck className="h-4 w-4" /></button>
                        <button className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="إيقاف"><UserX className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
