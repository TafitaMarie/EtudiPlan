"use client";

import { useState } from "react";
import AppLayout from "@/app/components/layout/appLayout";
import DayColumn from "./dayColumn";
import { Cours } from "./courseBlock";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Jour = {
  nom: string;
  cours: Cours[];
};

const planning: Jour[] = [
  {
    nom: "Lundi",
    cours: [
      { id: 1, matiere: "Mathématiques", heureDebut: "08h00", heureFin: "10h00", salle: "A102", couleur: "blue" },
      { id: 2, matiere: "Anglais", heureDebut: "10h15", heureFin: "12h00", salle: "B204", couleur: "green" },
    ],
  },
  {
    nom: "Mardi",
    cours: [
      { id: 3, matiere: "Économie", heureDebut: "09h00", heureFin: "11h00", salle: "C301", couleur: "orange" },
    ],
  },
  {
    nom: "Mercredi",
    cours: [],
  },
  {
    nom: "Jeudi",
    cours: [
      { id: 4, matiere: "Informatique", heureDebut: "14h00", heureFin: "17h00", salle: "Labo 2", couleur: "purple" },
    ],
  },
  {
    nom: "Vendredi",
    cours: [
      { id: 5, matiere: "Mathématiques", heureDebut: "08h00", heureFin: "10h00", salle: "A102", couleur: "blue" },
      { id: 6, matiere: "Économie", heureDebut: "10h15", heureFin: "12h00", salle: "C301", couleur: "orange" },
    ],
  },
   {
    nom: "Samedi",
    cours: [
      {id:9, matiere: "Sports", heureDebut: "09h00", heureFin: "11h00", salle: "Stade", couleur: "red"}
    ],
  },
];

export default function EmploiDuTemps() {
  const [semaine] = useState("Semaine du 1 - 7 juillet");

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold">
        Emploi du temps
      </h1>

      <p className="mt-2 text-gray-600">
        Ta semaine de cours en un coup d'œil
      </p>

      <div className="mt-6 flex items-center justify-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm py-3">
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="font-medium text-gray-700">{semaine}</span>
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {planning.map((jour) => (
          <DayColumn key={jour.nom} nom={jour.nom} cours={jour.cours} />
        ))}
      </div>

    </AppLayout>
  );
}