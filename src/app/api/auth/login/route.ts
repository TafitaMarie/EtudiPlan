import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimitMiddleware, getClientIp } from "@/lib/rate-limit";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function setCookieHeaders(token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "Secure; " : "";
  return `token=${token}; HttpOnly; ${secure}Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimitMiddleware(`login:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaye dans 60 secondes." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.hashedPassword);
    if (!ok) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    const token = createToken({ userId: user.id });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    res.headers.set("Set-Cookie", setCookieHeaders(token));
    return res;
  } catch (e: unknown) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
