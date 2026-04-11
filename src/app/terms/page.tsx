import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  const sections = [
    {
      title: "1. قبول الشروط",
      content: "باستخدامك لمنصة بحرنا، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يُرجى التوقف عن استخدام المنصة."
    },
    {
      title: "2. الخدمات المقدمة",
      content: "تعمل بحرنا كوسيط بين ملّاك اليخوت (المشغّلين) والعملاء. نحن لا نمتلك أي يخوت، بل نوفر المنصة لتيسير عملية الحجز."
    },
    {
      title: "3. الحجوزات والدفع",
      content: "تصبح الحجوزات مؤكدة بعد إتمام الدفع وتأكيد المشغّل. نسبة العمولة تُخصم تلقائياً من قيمة الحجز وتحدد حسب باقة كل متجر (من 8% إلى 15%)."
    },
    {
      title: "4. سياسة الإلغاء",
      content: "تختلف سياسة الإلغاء بحسب كل متجر ويخت. يُرجى الاطلاع على سياسة الإلغاء الخاصة باليخت قبل الحجز. بوجه عام، الإلغاء قبل 48 ساعة مجاني وبعدها قد تطبق رسوم."
    },
    {
      title: "5. مسؤولية المستخدم",
      content: "يتحمل المستخدم مسؤولية دقة المعلومات المُدخلة. يجب التزام جميع المستخدمين بالقوانين السعودية وآداب السلوك البحري."
    },
    {
      title: "6. المسؤولية المحدودة",
      content: "بحرنا غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الخدمة، أو عن أي نزاعات بين المشغّلين والعملاء."
    },
    {
      title: "7. الخصوصية والبيانات",
      content: "نلتزم بحماية بياناتك الشخصية وفق سياسة الخصوصية المعتمدة. لا نبيع بياناتك لأطراف ثالثة."
    },
    {
      title: "8. التعديلات",
      content: "تحتفظ بحرنا بحق تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-sea-glow text-white py-14 text-center">
          <div className="container-shell">
            <h1 className="text-4xl font-extrabold mb-3">الشروط والأحكام</h1>
            <p className="text-white/70">آخر تحديث: أبريل 2026</p>
          </div>
        </section>
        <section className="container-shell py-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
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
