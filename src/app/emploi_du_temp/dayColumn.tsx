import CourseBlock, { Cours } from "./courseBlock";

type DayColumnProps = {
  nom: string;
  cours: Cours[];
};

export default function DayColumn({ nom, cours }: DayColumnProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h2 className="font-bold text-gray-900 mb-3">{nom}</h2>

      {cours.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Aucun cours</p>
      ) : (
        <div className="space-y-2">
          {cours.map((c) => (
            <CourseBlock key={c.id} cours={c} />
          ))}
        </div>
      )}
    </div>
  );
}