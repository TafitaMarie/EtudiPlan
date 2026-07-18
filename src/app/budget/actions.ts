"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/getCurrentUserId";
import { transactionSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  const userId = await requireUserId();

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return transactions.map((t) => ({
    ...t,
    date: t.date.toISOString(),
  }));
}

export async function createTransactionAction(data: {
  libelle: string;
  categorie: string;
  montant: number;
  type: "REVENU" | "DEPENSE";
  date?: string;
}) {
  const userId = await requireUserId();

  const parsed = transactionSchema.safeParse({
    ...data,
    date: data.date ? new Date(data.date) : undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  await prisma.transaction.create({
    data: {
      userId,
      libelle: parsed.data.libelle,
      categorie: parsed.data.categorie,
      montant: parsed.data.montant,
      type: parsed.data.type,
      date: parsed.data.date ?? new Date(),
    },
  });

  revalidatePath("/budget");
}

export async function updateTransactionAction(
  id: number,
  data: {
    libelle: string;
    categorie: string;
    montant: number;
    type: "REVENU" | "DEPENSE";
    date?: string;
  }
) {
  const userId = await requireUserId();

  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Transaction introuvable");
  }

  const parsed = transactionSchema.safeParse({
    ...data,
    date: data.date ? new Date(data.date) : undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  await prisma.transaction.update({
    where: { id },
    data: {
      libelle: parsed.data.libelle,
      categorie: parsed.data.categorie,
      montant: parsed.data.montant,
      type: parsed.data.type,
      date: parsed.data.date ?? existing.date,
    },
  });

  revalidatePath("/budget");
}

export async function deleteTransactionAction(id: number) {
  const userId = await requireUserId();

  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Transaction introuvable");
  }

  await prisma.transaction.delete({ where: { id } });

  revalidatePath("/budget");
}
