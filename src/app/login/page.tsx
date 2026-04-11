"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Anchor, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("?????? ?????? ??? ?????. ???? ???????? ??? ????.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "ADMIN") router.push("/admin");
    else if (role === "OPERATOR") router.push("/owner");
    else router.push("/");
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-luxury">
      {reason === "unauthorized" && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          ??? ???? ?????? ??????. ???? ????? ?????? ????? ?????.
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            ?????? ?????????? ?? ??? ??????
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="admin@bahrna.sa ?? ??? ??????"
            required
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">???? ??????</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 py-3 px-4 pl-10 text-sm outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--navy)] text-white rounded-xl py-3.5 text-sm font-bold transition hover:bg-[#091d4f] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "????? ??????"
          )}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          ??? ???? ?????{" "}
          <Link href="/register" className="font-bold text-[var(--navy)] hover:underline">
            ??? ????
          </Link>
        </p>
      </div>

      <div className="mt-4 bg-[var(--sand)] rounded-xl p-4 text-xs text-slate-600">
        <p className="font-bold text-[var(--navy)] mb-2">?????? ?????? ?????????</p>
        <div className="space-y-1.5">
          <p>?????: <strong>admin@bahrna.sa</strong> / <strong>Admin@2026!</strong></p>
          <p>?????: <strong>operator</strong> / <strong>Owner@2026!</strong></p>
          <p>????: <strong>+966501234567</strong> / <strong>Customer@2026!</strong></p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sea-glow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)] flex items-center justify-center">
              <Anchor className="h-7 w-7 text-[var(--navy)]" />
            </div>
            <p className="text-xl font-extrabold text-white">?????</p>
          </Link>
          <h1 className="text-2xl font-extrabold text-white mt-1">????? ??????</h1>
          <p className="text-white/60 mt-1 text-sm">?????? ?????? ?? ???? ?????</p>
        </div>

        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-8 text-center text-slate-400">
              ???? ???????...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
          <ShieldCheck className="h-3.5 w-3.5" />
          ???? ???????? ????? ??????
        </div>
      </div>
    </div>
  );
}
