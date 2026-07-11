import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim() } });
  if (!user) {
    return NextResponse.json({ error: "Aucun compte avec cet email" }, { status: 404 });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpires },
  });

  console.log(`\n🔐 [RESET PASSWORD] Token for ${email}:`);
  console.log(`   ${resetToken}`);
  console.log(`   Lien: http://localhost:3000/reset-mot-de-passe?token=${resetToken}\n`);

  return NextResponse.json({ success: true, message: "Email envoyé (consulte la console)" });
}
