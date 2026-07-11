import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUserIdFromToken(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    if (typeof payload === "string") return null;
    return (payload as { userId: number }).userId ?? null;
  } catch {
    return null;
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return errorResponse("Non authentifié", 401);

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(transactions);
  } catch {
    return errorResponse("Erreur serveur", 500);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return errorResponse("Non authentifié", 401);

    const body = await request.json();
    const { libelle, categorie, montant, type } = body;

    if (!libelle || !categorie || montant === undefined || !type) {
      return errorResponse("Champs obligatoires manquants", 400);
    }
    if (typeof montant !== "number" || montant <= 0) {
      return errorResponse("Montant invalide", 400);
    }
    if (!["REVENU", "DEPENSE"].includes(type)) {
      return errorResponse("Type invalide", 400);
    }

    const created = await prisma.transaction.create({
      data: {
        userId,
        libelle: String(libelle),
        categorie: String(categorie),
        montant: Number(montant),
        type: type as "REVENU" | "DEPENSE",
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return errorResponse("Erreur serveur", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return errorResponse("Non authentifié", 401);

    const body = await request.json();
    const { id, libelle, categorie, montant, type, date } = body;
    const numericId = Number(id);

    if (!id || !libelle || !categorie || montant === undefined || !type) {
      return errorResponse("Champs obligatoires manquants", 400);
    }

    const existing = await prisma.transaction.findUnique({ where: { id: numericId } });
    if (!existing) return errorResponse("Transaction introuvable", 404);
    if (existing.userId !== userId) return errorResponse("Accès refusé", 403);

    const updated = await prisma.transaction.update({
      where: { id: numericId },
      data: {
        libelle: String(libelle),
        categorie: String(categorie),
        montant: Number(montant),
        type: type as "REVENU" | "DEPENSE",
        date: date ? new Date(date) : existing.date,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return errorResponse("Erreur serveur", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return errorResponse("Non authentifié", 401);

    const body = await request.json();
    const numericId = Number(body.id);

    if (!numericId) return errorResponse("ID requis", 400);

    const existing = await prisma.transaction.findUnique({ where: { id: numericId } });
    if (!existing) return errorResponse("Transaction introuvable", 404);
    if (existing.userId !== userId) return errorResponse("Accès refusé", 403);

    await prisma.transaction.delete({ where: { id: numericId } });
    return NextResponse.json({ ok: true });
  } catch {
    return errorResponse("Erreur serveur", 500);
  }
}
