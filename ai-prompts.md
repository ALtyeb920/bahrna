# 🤖 Prompts جاهزة للتنفيذ مع Cursor / Lovable / Claude

## منصة حجز اليخوت - السوق السعودي

---

## 📋 كيفية استخدام هذا الملف

1. **مع Cursor**: انسخ كل prompt والصقه في Composer
2. **مع Lovable**: استخدم الـ prompts الخاصة بالواجهات
3. **مع Claude**: استخدم للمراجعة والتحليل

---

## 🚀 PROMPT #1: إعداد المشروع الأساسي

```
Create a new Next.js 14 project for a yacht booking platform (Saudi market) with the following setup:

PROJECT STRUCTURE:
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Prisma ORM
- NextAuth.js for authentication

INSTALL THESE PACKAGES:
```bash
npm install @prisma/client prisma
npm install @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install next-auth
npm install lucide-react
npm install date-fns
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
npm install recharts
npm install sonner
```

CREATE THIS FILE STRUCTURE:

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Homepage
│   │   ├── yachts/
│   │   │   ├── page.tsx            # Yachts listing
│   │   │   └── [slug]/page.tsx     # Yacht details
│   │   └── book/[slug]/page.tsx    # Booking page
│   ├── dashboard/
│   │   ├── operator/               # Operator dashboard
│   │   │   ├── page.tsx
│   │   │   ├── yachts/page.tsx
│   │   │   └── bookings/page.tsx
│   │   └── admin/                  # Admin dashboard
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── bookings/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn components
│   ├── yacht/
│   ├── booking/
│   └── dashboard/
├── lib/
│   ├── db.ts                       # Prisma client
│   ├── auth.ts                     # NextAuth config
│   ├── utils.ts
│   └── validations/
├── hooks/
├── types/
│   └── index.ts
└── store/                          # Zustand stores
    └── booking.ts
```

SETUP TAILWIND CONFIG with RTL support and custom colors:

- Primary: Deep blue (#0A2463)
- Secondary: Gold (#D4AF37)
- Accent: Teal (#00B4D8)

SETUP PRISMA:
Initialize Prisma with PostgreSQL and create the schema file (I'll provide the schema separately)

CREATE BASIC LAYOUT:

- Header with logo, navigation, and auth buttons
- Footer with links and contact info
- RTL support for Arabic
- Dark/Light mode toggle

```

---

## 🎨 PROMPT #2: تصميم الصفحة الرئيسية

```

Create a stunning homepage for a yacht booking platform (Saudi market, Arabic language) with these sections:

HERO SECTION:

- Full-width background: luxury yacht image with overlay
- Centered heading (Arabic): "احجز يختك المثالي في جدة"
- Subtitle: "تجربة فاخرة على البحر الأحمر"
- Search bar with 4 fields:
  - المدينة (City dropdown: جدة، ينبع، الدمام)
  - التاريخ (Date picker)
  - عدد الأشخاص (Guest count)
  - ابحث (Search button)

FEATURED YACHTS SECTION:

- Title: "اليخوت المميزة"
- Grid of 6 yacht cards (3 cols on desktop, 1 on mobile)
- Each card shows:
  - High-quality yacht image
  - Yacht name (Arabic)
  - Rating (stars)
  - Capacity
  - Price per hour (starts from XXX ريال)
  - Location
  - "احجز الآن" button

HOW IT WORKS SECTION:

- Title: "كيف يعمل؟"
- 4 steps with icons:
  1. اختر اليخت المناسب
  2. حدد التاريخ والوقت
  3. ادفع بأمان
  4. استمتع برحلتك

WHY CHOOSE US:

- 4 feature cards:
  - حجز فوري
  - دفع آمن
  - أفضل الأسعار
  - دعم 24/7

CALL TO ACTION:

- "هل تمتلك يخت؟ انضم إلينا"
- Button: "سجل متجرك الآن"

DESIGN REQUIREMENTS:

- RTL layout
- Smooth animations
- Mobile-first responsive
- Gradient overlays
- Modern, clean, luxury feel
- Arabic typography (use 'Tajawal' or 'Cairo' font)

COMPONENTS TO CREATE:

- HeroSection.tsx
- SearchBar.tsx
- YachtCard.tsx
- HowItWorks.tsx
- WhyChooseUs.tsx
- CTASection.tsx

```

---

## 📊 PROMPT #3: قاعدة البيانات Prisma Schema

```

Create a complete Prisma schema for a yacht booking SaaS platform with these models:

MODELS NEEDED:

1. User (customers, operators, admins)
2. Store (each operator has a store)
3. Yacht (belongs to store)
4. YachtImage (multiple images per yacht)
5. Availability (yacht availability schedule)
6. PricingRule (weekend, seasonal pricing)
7. Addon (additional services)
8. Booking (main booking record)
9. BookingAddon (many-to-many with quantity)
10. Payment (payment transactions)
11. Review (customer reviews)
12. Wallet (operator earnings)
13. Transaction (wallet transactions)
14. Notification
15. Settings (platform settings)

ENUMS:

- UserRole: ADMIN, OPERATOR, CUSTOMER
- AccountStatus: ACTIVE, SUSPENDED, PENDING_VERIFICATION
- StoreStatus: ACTIVE, INACTIVE, UNDER_REVIEW, SUSPENDED
- YachtType: SPEEDBOAT, SAILING_YACHT, MOTOR_YACHT, CATAMARAN, LUXURY_YACHT, PARTY_BOAT, FISHING_BOAT
- YachtStatus: AVAILABLE, UNAVAILABLE, MAINTENANCE, UNDER_REVIEW
- BookingStatus: PENDING, CONFIRMED, PAID, IN_PROGRESS, COMPLETED, CANCELLED, REFUNDED
- PaymentStatus: PENDING, PAID, PARTIALLY_PAID, REFUNDED, FAILED
- PaymentMethod: MADA, VISA, MASTERCARD, APPLE_PAY, STC_PAY, CASH
- PaymentProvider: MOYASAR, TAP, HYPERPAY, MANUAL

REQUIREMENTS:

- All string fields that need Arabic should have both field and fieldAr
- Use cuid() for IDs
- Proper indexes on frequently queried fields
- Cascade deletes where appropriate
- Track created/updated timestamps
- Store commission rate per store (platform fee)
- Support for blocked dates and recurring availability
- Multiple pricing rules per yacht
- Booking number generation

FILE: prisma/schema.prisma

```

---

## 🔐 PROMPT #4: نظام المصادقة Authentication

```

Set up NextAuth.js authentication for a yacht booking platform with these requirements:

PROVIDERS:

- Credentials (phone/email + password)
- Future: Google OAuth, Apple

USER ROLES:

- CUSTOMER (default)
- OPERATOR (can create stores and yachts)
- ADMIN (full access)

FEATURES NEEDED:

1. Login/Register pages
2. Phone verification (SMS OTP)
3. Email verification
4. Password reset
5. Role-based access control
6. Protected routes middleware

CREATE THESE FILES:

1. lib/auth.ts

```typescript
// NextAuth configuration
// Include JWT callback with role
// Include session callback with user data
```

1. app/api/auth/[...nextauth]/route.ts

```typescript
// NextAuth handler
```

1. middleware.ts

```typescript
// Protect dashboard routes
// Redirect based on role
// Public routes: /, /yachts, /yachts/[slug]
// Operator routes: /dashboard/operator/*
// Admin routes: /dashboard/admin/*
```

1. components/auth/LoginForm.tsx

```typescript
// Login form with react-hook-form + zod
// Phone/email field
// Password field
// Remember me checkbox
// Forgot password link
// Register link
```

1. components/auth/RegisterForm.tsx

```typescript
// Register form
// Name, phone, email, password
// Role selection (CUSTOMER by default, show OPERATOR option)
// Terms acceptance
```

1. app/(auth)/login/page.tsx
2. app/(auth)/register/page.tsx

VALIDATION SCHEMAS (using Zod):

- loginSchema
- registerSchema
- resetPasswordSchema

UTILITIES:

- hashPassword function
- verifyPassword function
- generateOTP function
- sendOTP function

```

---

## 🏠 PROMPT #5: صفحة استكشاف اليخوت

```

Create a comprehensive yacht listing/marketplace page with advanced filtering:

PAGE: app/yachts/page.tsx

LAYOUT:

- Sidebar (left, 25% width) for filters
- Main content (right, 75%) for yacht grid

FILTERS SIDEBAR:

1. City (checkboxes): جدة، ينبع، الدمام
2. Yacht Type (checkboxes):
  - قارب سريع
  - يخت شراعي
  - يخت بمحرك
  - كاتاماران
  - يخت فاخر
  - قارب حفلات
  - قارب صيد
3. Price Range (dual slider): 100 - 5000 ريال/ساعة
4. Capacity (number input): minimum guests
5. Features (checkboxes):
  - مكيف
  - مطبخ
  - WiFi
  - جت سكي
  - معدات صيد
  - رياضات مائية
6. Rating (stars): 4+ stars, 3+ stars, etc.
7. Sort by (dropdown):
  - الأحدث
  - الأعلى تقييماً
  - الأقل سعراً
  - الأعلى سعراً

YACHT GRID:

- Responsive: 3 cols desktop, 2 cols tablet, 1 col mobile
- Each card:
  - Image with hover zoom effect
  - Yacht type badge
  - Name (clickable to details)
  - Rating + review count
  - Location (city + marina)
  - Capacity
  - Starting price
  - "احجز الآن" button

HEADER:

- Results count: "وجدنا 24 يخت"
- View toggle: Grid/List
- Items per page: 12, 24, 48

PAGINATION:

- Show max 12 yachts per page
- Numbered pagination
- Previous/Next buttons

COMPONENTS TO CREATE:

- YachtFilters.tsx (sidebar)
- YachtGrid.tsx (main grid)
- YachtCard.tsx (individual card)
- Pagination.tsx

USE:

- Server components for data fetching
- Client components for interactive filters
- URL search params for filters (shareable URLs)
- Skeleton loading states

API ROUTE:

- app/api/yachts/route.ts
- Accept query params for filtering
- Return paginated results

```

---

## 🚤 PROMPT #6: صفحة تفاصيل اليخت

```

Create a detailed yacht page with booking integration:

PAGE: app/yachts/[slug]/page.tsx

SECTIONS:

1. IMAGE GALLERY (top)
  - Main large image
  - Thumbnail strip below
  - Lightbox on click
  - Show all images button
2. YACHT HEADER
  - Yacht name (h1)
  - Rating (stars) + review count
  - Location (city, marina)
  - Share button
  - Favorite button
3. TWO-COLUMN LAYOUT:

LEFT COLUMN (65%):

A. OVERVIEW

- Description (Arabic)
- Yacht type
- Quick specs: capacity, length, cabins

B. SPECIFICATIONS

- Table format:
  - الطول
  - السعة
  - عدد الكبائن
  - عدد الحمامات
  - سنة الصنع
  - الشركة المصنعة

C. FEATURES & AMENITIES

- Grid of feature icons:
✓ مكيف
✓ مطبخ
✓ WiFi
✓ جت سكي
✓ معدات صيد
✓ رياضات مائية

D. PRICING

- Base price per hour
- Minimum hours
- Weekend pricing (if applicable)
- Seasonal pricing (if applicable)

E. POLICIES

- Cancellation policy
- Terms and conditions

F. REVIEWS

- Overall rating breakdown
- Individual reviews with pagination
- "كتابة تقييم" button (if booked before)

G. MAP

- Departure point location
- Marina location

RIGHT COLUMN (35%, sticky):

BOOKING CARD:

- Price display: "من XXX ريال/ساعة"
- Date picker (calendar)
- Time picker (dropdown)
- Duration selector (2, 4, 6, 8 hours)
- Guest count
- Additional services (checkboxes):
  - الطعام والمشروبات
  - التزيين
  - التصوير
  - DJ وموسيقى
- Price breakdown:
  - السعر الأساسي
  - الخدمات الإضافية
  - العمولة
  - الضريبة
  - المجموع
- "احجز الآن" button
- "اتصل بالمشغل" button (WhatsApp)

SIMILAR YACHTS:

- Horizontal scroll
- 4-6 similar yachts

COMPONENTS:

- ImageGallery.tsx
- SpecsTable.tsx
- FeaturesList.tsx
- PricingDetails.tsx
- BookingCard.tsx
- ReviewsList.tsx
- MapView.tsx

STATE MANAGEMENT:

- Zustand store for booking data
- Track: date, time, duration, guests, addons

```

---

## 📅 PROMPT #7: نظام الحجز Booking System

```

Create a complete booking system with availability check and payment integration:

FLOW:

1. User selects date, time, duration on yacht details page
2. System checks availability in real-time
3. User adds guest info and special requests
4. User reviews booking summary
5. User proceeds to payment
6. System processes payment via Moyasar
7. Booking confirmed, emails sent

FILES TO CREATE:

1. components/booking/DateTimePicker.tsx

```typescript
// Calendar with disabled dates (already booked)
// Time slots based on yacht availability
// Duration selector
// Real-time availability check
```

1. components/booking/GuestForm.tsx

```typescript
// Guest information form
// Name, phone, email
// Number of guests
// Special requests (textarea)
```

1. components/booking/BookingSummary.tsx

```typescript
// Review all booking details
// Yacht info
// Date, time, duration
// Guest count
// Addons
// Price breakdown
// Terms acceptance checkbox
```

1. lib/availability.ts

```typescript
export async function checkAvailability(
  yachtId: string,
  date: Date,
  startTime: string,
  duration: number
): Promise<boolean> {
  // 1. Check if yacht is active
  // 2. Check if date is blocked in Availability table
  // 3. Check for conflicting bookings
  // 4. Return true/false
}

export async function getAvailableSlots(
  yachtId: string,
  date: Date
): Promise<TimeSlot[]> {
  // Return array of available time slots for that day
}
```

1. lib/pricing.ts

```typescript
export async function calculatePrice(
  yachtId: string,
  date: Date,
  duration: number,
  addonIds: string[]
): Promise<PriceBreakdown> {
  // 1. Get yacht base price
  // 2. Apply pricing rules (weekend, season, etc.)
  // 3. Calculate addons cost
  // 4. Calculate platform fee (commission)
  // 5. Calculate tax (15% VAT)
  // 6. Return breakdown
}
```

1. app/api/bookings/create/route.ts

```typescript
// POST endpoint to create booking
// 1. Validate input
// 2. Check availability again
// 3. Calculate final price
// 4. Create booking in DB (status: PENDING)
// 5. Return booking ID for payment
```

1. app/api/bookings/[id]/confirm/route.ts

```typescript
// Called after successful payment
// 1. Update booking status to CONFIRMED/PAID
// 2. Send confirmation email to customer
// 3. Send notification to operator
// 4. Update yacht booking count
```

VALIDATION SCHEMAS:

```typescript
const bookingSchema = z.object({
  yachtId: z.string().cuid(),
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  duration: z.number().min(2).max(12),
  numberOfGuests: z.number().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^966[0-9]{9}$/),
  customerEmail: z.string().email().optional(),
  addons: z.array(z.object({
    id: z.string().cuid(),
    quantity: z.number().min(1)
  })).optional(),
  specialRequests: z.string().optional()
})
```

ERROR HANDLING:

- Availability conflict
- Payment failure
- Invalid data
- Network errors

SUCCESS STATES:

- Booking created
- Payment successful
- Confirmation sent

```

---

## 💳 PROMPT #8: ربط الدفع Moyasar Integration

```

Integrate Moyasar payment gateway for the yacht booking platform:

SETUP:

1. Install Moyasar package
2. Add environment variables:
  - MOYASAR_API_KEY
  - NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY

FILES TO CREATE:

1. lib/moyasar.ts

```typescript
import Moyasar from '@moyasar/moyasar'

export const moyasar = new Moyasar({
  apiKey: process.env.MOYASAR_API_KEY!
})

export async function createPayment(booking: {
  id: string
  total: number
  bookingNumber: string
}) {
  const payment = await moyasar.payment.create({
    amount: Math.round(booking.total * 100), // Convert to halalas
    currency: 'SAR',
    description: `حجز يخت #${booking.bookingNumber}`,
    callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/callback`,
    source: {
      type: 'creditcard' // or 'applepay'
    },
    metadata: {
      booking_id: booking.id
    }
  })

  return payment
}
```

1. app/api/payment/create/route.ts

```typescript
// POST /api/payment/create
// Body: { bookingId }
// 1. Get booking from DB
// 2. Verify booking status is PENDING
// 3. Create Moyasar payment
// 4. Return payment URL
```

1. app/api/payment/callback/route.ts

```typescript
// GET /api/payment/callback
// Query: { id (payment_id), status }
// 1. Fetch payment details from Moyasar
// 2. Verify payment status
// 3. If paid:
//    - Update booking to PAID
//    - Create Payment record
//    - Send confirmations
//    - Redirect to success page
// 4. If failed:
//    - Keep booking as PENDING
//    - Redirect to retry page
```

1. components/payment/PaymentButton.tsx

```typescript
'use client'

export function PaymentButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)

  async function handlePayment() {
    setLoading(true)
    
    const response = await fetch('/api/payment/create', {
      method: 'POST',
      body: JSON.stringify({ bookingId })
    })
    
    const { paymentUrl } = await response.json()
    
    // Redirect to Moyasar payment page
    window.location.href = paymentUrl
  }

  return (
    <Button onClick={handlePayment} loading={loading}>
      ادفع الآن - XXX ريال
    </Button>
  )
}
```

1. app/booking/[id]/success/page.tsx

```typescript
// Payment success page
// Show:
// - Booking confirmed message
// - Booking details
// - Booking number
// - Download receipt button
// - Calendar add button
// - Back to home button
```

SUPPORTED PAYMENT METHODS:

- MADA
- VISA
- MASTERCARD
- Apple Pay

SECURITY:

- Verify webhook signatures
- Store minimal payment data
- PCI DSS compliance (handled by Moyasar)

ERROR SCENARIOS:

- Payment declined
- Network timeout
- Invalid card
- Insufficient funds

```

---

## 👨‍💼 PROMPT #9: لوحة تحكم المشغل Operator Dashboard

```

Create a comprehensive operator dashboard for yacht owners/managers:

LAYOUT:

- Sidebar navigation
- Top bar with notifications and profile
- Main content area

PAGES:

1. DASHBOARD OVERVIEW (app/dashboard/operator/page.tsx)
  Stats cards:
  - إجمالي الحجوزات
  - الحجوزات النشطة
  - الإيرادات هذا الشهر
  - متوسط التقييم
   Charts:
  - Bookings trend (last 30 days)
  - Revenue by yacht
   Recent bookings table:
  - Last 10 bookings
  - Quick actions
2. YACHTS MANAGEMENT (app/dashboard/operator/yachts/page.tsx)
  - List all yachts
  - Add new yacht button
  - Edit/Delete actions
  - Status toggle (active/inactive)
  - Search and filter
   Yacht form (app/dashboard/operator/yachts/new/page.tsx):
  - Basic info (name, type, description)
  - Specifications
  - Image upload (multiple)
  - Pricing
  - Features
  - Availability settings
  - Addons
3. BOOKINGS (app/dashboard/operator/bookings/page.tsx)
  Tabs:
  - الكل
  - المعلقة (pending approval)
  - المؤكدة
  - قيد التنفيذ
  - المكتملة
  - الملغية
   Actions:
  - Approve/Reject pending bookings
  - View details
  - Contact customer
  - Cancel booking
  - Mark as completed
4. CALENDAR (app/dashboard/operator/calendar/page.tsx)
  - FullCalendar integration
  - Show all bookings across all yachts
  - Filter by yacht
  - Color-coded by status
  - Click to view booking details
  - Block dates manually
5. CUSTOMERS (app/dashboard/operator/customers/page.tsx)
  - List of all customers who booked
  - Contact info
  - Booking history
  - Search
6. REVIEWS (app/dashboard/operator/reviews/page.tsx)
  - All reviews for my yachts
  - Filter by yacht
  - Filter by rating
  - Respond to reviews
  - Flag inappropriate reviews
7. ANALYTICS (app/dashboard/operator/analytics/page.tsx)
  - Bookings over time
  - Revenue trends
  - Popular yachts
  - Peak booking times
  - Customer demographics
  - Export reports
8. WALLET (app/dashboard/operator/wallet/page.tsx)
  - Current balance
  - Pending balance
  - Total earnings
  - Withdraw button
  - Transaction history
  - Bank account settings
9. SETTINGS (app/dashboard/operator/settings/page.tsx)
  - Store information
  - Contact details
  - Bank account
  - Notification preferences
  - Security (change password)

COMPONENTS:

- Sidebar.tsx
- StatsCard.tsx
- BookingTable.tsx
- YachtForm.tsx
- BookingCalendar.tsx
- ReviewCard.tsx
- WithdrawForm.tsx

PERMISSIONS:

- Operators can only see/manage their own data
- Cannot access other operators' bookings/yachts

```

---

## 👑 PROMPT #10: لوحة تحكم الإدارة Admin Dashboard

```

Create a powerful admin dashboard with full platform control:

PAGES:

1. DASHBOARD (app/dashboard/admin/page.tsx)
  Platform-wide stats:
  - Total users (customers, operators)
  - Total stores
  - Total yachts
  - Total bookings
  - Total revenue
  - Platform commission earned
   Charts:
  - User growth
  - Revenue growth
  - Bookings by city
  - Yacht types distribution
2. STORES (app/dashboard/admin/stores/page.tsx)
  - List all stores
  - Filter by status, city
  - Search
  - Approve/Reject new stores
  - Suspend/Activate stores
  - Edit commission rate per store
  - View store details and stats
3. USERS (app/dashboard/admin/users/page.tsx)
  - List all users
  - Filter by role, status
  - Search
  - View user details
  - Suspend/Activate accounts
  - Change user role
  - Impersonate user (for support)
4. YACHTS (app/dashboard/admin/yachts/page.tsx)
  - List all yachts across all stores
  - Filter by status, type, city
  - Approve/Reject yacht listings
  - Feature/Unfeature yachts
  - Edit yacht details
  - Remove yachts
5. BOOKINGS (app/dashboard/admin/bookings/page.tsx)
  - View all platform bookings
  - Filter by status, date, store
  - Search by booking number
  - View booking details
  - Handle disputes
  - Issue refunds
6. PAYMENTS (app/dashboard/admin/payments/page.tsx)
  - All payment transactions
  - Filter by status, method, date
  - View payment details
  - Process refunds
  - Failed payments report
7. REVIEWS (app/dashboard/admin/reviews/page.tsx)
  - All platform reviews
  - Flag inappropriate reviews
  - Hide/Unhide reviews
  - View review details
8. REPORTS (app/dashboard/admin/reports/page.tsx)
  Generate reports:
  - Revenue report (by period, store, city)
  - Bookings report
  - Commission report
  - User growth report
  - Export to CSV/PDF
9. CONTENT (app/dashboard/admin/content/page.tsx)
  Manage:
  - Cities and marinas
  - Yacht types
  - Feature categories
  - Addon categories
  - Static pages (about, terms, privacy)
10. SETTINGS (app/dashboard/admin/settings/page.tsx)
  Platform settings:
  - Default commission rate
  - Tax rate
  - Payment gateway configs
  - Email templates
  - SMS templates
  - Site metadata
  - API keys

FEATURES:

- Advanced filtering and search
- Bulk actions
- Export capabilities
- Real-time updates
- Activity logs
- Email notifications
- System health monitoring

COMPONENTS:

- AdminStats.tsx
- StoreApprovalQueue.tsx
- UserTable.tsx
- RevenueChart.tsx
- ExportButton.tsx
- SettingsForm.tsx

PERMISSIONS:

- Admin role required for all pages
- Log all admin actions
- 2FA required for sensitive actions

```

---

## 📧 PROMPT #11: نظام الإشعارات Notifications

```

Create a comprehensive notification system for emails and SMS:

TYPES OF NOTIFICATIONS:

1. EMAIL NOTIFICATIONS:
  - New booking (to operator)
  - Booking confirmed (to customer)
  - Booking cancelled
  - Payment received
  - Review received
  - Account verification
  - Password reset
  - Weekly summary
2. SMS NOTIFICATIONS:
  - Booking confirmation code
  - Booking reminder (1 day before)
  - Account verification OTP
  - Important updates

FILES TO CREATE:

1. lib/email.ts

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(bookingId: string) {
  const booking = await getBookingWithDetails(bookingId)
  
  // Send to customer
  await resend.emails.send({
    from: 'bookings@yachts.sa',
    to: booking.customerEmail,
    subject: `تأكيد حجز #${booking.bookingNumber}`,
    html: renderBookingEmail(booking, 'customer')
  })
  
  // Send to operator
  await resend.emails.send({
    from: 'bookings@yachts.sa',
    to: booking.store.owner.email,
    subject: `حجز جديد #${booking.bookingNumber}`,
    html: renderBookingEmail(booking, 'operator')
  })
}
```

1. lib/sms.ts

```typescript
// Using MSEGAT or Unifonic
export async function sendSMS(phone: string, message: string) {
  const response = await fetch('https://api.msegat.com/gw/send.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: process.env.MSEGAT_USERNAME,
      numbers: phone,
      userSender: 'YachtSA',
      msg: message,
      msgEncoding: 'UTF8'
    })
  })
  
  return response.json()
}

export async function sendBookingReminderSMS(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { yacht: true }
  })
  
  const message = `تذكير: لديك حجز يخت ${booking.yacht.name} غداً الساعة ${booking.startTime}. رقم الحجز: ${booking.bookingNumber}`
  
  await sendSMS(booking.customerPhone, message)
}
```

1. components/email-templates/
  - BookingConfirmation.tsx
  - BookingCancellation.tsx
  - PaymentReceipt.tsx
  - WeeklySummary.tsx
2. app/api/notifications/route.ts

```typescript
// Cron job endpoint (call via Vercel Cron or external service)
// Send daily reminders for bookings tomorrow
// Send weekly summaries to operators
```

1. Create Notification model in Prisma:

```prisma
model Notification {
  id        String   @id @default(cuid())
  type      NotificationType
  title     String
  message   String
  isRead    Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

enum NotificationType {
  BOOKING_RECEIVED
  BOOKING_CONFIRMED
  BOOKING_CANCELLED
  PAYMENT_RECEIVED
  REVIEW_RECEIVED
  SYSTEM
}
```

1. components/NotificationBell.tsx

```typescript
// Bell icon with badge
// Dropdown showing recent notifications
// Mark as read functionality
// "See all" link to notifications page
```

TEMPLATES NEEDED:

- Booking confirmation (customer)
- New booking (operator)
- Booking cancelled
- Payment receipt
- Account verified
- Password reset
- Weekly summary

```

---

## 📱 PROMPT #12: تحسين تجربة الموبايل Mobile Optimization

```

Optimize the yacht booking platform for mobile devices:

REQUIREMENTS:

1. RESPONSIVE DESIGN:
  - Mobile-first approach
  - Breakpoints: 640px, 768px, 1024px, 1280px
  - Touch-friendly buttons (min 44x44px)
  - Swipeable carousels
  - Bottom navigation on mobile
2. MOBILE-SPECIFIC FEATURES:
  - Pull-to-refresh
  - Infinite scroll on yacht listing
  - Native-like animations
  - Bottom sheet modals
  - Sticky booking button on yacht details
  - WhatsApp click-to-chat
  - Click-to-call phone numbers
3. PERFORMANCE:
  - Image optimization (next/image)
  - Lazy loading
  - Reduce bundle size
  - Cache strategies
  - Offline support (service worker)
4. MOBILE COMPONENTS:

components/mobile/

- MobileNav.tsx (bottom navigation)
- MobileSearch.tsx (full-screen search)
- MobileFilters.tsx (bottom sheet filters)
- SwipeableGallery.tsx (image gallery)
- StickyBookingBar.tsx (fixed bottom)
- MobileMenu.tsx (hamburger menu)

1. TOUCH GESTURES:
  - Swipe to dismiss modals
  - Swipe between images
  - Pull down to close
  - Long press for quick actions
2. MOBILE BOOKING FLOW:
  - Single page with steps
  - Progress indicator at top
  - Sticky "Next" button
  - Auto-scroll to next section
  - Smooth transitions

TESTING:

- Test on iOS Safari
- Test on Android Chrome
- Test on different screen sizes
- Test touch interactions
- Test offline functionality

MOBILE MENU STRUCTURE:

- الرئيسية
- اليخوت
- حجوزاتي
- المفضلة
- الحساب
- تسجيل الدخول / الخروج

```

---

## 🔍 PROMPT #13: تحسين محركات البحث SEO

```

Implement comprehensive SEO optimization:

1. METADATA (app/layout.tsx):

```typescript
export const metadata: Metadata = {
  title: {
    default: 'حجز يخوت في السعودية | أفضل منصة لحجز اليخوت',
    template: '%s | حجز يخوت'
  },
  description: 'احجز يختك المثالي في جدة والسعودية. أفضل الأسعار، حجز فوري، دفع آمن. يخوت فاخرة للعائلات والمناسبات.',
  keywords: ['حجز يخوت', 'يخوت جدة', 'رحلات بحرية', 'يخوت فاخرة', 'حجز يخت اون لاين'],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'حجز يخوت',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yachtssa'
  },
  robots: {
    index: true,
    follow: true
  }
}
```

1. DYNAMIC METADATA (yacht pages):

```typescript
// app/yachts/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const yacht = await getYacht(params.slug)
  
  return {
    title: `${yacht.name} - حجز يخت في ${yacht.city}`,
    description: yacht.description,
    openGraph: {
      title: yacht.name,
      description: yacht.description,
      images: [yacht.images[0].url],
      type: 'product'
    }
  }
}
```

1. STRUCTURED DATA:

```typescript
// components/StructuredData.tsx
export function YachtStructuredData({ yacht }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": yacht.name,
    "description": yacht.description,
    "image": yacht.images.map(img => img.url),
    "offers": {
      "@type": "Offer",
      "price": yacht.basePrice,
      "priceCurrency": "SAR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": yacht.averageRating,
      "reviewCount": yacht.reviewCount
    }
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

1. SITEMAP (app/sitemap.ts):

```typescript
export default async function sitemap() {
  const yachts = await getAllYachts()
  
  const yachtUrls = yachts.map(yacht => ({
    url: `https://yachts.sa/yachts/${yacht.slug}`,
    lastModified: yacht.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8
  }))
  
  return [
    {
      url: 'https://yachts.sa',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: 'https://yachts.sa/yachts',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9
    },
    ...yachtUrls
  ]
}
```

1. ROBOTS.TXT (public/robots.txt):

```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://yachts.sa/sitemap.xml
```

1. SEO CHECKLIST:
  - Proper heading hierarchy (H1, H2, H3)
  - Alt text for all images
  - Descriptive URLs (slugs)
  - Internal linking
  - Mobile-friendly
  - Fast loading speed
  - HTTPS
  - Breadcrumbs
  - Canonical URLs
  - Social share buttons

```

---

## 🚀 PROMPT #14: التشغيل والنشر Deployment

```

Set up deployment pipeline for production:

HOSTING:

- Frontend: Vercel
- Database: Supabase PostgreSQL
- File Storage: Supabase Storage / Cloudinary
- Email: Resend
- SMS: MSEGAT

ENVIRONMENT VARIABLES:
Create .env.production with:

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_URL=https://yachts.sa
NEXTAUTH_SECRET=

# Moyasar
MOYASAR_API_KEY=
NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=

# SMS
MSEGAT_USERNAME=
MSEGAT_API_KEY=

# Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

VERCEL SETUP:

1. Connect GitHub repository
2. Configure build settings:
  - Framework: Next.js
  - Build command: `npm run build`
  - Output directory: `.next`
3. Add environment variables
4. Enable automatic deployments
5. Set up custom domain

SUPABASE SETUP:

1. Create production project
2. Run migrations
3. Set up Row Level Security (RLS)
4. Configure storage buckets
5. Set up database backups

PERFORMANCE:

- Enable Edge Functions
- Configure caching
- Set up CDN
- Image optimization
- Bundle analysis

MONITORING:

- Set up Vercel Analytics
- Add error tracking (Sentry)
- Monitor API response times
- Set up uptime monitoring
- Database performance monitoring

CI/CD:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

BACKUP STRATEGY:

- Daily database backups
- Backup retention: 30 days
- File storage backups
- Disaster recovery plan

SECURITY:

- Enable HTTPS
- Set security headers
- Rate limiting
- DDoS protection
- Regular security audits

```

---

## 📊 PROMPT #15: Analytics & Tracking

```

Implement comprehensive analytics and tracking:

1. GOOGLE ANALYTICS 4:

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

1. CUSTOM EVENTS:

```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Usage examples:
trackEvent('yacht_view', { yacht_id, yacht_name, city })
trackEvent('booking_started', { yacht_id, date })
trackEvent('booking_completed', { booking_id, total_amount })
trackEvent('payment_success', { booking_id, payment_method })
```

1. CONVERSION TRACKING:

- Yacht view
- Add to favorites
- Booking started
- Booking completed
- Payment success
- User registration
- Review submitted

1. MIXPANEL (optional, for detailed analytics):

```typescript
import mixpanel from 'mixpanel-browser'

mixpanel.init('YOUR_TOKEN')

export const mixpanelTrack = (event: string, properties?: object) => {
  mixpanel.track(event, properties)
}

// Track user funnel
mixpanelTrack('Page Viewed', { page: 'yacht_details' })
mixpanelTrack('Booking Started', { yacht_id, price })
mixpanelTrack('Payment Initiated', { booking_id })
mixpanelTrack('Purchase Completed', { booking_id, revenue })
```

1. ADMIN ANALYTICS DASHBOARD:

```typescript
// app/dashboard/admin/analytics/page.tsx
export default function AnalyticsPage() {
  const stats = useAnalytics()
  
  return (
    <div>
      {/* Key Metrics */}
      <MetricsCards
        totalUsers={stats.totalUsers}
        totalBookings={stats.totalBookings}
        totalRevenue={stats.totalRevenue}
        conversionRate={stats.conversionRate}
      />
      
      {/* Charts */}
      <Charts
        bookingsTrend={stats.bookingsTrend}
        revenueTrend={stats.revenueTrend}
        topYachts={stats.topYachts}
        userAcquisition={stats.userAcquisition}
      />
      
      {/* Funnels */}
      <ConversionFunnel
        steps={[
          'Page View',
          'Yacht Clicked',
          'Booking Started',
          'Payment Initiated',
          'Booking Completed'
        ]}
        values={stats.funnelData}
      />
    </div>
  )
}
```

TRACK:

- Page views
- User behavior
- Booking funnel
- Revenue metrics
- Popular yachts
- Search queries
- Bounce rate
- Session duration

```

---

## 🎨 DESIGN SYSTEM PROMPT

```

Create a comprehensive design system for the yacht booking platform:

COLORS:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8EAF6',
          100: '#C5CAE9',
          500: '#0A2463', // Main brand color
          600: '#081B4A',
          700: '#061331',
        },
        secondary: {
          50: '#FFF9E6',
          500: '#D4AF37', // Gold accent
          600: '#B8962E',
        },
        accent: {
          500: '#00B4D8', // Teal
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      }
    }
  }
}
```

TYPOGRAPHY:

- Headings: 'Cairo', sans-serif
- Body: 'Tajawal', sans-serif
- Monospace: 'JetBrains Mono'

SPACING SCALE:

- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

SHADOWS:

- sm: subtle
- md: normal
- lg: prominent
- xl: dramatic

COMPONENTS:
Create shadcn/ui components:

- Button (primary, secondary, outline, ghost)
- Input
- Select
- Textarea
- Checkbox
- Radio
- Switch
- Card
- Badge
- Alert
- Dialog
- Sheet
- Tabs
- Accordion
- Table
- Pagination

ICONS:
Use lucide-react for all icons

```

---

هذه مجموعة شاملة من الـ Prompts الجاهزة للاستخدام. كل prompt مصمم ليكون:
- ✅ واضح ومفصل
- ✅ قابل للتنفيذ مباشرة
- ✅ يحتوي على أمثلة كود
- ✅ يغطي جميع الحالات

يمكنك استخدامها بالترتيب أو حسب الحاجة! 🚀
```

