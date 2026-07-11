import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (user.verified) {
    return NextResponse.json({ error: "Email déjà vérifié" }, { status: 400 });
  }

  const verifyToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: userId },
    data: { verifyToken },
  });

  const link = `http://localhost:3000/api/auth/verify-email?token=${verifyToken}`;

  console.log(`\n✅ [VERIFY EMAIL] Token for ${user.email}:`);
  console.log(`   ${verifyToken}`);
  console.log(`   Lien: ${link}\n`);

  return NextResponse.json({ success: true, link, message: "Lien de vérification généré" });
}
