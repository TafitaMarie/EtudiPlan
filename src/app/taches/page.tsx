import AppLayout from "@/app/components/layout/appLayout";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/getCurrentUserId";
import TachesClient from "./TachesClient";

export default async function TachesPage() {
  const userId = await requireUserId();
  const raw = await prisma.tache.findMany({
    where: { userId },
    orderBy: { ordre: "asc" },
  });

  const taches = raw.map((t) => ({
    ...t,
    dateLimite: t.dateLimite?.toISOString() ?? null,
    priorite: t.priorite as "BASSE" | "MOYENNE" | "HAUTE",
    statut: t.statut as "A_FAIRE" | "EN_COURS" | "TERMINEE",
  }));

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-foreground">Tâches</h1>
      <p className="mt-2 text-muted-foreground">Gère tes devoirs et travaux à rendre.</p>
      <div className="mt-6">
        <TachesClient taches={taches} />
      </div>
    </AppLayout>
  );
}
