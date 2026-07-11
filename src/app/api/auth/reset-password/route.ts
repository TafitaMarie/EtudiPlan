import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: "Token invalide ou mot de passe trop court" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpires: { gte: new Date() } },
  });

  if (!user) {
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword, resetToken: null, resetTokenExpires: null },
  });

  return NextResponse.json({ success: true, message: "Mot de passe réinitialisé" });
}
