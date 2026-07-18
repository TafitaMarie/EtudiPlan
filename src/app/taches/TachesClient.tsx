"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, useState, useTransition, useCallback } from "react";
import { Circle, CheckCircle2, Plus, Trash2, Search, X, GripVertical, Pencil } from "lucide-react";
import { useToast } from "@/app/contexts/toastProvider";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  ajouterTacheAction,
  modifierTacheAction,
  toggleTacheAction,
  supprimerTacheAction,
  reordonnerTachesAction,
} from "./actions";

type Tache = {
  id: number;
  ordre: number;
  titre: string;
  matiere: string | null;
  dateLimite: string | null;
  priorite: "BASSE" | "MOYENNE" | "HAUTE";
  statut: "A_FAIRE" | "EN_COURS" | "TERMINEE";
  faite: boolean;
};

const badgeStyles: Record<string, string> = {
  BASSE: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  MOYENNE: "bg-amber-200 dark:bg-yellow-900 text-amber-800 dark:text-yellow-300",
  HAUTE: "bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-300",
  A_FAIRE: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  EN_COURS: "bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  TERMINEE: "bg-emerald-200 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
};

function SortableRow({ tache, onEdit, onToggle, onSupprimer, loading }: {
  tache: Tache;
  onEdit: (tache: Tache) => void;
  onToggle: (id: number, faite: boolean) => void;
  onSupprimer: (id: number) => void;
  loading: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tache.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.tr
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, padding: 0 }}
      transition={{ duration: 0.2 }}
      className={`transition hover:bg-muted/50 ${isDragging ? "bg-primary/5 shadow-lg rounded-xl" : ""}`}
    >
      <td className="px-2 py-4 w-10">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Déplacer"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-foreground">{tache.titre}</div>
      </td>
      <td className="px-6 py-4 text-muted-foreground">{tache.matiere || "—"}</td>
      <td className="px-6 py-4 text-muted-foreground">{tache.dateLimite ? new Date(tache.dateLimite).toLocaleDateString("fr-FR") : "—"}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[tache.priorite]}`}>
          {tache.priorite === "MOYENNE" ? "Moyenne" : tache.priorite === "HAUTE" ? "Haute" : "Basse"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[tache.statut]}`}>
          {tache.statut === "A_FAIRE" ? "À faire" : tache.statut === "EN_COURS" ? "En cours" : "Terminée"}
        </span>
      </td>
      <td className="px-6 py-4">
        {tache.faite ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : (
          <Circle size={20} className="text-muted-foreground" />
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(tache)}
            className="rounded-2xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-card-border transition-colors"
          >
            <Pencil size={14} className="inline" /> Modifier
          </button>
          <button
            type="button"
            onClick={() => onToggle(tache.id, tache.faite)}
            disabled={loading}
            className="rounded-2xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-card-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : tache.faite ? "Annuler" : "Terminer"}
          </button>
          <button
            type="button"
            onClick={() => onSupprimer(tache.id)}
            disabled={loading}
            className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : <><Trash2 size={14} className="inline" /> Supprimer</>}
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

export default function TachesClient({ taches }: { taches: Tache[] }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [titre, setTitre] = useState("");
  const [matiere, setMatiere] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [priorite, setPriorite] = useState<"BASSE" | "MOYENNE" | "HAUTE">("MOYENNE");
  const [statut, setStatut] = useState<"A_FAIRE" | "EN_COURS" | "TERMINEE">("A_FAIRE");

  const [editingTache, setEditingTache] = useState<Tache | null>(null);
  const [loadingRows, setLoadingRows] = useState<Set<number>>(new Set());

  const [filterStatut, setFilterStatut] = useState<string>("TOUS");
  const [filterPriorite, setFilterPriorite] = useState<string>("TOUS");
  const [searchQuery, setSearchQuery] = useState("");

  async function handleAjouter(e: React.FormEvent) {
    e.preventDefault();
    if (titre.trim() === "") return;

    startTransition(async () => {
      try {
        if (editingTache) {
          await modifierTacheAction(editingTache.id, titre, matiere || null, dateLimite || null, priorite, statut);
          addToast("Tâche modifiée", "success");
        } else {
          await ajouterTacheAction(titre, matiere || null, dateLimite || null, priorite, statut);
          addToast("Tâche ajoutée", "success");
        }
        setTitre("");
        setMatiere("");
        setDateLimite("");
        setPriorite("MOYENNE");
        setStatut("A_FAIRE");
        setEditingTache(null);
        router.refresh();
      } catch (e) {
        addToast(e instanceof Error ? e.message : "Erreur lors de l'enregistrement", "error");
      }
    });
  }

  function handleEdit(tache: Tache) {
    setTitre(tache.titre);
    setMatiere(tache.matiere ?? "");
    setDateLimite(tache.dateLimite ? tache.dateLimite.slice(0, 10) : "");
    setPriorite(tache.priorite);
    setStatut(tache.statut);
    setEditingTache(tache);
  }

  async function handleToggle(id: number, faite: boolean) {
    setLoadingRows((prev) => new Set(prev).add(id));
    startTransition(async () => {
      try {
        await toggleTacheAction(id, faite);
        addToast(faite ? "Tâche marquée comme non terminée" : "Tâche terminée", "success");
        router.refresh();
      } catch (e) {
        addToast(e instanceof Error ? e.message : "Erreur lors du changement de statut", "error");
      } finally {
        setLoadingRows((prev) => { const next = new Set(prev); next.delete(id); return next; });
      }
    });
  }

  async function handleSupprimer(id: number) {
    setLoadingRows((prev) => new Set(prev).add(id));
    startTransition(async () => {
      try {
        await supprimerTacheAction(id);
        addToast("Tâche supprimée", "success");
        router.refresh();
      } catch (e) {
        addToast(e instanceof Error ? e.message : "Erreur lors de la suppression", "error");
      } finally {
        setLoadingRows((prev) => { const next = new Set(prev); next.delete(id); return next; });
      }
    });
  }

  const filtered = taches.filter((t) => {
    if (filterStatut !== "TOUS" && t.statut !== filterStatut) return false;
    if (filterPriorite !== "TOUS" && t.priorite !== filterPriorite) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitre = t.titre.toLowerCase().includes(q);
      const matchMatiere = t.matiere?.toLowerCase().includes(q) ?? false;
      if (!matchTitre && !matchMatiere) return false;
    }
    return true;
  });

  const hasActiveFilters = filterStatut !== "TOUS" || filterPriorite !== "TOUS" || searchQuery !== "";

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((t) => t.id === active.id);
    const newIndex = filtered.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...filtered];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    startTransition(async () => {
      try {
        await reordonnerTachesAction(reordered.map((t) => t.id));
        router.refresh();
      } catch (e) {
        addToast(e instanceof Error ? e.message : "Erreur lors du réordonnancement", "error");
      }
    });
  }, [filtered, router, addToast]);

  function resetFilters() {
    setFilterStatut("TOUS");
    setFilterPriorite("TOUS");
    setSearchQuery("");
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleAjouter} className="rounded-[2rem] border border-card-border bg-card p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            {editingTache ? <><Plus size={20} /> Modifier la tâche</> : <><Plus size={20} /> Ajouter une tâche</>}
          </h2>
          {editingTache && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Modification de : <strong>{editingTache.titre}</strong></p>
              <button
                type="button"
                onClick={() => { setEditingTache(null); setTitre(""); setMatiere(""); setDateLimite(""); setPriorite("MOYENNE"); setStatut("A_FAIRE"); }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Annuler
              </button>
            </div>
          )}

          <div>
            <label htmlFor="titre" className="sr-only">Titre de la tâche</label>
            <input
              id="titre"
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre de la tâche"
              className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="matiere" className="sr-only">Matière</label>
              <input
                id="matiere"
                type="text"
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
                placeholder="Matière (optionnel)"
                className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="dateLimite" className="sr-only">Date limite</label>
              <input
                id="dateLimite"
                type="date"
                value={dateLimite}
                onChange={(e) => setDateLimite(e.target.value)}
                className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priorite" className="sr-only">Priorité</label>
              <select
                id="priorite"
                value={priorite}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriorite(e.target.value as "BASSE" | "MOYENNE" | "HAUTE")}
                className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="MOYENNE">Priorité moyenne</option>
                <option value="HAUTE">Haute priorité</option>
                <option value="BASSE">Basse priorité</option>
              </select>
            </div>
            <div>
              <label htmlFor="statut-form" className="sr-only">Statut</label>
              <select
                id="statut-form"
                value={statut}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatut(e.target.value as "A_FAIRE" | "EN_COURS" | "TERMINEE")}
                className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="A_FAIRE">À faire</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINEE">Terminée</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Enregistrement..." : editingTache ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-[2rem] bg-card border border-card-border shadow-sm"
      >
        <div className="p-4 border-b border-card-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full rounded-2xl border border-card-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="rounded-2xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="A_FAIRE">À faire</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
            </select>
            <select
              value={filterPriorite}
              onChange={(e) => setFilterPriorite(e.target.value)}
              className="rounded-2xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="TOUS">Toutes les priorités</option>
              <option value="HAUTE">Haute</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="BASSE">Basse</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-card-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={14} /> Réinitialiser
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            {hasActiveFilters ? "Aucune tâche ne correspond aux filtres." : "Aucune tâche pour le moment."}
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-card-border text-sm">
                <thead className="bg-muted text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-2 py-4 w-10"></th>
                    <th className="px-6 py-4">Tâche</th>
                    <th className="px-6 py-4">Matière</th>
                    <th className="px-6 py-4">Date limite</th>
                    <th className="px-6 py-4">Priorité</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Réalisée</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <SortableContext items={filtered.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <tbody className="divide-y divide-card-border">
                    <AnimatePresence>
                      {filtered.map((tache) => (
                        <SortableRow
                          key={tache.id}
                          tache={tache}
                          onEdit={handleEdit}
                          onToggle={handleToggle}
                          onSupprimer={handleSupprimer}
                          loading={loadingRows.has(tache.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </SortableContext>
              </table>
            </div>
          </DndContext>
        )}
      </motion.div>
    </div>
  );
}
