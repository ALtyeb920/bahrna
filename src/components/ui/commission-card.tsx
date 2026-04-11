interface Props {
  total: number;
  commission: number;
  payout: number;
  vat?: number;
  commissionRate?: number;
  variant?: "booking" | "summary";
}

export function CommissionCard({ total, commission, payout, vat = 0, commissionRate, variant = "booking" }: Props) {
  const base = total - vat;
  const commissionPct = commissionRate ?? Math.round((commission / base) * 100);
  const payoutPct = 100 - commissionPct;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">توزيع المبلغ</p>
        <p className="text-xs text-slate-400">نسبة العمولة {commissionPct}%</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Bar */}
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
          <div className="h-full bg-[var(--gold)] rounded-r-full transition-all duration-700" style={{ width: `${commissionPct}%` }} />
          <div className="h-full bg-[var(--navy)] rounded-l-full transition-all duration-700" style={{ width: `${payoutPct}%` }} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">إجمالي الحجز</p>
            <p className="font-extrabold text-[var(--navy)] text-sm">{total.toLocaleString()}</p>
            <p className="text-xs text-slate-400">ريال</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <p className="text-xs text-amber-600 mb-1">عمولة المنصة</p>
            <p className="font-extrabold text-amber-700 text-sm">{commission.toLocaleString()}</p>
            <p className="text-xs text-amber-500">{commissionPct}%</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <p className="text-xs text-green-600 mb-1">صافي المشغّل</p>
            <p className="font-extrabold text-green-700 text-sm">{payout.toLocaleString()}</p>
            <p className="text-xs text-green-500">{payoutPct}%</p>
          </div>
        </div>

        {vat > 0 && (
          <p className="text-xs text-slate-400 text-center">
            يشمل الإجمالي ضريبة القيمة المضافة {vat.toLocaleString()} ريال (15%)
          </p>
        )}
      </div>
    </div>
  );
}
