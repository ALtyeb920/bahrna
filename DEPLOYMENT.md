# نشر منصة بحرنا على Hostinger VPS

## المتطلبات
- Hostinger VPS بنظام Ubuntu 22.04
- Node.js 18+ 
- PM2
- Nginx (اختياري لكن موصى به)

---

## الخطوة 1: الاتصال بالسيرفر

```bash
ssh root@YOUR_SERVER_IP
```

---

## الخطوة 2: تثبيت Node.js و PM2

```bash
# تثبيت NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# تثبيت Node.js 18
nvm install 18
nvm use 18
node -v  # يجب أن يظهر v18.x.x

# تثبيت PM2
npm install -g pm2
```

---

## الخطوة 3: نسخ المشروع

```bash
cd /var/www
git clone https://github.com/ALtyeb920/bahrna.git
cd bahrna
```

---

## الخطوة 4: إعداد المتغيرات البيئية

```bash
cp .env.production.example .env
nano .env
```

**عدّل هذه القيم:**
```env
DATABASE_URL="file:/var/www/bahrna/prisma/production.db"
NEXTAUTH_SECRET="اكتب_مفتاح_عشوائي_طويل_هنا"
NEXTAUTH_URL="https://YOUR_DOMAIN.com"
```

**لإنشاء مفتاح عشوائي:**
```bash
openssl rand -base64 32
```

---

## الخطوة 5: تثبيت وبناء المشروع

```bash
npm ci
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run build
```

---

## الخطوة 6: تشغيل مع PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**التحقق أن التطبيق يعمل:**
```bash
pm2 status
pm2 logs bahrna
```

---

## الخطوة 7: إعداد Nginx (للدومين الخاص)

```bash
apt install nginx -y
nano /etc/nginx/sites-available/bahrna
```

**المحتوى:**
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/bahrna /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## الخطوة 8: SSL مجاني مع Certbot

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

---

## تحديث المشروع في المستقبل

```bash
cd /var/www/bahrna
bash deploy.sh
```

---

## بيانات الدخول الافتراضية

| الدور | المعرّف | كلمة المرور |
|-------|---------|------------|
| مسؤول | admin@bahrna.sa | Admin@2026! |
| مشغّل | operator | Owner@2026! |
| عميل | +966501234567 | Customer@2026! |

> ⚠️ **مهم:** غيّر كلمات المرور بعد أول تسجيل دخول في بيئة الإنتاج

---

## استكشاف الأخطاء

```bash
# عرض لوجات التطبيق
pm2 logs bahrna --lines 100

# إعادة تشغيل
pm2 restart bahrna

# عرض الموارد
pm2 monit
```
