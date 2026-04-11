import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    { title: "1. البيانات التي نجمعها", content: "نجمع: الاسم، البريد الإلكتروني، رقم الجوال، معلومات الحجز والدفع. لا نجمع بيانات بطاقات الائتمان مباشرةً — يتم ذلك عبر بوابة دفع معتمدة (Moyasar)." },
    { title: "2. كيف نستخدم بياناتك", content: "نستخدم بياناتك لتأكيد الحجوزات، التواصل معك، تحسين الخدمة، وإرسال إشعارات الحجز. لا نبيع بياناتك لأطراف ثالثة." },
    { title: "3. مشاركة البيانات", content: "نشارك بيانات الحجز مع المشغّل المعني فقط لإتمام الخدمة. قد نشارك بيانات مجمّعة (غير شخصية) لأغراض إحصائية." },
    { title: "4. أمان البيانات", content: "نستخدم تشفير SSL لجميع البيانات المنقولة. كلمات المرور مُشفّرة بخوارزمية bcrypt. نراجع ممارساتنا الأمنية بانتظام." },
    { title: "5. ملفات الارتباط (Cookies)", content: "نستخدم ملفات الارتباط الضرورية للجلسات والتحقق من الهوية فقط. لا نستخدم ملفات ارتباط للإعلانات." },
    { title: "6. حقوقك", content: "يحق لك طلب الوصول إلى بياناتك، تصحيحها، أو حذفها في أي وقت. تواصل معنا عبر support@bahrna.sa." },
    { title: "7. الاحتفاظ بالبيانات", content: "نحتفظ ببياناتك طالما حسابك نشط أو حسب ما تقتضيه المتطلبات القانونية. يمكنك طلب حذف حسابك في أي وقت." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-sea-glow text-white py-14 text-center">
          <div className="container-shell">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
              <Shield className="h-7 w-7 text-[var(--gold)]" />
            </div>
            <h1 className="text-4xl font-extrabold mb-3">سياسة الخصوصية</h1>
            <p className="text-white/70">آخر تحديث: أبريل 2026</p>
          </div>
        </section>
        <section className="container-shell py-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <strong>الخلاصة:</strong> نحن لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث بدون موافقتك. بياناتك آمنة معنا.
            </div>
            {sections.map(s => (
              <div key={s.title}>
                <h2 className="font-extrabold text-[var(--navy)] mb-3">{s.title}</h2>
                <p className="text-slate-600 leading-8 text-sm">{s.content}</p>
              </div>
            ))}
            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400">للاستفسار: <a href="mailto:support@bahrna.sa" className="text-[var(--ocean)] hover:underline">support@bahrna.sa</a></p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
