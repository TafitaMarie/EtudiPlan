"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/getCurrentUserId";

export async function getTransactions() {
  const userId = await requireUserId();

  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}
