import { Clock, MapPin, Pencil, Trash2 } from "lucide-react";

export type Event = {
  id: number;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  room?: string | null;
  color?: "BLUE" | "GREEN" | "ORANGE" | "PURPLE" | "RED";
  type: "COURSE" | "EXAM";
  repeat?: "NONE" | "WEEKLY";
  repeatEndDate?: string | Date | null;
};

const couleurStyles = {
  BLUE: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
  GREEN: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
  ORANGE: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
  PURPLE: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
  RED: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
};

export default function CourseBlock({ event, onEdit, onDelete }: {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
}) {
  const heureDebut = new Date(event.startDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const heureFin = new Date(event.endDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const colorClass = couleurStyles[event.color ?? "BLUE"];

  return (
    <div className={`group relative rounded-xl border px-3 py-2 ${colorClass}`}>
      {(onEdit || onDelete) && (
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(event); }}
              className="rounded-full bg-white/80 dark:bg-black/50 p-1 text-muted-foreground hover:text-foreground shadow-sm"
              aria-label="Modifier"
            >
              <Pencil size={12} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
              className="rounded-full bg-white/80 dark:bg-black/50 p-1 text-destructive hover:text-destructive/80 shadow-sm"
              aria-label="Supprimer"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}

      <p className="font-semibold text-sm">{event.title}</p>

      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
        <Clock size={12} />
        <span>{heureDebut} - {heureFin}</span>
      </div>

      {event.room && (
        <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
          <MapPin size={12} />
          <span>{event.room}</span>
        </div>
      )}

      {event.repeat === "WEEKLY" && (
        <div className="text-[10px] mt-1 opacity-60">
          Hebdomadaire{event.repeatEndDate ? ` jusqu'au ${new Date(event.repeatEndDate).toLocaleDateString("fr-FR")}` : ""}
        </div>
      )}
    </div>
  );
}
