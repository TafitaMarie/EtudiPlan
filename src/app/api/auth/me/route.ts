import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, verified: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { name, email, password } = await req.json();

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Nom et email requis" }, { status: 400 });
  }

  const data: Record<string, string> = { name: name.trim(), email: email.trim() };

  if (password) {
    data.hashedPassword = await hashPassword(password);
  }

  try {
    await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  }
}
