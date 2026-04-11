import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────────────────────

export type AppYacht = {
  id: string; slug: string; name: string; type: string; typeLabel: string;
  description: string; location: string; city: string; status: string;
  capacity: number; crewCount: number; pricePerHour: number; minimumHours: number;
  length?: number | null; cabins?: number | null; bathrooms?: number | null;
  buildYear?: number | null; manufacturer?: string | null;
  departurePoint?: string | null; cancellationPolicy?: string | null;
  rating: string; reviews: number; price: string;
  image: string; images: string[];
  isFeatured: boolean;
  hasAC: boolean; hasWifi: boolean; hasKitchen: boolean;
  hasWaterSports: boolean; hasJetSki: boolean; hasFishing: boolean;
  hasDiving: boolean; hasMusic: boolean; hasSunDeck: boolean; hasTV: boolean;
  store: {
    id: string; name: string; slug: string; city: string;
    commissionRate: number; status: string; marina?: string | null;
    phone?: string | null; whatsapp?: string | null;
  };
};

export type AppStore = {
  id: string; slug: string; name: string; description?: string | null;
  logo?: string | null; coverImage?: string | null;
  city: string; marina?: string | null; address?: string | null;
  phone?: string | null; whatsapp?: string | null; email?: string | null;
  policies?: string | null; cancellationTerms?: string | null;
  operatingHours?: string | null;
  status: string; commissionRate: number;
  totalRevenue: number; totalPayout: number; totalCommission: number;
  averageRating?: number | null;
  owner: string; ownerId: string; ownerEmail?: string | null;
  yachtCount: number; bookingCount: number;
};

export type AppBooking = {
  id: string; bookingNumber: string;
  date: string; startTime: string; duration: number; numberOfGuests: number;
  baseAmount: number; addonAmount: number; subtotal: number;
  platformCommission: number; ownerPayout: number; vatAmount: number; total: number;
  status: string; paymentStatus: string; paymentMethod?: string | null;
  customerName: string; customerPhone: string;
  customerEmail?: string | null; notes?: string | null; operatorNotes?: string | null;
  paidAt?: Date | null; confirmedAt?: Date | null; completedAt?: Date | null;
  createdAt: Date;
  yacht: { id: string; name: string; slug: string };
  store: { id: string; name: string; slug: string; commissionRate: number };
  userId?: string | null;
};

export type AppUser = {
  id: string; name: string; email?: string | null; phone: string;
  role: string; status: string; emailVerified: boolean; createdAt: Date;
  storeName?: string | null;
};

// ─── Mappers ───────────────────────────────────────────────────────────────

function mapYacht(y: any, images?: any[]): AppYacht {
  const imgs = images ?? y.images ?? [];
  const primaryImg = imgs.find((i: any) => i.isPrimary)?.url ?? imgs[0]?.url ?? "";
  const allImgs = imgs.sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((i: any) => i.url);

  return {
    id: y.id, slug: y.slug, name: y.name, type: y.type, typeLabel: y.typeLabel,
    description: y.description, location: y.location, city: y.city, status: y.status,
    capacity: y.capacity, crewCount: y.crewCount, pricePerHour: y.pricePerHour, minimumHours: y.minimumHours,
    length: y.length, cabins: y.cabins, bathrooms: y.bathrooms,
    buildYear: y.buildYear, manufacturer: y.manufacturer,
    departurePoint: y.departurePoint, cancellationPolicy: y.cancellationPolicy,
    rating: Number(y.rating).toFixed(1), reviews: y.reviews,
    price: `يبدأ من ${y.pricePerHour.toLocaleString("ar-SA")} ريال/ساعة`,
    image: primaryImg, images: allImgs.length ? allImgs : [primaryImg],
    isFeatured: y.isFeatured,
    hasAC: y.hasAC, hasWifi: y.hasWifi, hasKitchen: y.hasKitchen,
    hasWaterSports: y.hasWaterSports, hasJetSki: y.hasJetSki,
    hasFishing: y.hasFishing, hasDiving: y.hasDiving, hasMusic: y.hasMusic,
    hasSunDeck: y.hasSunDeck, hasTV: y.hasTV,
    store: {
      id: y.store.id, name: y.store.name, slug: y.store.slug, city: y.store.city,
      commissionRate: y.store.commissionRate, status: y.store.status,
      marina: y.store.marina, phone: y.store.phone, whatsapp: y.store.whatsapp,
    },
  };
}

function mapStore(s: any): AppStore {
  return {
    id: s.id, slug: s.slug, name: s.name, description: s.description,
    logo: s.logo, coverImage: s.coverImage, city: s.city, marina: s.marina,
    address: s.address, phone: s.phone, whatsapp: s.whatsapp, email: s.email,
    policies: s.policies, cancellationTerms: s.cancellationTerms, operatingHours: s.operatingHours,
    status: s.status, commissionRate: s.commissionRate,
    totalRevenue: s.totalRevenue, totalPayout: s.totalPayout, totalCommission: s.totalCommission,
    averageRating: s.averageRating,
    owner: s.owner?.name ?? "—", ownerId: s.ownerId, ownerEmail: s.owner?.email,
    yachtCount: s._count?.yachts ?? 0,
    bookingCount: s._count?.bookings ?? 0,
  };
}

function mapBooking(b: any): AppBooking {
  return {
    id: b.id, bookingNumber: b.bookingNumber,
    date: b.date, startTime: b.startTime, duration: b.duration, numberOfGuests: b.numberOfGuests,
    baseAmount: b.baseAmount, addonAmount: b.addonAmount ?? 0, subtotal: b.subtotal,
    platformCommission: b.platformCommission, ownerPayout: b.ownerPayout,
    vatAmount: b.vatAmount ?? 0, total: b.total,
    status: b.status, paymentStatus: b.paymentStatus, paymentMethod: b.paymentMethod,
    customerName: b.customerName, customerPhone: b.customerPhone,
    customerEmail: b.customerEmail, notes: b.notes, operatorNotes: b.operatorNotes,
    paidAt: b.paidAt, confirmedAt: b.confirmedAt, completedAt: b.completedAt, createdAt: b.createdAt,
    yacht: b.yacht, store: b.store, userId: b.userId,
  };
}

// ─── Include helpers ───────────────────────────────────────────────────────

const yachtInclude = {
  store: true,
  images: { orderBy: { sortOrder: "asc" as const } },
};

const bookingInclude = {
  yacht: { select: { id: true, name: true, slug: true } },
  store: { select: { id: true, name: true, slug: true, commissionRate: true } },
};

const storeInclude = {
  owner: { select: { id: true, name: true, email: true } },
  _count: { select: { yachts: true, bookings: true } },
};

// ─── Yacht Queries ─────────────────────────────────────────────────────────

export async function getFeaturedYachts() {
  const rows = await db.yacht.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    include: yachtInclude,
    orderBy: { rating: "desc" },
  });
  return rows.map((y) => mapYacht(y, y.images));
}

export async function getAllYachts(f?: {
  city?: string; type?: string; search?: string;
  minPrice?: number; maxPrice?: number; minCapacity?: number; storeSlug?: string;
}) {
  let storeId: string | undefined;
  if (f?.storeSlug) {
    const s = await db.store.findUnique({ where: { slug: f.storeSlug } });
    storeId = s?.id;
  }

  const where: any = {};
  if (storeId) where.storeId = storeId;

  const rows = await db.yacht.findMany({
    where,
    include: yachtInclude,
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
  });

  return rows
    .map((y) => mapYacht(y, y.images))
    .filter((y) => {
      if (f?.city && y.city !== f.city && !y.location.includes(f.city)) return false;
      if (f?.type && y.type !== f.type) return false;
      if (f?.search) {
        const q = f.search.toLowerCase();
        if (!y.name.toLowerCase().includes(q) && !y.location.toLowerCase().includes(q) && !y.description.toLowerCase().includes(q)) return false;
      }
      if (f?.minPrice && y.pricePerHour < f.minPrice) return false;
      if (f?.maxPrice && y.pricePerHour > f.maxPrice) return false;
      if (f?.minCapacity && y.capacity < f.minCapacity) return false;
      return true;
    });
}

export async function getYachtBySlug(slug: string) {
  const y = await db.yacht.findUnique({ where: { slug }, include: yachtInclude });
  return y ? mapYacht(y, y.images) : null;
}

export async function getYachtById(id: string) {
  const y = await db.yacht.findUnique({ where: { id }, include: yachtInclude });
  return y ? mapYacht(y, y.images) : null;
}

export async function getOwnerYachts(ownerId: string) {
  const store = await db.store.findUnique({ where: { ownerId } });
  if (!store) return [];
  const rows = await db.yacht.findMany({
    where: { storeId: store.id },
    include: yachtInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((y) => mapYacht(y, y.images));
}

export async function getYachtReviews(yachtId: string) {
  return db.review.findMany({
    where: { yachtId, isPublished: true },
    include: { customer: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Store Queries ─────────────────────────────────────────────────────────

export async function getStores(f?: { city?: string; status?: string }) {
  const where: any = {};
  if (f?.city) where.city = f.city;
  if (f?.status) where.status = f.status;
  const rows = await db.store.findMany({ where, include: storeInclude, orderBy: { averageRating: "desc" } });
  return rows.map(mapStore);
}

export async function getStoreBySlug(slug: string) {
  const s = await db.store.findUnique({ where: { slug }, include: storeInclude });
  return s ? mapStore(s) : null;
}

export async function getOwnerStore(ownerId: string) {
  const s = await db.store.findUnique({ where: { ownerId }, include: storeInclude });
  return s ? mapStore(s) : null;
}

export async function getStoreOptions() {
  return db.store.findMany({ select: { id: true, name: true, slug: true, city: true }, orderBy: { name: "asc" } });
}

export async function getAdminStores() {
  const rows = await db.store.findMany({ include: storeInclude, orderBy: { createdAt: "desc" } });
  return rows.map(mapStore);
}

// ─── Booking Queries ───────────────────────────────────────────────────────

export async function getAllBookings(f?: { status?: string; storeId?: string; userId?: string }) {
  const where: any = {};
  if (f?.status) where.status = f.status;
  if (f?.storeId) where.storeId = f.storeId;
  if (f?.userId) where.userId = f.userId;
  const rows = await db.booking.findMany({ where, include: bookingInclude, orderBy: { createdAt: "desc" } });
  return rows.map(mapBooking);
}

export async function getOwnerBookings(ownerId: string, status?: string) {
  const store = await db.store.findUnique({ where: { ownerId } });
  if (!store) return [];
  const where: any = { storeId: store.id };
  if (status) where.status = status;
  const rows = await db.booking.findMany({ where, include: bookingInclude, orderBy: { createdAt: "desc" } });
  return rows.map(mapBooking);
}

export async function getCustomerBookings(userId: string) {
  const rows = await db.booking.findMany({
    where: { userId },
    include: bookingInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapBooking);
}

export async function getBookingById(id: string) {
  const b = await db.booking.findUnique({ where: { id }, include: bookingInclude });
  return b ? mapBooking(b) : null;
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [users, stores, yachts, bookings, payouts] = await Promise.all([
    db.user.findMany(),
    db.store.findMany(),
    db.yacht.findMany(),
    db.booking.findMany(),
    db.payout.findMany(),
  ]);

  const paid = bookings.filter((b) => b.paymentStatus === "PAID");
  return {
    totalUsers: users.length,
    customerCount: users.filter((u) => u.role === "CUSTOMER").length,
    operatorCount: users.filter((u) => u.role === "OPERATOR").length,
    totalStores: stores.length,
    activeStores: stores.filter((s) => s.status === "ACTIVE").length,
    pendingStores: stores.filter((s) => s.status === "PENDING").length,
    totalYachts: yachts.length,
    activeYachts: yachts.filter((y) => y.status === "ACTIVE").length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
    confirmedBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    totalRevenue: paid.reduce((s, b) => s + b.total, 0),
    totalCommissions: paid.reduce((s, b) => s + b.platformCommission, 0),
    totalPayouts: paid.reduce((s, b) => s + b.ownerPayout, 0),
    pendingPayouts: payouts.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0),
  };
}

export async function getOwnerStats(ownerId: string) {
  const store = await db.store.findUnique({ where: { ownerId } });
  if (!store) return null;

  const [yachts, bookings] = await Promise.all([
    db.yacht.findMany({ where: { storeId: store.id } }),
    db.booking.findMany({ where: { storeId: store.id } }),
  ]);

  const paid = bookings.filter((b) => b.paymentStatus === "PAID");
  return {
    storeName: store.name,
    storeStatus: store.status,
    commissionRate: store.commissionRate,
    totalYachts: yachts.length,
    activeYachts: yachts.filter((y) => y.status === "ACTIVE").length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
    confirmedBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    totalRevenue: paid.reduce((s, b) => s + b.total, 0),
    totalCommissions: paid.reduce((s, b) => s + b.platformCommission, 0),
    totalPayouts: paid.reduce((s, b) => s + b.ownerPayout, 0),
  };
}

export async function getCustomerStats(userId: string) {
  const bookings = await db.booking.findMany({ where: { userId } });
  return {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelledBookings: bookings.filter((b) => b.status === "CANCELLED").length,
    totalSpent: bookings.filter((b) => b.paymentStatus === "PAID").reduce((s, b) => s + b.total, 0),
  };
}

// ─── Users ─────────────────────────────────────────────────────────────────

export async function getAllUsers(f?: { role?: string; status?: string }) {
  const where: any = {};
  if (f?.role) where.role = f.role;
  if (f?.status) where.status = f.status;
  const users = await db.user.findMany({
    where,
    include: { store: { select: { id: true, name: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
  return users.map((u) => ({
    id: u.id, name: u.name, email: u.email, phone: u.phone,
    role: u.role, status: u.status, emailVerified: u.emailVerified, createdAt: u.createdAt,
    storeName: u.store?.name,
  }));
}

// ─── Settings ──────────────────────────────────────────────────────────────

export async function getSettings() {
  const rows = await db.setting.findMany({ orderBy: { key: "asc" } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

// ─── Notifications ─────────────────────────────────────────────────────────

export async function getUserNotifications(userId: string) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({ where: { userId, isRead: false } });
}
