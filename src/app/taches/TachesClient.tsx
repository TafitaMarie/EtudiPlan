"use client";

import { useState } from "react";
import { Circle, CheckCircle2, Trash2 } from "lucide-react";
import {
  ajouterTacheAction,
  toggleTacheAction,
  supprimerTacheAction,
} from "./actions";

type Tache = {
  id: number;
  titre: string;
  faite: boolean;
};

export default function TachesClient({ taches }: { taches: Tache[] }) {
  const [nouvelleTache, setNouvelleTache] = useState("");

  async function handleAjouter() {
    if (nouvelleTache.trim() === "") return;
    await ajouterTacheAction(nouvelleTache);
    setNouvelleTache("");
  }

  return (
    <>
      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={nouvelleTache}
          onChange={(e) => setNouvelleTache(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
          placeholder="Nouvelle tâche..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAjouter}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Ajouter
        </button>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ul className="space-y-3">
          {taches.map((tache) => (
            <li
              key={tache.id}
              onClick={() => toggleTacheAction(tache.id, tache.faite)}
              className="flex items-center gap-3 text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
            >
              {tache.faite ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <Circle size={20} className="text-gray-300" />
              )}
              <span className={tache.faite ? "line-through text-gray-400 flex-1" : "flex-1"}>
                {tache.titre}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  supprimerTacheAction(tache.id);
                }}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}