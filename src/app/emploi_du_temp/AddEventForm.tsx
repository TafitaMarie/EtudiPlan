"use client";

import { type ChangeEvent, useState, useEffect } from "react";
import { createEvent, updateEvent } from "./actions";
import { Event } from "./courseBlock";
import { useToast } from "@/app/contexts/toastProvider";

type Props = {
  onAdded: () => void;
  onCancelled?: () => void;
  event?: Event | null;
};

function toDatetimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function AddEventForm({ onAdded, onCancelled, event: editEvent }: Props) {
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"COURSE" | "EXAM">("COURSE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [room, setRoom] = useState("");
  const [repeat, setRepeat] = useState<"NONE" | "WEEKLY">("NONE");
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!editEvent;

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setType(editEvent.type);
      setStartDate(toDatetimeLocal(new Date(editEvent.startDate)));
      setEndDate(editEvent.endDate ? toDatetimeLocal(new Date(editEvent.endDate)) : "");
      setRoom(editEvent.room ?? "");
      setRepeat(editEvent.repeat ?? "NONE");
      setRepeatEndDate(editEvent.repeatEndDate ? toDatetimeLocal(new Date(editEvent.repeatEndDate)).slice(0, 16) : "");
    }
  }, [editEvent]);

  function today() {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    setLoading(true);
    try {
      const payload = {
        title,
        type,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        room: room || undefined,
        color: "BLUE" as const,
        repeat: repeat === "WEEKLY" ? "WEEKLY" as const : undefined,
        repeatEndDate: repeat === "WEEKLY" && repeatEndDate ? new Date(repeatEndDate) : null,
      };

      if (isEditing) {
        await updateEvent(editEvent.id, payload);
      } else {
        await createEvent(payload);
      }

      setTitle("");
      setStartDate("");
      setEndDate("");
      setRoom("");
      setRepeat("NONE");
      setRepeatEndDate("");
      onAdded();
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-card-border bg-card p-6 space-y-4 shadow-sm">
      <h3 className="font-semibold text-foreground">
        {isEditing ? "Modifier l'événement" : "Ajouter un événement"}
      </h3>

      <div>
        <label htmlFor="title" className="sr-only">Titre</label>
        <input
          id="title"
          placeholder="Titre"
          className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="event-type" className="sr-only">Type</label>
        <select
          id="event-type"
          className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value as "COURSE" | "EXAM")}
        >
          <option value="COURSE">Cours</option>
          <option value="EXAM">Examen</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start-date" className="sr-only">Début</label>
          <input
            id="start-date"
            type="datetime-local"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today()}
            required
          />
        </div>
        <div>
          <label htmlFor="end-date" className="sr-only">Fin</label>
          <input
            id="end-date"
            type="datetime-local"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today()}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="room" className="sr-only">Salle</label>
          <input
            id="room"
            placeholder="Salle (optionnel)"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="event-repeat" className="sr-only">Répétition</label>
          <select
            id="event-repeat"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={repeat}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setRepeat(e.target.value as "NONE" | "WEEKLY")}
          >
            <option value="NONE">Une seule fois</option>
            <option value="WEEKLY">Chaque semaine</option>
          </select>
        </div>
      </div>

      {repeat === "WEEKLY" && (
        <div>
          <label htmlFor="repeat-end-date" className="sr-only">Répéter jusqu'au</label>
          <input
            id="repeat-end-date"
            type="date"
            className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={repeatEndDate}
            onChange={(e) => setRepeatEndDate(e.target.value)}
            placeholder="Répéter jusqu'au (optionnel)"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : isEditing ? "Enregistrer" : "Ajouter"}
        </button>
        {isEditing && onCancelled && (
          <button
            type="button"
            onClick={onCancelled}
            className="rounded-2xl border border-card-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
