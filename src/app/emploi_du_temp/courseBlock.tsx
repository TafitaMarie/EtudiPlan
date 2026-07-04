import { Clock, MapPin } from "lucide-react";

export type Cours = {
  id: number;
  matiere: string;
  heureDebut: string;
  heureFin: string;
  salle: string;
  couleur: "blue" | "green" | "orange" | "purple"| "red";
};

const couleurStyles = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  green: "bg-green-50 border-green-200 text-green-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
};

export default function CourseBlock({ cours }: { cours: Cours }) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${couleurStyles[cours.couleur]}`}>
      <p className="font-semibold text-sm">{cours.matiere}</p>
      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
        <Clock size={12} />
        <span>{cours.heureDebut} - {cours.heureFin}</span>
      </div>
      <div className="flex items-center gap-1 text-xs mt-0.5 opacity-80">
        <MapPin size={12} />
        <span>{cours.salle}</span>
      </div>
    </div>
  );
}