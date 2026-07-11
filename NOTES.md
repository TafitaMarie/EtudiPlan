/# EtudiPlan - Travail restant

## 🔴 Actions manuelles à faire (priorité absolue)

### 1. Mettre à jour `.env.local`
Remplacer le contenu par :
```
DATABASE_URL="postgresql://neondb_owner:TON_NOUVEAU_MDP@ep-restless-breeze-ath8frp1-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="ta_nouvelle_cle_secrete"
```
Générer une JWT_SECRET :
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Nettoyer `.env`
Vider le fichier `.env` (credentials exposés).

### 3. Lancer la migration Prisma
```powershell
npx prisma migrate dev --name high_priority_improvements
```

### 4. Redémarrer le serveur
```powershell
npm run dev
```

---

## Ce qui a déjà été implanté (code OK, build passe)

### Critiques (sprint 0)
- [x] Middleware d'auth (`middleware.ts`)
- [x] Isolation userId dans Server Actions + Dashboard + API
- [x] Validation Zod (login, signup, taches, events, transactions)
- [x] Rate limiting (login: 10/min, signup: 5/min)
- [x] Cookie `Secure` + `SameSite=Strict`
- [x] `try/catch` partout
- [x] `.env.example`

### Hautes priorités (sprint 1)
- [x] Indexes Prisma + TransactionType enum + updatedAt
- [x] `error.tsx` + `not-found.tsx`
- [x] Bouton déconnexion dans la sidebar
- [x] Bug mois EmploiDuTemps corrigé (selectedDate)
- [x] Semaine complète 7 jours + locale fr-FR
- [x] Accessibility sur formulaires (labels, aria-label)
- [x] Loading/empty/error states

### À faire ensuite (priorités moyennes)
- [ ] Email verification
- [ ] Mot de passe oublié
- [ ] SEO (metadata, sitemap.xml, robots.txt)
- [ ] PWA (manifest.json, theme-color)
- [ ] Tests (Vitest + Testing Library)
- [ ] Page profil (modifier nom/email/mdp)
