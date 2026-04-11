# Yacht Booking Platform — Full Database Schema (توثيق للمرجع)

> ⚠️ هذا الملف **مرجع توثيقي فقط** وليس schema فعلياً.  
> الـ schema الفعلي المستخدم هو `prisma/schema.prisma` (SQLite).  
> هذا الملف يتضمن تصميم PostgreSQL المتكامل للمرحلة المستقبلية.

---

## النماذج الأساسية

### User (المستخدمون)

```prisma
enum UserRole { ADMIN, OPERATOR, CUSTOMER }
enum AccountStatus { ACTIVE, SUSPENDED, PENDING_VERIFICATION, DEACTIVATED }

model User {
  id                String         @id @default(cuid())
  email             String         @unique
  phone             String         @unique
  name              String
  password          String?
  avatar            String?
  role              UserRole       @default(CUSTOMER)
  accountStatus     AccountStatus  @default(PENDING_VERIFICATION)
  emailVerified     DateTime?
  phoneVerified     DateTime?
  nationalId        String?
  commercialLicense String?
  bankAccount       String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  stores            Store[]
  bookings          Booking[]
  reviews           Review[]
  notifications     Notification[]
  wallet            Wallet?
}
```

### Store (المتاجر)

```prisma
enum StoreStatus { ACTIVE, INACTIVE, UNDER_REVIEW, SUSPENDED }

model Store {
  id             String      @id @default(cuid())
  slug           String      @unique
  name           String
  nameAr         String?
  description    String?
  phone          String
  email          String?
  whatsapp       String?
  city           String
  marina         String?
  status         StoreStatus @default(UNDER_REVIEW)
  isVerified     Boolean     @default(false)
  commissionRate Float       @default(15.0)
  totalBookings  Int         @default(0)
  totalRevenue   Float       @default(0)
  averageRating  Float?
  owner          User        @relation(fields: [ownerId], references: [id])
  ownerId        String
  yachts         Yacht[]
  bookings       Booking[]
}
```

### Yacht (اليخوت)

```prisma
enum YachtType { SPEEDBOAT, SAILING_YACHT, MOTOR_YACHT, CATAMARAN, LUXURY_YACHT, PARTY_BOAT, FISHING_BOAT }
enum YachtStatus { AVAILABLE, UNAVAILABLE, MAINTENANCE, UNDER_REVIEW }

model Yacht {
  id             String      @id @default(cuid())
  slug           String      @unique
  name           String
  type           YachtType
  status         YachtStatus @default(UNDER_REVIEW)
  length         Float?
  capacity       Int
  cabins         Int?
  basePrice      Float
  minimumHours   Int         @default(2)
  hasAC          Boolean     @default(false)
  hasKitchen     Boolean     @default(false)
  hasWifi        Boolean     @default(false)
  hasJetSki      Boolean     @default(false)
  hasWaterSports Boolean     @default(false)
  isFeatured     Boolean     @default(false)
  store          Store       @relation(fields: [storeId], references: [id])
  storeId        String
  images         YachtImage[]
  availability   Availability[]
  pricingRules   PricingRule[]
  bookings       Booking[]
  reviews        Review[]
  addons         Addon[]
}
```

### Booking (الحجوزات)

```prisma
enum BookingStatus { PENDING, CONFIRMED, PAID, IN_PROGRESS, COMPLETED, CANCELLED, REFUNDED }
enum PaymentStatus  { PENDING, PAID, PARTIALLY_PAID, REFUNDED, FAILED }

model Booking {
  id             String        @id @default(cuid())
  bookingNumber  String        @unique
  date           DateTime
  startTime      String
  duration       Int
  numberOfGuests Int
  basePrice      Float
  addonsCost     Float         @default(0)
  subtotal       Float
  platformFee    Float
  tax            Float         @default(0)
  discount       Float         @default(0)
  total          Float
  status         BookingStatus @default(PENDING)
  paymentStatus  PaymentStatus @default(PENDING)
  customerName   String
  customerPhone  String
  customerEmail  String?
  customerNotes  String?
  operatorNotes  String?
  customer       User?         @relation(fields: [customerId], references: [id])
  customerId     String?
  yacht          Yacht         @relation(fields: [yachtId], references: [id])
  yachtId        String
  store          Store         @relation(fields: [storeId], references: [id])
  storeId        String
  addons         BookingAddon[]
  payments       Payment[]
  review         Review?
}
```

### Payment (المدفوعات)

```prisma
enum PaymentMethod   { MADA, VISA, MASTERCARD, APPLE_PAY, STC_PAY, CASH }
enum PaymentProvider { MOYASAR, TAP, HYPERPAY, MANUAL }

model Payment {
  id            String          @id @default(cuid())
  transactionId String?         @unique
  amount        Float
  currency      String          @default("SAR")
  method        PaymentMethod
  provider      PaymentProvider
  status        PaymentStatus
  metadata      String?
  paidAt        DateTime?
  booking       Booking         @relation(fields: [bookingId], references: [id])
  bookingId     String
}
```

### Review (التقييمات)

```prisma
model Review {
  id          String   @id @default(cuid())
  rating      Int
  comment     String?
  response    String?
  respondedAt DateTime?
  isPublished Boolean  @default(true)
  booking     Booking  @relation(fields: [bookingId], references: [id])
  bookingId   String   @unique
  yacht       Yacht    @relation(fields: [yachtId], references: [id])
  yachtId     String
  customer    User     @relation(fields: [customerId], references: [id])
  customerId  String
}
```

### Wallet & Transactions (المحفظة)

```prisma
enum TransactionType { COMMISSION, WITHDRAWAL, REFUND, ADJUSTMENT }

model Wallet {
  id             String         @id @default(cuid())
  balance        Float          @default(0)
  pendingBalance Float          @default(0)
  totalEarnings  Float          @default(0)
  totalWithdrawn Float          @default(0)
  user           User           @relation(fields: [userId], references: [id])
  userId         String         @unique
  transactions   Transaction[]
}
```

### Notifications (الإشعارات)

```prisma
enum NotificationType {
  BOOKING_RECEIVED, BOOKING_CONFIRMED, BOOKING_CANCELLED,
  PAYMENT_RECEIVED, REVIEW_RECEIVED, SYSTEM
}

model Notification {
  id       String           @id @default(cuid())
  type     NotificationType
  title    String
  message  String
  isRead   Boolean          @default(false)
  metadata String?
  user     User             @relation(fields: [userId], references: [id])
  userId   String
}
```

