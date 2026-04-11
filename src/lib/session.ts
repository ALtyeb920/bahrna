import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") redirect("/login?reason=unauthorized");
  return session;
}

export async function requireOperator() {
  const session = await requireAuth();
  if (session.user.role !== "OPERATOR" && session.user.role !== "ADMIN") {
    redirect("/login?reason=unauthorized");
  }
  return session;
}

export async function requireCustomer() {
  const session = await requireAuth();
  return session;
}
