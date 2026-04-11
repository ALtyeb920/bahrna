import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, role, storeName, storeCity } = body;

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json({ message: "الاسم ورقم الجوال وكلمة المرور مطلوبة" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
    }

    // Check unique phone
    const existingPhone = await db.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ message: "رقم الجوال مستخدم بالفعل" }, { status: 409 });
    }

    // Check unique email if provided
    if (email) {
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ message: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        phone,
        email: email || null,
        passwordHash,
        role: role === "OPERATOR" ? "OPERATOR" : "CUSTOMER",
        status: "ACTIVE",
      },
    });

    // Create store for operators
    if (role === "OPERATOR" && storeName) {
      const baseSlug = slugify(storeName);
      let slug = baseSlug;
      let counter = 1;

      // Ensure unique slug
      while (await db.store.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      await db.store.create({
        data: {
          name: storeName,
          slug,
          city: storeCity || "غير محدد",
          status: "PENDING",
          commissionRate: 12,
          ownerId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
