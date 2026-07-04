"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTaches() {
  return prisma.tache.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function ajouterTacheAction(titre: string) {
  if (titre.trim() === "") return;

  await prisma.tache.create({
    data: { titre },
  });

  revalidatePath("/taches");
}

export async function toggleTacheAction(id: number, faiteActuelle: boolean) {
  await prisma.tache.update({
    where: { id },
    data: { faite: !faiteActuelle },
  });

  revalidatePath("/taches");
}

export async function supprimerTacheAction(id: number) {
  await prisma.tache.delete({
    where: { id },
  });

  revalidatePath("/taches");
}