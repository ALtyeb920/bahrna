import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking/booking-flow";
import { getYachtBySlug } from "@/lib/server-data";

export default async function BookingPage({ params }: { params: { slug: string } }) {
  let yacht: Awaited<ReturnType<typeof getYachtBySlug>> = null;
  try {
    yacht = await getYachtBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!yacht) notFound();

  return (
    <div className="container-shell py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-primary">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/yachts" className="hover:text-brand-primary">
          اليخوت
        </Link>
        <span>/</span>
        <Link href={`/yachts/${yacht.slug}`} className="hover:text-brand-primary">
          {yacht.name}
        </Link>
        <span>/</span>
        <span className="font-bold text-brand-primary">الحجز</span>
      </nav>

      <BookingFlow yacht={yacht} />
    </div>
  );
}
