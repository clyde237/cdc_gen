# CDC-Gen Frontend — Récapitulatif d'Avancement

> Dernière mise à jour : 20/05/2026

---

## État Global

| Module | Statut | Branche | Date |
|--------|--------|---------|------|
| M01 — Schemas TypeScript | ✅ Terminé | `feature/frontend-schemas` | 11/05/2026 |
| M02 — Mocks API | ✅ Terminé | `feature/frontend-mocks` | 18/05/2026 |
| M03 — Client API | ✅ Terminé | `feature/frontend-api-client` | 18/05/2026 |
| M04 — UI Foundation | ✅ Terminé | `feature/frontend-ui-foundation` | 18/05/2026 |
| M05 — Auth | ✅ Terminé | `feature/frontend-auth` | 19/05/2026 |
| M06 — Dashboard | ✅ Terminé | `feature/frontend-dashboard` | 20/05/2026 |
| M07 — Liste Projets | ✅ Terminé | `feature/frontend-project-list` | 20/05/2026 |
| M08 — Formulaire Projet | ⏳ À faire | `feature/frontend-project-form` | — |
| M09 — Bundles/Pricing | ⏳ À faire | `feature/frontend-bundle-page` | — |
| M10 — Paramètres | ⏳ À faire | `feature/frontend-settings` | — |
| M11 — Historique | ⏳ À faire | `feature/frontend-history` | — |
| M12 — Streaming IA | ⏳ À faire | `feature/frontend-ai-streaming` | — |
| M13 — Export | ⏳ À faire | `feature/frontend-export` | — |
| M14 — Admin Layout | ⏳ À faire | `feature/frontend-admin-layout` | — |
| M15 — Admin Dashboard | ⏳ À faire | `feature/frontend-admin-dashboard` | — |
| M16 — Admin Utilisateurs | ⏳ À faire | `feature/frontend-admin-users` | — |
| M17 — Admin Analytics | ⏳ À faire | `feature/frontend-admin-analytics` | — |
| M18 — Admin Plateforme | ⏳ À faire | `feature/frontend-admin-platform` | — |
| M19 — Tests | ⏳ À faire | `feature/frontend-tests` | — |

---

## ✅ M01 — Schemas TypeScript

**Branche :** `feature/frontend-schemas`
**Destination :** `frontend/src/lib/schemas/`
**Validation :** `tsc --strict` → 0 erreur

### Fichiers créés

```
frontend/src/lib/schemas/
├── index.ts            ← barrel export principal
├── api.ts              ← ApiResponse<T>, AsyncState<T>
├── errors.ts           ← enum ApiErrors, isAuthError(), isBundleError()
├── user.ts             ← User, UserRegister, UserLogin, UserUpdate, AuthResponse
├── bundle.ts           ← BundleType, Bundle, BundleConfig, hasBundleLevel()
├── template.ts         ← Template, TemplateCreate
├── project-type.ts     ← ProjectType, ProjectTypeField, FieldType, ProjectData
├── project.ts          ← Project, ProjectDetail, ProjectCreate, ProjectUpdate
├── history.ts          ← HistoryEntry, HistoryResponse, HISTORY_ICONS
└── admin/
    ├── index.ts
    ├── admin.ts        ← Admin, AdminRole, AdminAuthResponse, isSuperAdmin()
    ├── events.ts       ← EventType, AdminEvent
    └── stats.ts        ← toutes les interfaces stats du backoffice
```

### Décisions clés

- **`ApiResponse<T>` comme union discriminée** — impossible d'accéder à `response.data` sans avoir vérifié `response.success` au préalable. TypeScript le refuse à la compilation.
- **`AsyncState<T>` pour les stores** — remplace le pattern fragile `isLoading + data + error` séparés par une structure unique à 4 états : `idle | loading | success | error`.
- **`hasBundleLevel(current, required)`** — centralise toute la logique de permissions en un point unique. Aucun composant ne compare des strings de bundle directement.
- **`Project` vs `ProjectDetail`** — la liste charge uniquement les métadonnées ; l'ouverture d'un projet charge le contenu IA complet. Évite de transférer des données volumétriques inutilement.
- **Séparation auth user / auth admin** — deux tokens JWT distincts, deux entités TypeScript distinctes. Un token utilisateur compromis ne donne jamais accès au backoffice.

---

## ✅ M02 — Mocks API

**Branche :** `feature/frontend-mocks`
**Destination :** `frontend/src/lib/api/mocks/`
**Validation :** `vitest run --project server src/lib/api/mocks/test-mocks.spec.ts` → 12/12 ✓

### Fichiers créés

```
frontend/src/lib/api/mocks/
├── index.ts
├── _utils.ts           ← delay(), ok(), fail(), MockConfig
├── _fixtures/
│   ├── users.ts
│   ├── bundles.ts
│   ├── projects.ts
│   ├── templates.ts
│   ├── project-types.ts
│   └── history.ts
├── auth.mock.ts
├── bundles.mock.ts
├── projects.mock.ts
├── templates.mock.ts
├── project-types.mock.ts
├── history.mock.ts
├── ai.mock.ts
├── export.mock.ts
└── admin/
    ├── index.ts
    ├── auth.mock.ts
    ├── live.mock.ts
    ├── stats.mock.ts   ← mockLiveConnected, mockUserStats, mockRevenueStats…
    ├── users.mock.ts
    └── platform.mock.ts
```

### Décisions clés

- **Mocks stateful** — `POST /api/projects` modifie l'état en mémoire, `GET /api/projects` le reflète. Les flux complets (créer → lister → modifier → supprimer) sont testables sans backend.
- **Latence calibrée par opération** — GET 150–300ms, POST/PUT 400–700ms, génération IA 2–4s. Force la gestion des états de chargement dès le départ.
- **`mockBundleList` = souscriptions utilisateurs** (pas les 4 types d'offres). Les types d'offres sont dans `mockBundleConfigs`.
- **Streaming IA via `AsyncGenerator`** — simule l'émission token par token avec délai variable pour reproduire le comportement réel du backend.

---

## ✅ M03 — Client API

**Branche :** `feature/frontend-api-client`
**Destination :** `frontend/src/lib/api/`

### Fichiers créés

```
frontend/src/lib/api/
├── _client.ts              ← fetch wrapper, USE_MOCKS, handleMockRequest()
├── index.ts                ← barrel export unique pour tous les composants
├── auth.api.ts             ← authApi : register, login, logout, me
├── bundles.api.ts          ← bundlesApi : getAll, getCurrent, subscribe
├── projects.api.ts         ← projectsApi : list, get, create, update, delete, duplicate
├── templates.api.ts        ← templatesApi : getAll, get
├── project-types.api.ts    ← projectTypesApi : getAll
├── history.api.ts          ← historyApi : get(limit?, offset?)
├── export.api.ts           ← exportApi : exportProject(id, options)
├── ai.api.ts               ← aiApi : generate() avec callbacks onChunk/onComplete/onError
└── admin/
    ├── index.ts
    ├── auth.admin.api.ts   ← adminAuthApi : login, logout
    ├── users.admin.api.ts  ← adminUsersApi : list, get, suspend, activate, setBundle
    ├── stats.admin.api.ts  ← adminStatsApi : tous les endpoints /api/admin/stats/*
    └── platform.admin.api.ts ← adminPlatformApi : bundles, templates, projectTypes, AIs
```

### Décisions clés

- **Chaque fichier API est intentionnellement fin** — pas de logique métier, juste le contrat. Headers, latence, routing mock/réel : tout dans `_client.ts`.
- **`ai.api.ts` bypasse `apiFetch`** — le streaming SSE ne peut pas passer par un wrapper qui attend une réponse JSON complète. Interface à callbacks unifiée (mock et réel identiques pour le composant).
- **`historyApi.get(limit?, offset?)`** construit le query string dynamiquement — le composant ne manipule jamais d'URL directement.
- **Basculement mock → réel** : passer `VITE_USE_MOCKS=false` dans `.env`. Aucun composant n'a besoin d'être modifié.

### Usage depuis un composant

```typescript
import { projectsApi, aiApi } from '$lib/api';

const result = await projectsApi.list();
if (result.success) { projects = result.data; }

await aiApi.generate(
  { projectId, formData },
  { onChunk: c => content += c, onComplete: save, onError: showError }
);
```

---

## ✅ M04 — UI Foundation

**Branche :** `feature/frontend-ui-foundation`
**Destination :** `frontend/src/lib/components/`, `frontend/src/lib/stores/`, `frontend/src/routes/layout.css`

### Fichiers créés

```
frontend/src/
├── routes/
│   └── layout.css              ← thème DaisyUI custom + tokens CSS (@theme)
└── lib/
    ├── components/
    │   ├── ui/
    │   │   ├── Button.svelte   ← variantes: primary, secondary, ghost, danger
    │   │   ├── Input.svelte    ← label, erreur, focus animé
    │   │   ├── Badge.svelte    ← pastilles bundle (free/starter/pro/business) + statuts
    │   │   ├── Card.svelte     ← conteneur avec ombre ambiante
    │   │   ├── Modal.svelte    ← <dialog> HTML5 natif, accessible, Échap géré
    │   │   ├── Toast.svelte    ← notification empilable (success/error/info/warning)
    │   │   └── index.ts
    │   └── layout/
    │       ├── AppShell.svelte ← structure globale max-width 1280px
    │       ├── Sidebar.svelte  ← navigation latérale + Lucide Icons
    │       ├── TopBar.svelte   ← barre d'en-tête utilisateur
    │       └── index.ts
    ├── stores/
    │   ├── toast.store.svelte.ts  ← file d'attente des toasts (classe + $state)
    │   ├── user.store.svelte.ts   ← session utilisateur courante
    │   ├── bundle.store.svelte.ts ← bundle actif + hasBundleLevel()
    │   └── index.ts
    └── utils/
        ├── format.ts           ← formatXAF(), formatDate(), formatName()
        └── bundle-guard.ts     ← isFeatureAllowed(feature, bundleType)
```

### Décisions clés

- **Tailwind v4 `@theme`** — toutes les variables de design (couleurs, ombres, typographie, arrondis) sont définies nativement dans `layout.css`. Pas de fichier de config externe.
- **DaisyUI v5 theme custom "ise"** — le thème mappe les tokens du `DESIGN.md` (Professional Blue + AI Purple) sur les variables DaisyUI. Un seul endroit à modifier si la palette change.
- **Svelte 5 Runes partout** — `$props()`, `$derived()`, `{@render children()}`. Pas de `export let` ni de `<slot />` ancien style.
- **`<dialog>` natif pour Modal** — accessibilité parfaite, gestion Échap et backdrop natifs sans librairie tierce.
- **Stores en `.svelte.ts`** — classe + `$state()` hors composant. Permet `toastStore.add('Message', 'success')` depuis n'importe où dans l'app, y compris des fichiers `.ts` purs.

---

## Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `CDC_Gen_Project_Guide.md` | Guide complet du projet (vision, architecture, contrat API) |
| `DESIGN.md` | Tokens du design system (couleurs, typographie, élévation, composants) |
| `shared/api_contracts.md` | Contrat API source de vérité (endpoints, formats, codes d'erreur) |

---

## ✅ M05 — Auth

**Branche :** `feature/frontend-auth`
**Destination :** `frontend/src/routes/auth/` + `frontend/src/lib/stores/auth.store.svelte.ts`

### Objectif

Pages de connexion et d'inscription avec un layout centré minimaliste. Liaison des formulaires au store auth pour gérer la session utilisateur, et mise en place des guards de navigation.

### Fichiers créés

```
frontend/src/
├── routes/
│   └── auth/
│       ├── +layout.svelte      ← layout centré, fond surface, logo CDC-Gen
│       ├── login/
│       │   └── +page.svelte    ← formulaire email + mot de passe
│       └── register/
│           └── +page.svelte    ← formulaire inscription complet
└── lib/
    └── stores/
        └── auth.store.svelte.ts ← login(), register(), logout(), session reactive
```

### Comportements implémentés

- Formulaire login → appel `authApi.login()` → stockage token → redirect `/dashboard`
- Formulaire register → appel `authApi.register()` → auto-login → redirect `/dashboard`
- Guard `+layout.svelte` de la route `(app)` → redirect `/auth/login` si non connecté
- Gestion des erreurs API inline (mauvais mot de passe, email déjà utilisé)
- États de chargement sur les boutons (spinner via `Button` avec prop `loading`)
- Lien "Mot de passe oublié" → page à implémenter ultérieurement (placeholder)

---

## ✅ M06 — Dashboard

**Branche :** `feature/frontend-dashboard`  
**Destination dans le projet :** `frontend/src/routes/(app)/dashboard/`  

### Fichiers créés / modifiés

```
frontend/src/routes/(app)/
├── +layout.svelte          ← Layout de groupe injectant automatiquement l'AppShell
└── dashboard/
└── +page.svelte        ← Tableau de bord principal connecté à projectsApi.list()
```
### Décisions d'architecture prises

- **Layout de groupe `(app)`** : Utilisation du mécanisme avancé de SvelteKit pour encapsuler les pages applicatives (`dashboard`, `projects`, `settings`) dans l'`AppShell` sans répéter de code et sans altérer la clarté des URLs.
- **Règle stricte des 4 états de chargement** : 
  - *Idle* : Initialisation.
  - *Loading* : Écran de chargement moderne (Squelettes / Skeletons clignotants) simulant la latence réseau.
  - *Error* : Rendu visuel propre avec l'icône `@lucide/svelte` `TriangleAlert` et un bouton d'action pour ré-exécuter l'appel en cas d'échec.
  - *Success* : Affichage de la grille ou d'un état vide (*Empty State*) si la liste de projets est vide.
- **Alignement strict des variables de données** : Passage complet aux clés exactes du modèle PostgreSQL de ton projet : `project.name` pour le titre, `project.lastModif` pour la date, et `project.projetType` string.
- **Correction du typage des Badges** : Résolution stricte des contraintes de variantes TypeScript du composant `Badge`.

---

## ✅ M07 — Liste Projets

**Branche :** `feature/frontend-project-list`  
**Destination dans le projet :** `frontend/src/routes/(app)/projects/`  

### Comportements implémentés

- **Double vue** : Ajout d'une vue Tableau liste (par défaut) et d'une vue Grille de cartes, contrôlées par des boutons d'icônes (`List`, `LayoutGrid`) basculés à l'extrême droite du bandeau.
- **Barre de contrôle hautement optimisée** : Alignement sur une seule ligne (sur desktop) combinant une barre de recherche textuelle réactive (prenant l'espace restant) et des sélecteurs de filtrage/tri.
- **Véritable Tableau Paginé** : Affichage sous forme de `<table>` sémantique et élégant avec gestion réactive de la pagination (8 éléments par page) via les Runes Svelte 5 (`$derived`).
- **Réglementation des 4 états** : Gestion sans faille des états asynchrones (`idle`, `loading` avec squelette adapté, `error` avec icône `@lucide/svelte` `TriangleAlert` et action de réessai, `success` avec empty state contextuel).

## Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `FRONTEND_MODULES.md` | Découpage complet en 19 modules avec dépendances et durées |
| `CDC_Gen_Project_Guide.md` | Guide complet du projet (vision, architecture, contrat API) |
| `DESIGN.md` | Tokens du design system (couleurs, typographie, élévation) |

---

## Prochaine étape : M08 — Formulaire Projet

**Branche à créer :** `feature/frontend-project-form`  
**Destination :** `frontend/src/routes/(app)/projects/` (Via Modale ou Route dédiée)  

### Objectif

Mettre en place le tunnel de création d'un nouveau projet afin de configurer le nom, le type de document (`projetType`), le patron (`template`), et le modèle de langage principal (`mainAI_API`). Branchement sur la méthode `projectsApi.create()` et redirection automatique vers l'espace d'édition du document généré.
"""

with open("AVANCEMENT-v3.md", "w", encoding="utf-8") as f:
    f.write(content)

print("File AVANCEMENT-v3.md created successfully.")