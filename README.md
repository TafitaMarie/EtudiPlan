# ÉtudiPlan

Application web de gestion étudiante : tâches, emploi du temps, budget.

## Stack

| Technologie | Rôle |
|---|---|
| **Next.js 16** (React 19, App Router) | Framework full-stack |
| **TypeScript** | Typage |
| **Prisma** | ORM base de données |
| **SQLite** (local) / **PostgreSQL** (Vercel) | Base de données |
| **Zod** | Validation formulaires |
| **Tailwind CSS** | Styles |
| **Framer Motion** | Animations |
| **Lucide React** | Icônes |
| **bcryptjs** | Hash mots de passe |
| **jsonwebtoken** | Sessions (JWT) |
| **@dnd-kit** | Drag & drop |

## Architecture

```
src/
├── app/
│   ├── api/auth/          # API REST (login, signup, logout...)
│   ├── taches/            # Module tâches
│   ├── emploi_du_temp/    # Module emploi du temps
│   ├── budget/            # Module budget
│   ├── components/        # Sidebar, AppLayout
│   ├── login/             # Page connexion
│   ├── signup/            # Page inscription
│   └── ...
├── lib/
│   ├── prisma.ts          # Instance Prisma (singleton)
│   ├── auth.ts            # Helpers JWT
│   ├── validation.ts      # Schémas Zod
│   └── getCurrentUserId.ts
└── middleware.ts           # Garde : redirige vers /login si non connecté
```

Chaque module (ex: `taches/`) contient :
- **`page.tsx`** — Server Component : fetch les données et les passe au client
- **`TachesClient.tsx`** — Client Component : UI, état local, formulaires, interactions
- **`actions.ts`** — Server Actions (`"use server"`) : CRUD base de données, exécutées côté serveur mais appelables depuis le client

## Base de données (Prisma)

4 modèles dans `prisma/schema.prisma` : `User`, `Tache`, `Event`, `Transaction`.

```bash
npx prisma generate    # Générer le client Prisma
npx prisma db push     # Synchroniser le schéma avec la base
npx prisma studio      # Interface graphique pour voir/modifier les données
```

## Inscription / Connexion

1. Formulaire → API route (`/api/auth/signup` ou `/api/auth/login`)
2. Mot de passe hashé avec bcryptjs (jamais en clair)
3. JWT créé et stocké dans un cookie
4. `middleware.ts` lit le cookie à chaque requête, redirige vers `/login` si invalide

## Tâches

- Tableau triable par drag & drop
- Champs : titre, matière, date limite, priorité (Basse/Moyenne/Haute), statut (À faire/En cours/Terminée), booléen `faite`
- `toggleTacheAction` : cocher "Terminer" met `faite = true` ET `statut = TERMINEE`
- `modifierTacheAction` : pré-remplit le formulaire pour édition

## Emploi du temps

- Vues : Jour / Semaine / Mois
- Événements répétés hebdomadairement, avec `repeatEndDate` pour limiter la répétition (sinon infinie)
- Boutons Modifier/Supprimer au survol

## Local vs Vercel

- **Local** : SQLite via `DATABASE_URL="file:./dev.db"` dans `.env.local`
- **Vercel** : `vercel-build.js` patche le provider en `postgresql`, génère Prisma, et crée les tables

## Lancer le projet

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev        # → http://localhost:3000
npm run build      # Build production
```
