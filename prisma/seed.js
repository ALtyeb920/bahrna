const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function hash(pw) {
  return bcrypt.hash(pw, SALT_ROUNDS);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean all tables
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.yachtImage.deleteMany();
  await prisma.yacht.deleteMany();
  await prisma.store.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // ── Settings ───────────────────────────────────────────────────────────────
  await prisma.setting.createMany({
    data: [
      { key: "platform_name", value: "بحرنا", description: "اسم المنصة" },
      { key: "default_commission_rate", value: "12", description: "نسبة العمولة الافتراضية %" },
      { key: "vat_rate", value: "15", description: "نسبة ضريبة القيمة المضافة %" },
      { key: "min_booking_hours", value: "2", description: "الحد الأدنى لساعات الحجز" },
      { key: "support_email", value: "support@bahrna.sa", description: "بريد الدعم" },
      { key: "support_phone", value: "+966-11-000-0000", description: "هاتف الدعم" },
    ],
  });

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminPw = await hash("Admin@2026!");
  const op1Pw   = await hash("Owner@2026!");
  const op2Pw   = await hash("Owner2@2026!");
  const op3Pw   = await hash("Owner3@2026!");
  const custPw  = await hash("Customer@2026!");

  const admin = await prisma.user.create({
    data: {
      email: "admin@bahrna.sa",
      phone: "admin",
      passwordHash: adminPw,
      name: "مدير المنصة",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  const op1 = await prisma.user.create({
    data: {
      email: "mohammed@bahrna.sa",
      phone: "operator",
      passwordHash: op1Pw,
      name: "محمد الأحمد",
      role: "OPERATOR",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  const op2 = await prisma.user.create({
    data: {
      email: "abdulrahman@bahrna.sa",
      phone: "op2",
      passwordHash: op2Pw,
      name: "عبدالرحمن السيف",
      role: "OPERATOR",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  const op3 = await prisma.user.create({
    data: {
      email: "tariq@bahrna.sa",
      phone: "op3",
      passwordHash: op3Pw,
      name: "طارق الزهراني",
      role: "OPERATOR",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "ahmed@example.sa",
      phone: "+966501234567",
      passwordHash: custPw,
      name: "أحمد العمري",
      role: "CUSTOMER",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  // ── Stores ─────────────────────────────────────────────────────────────────
  const store1 = await prisma.store.create({
    data: {
      slug: "red-sea-yachts",
      name: "يخوت البحر الأحمر",
      description: "أفخم يخوت البحر الأحمر في جدة — رحلات راقية للعائلات والمناسبات الخاصة منذ 2015. نوفر تجربة بحرية لا تُنسى مع طاقم متمرس وأسطول متميز.",
      logo: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1600&q=80",
      city: "جدة",
      marina: "مارينا أبحر الشمالية",
      address: "شارع أبحر، شمال جدة",
      phone: "+966501234567",
      whatsapp: "+966501234567",
      email: "info@red-sea-yachts.sa",
      policies: "يُرجى الالتزام بمواعيد الرحلة. الحد الأقصى للسعة يجب أن يُراعى. لا يُسمح بالكحول أو المخدرات على متن اليخوت.",
      cancellationTerms: "إلغاء مجاني قبل 48 ساعة. خصم 50% للإلغاء بين 24-48 ساعة. لا استرداد للإلغاء خلال 24 ساعة.",
      operatingHours: "السبت - الخميس: 7:00 صباحاً - 10:00 مساءً",
      status: "ACTIVE",
      commissionRate: 12,
      totalRevenue: 387600,
      totalPayout: 341088,
      totalCommission: 46512,
      averageRating: 4.8,
      ownerId: op1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      slug: "nukhba-bahar",
      name: "نخبة البحار",
      description: "تجربة بحرية استثنائية مع أسطول يخوت الفئة الأولى في مياه جدة. نتخصص في الرحلات الخاصة والمناسبات المميزة مع خدمات ضيافة راقية.",
      logo: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1600&q=80",
      city: "جدة",
      marina: "مارينا أبحر الجنوبية",
      address: "أبحر الجنوبية، شمال جدة",
      phone: "+966509876543",
      whatsapp: "+966509876543",
      email: "info@nukhba-bahar.sa",
      policies: "الحجز المسبق إلزامي. يجب تقديم هوية سارية عند الركوب.",
      cancellationTerms: "إلغاء مجاني قبل 72 ساعة. لا استرداد بعد ذلك.",
      status: "ACTIVE",
      commissionRate: 10,
      totalRevenue: 312400,
      totalPayout: 281160,
      totalCommission: 31240,
      averageRating: 4.9,
      ownerId: op2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      slug: "royal-marina-yanbu",
      name: "رويال مارينا ينبع",
      description: "خبرة 10 سنوات في خدمات اليخوت الفاخرة في ميناء ينبع السياحي الساحر. وجهتك المثالية لاستكشاف الجزر والشعاب المرجانية في البحر الأحمر.",
      coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80",
      city: "ينبع",
      marina: "مارينا ينبع السياحية",
      phone: "+966505555555",
      whatsapp: "+966505555555",
      email: "info@royal-marina-yanbu.sa",
      status: "ACTIVE",
      commissionRate: 12,
      totalRevenue: 218900,
      totalPayout: 192632,
      totalCommission: 26268,
      averageRating: 4.7,
      ownerId: op3.id,
    },
  });

  // ── Yachts ─────────────────────────────────────────────────────────────────
  const y1 = await prisma.yacht.create({
    data: {
      slug: "loulou-bahr-ahmar",
      name: "لؤلؤة البحر الأحمر",
      type: "LUXURY_YACHT",
      typeLabel: "يخت فاخر",
      description: "يخت فاخر من الدرجة الأولى بطول 18 متراً، مجهز بأحدث التقنيات البحرية وأرقى وسائل الراحة. يتسع لـ 12 شخصاً مع 3 كبائن مريحة وحمامات خاصة لكل كابينة. مثالي للرحلات العائلية والمناسبات الخاصة في البحر الأحمر الساحر.",
      location: "مارينا أبحر الشمالية، جدة",
      city: "جدة",
      status: "ACTIVE",
      capacity: 12,
      crewCount: 3,
      pricePerHour: 2500,
      minimumHours: 3,
      length: 18,
      cabins: 3,
      bathrooms: 2,
      buildYear: 2019,
      manufacturer: "Benetti",
      departurePoint: "رصيف A-12، مارينا أبحر الشمالية",
      cancellationPolicy: "إلغاء مجاني قبل 48 ساعة من موعد الرحلة. خصم 50% للإلغاء قبل 24 ساعة.",
      rating: 4.9,
      reviews: 47,
      isFeatured: true,
      hasAC: true, hasWifi: true, hasKitchen: true, hasMusic: true, hasSunDeck: true,
      storeId: store1.id,
    },
  });

  await prisma.yachtImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80", isPrimary: true, sortOrder: 0, yachtId: y1.id },
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80", sortOrder: 1, yachtId: y1.id },
      { url: "https://images.unsplash.com/photo-1502292239602-b4bfbd46e8c8?auto=format&fit=crop&w=1200&q=80", sortOrder: 2, yachtId: y1.id },
      { url: "https://images.unsplash.com/photo-1548425087-bff95db55b4e?auto=format&fit=crop&w=1200&q=80", sortOrder: 3, yachtId: y1.id },
    ],
  });

  const y2 = await prisma.yacht.create({
    data: {
      slug: "amwaj-nukhba",
      name: "أمواج النخبة",
      type: "MOTOR_YACHT",
      typeLabel: "يخت بمحرك",
      description: "يخت محرك فاخر بسعة 18 شخصاً يتميز بتصميمه العصري الأنيق وأجهزة الترفيه المتكاملة. يضم 4 كبائن رئيسية ونظام صوت باور عالي الجودة. تجربة بحرية لا تُنسى على امتداد ساحل جدة الذهبي.",
      location: "مارينا أبحر الجنوبية، جدة",
      city: "جدة",
      status: "ACTIVE",
      capacity: 18,
      crewCount: 4,
      pricePerHour: 3400,
      minimumHours: 3,
      length: 22,
      cabins: 4,
      bathrooms: 3,
      buildYear: 2021,
      manufacturer: "Sunseeker",
      departurePoint: "رصيف B-7، مارينا أبحر الجنوبية",
      cancellationPolicy: "إلغاء مجاني قبل 72 ساعة. لا يوجد استرداد للإلغاء خلال 24 ساعة.",
      rating: 4.8,
      reviews: 33,
      isFeatured: true,
      hasAC: true, hasWifi: true, hasKitchen: true, hasWaterSports: true, hasMusic: true, hasSunDeck: true,
      storeId: store2.id,
    },
  });

  await prisma.yachtImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80", isPrimary: true, sortOrder: 0, yachtId: y2.id },
      { url: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1200&q=80", sortOrder: 1, yachtId: y2.id },
      { url: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80", sortOrder: 2, yachtId: y2.id },
    ],
  });

  const y3 = await prisma.yacht.create({
    data: {
      slug: "diamond-party-boat",
      name: "ماسة البحر",
      type: "PARTY_BOAT",
      typeLabel: "قارب حفلات",
      description: "قارب الحفلات الأفخم على الساحل الغربي بسعة 25 شخصاً. مجهز بمنصة رقص احترافية، نظام صوت طراز DJ، وإضاءة LED متطورة. وسائل راحة خمس نجوم لمناسبتك الأكثر تميزاً.",
      location: "مارينا أبحر الجنوبية، جدة",
      city: "جدة",
      status: "ACTIVE",
      capacity: 25,
      crewCount: 5,
      pricePerHour: 5000,
      minimumHours: 4,
      length: 30,
      cabins: 5,
      bathrooms: 4,
      buildYear: 2022,
      departurePoint: "رصيف C-3، أبحر الجنوبية",
      cancellationPolicy: "بسبب طبيعة الحجوزات الخاصة، الإلغاء المجاني قبل أسبوع فقط.",
      rating: 4.9,
      reviews: 52,
      isFeatured: true,
      hasAC: true, hasWifi: true, hasKitchen: true, hasWaterSports: true, hasMusic: true, hasSunDeck: true,
      storeId: store2.id,
    },
  });

  await prisma.yachtImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1200&q=80", isPrimary: true, sortOrder: 0, yachtId: y3.id },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", sortOrder: 1, yachtId: y3.id },
    ],
  });

  const y4 = await prisma.yacht.create({
    data: {
      slug: "marsa-royal-yanbu",
      name: "بحرنا رويال",
      type: "LUXURY_YACHT",
      typeLabel: "يخت فاخر",
      description: "التجربة الملكية الأصيلة في ينبع الذهبية — يخت فاخر بطول 28 متراً مجهز بكل وسائل الراحة والرفاهية. مثالي لاستكشاف الجزر البكر والشعاب المرجانية الساحرة في ينبع.",
      location: "مارينا ينبع السياحية",
      city: "ينبع",
      status: "ACTIVE",
      capacity: 20,
      crewCount: 4,
      pricePerHour: 4100,
      minimumHours: 3,
      length: 28,
      cabins: 5,
      bathrooms: 4,
      buildYear: 2020,
      manufacturer: "Princess",
      departurePoint: "بحرنا D، ميناء ينبع السياحي",
      cancellationPolicy: "إلغاء مجاني قبل 48 ساعة.",
      rating: 5.0,
      reviews: 28,
      isFeatured: true,
      hasAC: true, hasWifi: true, hasKitchen: true, hasJetSki: true, hasWaterSports: true, hasSunDeck: true,
      storeId: store3.id,
    },
  });

  await prisma.yachtImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", isPrimary: true, sortOrder: 0, yachtId: y4.id },
      { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", sortOrder: 1, yachtId: y4.id },
    ],
  });

  const y5 = await prisma.yacht.create({
    data: {
      slug: "red-arrow-speedboat",
      name: "السهم الأحمر",
      type: "SPEEDBOAT",
      typeLabel: "قارب سريع",
      description: "قارب سريع للمغامرين — تجربة إثارة وأدرينالين لا مثيل لها على أمواج البحر الأحمر. السرعة والمتعة في رحلة لا تُنسى.",
      location: "مارينا أبحر الشمالية، جدة",
      city: "جدة",
      status: "ACTIVE",
      capacity: 8,
      crewCount: 1,
      pricePerHour: 1200,
      minimumHours: 2,
      length: 10,
      buildYear: 2023,
      departurePoint: "رصيف A-1، مارينا أبحر",
      rating: 4.6,
      reviews: 19,
      hasWaterSports: true,
      storeId: store1.id,
    },
  });

  await prisma.yachtImage.create({
    data: { url: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80", isPrimary: true, sortOrder: 0, yachtId: y5.id },
  });

  // ── Bookings ────────────────────────────────────────────────────────────────
  function calcAmounts(price, hours, commRate) {
    const base = price * hours;
    const comm = Math.round(base * commRate / 100);
    const payout = base - comm;
    const vat = Math.round((base + comm) * 0.15);
    return { base, comm, payout, vat, total: base + vat };
  }

  const b1data = calcAmounts(y1.pricePerHour, 4, store1.commissionRate);
  const b1 = await prisma.booking.create({
    data: {
      bookingNumber: "YB-2026-001",
      date: "2026-04-10", startTime: "10:00", duration: 4, numberOfGuests: 8,
      baseAmount: b1data.base, addonAmount: 0, subtotal: b1data.base,
      platformCommission: b1data.comm, ownerPayout: b1data.payout,
      vatAmount: b1data.vat, total: b1data.total,
      status: "CONFIRMED", paymentStatus: "PAID", paymentMethod: "MADA",
      customerName: "أحمد محمد العمري", customerPhone: "+966501234567", customerEmail: "ahmed@example.sa",
      yachtId: y1.id, storeId: store1.id, userId: customer.id,
      paidAt: new Date("2026-04-08T10:00:00Z"), confirmedAt: new Date("2026-04-08T10:30:00Z"),
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: "TXN-2026-001",
      amount: b1data.total,
      method: "MADA",
      provider: "MOYASAR",
      status: "PAID",
      paidAt: new Date("2026-04-08T10:00:00Z"),
      bookingId: b1.id,
    },
  });

  await prisma.payout.create({
    data: {
      amount: b1data.payout,
      status: "PAID",
      paidAt: new Date("2026-04-15T00:00:00Z"),
      storeId: store1.id,
      bookingId: b1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "تجربة استثنائية! اليخت نظيف جداً والطاقم محترف ومبتسم. سنعود بالتأكيد لرحلة أخرى.",
      isPublished: true,
      yachtId: y1.id,
      bookingId: b1.id,
      customerId: customer.id,
    },
  });

  const b2data = calcAmounts(y2.pricePerHour, 3, store2.commissionRate);
  await prisma.booking.create({
    data: {
      bookingNumber: "YB-2026-002",
      date: "2026-04-12", startTime: "14:00", duration: 3, numberOfGuests: 15,
      baseAmount: b2data.base, subtotal: b2data.base,
      platformCommission: b2data.comm, ownerPayout: b2data.payout,
      vatAmount: b2data.vat, total: b2data.total,
      status: "PENDING", paymentStatus: "PENDING",
      customerName: "فيصل السلمي", customerPhone: "+966509876543", customerEmail: "faisal@example.sa",
      yachtId: y2.id, storeId: store2.id,
    },
  });

  const b3data = calcAmounts(y4.pricePerHour, 6, store3.commissionRate);
  const b3 = await prisma.booking.create({
    data: {
      bookingNumber: "YB-2026-003",
      date: "2026-04-08", startTime: "09:00", duration: 6, numberOfGuests: 18,
      baseAmount: b3data.base, subtotal: b3data.base,
      platformCommission: b3data.comm, ownerPayout: b3data.payout,
      vatAmount: b3data.vat, total: b3data.total,
      status: "COMPLETED", paymentStatus: "PAID", paymentMethod: "VISA",
      customerName: "خالد الشمري", customerPhone: "+966505555555", customerEmail: "khaled@example.sa",
      yachtId: y4.id, storeId: store3.id, userId: customer.id,
      paidAt: new Date("2026-04-06T00:00:00Z"), confirmedAt: new Date("2026-04-06T01:00:00Z"), completedAt: new Date("2026-04-08T20:00:00Z"),
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: "TXN-2026-003",
      amount: b3data.total,
      method: "VISA",
      status: "PAID",
      paidAt: new Date("2026-04-06T00:00:00Z"),
      bookingId: b3.id,
    },
  });

  const b4data = calcAmounts(y3.pricePerHour, 5, store2.commissionRate);
  await prisma.booking.create({
    data: {
      bookingNumber: "YB-2026-004",
      date: "2026-04-18", startTime: "16:00", duration: 5, numberOfGuests: 22,
      baseAmount: b4data.base, subtotal: b4data.base,
      platformCommission: b4data.comm, ownerPayout: b4data.payout,
      vatAmount: b4data.vat, total: b4data.total,
      status: "CONFIRMED", paymentStatus: "PAID", paymentMethod: "APPLE_PAY",
      customerName: "نورة العتيبي", customerPhone: "+966507777777",
      yachtId: y3.id, storeId: store2.id, userId: customer.id,
      paidAt: new Date("2026-04-15T00:00:00Z"), confirmedAt: new Date("2026-04-15T01:00:00Z"),
    },
  });

  const b5data = calcAmounts(y1.pricePerHour, 3, store1.commissionRate);
  await prisma.booking.create({
    data: {
      bookingNumber: "YB-2026-005",
      date: "2026-04-22", startTime: "11:00", duration: 3, numberOfGuests: 8,
      baseAmount: b5data.base, subtotal: b5data.base,
      platformCommission: b5data.comm, ownerPayout: b5data.payout,
      vatAmount: b5data.vat, total: b5data.total,
      status: "PENDING", paymentStatus: "PENDING",
      customerName: "أحمد محمد العمري", customerPhone: "+966501234567",
      yachtId: y1.id, storeId: store1.id, userId: customer.id,
    },
  });

  // ── Notifications ──────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        type: "BOOKING_NEW",
        title: "حجز جديد",
        message: `وصل حجز جديد لـ لؤلؤة البحر الأحمر - أحمد محمد العمري`,
        isRead: false,
        userId: op1.id,
      },
      {
        type: "BOOKING_CONFIRMED",
        title: "تم تأكيد حجزك",
        message: "تم تأكيد حجزك رقم YB-2026-001 بنجاح. نتمنى لك رحلة ممتعة!",
        isRead: false,
        userId: customer.id,
      },
      {
        type: "SYSTEM",
        title: "ترحيب بالمنصة",
        message: "مرحباً بك في منصة بحرنا! تفضل باستكشاف اليخوت المتاحة.",
        isRead: true,
        userId: customer.id,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`   Users: admin, operator (×3), customer`);
  console.log(`   Stores: 3 active`);
  console.log(`   Yachts: 5 (with images)`);
  console.log(`   Bookings: 5 with payments/payouts`);
  console.log(`\n🔑 Login credentials:`);
  console.log(`   Admin:    admin@bahrna.sa / Admin@2026!`);
  console.log(`   Operator: operator / Owner@2026!`);
  console.log(`   Customer: +966501234567 / Customer@2026!`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error("❌", e); prisma.$disconnect(); process.exit(1); });
