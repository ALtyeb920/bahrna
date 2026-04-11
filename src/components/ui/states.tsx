// ── Loading Skeleton ──────────────────────────────────────────────────────

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[1.75rem] border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <Skeleton className="h-11 w-11 rounded-2xl mb-4" />
      <Skeleton className="h-7 w-1/2 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[var(--navy)] rounded-full animate-spin" />
        <p className="text-sm text-slate-400">جاري التحميل...</p>
      </div>
    </div>
  );
}

// ── Empty States ──────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-5xl mb-4 select-none">{icon}</div>
      <h3 className="text-xl font-bold text-[var(--navy)]">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500 max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function EmptyBookings({ href = "/yachts" }: { href?: string }) {
  return (
    <EmptyState
      icon="🛥️"
      title="لا توجد حجوزات بعد"
      description="لم تقم بأي حجز حتى الآن. استكشف اليخوت المتاحة وابدأ رحلتك!"
      action={
        <a href={href} className="inline-flex items-center gap-2 bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
          استكشف اليخوت
        </a>
      }
    />
  );
}

export function EmptyYachts({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon="⚓"
      title="لا يوجد يخوت مُضافة بعد"
      description="أضف أول يخت لك وابدأ في استقبال الحجوزات من العملاء."
      action={
        onAdd ? (
          <button onClick={onAdd} className="inline-flex items-center gap-2 bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
            + إضافة يخت جديد
          </button>
        ) : (
          <a href="/owner/yachts/new" className="inline-flex items-center gap-2 bg-[var(--navy)] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#091d4f] transition">
            + إضافة يخت جديد
          </a>
        )
      }
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon="🔍"
      title="لا توجد نتائج"
      description="لم نجد يخوت تطابق معايير البحث. جرّب تعديل الفلاتر."
      action={
        <a href="/yachts" className="text-sm font-bold text-[var(--ocean)] hover:underline">
          مسح الفلاتر والبدء من جديد
        </a>
      }
    />
  );
}

// ── Error States ──────────────────────────────────────────────────────────

export function ErrorState({ title = "حدث خطأ", description = "تعذّر تحميل البيانات. يرجى المحاولة مرة أخرى.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-bold text-red-600">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-md">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-sm font-bold text-[var(--ocean)] hover:underline">
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  // Booking
  PENDING:    { label: "معلق",      cls: "badge-pending" },
  CONFIRMED:  { label: "مؤكد",      cls: "badge-confirmed" },
  COMPLETED:  { label: "مكتمل",     cls: "badge-completed" },
  CANCELLED:  { label: "ملغي",      cls: "badge-cancelled" },
  IN_PROGRESS:{ label: "جارٍ",      cls: "bg-blue-100 text-blue-700" },
  // Payment
  PAID:       { label: "مدفوع",     cls: "badge-paid" },
  FAILED:     { label: "فشل",       cls: "badge-cancelled" },
  REFUNDED:   { label: "مسترجع",    cls: "badge-refunded" },
  // Store/Yacht
  ACTIVE:     { label: "نشط",       cls: "badge-active" },
  SUSPENDED:  { label: "موقوف",     cls: "badge-cancelled" },
  REJECTED:   { label: "مرفوض",     cls: "badge-cancelled" },
  INACTIVE:   { label: "غير نشط",   cls: "badge-pending" },
  MAINTENANCE:{ label: "صيانة",     cls: "badge-pending" },
  // Store
  UNDER_REVIEW: { label: "مراجعة", cls: "badge-review" },
  // User
  PROCESSING: { label: "معالجة",   cls: "bg-blue-100 text-blue-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
