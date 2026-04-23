import { Anchor, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white mt-auto">
      <div className="container-shell py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold)] flex items-center justify-center shrink-0">
              <Anchor className="h-5 w-5 text-[var(--navy)]" />
            </div>
            <div>
              <p className="font-extrabold text-lg leading-none">بحرنا</p>
              <p className="text-xs text-white/50 mt-0.5">حجوزات اليخوت السعودية</p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-7">
            منصة عربية احترافية لحجز اليخوت وإدارة المتاجر البحرية في السوق السعودي.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold mb-5 text-sm tracking-wide">روابط سريعة</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li><Link href="/yachts" className="hover:text-[var(--gold)] transition">استكشاف اليخوت</Link></li>
            <li><Link href="/stores" className="hover:text-[var(--gold)] transition">المتاجر</Link></li>
            <li><Link href="/about" className="hover:text-[var(--gold)] transition">من نحن</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--gold)] transition">اتصل بنا</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--gold)] transition">الشروط والأحكام</Link></li>
            <li><Link href="/privacy" className="hover:text-[var(--gold)] transition">سياسة الخصوصية</Link></li>
          </ul>
        </div>

        {/* For operators */}
        <div>
          <h4 className="font-bold mb-5 text-sm tracking-wide">للمشغّلين</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li><Link href="/register?role=operator" className="hover:text-[var(--gold)] transition">أنشئ متجرك</Link></li>
            <li><Link href="/owner" className="hover:text-[var(--gold)] transition">لوحة التحكم</Link></li>
            <li><Link href="/login" className="hover:text-[var(--gold)] transition">تسجيل الدخول</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-5 text-sm tracking-wide">تواصل معنا</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
              جدة، المملكة العربية السعودية
            </li>
            <li>
              <a href="tel:+966530788837" className="flex items-center gap-3 hover:text-[var(--gold)] transition">
                <Phone className="h-4 w-4 text-[var(--gold)] shrink-0" />
                +966 53 078 8837
              </a>
            </li>
            <li>
              <a href="https://wa.me/966530788837" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--gold)] transition">
                <MessageCircle className="h-4 w-4 text-[var(--gold)] shrink-0" />
                واتساب
              </a>
            </li>
            <li>
              <a href="mailto:yllaba7ar@gmail.com" className="flex items-center gap-3 hover:text-[var(--gold)] transition">
                <Mail className="h-4 w-4 text-[var(--gold)] shrink-0" />
                yllaba7ar@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 بحرنا. جميع الحقوق محفوظة.</p>
          <p>منصة متخصصة في حجز اليخوت للسوق السعودي</p>
        </div>
      </div>
    </footer>
  );
}
