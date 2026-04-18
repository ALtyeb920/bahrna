"use client";

import { useState, Suspense } from "react";
import { Anchor, Eye, EyeOff, ArrowRight, CheckCircle2, User, Store, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Role = "customer" | "operator";

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") === "operator" ? "operator" : "customer") as Role;

  const [role, setRole] = useState<Role>(defaultRole);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirmPassword: "",
    storeName: "", city: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    if (form.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          password: form.password,
          role: role === "operator" ? "OPERATOR" : "CUSTOMER",
          storeName: role === "operator" ? form.storeName : undefined,
          storeCity: role === "operator" ? form.city : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "حدث خطأ في التسجيل"); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-extrabold text-[var(--navy)] mb-2">
          {role === "operator" ? "تم إنشاء طلب المتجر!" : "تم إنشاء حسابك بنجاح!"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {role === "operator"
            ? "سيتم مراجعة طلبك من قِبل إدارة المنصة. ستصلك إشعار عند الموافقة."
            : "يمكنك الآن تسجيل الدخول والبدء في استكشاف اليخوت."}
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
          تسجيل الدخول <ArrowRight className="h-4 w-4 rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Role Selector */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl">
        <button type="button" onClick={() => setRole("customer")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${role === "customer" ? "bg-white text-[var(--navy)] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          <User className="h-4 w-4" /> عميل
        </button>
        <button type="button" onClick={() => setRole("operator")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${role === "operator" ? "bg-white text-[var(--navy)] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          <Store className="h-4 w-4" /> مشغّل يخوت
        </button>
      </div>

      {role === "operator" && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          سيتم إنشاء متجرك بحالة &ldquo;قيد المراجعة&rdquo; حتى تتم الموافقة من الإدارة.
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل *</label>
          <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="أدخل اسمك الكامل" required className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">رقم الجوال *</label>
          <input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+966 5X XXX XXXX" required dir="ltr" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
          <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="example@email.com" dir="ltr" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
        </div>

        {role === "operator" && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اسم المتجر *</label>
              <input type="text" value={form.storeName} onChange={e => setForm(p => ({...p, storeName: e.target.value}))} placeholder="مثال: يخوت البحر الأحمر" required className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">المدينة *</label>
              <select value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} required className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]">
                <option value="">اختر المدينة</option>
                {["جدة","ينبع","الدمام","جازان","الوجه","القنفذة"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور *</label>
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="8 أحرف على الأقل" required minLength={8} className="w-full rounded-xl border border-slate-200 py-3 px-4 pl-10 text-sm outline-none focus:border-[var(--navy)]" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور *</label>
          <input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({...p, confirmPassword: e.target.value}))} placeholder="••••••••" required className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)]" />
        </div>

        <div className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-1 w-4 h-4 accent-[var(--navy)]" />
          <label className="text-slate-600">أوافق على <a href="/terms" className="font-bold text-[var(--navy)] hover:underline">الشروط والأحكام</a> و<a href="/privacy" className="font-bold text-[var(--navy)] hover:underline">سياسة الخصوصية</a></label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[var(--navy)] text-white rounded-xl py-3.5 text-sm font-bold transition hover:bg-[#091d4f] disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{role === "operator" ? "إنشاء المتجر" : "إنشاء الحساب"}</span><ArrowRight className="h-4 w-4 rotate-180" /></>}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">لديك حساب؟ <Link href="/login" className="font-bold text-[var(--navy)] hover:underline">تسجيل الدخول</Link></p>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-sea-glow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gold)] text-[var(--navy)]">
              <Anchor className="h-7 w-7" />
            </div>
            <p className="text-xl font-extrabold text-white">بحرنا</p>
          </Link>
          <h1 className="text-2xl font-extrabold text-white mt-2">إنشاء حساب جديد</h1>
          <p className="text-white/60 mt-1 text-sm">انضم إلى منصة بحرنا اليوم</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-luxury">
          <Suspense fallback={<div className="text-center py-4 text-slate-400">جاري التحميل...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
