import AppLayout from "@/app/components/layout/appLayout";
import StatCard from "./statCard";
import { CalendarCheck, Wallet, ListTodo, GraduationCap, Circle, CheckCircle2, Lightbulb } from "lucide-react";

function genererRecommandation(soldeBudget: number, nbTachesRestantes: number): string {
  if (soldeBudget < 50) {
    return "Ton budget est serré ce mois-ci. Essaie de limiter les dépenses en loisirs.";
  }

  if (nbTachesRestantes >= 3) {
    return `Tu as ${nbTachesRestantes} tâches en attente. Priorise celles à rendre bientôt.`;
  }

  if (nbTachesRestantes === 0) {
    return "Toutes tes tâches sont à jour, bien joué ! Profite pour prendre de l'avance.";
  }

  return "Ta semaine est plutôt équilibrée. Continue comme ça !";
}

export default function Dashboard() {
  const soldeBudget = 30;
  const nbTachesRestantes = 3;
  const recommandation = genererRecommandation(soldeBudget, nbTachesRestantes);

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Bienvenue dans ÉtudiPlan
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tâches à faire"
          value="5"
          icon={ListTodo}
          color="blue"
        />
        <StatCard
          title="Prochain cours"
          value="14h00"
          icon={CalendarCheck}
          color="green"
        />
        <StatCard
          title="Budget restant"
          value="230 €"
          icon={Wallet}
          color="orange"
        />
        <StatCard
          title="Moyenne générale"
          value="14.2 / 20"
          icon={GraduationCap}
          color="purple"
        />
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Tâches du jour
        </h2>

        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle2 size={20} className="text-green-500" />
            <span className="line-through text-gray-400">Réviser le chapitre 3 de maths</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Circle size={20} className="text-gray-300" />
            <span>Rendre le devoir d'anglais</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Circle size={20} className="text-gray-300" />
            <span>Préparer la présentation d'économie</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Circle size={20} className="text-gray-300" />
            <span>Acheter des fournitures pour le TP</span>
          </li>
        </ul>
      </div>
    <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <Lightbulb size={22} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Conseil du jour</h3>
          <p className="text-gray-600 text-sm">{recommandation}</p>
        </div>
      </div>


    </AppLayout>
  );
}