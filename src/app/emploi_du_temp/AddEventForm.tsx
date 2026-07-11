"use client";

import { type ChangeEvent, useState } from "react";
import { createEvent } from "./actions";

type Props = {
  onAdded: () => void;
};

export default function AddEventForm({ onAdded }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"COURSE" | "EXAM">("COURSE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [room, setRoom] = useState("");
  const [repeat, setRepeat] = useState<"NONE" | "WEEKLY">("NONE");
  const [loading, setLoading] = useState(false);

  function today() {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    setLoading(true);
    try {
      await createEvent({
        title,
        type,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        room,
        color: "BLUE",
        repeat: repeat === "WEEKLY" ? "WEEKLY" : undefined,
      });
      setTitle("");
      setStartDate("");
      setEndDate("");
      setRoom("");
      setRepeat("NONE");
      onAdded();
    } catch {
      // silently fail for now
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-card-border bg-card p-6 space-y-4 shadow-sm">
      <h3 className="font-semibold text-foreground">Ajouter un événement</h3>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
}
