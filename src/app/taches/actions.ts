"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/getCurrentUserId";
import { tacheSchema } from "@/lib/validation";

export async function getTaches() {
  const userId = await requireUserId();

  const taches = await prisma.tache.findMany({
    where: { userId },
    orderBy: { ordre: "asc" },
  });

  return taches.map((t) => ({
    ...t,
    dateLimite: t.dateLimite ? t.dateLimite.toISOString() : null,
  }));
}

export async function ajouterTacheAction(
  titre: string,
  matiere: string | null,
  dateLimite: string | null,
  priorite: "BASSE" | "MOYENNE" | "HAUTE",
  statut: "A_FAIRE" | "EN_COURS" | "TERMINEE"
) {
  const userId = await requireUserId();

  const parsed = tacheSchema.safeParse({ titre, matiere, dateLimite, priorite, statut });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const { titre: t, matiere: m, dateLimite: d } = parsed.data;

  const maxOrdre = await prisma.tache.aggregate({
    where: { userId },
    _max: { ordre: true },
  });
  const nextOrdre = (maxOrdre._max.ordre ?? -1) + 1;

  await prisma.tache.create({
    data: {
      userId,
      titre: t,
      matiere: m && m.trim() !== "" ? m : null,
      dateLimite: d ? new Date(d) : null,
      priorite,
      statut,
      ordre: nextOrdre,
    },
  });

  revalidatePath("/taches");
}

export async function toggleTacheAction(id: number, faiteActuelle: boolean) {
  const userId = await requireUserId();

  const tache = await prisma.tache.findUnique({ where: { id } });
  if (!tache || tache.userId !== userId) {
    throw new Error("Tâche introuvable");
  }

  await prisma.tache.update({
    where: { id },
    data: { faite: !faiteActuelle },
  });

  revalidatePath("/taches");
}

export async function supprimerTacheAction(id: number) {
  const userId = await requireUserId();

  const tache = await prisma.tache.findUnique({ where: { id } });
  if (!tache || tache.userId !== userId) {
    throw new Error("Tâche introuvable");
  }

  await prisma.tache.delete({
    where: { id },
  });

  revalidatePath("/taches");
}

export async function reordonnerTachesAction(ids: number[]) {
  const userId = await requireUserId();

  const updates = ids.map((id, index) =>
    prisma.tache.updateMany({
      where: { id, userId },
      data: { ordre: index },
    })
  );

  await prisma.$transaction(updates);
  revalidatePath("/taches");
}
