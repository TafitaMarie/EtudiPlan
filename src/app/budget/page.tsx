"use client";
import AppLayout from "@/app/components/layout/appLayout";
import StatCard from "@/app/dashboard/statCard";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Transaction = {
  id: number;
  libelle: string;
  categorie: "Logement" | "Nourriture" | "Transport" | "Loisirs" | "Autre";
  montant: number;
  type: "revenu" | "depense";
  date: string;
};

const transactions: Transaction[] = [
  { id: 1, libelle: "Bourse mensuelle", categorie: "Autre", montant: 450, type: "revenu", date: "01 juil." },
  { id: 2, libelle: "Loyer", categorie: "Logement", montant: 300, type: "depense", date: "02 juil." },
  { id: 3, libelle: "Courses", categorie: "Nourriture", montant: 85, type: "depense", date: "05 juil." },
  { id: 4, libelle: "Ticket de bus", categorie: "Transport", montant: 20, type: "depense", date: "06 juil." },
  { id: 5, libelle: "Cinéma", categorie: "Loisirs", montant: 15, type: "depense", date: "08 juil." },
];

const couleursCategories: Record<string, string> = {
  Logement: "#3b82f6",
  Nourriture: "#f97316",
  Transport: "#a855f7",
  Loisirs: "#10b981",
  Autre: "#6b7280",
};

export default function Budget() {
  const revenus = transactions
    .filter((t) => t.type === "revenu")
    .reduce((total, t) => total + t.montant, 0);

  const depenses = transactions
    .filter((t) => t.type === "depense")
    .reduce((total, t) => total + t.montant, 0);

  const solde = revenus - depenses;

  const depensesParCategorie = transactions
    .filter((t) => t.type === "depense")
    .reduce((acc: { name: string; value: number }[], t) => {
      const existante = acc.find((item) => item.name === t.categorie);
      if (existante) {
        existante.value += t.montant;
      } else {
        acc.push({ name: t.categorie, value: t.montant });
      }
      return acc;
    }, []);

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold">
        Budget étudiant
      </h1>

      <p className="mt-2 text-gray-600">
        Suis tes revenus et dépenses du mois
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Revenus"
          value={`${revenus} €`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Dépenses"
          value={`${depenses} €`}
          icon={TrendingDown}
          color="orange"
        />
        <StatCard
          title="Solde restant"
          value={`${solde} €`}
          icon={Wallet}
          color="blue"
        />
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Dernières transactions
        </h2>

        <ul className="divide-y divide-gray-100">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="font-medium text-gray-800">{t.libelle}</p>
                <p className="text-sm text-gray-400">{t.categorie} · {t.date}</p>
              </div>
              <span
                className={`font-semibold ${
                  t.type === "revenu" ? "text-green-600" : "text-red-500"
                }`}
              >
                {t.type === "revenu" ? "+" : "-"}{t.montant} €
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Répartition des dépenses
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={depensesParCategorie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.name} (${entry.value}€)`}
              >
                {depensesParCategorie.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={couleursCategories[entry.name] || "#6b7280"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </AppLayout>
  );
}