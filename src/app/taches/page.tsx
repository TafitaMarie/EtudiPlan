import AppLayout from "@/app/components/layout/appLayout";
import { getTaches } from "./actions";
import TachesClient from "./TachesClient";

export default async function Taches() {
  const taches = await getTaches();

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold">
        Gestion des tâches
      </h1>

      <p className="mt-2 text-gray-600">
        Organise et suis l'avancement de tes tâches
      </p>

      <TachesClient taches={taches} />

    </AppLayout>
  );
}