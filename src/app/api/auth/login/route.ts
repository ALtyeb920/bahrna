import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ message: "البيانات مطلوبة" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        OR: [{ phone: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json({ message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json({ message: "حسابك موقوف. تواصل مع الإدارة." }, { status: 403 });
    }

    const redirect =
      user.role === "ADMIN" ? "/admin" :
      user.role === "OPERATOR" ? "/owner" : "/";

    return NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
      redirect,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطأ في الخادم" }, { status: 500 });
  }
}
