import { Clock, MapPin } from "lucide-react";

export type Event = {
  id: number;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  room?: string | null;
  color?: "BLUE" | "GREEN" | "ORANGE" | "PURPLE" | "RED";
  type: "COURSE" | "EXAM";
  repeat?: "NONE" | "WEEKLY";
};

const couleurStyles = {
  BLUE: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
  GREEN: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
  ORANGE: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
  PURPLE: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
  RED: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
};

export default function CourseBlock({ event }: { event: Event }) {
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
    <div className={`rounded-xl border px-3 py-2 ${colorClass}`}>
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
    </div>
  );
}
