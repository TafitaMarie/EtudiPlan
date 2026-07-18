import CourseBlock, { Event } from "./courseBlock";

type DayColumnProps = {
  nom: string;
  events: Event[];
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
};

export default function DayColumn({
  nom,
  events,
  onEdit,
  onDelete,
}: DayColumnProps) {
  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
      <h2 className="font-bold text-foreground mb-3">{nom}</h2>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Aucun événement</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <CourseBlock key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
