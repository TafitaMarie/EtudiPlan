import { z } from "zod";

const PrioriteEnum = z.enum(["BASSE", "MOYENNE", "HAUTE"]);
const StatutEnum = z.enum(["A_FAIRE", "EN_COURS", "TERMINEE"]);
const EventTypeEnum = z.enum(["COURSE", "EXAM"]);
const RepeatTypeEnum = z.enum(["NONE", "WEEKLY"]);
const EventColorEnum = z.enum(["BLUE", "GREEN", "ORANGE", "PURPLE", "RED"]);
const TransactionTypeEnum = z.enum(["REVENU", "DEPENSE"]);

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const signupSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
});

export const tacheSchema = z.object({
  titre: z.string().min(1, "Titre requis").max(200),
  matiere: z.string().max(100).nullable().optional(),
  dateLimite: z.string().nullable().optional(),
  priorite: PrioriteEnum.default("MOYENNE"),
  statut: StatutEnum.default("A_FAIRE"),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Titre requis").max(200),
  type: EventTypeEnum,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  room: z.string().max(100).optional(),
  color: EventColorEnum.default("BLUE"),
  repeat: RepeatTypeEnum.default("NONE"),
  repeatEndDate: z.coerce.date().nullable().optional(),
});

export const transactionSchema = z.object({
  libelle: z.string().min(1, "Libellé requis").max(200),
  categorie: z.string().min(1, "Catégorie requise").max(100),
  montant: z.number().positive("Le montant doit être positif"),
  type: TransactionTypeEnum,
  date: z.coerce.date().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type TacheInput = z.infer<typeof tacheSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
