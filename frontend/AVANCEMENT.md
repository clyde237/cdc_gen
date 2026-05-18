# CDC-Gen Frontend — Récapitulatif d'Avancement

> Dernière mise à jour : 11/05/2026

---

## État Global

| Module | Statut | Branche | Date |
|--------|--------|---------|------|
| M01 — Schemas TypeScript | ✅ Terminé | `feature/frontend-schemas` | 11/05/2026 |
| M02 — Mocks API | ✅ Terminé | `feature/frontend-mocks` | 18/05/2026 |
| M03 — Client API | ⏳ À faire | `feature/frontend-api-client` | — |
| M04 — UI Foundation | ⏳ À faire | `feature/frontend-ui-foundation` | — |
| M05 — Auth | ⏳ À faire | `feature/frontend-auth` | — |
| M06 — Dashboard | ⏳ À faire | `feature/frontend-dashboard` | — |
| M07 — Liste Projets | ⏳ À faire | `feature/frontend-project-list` | — |
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
**Destination dans le projet :** `frontend/src/lib/schemas/`  
**Validation :** `tsc --strict` → 0 erreur

### Fichiers créés

```
frontend/src/lib/schemas/
├── index.ts            ← barrel export principal (importer depuis '$lib/schemas')
├── api.ts              ← wrapper générique ApiResponse<T>, AsyncState<T>
├── errors.ts           ← enum ApiErrors + helpers isAuthError, isBundleError
├── user.ts             ← User, UserRegister, UserLogin, UserUpdate, AuthResponse
├── bundle.ts           ← BundleType, Bundle, BundleConfig, hasBundleLevel
├── template.ts         ← Template, TemplateCreate
├── project-type.ts     ← ProjectType, ProjectTypeField, FieldType, ProjectData
├── project.ts          ← Project, ProjectDetail, ProjectCreate, ProjectUpdate
├── history.ts          ← HistoryEntry, HistoryResponse, HISTORY_ICONS
└── admin/
    ├── index.ts        ← barrel export admin
    ├── admin.ts        ← Admin, AdminRole, AdminAuthResponse, isSuperAdmin
    ├── events.ts       ← EventType, AdminEvent
    └── stats.ts        ← toutes les interfaces stats du backoffice
```

### Décisions d'architecture prises

**`ApiResponse<T>` comme union discriminée**
```typescript
// Le pattern imposé par TypeScript dans TOUT le projet :
if (response.success) {
  // ici response.data est disponible et typé
} else {
  // ici response.error est disponible et typé
}
```
Aucun composant ne peut accéder à `response.data` sans avoir vérifié `response.success` — TypeScript le refuse à la compilation.

**`AsyncState<T>` pour les stores**
```typescript
// Structure unique pour tout état async dans les stores Svelte
interface AsyncState<T> {
  state: 'idle' | 'loading' | 'success' | 'error'
  data: T | null
  error: ApiErrorBody | null
}
```
Remplace le pattern fragile `isLoading + data + error` séparés.

**`BUNDLE_RANK` + `hasBundleLevel(current, required)`**
```typescript
// Toute vérification de permission passe par là
hasBundleLevel('pro', 'starter')   // → true
hasBundleLevel('free', 'starter')  // → false
```
Centralise toute la logique de permissions en un point unique.

**`isAuthError(code)` + `isBundleError(code)`**  
Le client API (M03) utilisera ces helpers pour décider automatiquement :
- erreur 401 → rediriger vers `/login`
- erreur 403/4031/4032 → afficher une invitation à upgrader le bundle

**`Project` vs `ProjectDetail`**  
La liste des projets charge uniquement les métadonnées (`Project`).  
L'ouverture d'un projet charge le contenu complet (`ProjectDetail` avec `data: ProjectData`).  
Évite de transférer les données IA volumétriques pour chaque carte de la grille.

**`ProjectData = Record<string, string | number | boolean | null>`**  
La structure du contenu d'un projet dépend du `ProjectType` choisi et ne peut pas être connue à la compilation. On type les valeurs possibles plutôt que les clés.

**Séparation auth user / auth admin**  
Deux entités distinctes (`User` vs `Admin`), deux endpoints distincts, deux tokens JWT distincts (signés avec des secrets différents côté backend). Un token utilisateur compromis ne donne jamais accès au backoffice.

### Import dans le projet

```typescript
// Import depuis n'importe quel fichier du frontend
import type { User, Project, ApiResponse, BundleType } from '$lib/schemas'
import { hasBundleLevel, getErrorMessage, HISTORY_ICONS } from '$lib/schemas'
```

---

## Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `FRONTEND_MODULES.md` | Découpage complet en 19 modules avec dépendances et durées |
| `CDC_Gen_Project_Guide.md` | Guide complet du projet (vision, architecture, contrat API) |

---

## Prochaine étape : M02 — Mocks API

**Branche à créer :** `feature/frontend-mocks`  
**Destination :** `frontend/src/lib/api/mocks/`  
**Objectif :** Un mock fonctionnel et typé pour chaque endpoint du contrat API.  
**Point clé :** Simuler la latence réseau avec `delay()` pour forcer la gestion des états de chargement dès le départ.
