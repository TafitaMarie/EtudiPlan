import AppLayout from "@/app/components/layout/appLayout";
import { getTransactions } from "./actions";
import ClientBudget from "./ClientBudget";

export default async function Budget() {
  const transactions = await getTransactions();

  const serialized = transactions.map((t) => ({
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
