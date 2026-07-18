"use client";

import AddEventForm from "./AddEventForm";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import DayColumn from "./dayColumn";
import CourseBlock, { Event } from "./courseBlock";
import { ChevronLeft, ChevronRight, Calendar, Grid3X3, CalendarDays, Plus, X } from "lucide-react";
import { deleteEvent } from "./actions";

type Props = {
  events: Event[];
};

const LOCALE = "fr-FR";

const monthColorMap: Record<string, string> = {
  BLUE: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  GREEN: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  ORANGE: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  PURPLE: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  RED: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

export default function EmploiDuTempsClient({ events }: Props) {
  const [viewMode, setViewMode] = useState<"DAY" | "WEEK" | "MONTH">("WEEK");
  const [showAdd, setShowAdd] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const router = useRouter();
  const refresh = () => router.refresh();

  async function handleDelete(id: number) {
    await deleteEvent(id);
    refresh();
  }

  function handleEdit(event: Event) {
    setEditingEvent(event);
    setShowAdd(true);
  }

  function handleFormDone() {
    setShowAdd(false);
    setEditingEvent(null);
    refresh();
  }

  const startOfWeek = useMemo(() => getStartOfWeek(selectedDate), [selectedDate]);

  const endOfWeek = useMemo(() => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + 6);
    return d;
  }, [startOfWeek]);

  const semaine = `Semaine du ${startOfWeek.toLocaleDateString(LOCALE, { day: "2-digit", month: "short" })} - ${endOfWeek.toLocaleDateString(LOCALE, { day: "2-digit", month: "short", year: "numeric" })}`;

  const days = useMemo(() => {
    const result: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      result.push(d);
    }
    return result;
  }, [startOfWeek]);

  const eventsForDay = (day: Date) =>
    events.filter((e) => {
      const eventDate = new Date(e.startDate);
      if (eventDate.toDateString() === day.toDateString()) return true;
      if (e.repeat === "WEEKLY" && eventDate.getDay() === day.getDay() && eventDate <= day) {
        if (e.repeatEndDate && day > new Date(e.repeatEndDate)) return false;
        return true;
      }
      return false;
    });

  const buttonStyle = (mode: string) =>
    `px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
      viewMode === mode
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground bg-card border border-card-border"
    }`;

  return (
    <div className="space-y-4">
      {/* Top bar: nav + buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Navigation arrows + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (viewMode === "MONTH") {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
              } else {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - (viewMode === "DAY" ? 1 : 7)));
              }
            }}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="font-semibold text-foreground text-sm">
            {viewMode === "WEEK" && semaine}
            {viewMode === "DAY" && selectedDate.toLocaleDateString(LOCALE, { weekday: "long", day: "numeric", month: "long" })}
            {viewMode === "MONTH" && selectedDate.toLocaleDateString(LOCALE, { month: "long", year: "numeric" })}
          </div>

          <button
            onClick={() => {
              if (viewMode === "MONTH") {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
              } else {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + (viewMode === "DAY" ? 1 : 7)));
              }
            }}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            aria-label="Suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View toggle + Ajouter */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 bg-muted p-1 rounded-xl border border-card-border">
            <button onClick={() => setViewMode("DAY")} className={buttonStyle("DAY")}>
              <Calendar size={16} className="inline mr-1.5" />
              Jour
            </button>
            <button onClick={() => setViewMode("WEEK")} className={buttonStyle("WEEK")}>
              <Grid3X3 size={16} className="inline mr-1.5" />
              Semaine
            </button>
            <button onClick={() => setViewMode("MONTH")} className={buttonStyle("MONTH")}>
              <CalendarDays size={16} className="inline mr-1.5" />
              Mois
            </button>
          </div>
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {showAdd ? <X size={16} /> : <Plus size={16} />}
            {showAdd ? "Fermer" : "Ajouter"}
          </button>
        </div>
      </div>

      {showAdd && (
        <AddEventForm
          event={editingEvent}
          onAdded={handleFormDone}
          onCancelled={() => { setShowAdd(false); setEditingEvent(null); }}
        />
      )}

      {/* WEEK VIEW */}
      {viewMode === "WEEK" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
          {days.map((d) => (
            <DayColumn
              key={d.toDateString()}
              nom={
                ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][
                  d.getDay() === 0 ? 6 : d.getDay() - 1
                ]
              }
              events={eventsForDay(d)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === "DAY" && (() => {
        const dayEvents = eventsForDay(selectedDate)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        return (
          <>
            {dayEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-card-border bg-muted p-8 text-center text-muted-foreground">
                Aucun événement ce jour
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {dayEvents.map((event) => (
                  <CourseBlock key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        );
      })()}

      {/* MONTH VIEW */}
      {viewMode === "MONTH" && (() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7;
        const daysInMonth: (Date | null)[] = [];

        for (let i = 0; i < startOffset; i++) daysInMonth.push(null);
        for (let i = 1; i <= lastDay.getDate(); i++) daysInMonth.push(new Date(year, month, i));

        return (
          <div className="bg-card p-4 sm:p-6 rounded-2xl border border-card-border shadow-sm">
            <div className="grid grid-cols-7 text-center font-semibold text-muted-foreground mb-2 text-sm">
              <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {daysInMonth.map((date, i) => (
                <div key={i} className="min-h-20 sm:h-24 border border-card-border rounded-lg p-1 text-xs bg-background">
                  {date && (
                    <>
                      <div className="font-semibold text-foreground mb-1">{date.getDate()}</div>
                      <div className="space-y-1">
                        {eventsForDay(date).slice(0, 3)
                          .map((e) => {
                            const colorClass = monthColorMap[e.color ?? "BLUE"];
                            return (
                              <div key={e.id} className={`rounded px-1 truncate text-[10px] leading-5 font-medium ${colorClass}`}>
                                {e.title}
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
