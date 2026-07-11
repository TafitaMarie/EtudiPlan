import { getEvents } from "./actions";
import EmploiDuTempsClient from "./EmploiDuTempsClient";
import { CalendarDays } from "lucide-react";
import AppLayout from "@/app/components/layout/appLayout";

export default async function EmploiDuTemps() {
  const events = await getEvents();

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <CalendarDays className="text-primary" size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emploi du temps</h1>
          <p className="text-muted-foreground">Organisation de ta semaine et de tes examens</p>
        </div>
      </div>

      <EmploiDuTempsClient events={events} />
    </AppLayout>
  );
}
