import AppLayout from "@/app/components/layout/appLayout";
import StatCard from "./statCard";
import { Wallet, ListTodo, CalendarCheck, GraduationCap, Circle, Lightbulb, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Transaction, Tache } from "@prisma/client";
import { requireUserId } from "@/lib/getCurrentUserId";

function formatAriary(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " Ar";
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default async function Dashboard() {
  const userId = await requireUserId();
  const now = new Date();
  const [taches, transactions, prochainCours, evenementsAvenir] = await Promise.all([
    prisma.tache.findMany({
      where: { userId, faite: false },
      orderBy: [{ priorite: "desc" }, { dateLimite: "asc" }, { createdAt: "asc" }],
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.event.findFirst({
      where: { userId, startDate: { gte: now } },
      orderBy: { startDate: "asc" },
    }),
    prisma.event.count({ where: { userId, startDate: { gte: now } } }),
  ]);

  const solde = transactions.reduce((s: number, t: Transaction) => (t.type === "REVENU" ? s + (t.montant ?? 0) : s - (t.montant ?? 0)), 0);
  const nbTachesRestantes = taches.length;
  const nbTachesUrgentes = taches.filter((t) => t.priorite === "HAUTE").length;
  const tachesDuJour = taches.filter((t) => t.dateLimite && isSameDay(new Date(t.dateLimite), now));
  const tachesAffichees = tachesDuJour.length > 0 ? tachesDuJour.slice(0, 5) : taches.slice(0, 5);
  const tachesTitre = tachesDuJour.length > 0 ? "Tâches du jour" : taches.length > 0 ? "Prochaines tâches" : "Tâches du jour";

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const transactionsThisMonth = transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date >= monthStart && date <= monthEnd;
  });
  const depensesCeMois = transactionsThisMonth
    .filter((transaction) => transaction.type === "DEPENSE")
    .reduce((total, transaction) => total + transaction.montant, 0);
  const revenusCeMois = transactionsThisMonth
    .filter((transaction) => transaction.type === "REVENU")
    .reduce((total, transaction) => total + transaction.montant, 0);

  const jourSemaine = now.toLocaleDateString("fr-FR", { weekday: "long" });
  const heure = now.getHours();
  const salutation = heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";

  let recommandation: string;
  let emoji: string;

  if (tachesDuJour.length > 0) {
    recommandation = `Tu as ${tachesDuJour.length} tâche${tachesDuJour.length > 1 ? "s" : ""} à rendre aujourd'hui. Commence par "${tachesDuJour[0].titre}".`;
    emoji = "🎯";
  } else if (nbTachesUrgentes > 0) {
    recommandation = `${nbTachesUrgentes} tâche${nbTachesUrgentes > 1 ? "s" : ""} haute priorité t'attend${nbTachesUrgentes > 1 ? "ent" : ""}. Concentre-toi sur l'essentiel.`;
    emoji = "⚡";
  } else if (solde < 0) {
    recommandation = "Tes dépenses dépassent tes revenus ce mois-ci. Essaie de réduire les sorties.";
    emoji = "⚠️";
  } else if (nbTachesRestantes === 0 && evenementsAvenir === 0) {
    recommandation = "Rien à faire pour le moment. Profite pour réviser ou prendre de l'avance.";
    emoji = "🌟";
  } else if (jourSemaine === "samedi" || jourSemaine === "dimanche") {
    recommandation = "C'est le week-end ! Pense à te reposer, mais n'oublie pas tes révisions.";
    emoji = "😌";
  } else {
    recommandation = `${nbTachesRestantes} tâche${nbTachesRestantes > 1 ? "s" : ""} en attente, ${evenementsAvenir} événement${evenementsAvenir > 1 ? "s" : ""} à venir. Continue comme ça !`;
    emoji = "💪";
  }

  const nextCourseTime = prochainCours
    ? new Date(prochainCours.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";
  const nextCourseDay = prochainCours
    ? new Date(prochainCours.startDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : "";
  const nextCourseType = prochainCours ? (prochainCours.type === "COURSE" ? "Cours" : "Examen") : "";
  const nextCourseRoom = prochainCours?.room ?? "Salle non définie";

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">{salutation} {now.getDate() === 1 ? "1er" : now.getDate()} {now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Solde total" value={formatAriary(solde)} icon={Wallet} color="blue" />
        <StatCard title="Tâches à faire" value={`${nbTachesRestantes}`} icon={ListTodo} color="green" />
        <StatCard title="Événements à venir" value={`${evenementsAvenir}`} icon={CalendarDays} color="blue" />
        <StatCard title="Dépenses ce mois" value={formatAriary(depensesCeMois)} icon={Wallet} color="orange" />
        <StatCard title="Revenus ce mois" value={formatAriary(revenusCeMois)} icon={GraduationCap} color="purple" />
      </div>

      <div className="mt-8 bg-card rounded-2xl border border-card-border shadow-sm p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Transactions récentes</h2>
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border bg-muted p-6 text-center text-muted-foreground">
            Aucune transaction enregistrée pour le moment. Ajoute-en depuis la page Budget.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-card-border bg-muted/50 p-4">
                <div>
                  <p className="font-medium text-foreground">{transaction.libelle}</p>
                  <p className="text-sm text-muted-foreground">{transaction.categorie}</p>
                </div>
                <p className={`font-semibold ${transaction.type === "REVENU" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                  {transaction.type === "REVENU" ? "+" : "-"}{formatAriary(transaction.montant)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {prochainCours ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Événement</p>
            <p className="mt-2 text-xl font-semibold text-foreground">{prochainCours.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{nextCourseType}</p>
          </div>
          <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="mt-2 text-xl font-semibold text-foreground">{nextCourseDay}</p>
            <p className="mt-1 text-sm text-muted-foreground">{nextCourseTime}</p>
          </div>
          <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Salle</p>
            <p className="mt-2 text-xl font-semibold text-foreground">{nextCourseRoom}</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl bg-card border border-card-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Prochain cours</p>
          <p className="mt-2 text-lg font-semibold text-foreground">Aucun événement prévu</p>
          <p className="mt-1 text-sm text-muted-foreground">Ajoute un cours ou un examen dans l&rsquo;emploi du temps pour le voir ici.</p>
        </div>
      )}

      <div className="mt-8 bg-card rounded-2xl border border-card-border shadow-sm p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">{tachesTitre}</h2>

        {taches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border bg-muted p-6 text-center text-muted-foreground">
            Aucune tâche à faire pour le moment. Ajoute-en depuis la page Tâches.
          </div>
        ) : (
          <ul className="space-y-3">
            {tachesAffichees.map((t: Tache) => (
              <li key={t.id} className="flex items-center gap-3 text-foreground">
                <Circle size={20} className={t.faite ? "text-green-500 dark:text-green-400" : "text-muted-foreground"} />
                <span className={t.faite ? "line-through text-muted-foreground" : ""}>{t.titre}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="text-2xl">{emoji}</div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Conseil du jour — {jourSemaine}</h3>
          <p className="text-muted-foreground text-sm">{recommandation}</p>
        </div>
      </div>
    </AppLayout>
  );
}
