"use client";

import StatCard from "@/app/dashboard/statCard";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

type Transaction = {
  id: number;
  libelle: string;
  categorie: string;
  montant: number;
  type: "REVENU" | "DEPENSE";
  date: string;
};

type TransactionApi = Omit<Transaction, "date"> & {
  date: string;
};

const couleursCategories: Record<string, string> = {
  Logement: "#3b82f6",
  Nourriture: "#f97316",
  Transport: "#a855f7",
  Loisirs: "#10b981",
  Autre: "#6b7280",
};

export default function ClientBudget({ transactions: initial }: { transactions: Transaction[] }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initial || []);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = (await res.json()) as TransactionApi[];
    setTransactions(data.map((t) => ({ ...t, date: new Date(t.date).toISOString() })));
  };

  const createTransaction = async (payload: Partial<Transaction>) => {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchTransactions();
  };

  const updateTransaction = async (payload: Partial<Transaction> & { id: number }) => {
    await fetch("/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchTransactions();
  };

  const deleteTransaction = async (id: number) => {
    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchTransactions();
  };

  const revenus = transactions
    .filter((t) => t.type === "REVENU")
    .reduce((total, t) => total + t.montant, 0);

  const depenses = transactions
    .filter((t) => t.type === "DEPENSE")
    .reduce((total, t) => total + t.montant, 0);

  const solde = revenus - depenses;

  const depensesParCategorie = transactions
    .filter((t) => t.type === "DEPENSE")
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
    <>
      <div>
        <h3 className="font-semibold text-foreground mb-2">Ajouter / modifier une transaction</h3>
        <TransactionForm
          key={editing?.id ?? "new"}
          initial={editing}
          onCreate={createTransaction}
          onUpdate={updateTransaction}
          onCancel={() => setEditing(null)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenus" value={`${revenus} €`} icon={TrendingUp} color="green" />
        <StatCard title="Dépenses" value={`${depenses} €`} icon={TrendingDown} color="orange" />
        <StatCard title="Solde restant" value={`${solde} €`} icon={Wallet} color="blue" />
      </div>

      {transactions.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-card-border bg-muted p-6 text-center text-muted-foreground">
          Aucune transaction pour le moment. Ajoute-en avec le formulaire ci-dessus.
        </div>
      ) : (
        <>
          <div className="mt-8 bg-card rounded-2xl border border-card-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Dernières transactions</h2>

            <ul className="divide-y divide-card-border">
              {transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{t.libelle}</p>
                    <p className="text-sm text-muted-foreground">{t.categorie} · {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${t.type === "REVENU" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {t.type === "REVENU" ? "+" : "-"}{t.montant} €
                    </span>
                    <button className="rounded-2xl bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-card-border transition-colors" onClick={() => setEditing(t)}>Éditer</button>
                    <button className="rounded-2xl bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors" onClick={() => deleteTransaction(t.id)}>Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {depensesParCategorie.length > 0 && (
            <div className="mt-8 bg-card rounded-2xl border border-card-border shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Répartition des dépenses</h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={depensesParCategorie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name} (${entry.value}€)`}>
                      {depensesParCategorie.map((entry) => (
                        <Cell key={entry.name} fill={couleursCategories[entry.name] || "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function TransactionForm({
  initial,
  onCreate,
  onUpdate,
  onCancel,
}: {
  initial?: Transaction | null;
  onCreate: (p: Partial<Transaction>) => Promise<void>;
  onUpdate: (p: Partial<Transaction> & { id: number }) => Promise<void>;
  onCancel: () => void;
}) {
  const [id, setId] = useState<number | null>(initial?.id ?? null);
  const [libelle, setLibelle] = useState(initial?.libelle ?? "");
  const [categorie, setCategorie] = useState(initial?.categorie ?? "Autre");
  const [montant, setMontant] = useState(initial ? String(initial.montant) : "");
  const [type, setType] = useState<"REVENU" | "DEPENSE">(initial?.type ?? "DEPENSE");
  const [date, setDate] = useState<string>(
    initial ? new Date(initial.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMontant = Number(montant);
    if (!libelle.trim() || !montant || parsedMontant <= 0) return;

    setLoading(true);
    try {
      const payload: Partial<Transaction> = {
        libelle,
        categorie,
        montant: parsedMontant,
        type,
        date: new Date(date).toISOString(),
      };

      if (id) {
        await onUpdate({ ...payload, id });
      } else {
        await onCreate(payload);
      }

      setId(null);
      setLibelle("");
      setCategorie("Autre");
      setMontant("");
      setType("DEPENSE");
      setDate(new Date().toISOString().slice(0, 16));
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-card-border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <label htmlFor="libelle" className="sr-only">Libellé</label>
        <input
          id="libelle"
          placeholder="Libellé"
          className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="categorie" className="sr-only">Catégorie</label>
          <select
            id="categorie"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option>Logement</option>
            <option>Nourriture</option>
            <option>Transport</option>
            <option>Loisirs</option>
            <option>Autre</option>
          </select>
        </div>

        <div>
          <label htmlFor="montant" className="sr-only">Montant</label>
          <input
            id="montant"
            type="number"
            step="0.01"
            min="0"
            placeholder="Montant"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="transaction-type" className="sr-only">Type</label>
          <select
            id="transaction-type"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={type}
            onChange={(e) => setType(e.target.value as "REVENU" | "DEPENSE")}
          >
            <option value="REVENU">Revenu</option>
            <option value="DEPENSE">Dépense</option>
          </select>
        </div>

        <div>
          <label htmlFor="transaction-date" className="sr-only">Date</label>
          <input
            id="transaction-date"
            type="datetime-local"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "En cours..." : id ? "Modifier" : "Ajouter"}
        </button>
        {id && (
          <button
            type="button"
            onClick={() => { setId(null); setLibelle(""); setCategorie("Autre"); setMontant(""); setType("DEPENSE"); setDate(new Date().toISOString().slice(0, 16)); onCancel(); }}
            className="rounded-2xl border border-card-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
