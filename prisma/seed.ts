import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@etudiplan.mg" },
    update: { verified: true },
    create: {
      name: "Étudiant Demo",
      email: "demo@etudiplan.mg",
      hashedPassword,
      verified: true,
    },
  });

  console.log(`User: ${user.email} (password: password123)`);

  // Only add test data if user has none
  const existingTaches = await prisma.tache.count({ where: { userId: user.id } });
  if (existingTaches > 0) {
    console.log("Test data already exists, skipping.");
    return;
  }

  await prisma.tache.createMany({
    data: [
      { userId: user.id, titre: "Rendre dissertation philo", matiere: "Philosophie", dateLimite: new Date(Date.now() + 86400000 * 2), priorite: "HAUTE", statut: "A_FAIRE" },
      { userId: user.id, titre: "Préparer exposé marketing", matiere: "Marketing", dateLimite: new Date(Date.now() + 86400000 * 5), priorite: "HAUTE", statut: "EN_COURS" },
      { userId: user.id, titre: "Exercices maths ch.4", matiere: "Mathématiques", dateLimite: new Date(Date.now() + 86400000 * 3), priorite: "MOYENNE", statut: "A_FAIRE" },
      { userId: user.id, titre: "Lire chapitres 5-8 anglais", matiere: "Anglais", dateLimite: new Date(Date.now() + 86400000 * 7), priorite: "MOYENNE", statut: "A_FAIRE" },
      { userId: user.id, titre: "Corriger exercices Python", matiere: "Informatique", priorite: "BASSE", statut: "TERMINEE", faite: true },
    ],
  });

  console.log("Tasks created: 5");

  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  await prisma.event.createMany({
    data: [
      { userId: user.id, title: "Cours de Maths", type: "COURSE", startDate: new Date(monday.getTime() + 8 * 3600000), endDate: new Date(monday.getTime() + 10 * 3600000), room: "Amphi A", color: "BLUE", repeat: "WEEKLY" },
      { userId: user.id, title: "TD Anglais", type: "COURSE", startDate: new Date(monday.getTime() + 14 * 3600000), endDate: new Date(monday.getTime() + 16 * 3600000), room: "Salle 203", color: "GREEN" },
      { userId: user.id, title: "Cours de Marketing", type: "COURSE", startDate: new Date(monday.getTime() + 86400000 + 10 * 3600000), endDate: new Date(monday.getTime() + 86400000 + 12 * 3600000), room: "Amphi B", color: "PURPLE" },
      { userId: user.id, title: "TP Informatique", type: "COURSE", startDate: new Date(monday.getTime() + 86400000 * 2 + 8 * 3600000), endDate: new Date(monday.getTime() + 86400000 * 2 + 12 * 3600000), room: "Labo 5", color: "ORANGE" },
      { userId: user.id, title: "Examen partiel Maths", type: "EXAM", startDate: new Date(monday.getTime() + 86400000 * 4 + 9 * 3600000), endDate: new Date(monday.getTime() + 86400000 * 4 + 11 * 3600000), room: "Amphi A", color: "RED" },
    ],
  });

  console.log("Events created: 5");

  await prisma.transaction.createMany({
    data: [
      { userId: user.id, libelle: "Bourse mensuelle", categorie: "Autre", montant: 200000, type: "REVENU", date: new Date(now.getFullYear(), now.getMonth(), 5) },
      { userId: user.id, libelle: "Courses alimentaires", categorie: "Nourriture", montant: 45000, type: "DEPENSE", date: new Date(now.getFullYear(), now.getMonth(), 7) },
      { userId: user.id, libelle: "Transport taxi-be", categorie: "Transport", montant: 12000, type: "DEPENSE", date: new Date(now.getFullYear(), now.getMonth(), 8) },
      { userId: user.id, libelle: "Sortie cinéma", categorie: "Loisirs", montant: 15000, type: "DEPENSE", date: new Date(now.getFullYear(), now.getMonth(), 10) },
      { userId: user.id, libelle: "Loyer février", categorie: "Logement", montant: 80000, type: "DEPENSE", date: new Date(now.getFullYear(), now.getMonth(), 1) },
      { userId: user.id, libelle: "Jobs étudiants", categorie: "Autre", montant: 50000, type: "REVENU", date: new Date(now.getFullYear(), now.getMonth(), 15) },
      { userId: user.id, libelle: "Achat livres", categorie: "Autre", montant: 25000, type: "DEPENSE", date: new Date(now.getFullYear(), now.getMonth(), 12) },
    ],
  });

  console.log("Transactions created: 7");
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
