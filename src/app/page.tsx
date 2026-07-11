import Link from "next/link";
import Logo from "@/app/components/layout/Logo";
import { CheckCircle, Calendar, Wallet, ListTodo, TrendingUp, Smartphone } from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "Gestion des tâches",
    desc: "Organise tes devoirs avec priorités, matières et dates limites.",
  },
  {
    icon: Calendar,
    title: "Emploi du temps",
    desc: "Visualise ta semaine en vue jour, semaine ou mois.",
  },
  {
    icon: Wallet,
    title: "Budget étudiant",
    desc: "Suis revenus et dépenses avec graphiques interactifs.",
  },
  {
    icon: TrendingUp,
    title: "Tableau de bord",
    desc: "Aperçu clair de ta vie étudiante en un coup d'œil.",
  },
  {
    icon: Smartphone,
    title: "Responsive",
    desc: "Accessible sur téléphone, tablette et ordinateur.",
  },
  {
    icon: CheckCircle,
    title: "Simple & Rapide",
    desc: "Pas de configuration complexe, prêt à l'emploi.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-card-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-card-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              ÉtudiPlan
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Organise ta vie étudiante, simplement.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Tâches, emploi du temps, budget — tout ce dont tu as besoin pour
              réussir ton semestre, au même endroit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-card-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Tout pour réussir ton semestre
            </h2>
            <p className="mt-4 text-muted-foreground">
              Des outils conçus pour les étudiants, sans superflu.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-card-border bg-card p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 border-t border-card-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Prêt à reprendre le contrôle ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rejoins les étudiants qui utilisent ÉtudiPlan au quotidien.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Créer un compte gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-card-border py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ÉtudiPlan. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
