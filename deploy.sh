#!/bin/bash
# ─── سكريبت النشر لمنصة بحرنا ─────────────────────────────────────────────────
# التشغيل: bash deploy.sh

set -e

echo "🚀 بدء نشر منصة بحرنا..."

# 1. سحب آخر التحديثات
echo "📥 سحب التحديثات من GitHub..."
git pull origin main

# 2. تثبيت المكتبات
echo "📦 تثبيت المكتبات..."
npm ci --production=false

# 3. توليد Prisma Client
echo "🗄️  توليد Prisma Client..."
npx prisma generate

# 4. تحديث قاعدة البيانات
echo "🗄️  تحديث قاعدة البيانات..."
npx prisma db push --accept-data-loss

# 5. بناء التطبيق
echo "🔨 بناء التطبيق..."
npm run build

# 6. إعادة تشغيل PM2
echo "♻️  إعادة تشغيل الخدمة..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js

echo "✅ تم النشر بنجاح!"
echo "🌐 الموقع يعمل على المنفذ 3000"
