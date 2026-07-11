import AppLayout from "@/app/components/layout/appLayout";
import { getTransactions } from "./actions";
import ClientBudget from "./ClientBudget";

type RawTransaction = {
  id: number;
  userId: number;
  libelle: string;
  categorie: string;
  montant: number;
  type: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default async function Budget() {
  const transactions = await getTransactions();

  const serialized = (transactions as RawTransaction[]).map((t) => ({
    ...t,
    type: t.type as "REVENU" | "DEPENSE",
    date: t.date.toISOString(),
  }));

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-foreground">Budget étudiant</h1>
      <p className="mt-2 text-muted-foreground">Suis tes revenus et dépenses du mois.</p>
      <div className="mt-6">
        <ClientBudget transactions={serialized} />
      </div>
    </AppLayout>
  );
}
