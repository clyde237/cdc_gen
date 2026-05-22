# CDC-Gen — Découpage Frontend en Modules

> Document de planification du développement frontend  
> Stack : SvelteKit 5 + TailwindCSS + DaisyUI + Lucide  
> Mise à jour : 11/05/2026

---

## Philosophie du découpage

Chaque module correspond à **une branche Git `feature/frontend-*`** de 2-3 jours maximum.  
L'ordre est strict : les couches basses (infrastructure, composants) précèdent les couches hautes (pages, flux).  
Chaque module livre quelque chose de **visible et testable** — pas de travail invisible pendant des jours.

```
Niveau 0 — Infrastructure (schemas, mocks, config)
     ↓
Niveau 1 — UI Foundation (composants atoms / layout)
     ↓
Niveau 2 — Auth (login, register)
     ↓
Niveau 3 — App Core (dashboard, projets, settings)
     ↓
Niveau 4 — Features avancées (IA streaming, export)
     ↓
Niveau 5 — Backoffice Admin
     ↓
Niveau 6 — Qualité (tests, accessibilité, perf)
```

---

## Vue d'ensemble des modules

| # | Branche | Niveau | Durée est. | Dépend de |
|---|---------|--------|-----------|-----------|
| M01 | `feature/frontend-schemas` | 0 | 1 jour | — |
| M02 | `feature/frontend-mocks` | 0 | 1-2 jours | M01 |
| M03 | `feature/frontend-api-client` | 0 | 1 jour | M01, M02 |
| M04 | `feature/frontend-ui-foundation` | 1 | 2-3 jours | M01 |
| M05 | `feature/frontend-auth` | 2 | 2-3 jours | M03, M04 |
| M06 | `feature/frontend-dashboard` | 3 | 2-3 jours | M04, M05 |
| M07 | `feature/frontend-project-list` | 3 | 2 jours | M04, M05 |
| M08 | `feature/frontend-project-form` | 3 | 3 jours | M06, M07 |
| M09 | `feature/frontend-bundle-page` | 3 | 2 jours | M04, M05 |
| M10 | `feature/frontend-settings` | 3 | 1-2 jours | M04, M05 |
| M11 | `feature/frontend-history` | 3 | 1-2 jours | M04, M05 |
| M12 | `feature/frontend-ai-streaming` | 4 | 3 jours | M08 |
| M13 | `feature/frontend-export` | 4 | 2 jours | M08 |
| M14 | `feature/frontend-admin-layout` | 5 | 1-2 jours | M04 |
| M15 | `feature/frontend-admin-dashboard` | 5 | 3 jours | M14 |
| M16 | `feature/frontend-admin-users` | 5 | 2-3 jours | M14 |
| M17 | `feature/frontend-admin-analytics` | 5 | 3 jours | M14, M15 |
| M18 | `feature/frontend-admin-platform` | 5 | 2-3 jours | M14 |
| M19 | `feature/frontend-tests` | 6 | 2-3 jours | tous |

---

## Niveau 0 — Infrastructure

> Aucune interface utilisateur. Que de la fondation. Si ce niveau est bâclé, tout le reste se paie.

---

### M01 — Schemas TypeScript
**Branche :** `feature/frontend-schemas`  
**Durée :** 1 jour  
**Dépendances :** aucune

**Pourquoi en premier ?**  
Les interfaces TypeScript sont le contrat entre le frontend et le backend. Tous les composants, mocks et appels API en dépendent. Sans ça, on développe dans le flou.

**Fichiers à créer :**

```
frontend/src/lib/schemas/
├── user.ts          # Interface User + UserRegister
├── bundle.ts        # Interface Bundle + BundleType (union type)
├── project.ts       # Interface Project + ProjectCreate + ProjectData
├── template.ts      # Interface Template
├── project-type.ts  # Interface ProjectType
├── history.ts       # Interface HistoryEntry
├── errors.ts        # Enum ApiErrors (codes définis dans le contrat)
├── api.ts           # Types ApiResponse<T> (succès/erreur générique)
└── admin/
    ├── admin.ts     # Interface Admin
    ├── stats.ts     # Interfaces pour toutes les stats du backoffice
    └── events.ts    # Interface AdminEvent + EventType
```

**Contenu clé à implémenter :**

```typescript
// api.ts — le wrapper générique de toutes les réponses API
export interface ApiSuccess<T> {
  success: true
  data: T
  message: string
}

export interface ApiError {
  success: false
  error: {
    code: number
    type: string
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// bundle.ts
export type BundleType = 'free' | 'starter' | 'pro' | 'business'
```

**Critère de "Done" :** `npx svelte-check` passe sans erreur de type sur ces fichiers.

---

### M02 — Mocks API
**Branche :** `feature/frontend-mocks`  
**Durée :** 1-2 jours  
**Dépendances :** M01

**Pourquoi ?**  
Le backend n'est pas encore prêt. Les mocks permettent de développer l'intégralité du frontend en parallèle, sans bloquer ni attendre.

**Règle :** Les mocks respectent **exactement** les types définis en M01. Si un mock viole un type, c'est un bug à corriger immédiatement.

**Fichiers à créer :**

```
frontend/src/lib/api/mocks/
├── user.mock.ts          # mockUser, mockUserRegisterPayload
├── bundle.mock.ts        # mockBundle (un par type : free, starter, pro, business)
├── project.mock.ts       # mockProject, mockProjectList (5-10 projets)
├── project-data.mock.ts  # mockProjectData (contenu JSON simulé)
├── template.mock.ts      # mockTemplateList (3-5 templates)
├── project-type.mock.ts  # mockProjectTypeList
├── history.mock.ts       # mockHistoryList (10-15 entrées)
└── admin/
    ├── users.mock.ts     # mockUserList (20+ utilisateurs variés)
    ├── stats.mock.ts     # mockStats (registrations, revenue, conversion...)
    └── events.mock.ts    # mockEventList
```

**Technique recommandée :**  
Créer une fonction `delay(ms)` pour simuler la latence réseau. Ça force à écrire des composants qui gèrent correctement les états de chargement dès le début.

```typescript
// src/lib/api/mocks/_utils.ts
export const delay = (ms = 400) => new Promise(res => setTimeout(res, ms))

// Utilisation dans un mock
export async function getMockProjects(): Promise<ApiResponse<Project[]>> {
  await delay(350)
  return { success: true, data: mockProjectList, message: 'OK' }
}
```

**Critère de "Done" :** Chaque endpoint du contrat API a un mock fonctionnel qui retourne des données typées.

---

### M03 — Client API
**Branche :** `feature/frontend-api-client`  
**Durée :** 1 jour  
**Dépendances :** M01, M02

**Pourquoi ?**  
Centraliser tous les appels API dans un seul endroit. Quand le backend est prêt, on remplace le mock par le vrai `fetch` dans le client — sans toucher aux composants.

**Fichiers à créer :**

```
frontend/src/lib/api/
├── _client.ts          # fetch wrapper (gestion erreurs, headers, base URL)
├── auth.api.ts         # register, login, logout, me
├── bundles.api.ts      # getBundles, subscribeToBunde, getCurrentBundle
├── projects.api.ts     # list, get, create, update, delete, duplicate
├── templates.api.ts    # getTemplates, getTemplate
├── project-types.api.ts
├── history.api.ts      # getHistory
├── export.api.ts       # exportProject
├── ai.api.ts           # generateContent (streaming)
└── admin/
    ├── auth.admin.api.ts
    ├── users.admin.api.ts
    ├── stats.admin.api.ts
    └── platform.admin.api.ts
```

**Architecture du client :**

```typescript
// _client.ts
// USE_MOCKS = true tant que le backend n'est pas prêt
// USE_MOCKS = false quand on connecte le vrai backend
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
```

Chaque fichier API expose une interface identique que USE_MOCKS soit vrai ou faux. Le switch est invisible pour les composants.

**Critère de "Done" :** On peut appeler `projectsApi.list()` depuis n'importe quel composant et obtenir des données mockées typées.

---

## Niveau 1 — UI Foundation

> Les briques réutilisables. Tout ce qui sera utilisé dans 5 pages ou plus appartient ici.

---

### M04 — UI Foundation (Composants, Layouts, Design System)
**Branche :** `feature/frontend-ui-foundation`  
**Durée :** 2-3 jours  
**Dépendances :** M01

**Pourquoi traiter ça comme un module à part ?**  
Les composants fondamentaux sont utilisés partout. Les définir une fois correctement évite les inconsistances visuelles et les refactorisations douloureuses plus tard.

**Fichiers à créer :**

```
frontend/src/lib/
├── components/
│   ├── ui/                         # Composants atomiques
│   │   ├── Button.svelte           # Variantes : primary, secondary, ghost, danger
│   │   ├── Input.svelte            # Texte, email, password avec gestion d'erreur
│   │   ├── Select.svelte
│   │   ├── Badge.svelte            # Pour les types de bundle, statuts
│   │   ├── Card.svelte             # Container réutilisable
│   │   ├── Modal.svelte            # Dialog générique
│   │   ├── Toast.svelte            # Notifications (succès, erreur, info)
│   │   ├── Spinner.svelte          # Loading state
│   │   ├── EmptyState.svelte       # "Aucun projet" etc.
│   │   ├── ErrorBoundary.svelte    # Gestion erreurs globale
│   │   └── Avatar.svelte           # Initiales utilisateur
│   │
│   └── layout/                     # Composants de mise en page
│       ├── AppShell.svelte         # Layout principal avec sidebar
│       ├── Sidebar.svelte          # Navigation latérale (app user)
│       ├── TopBar.svelte           # Barre du haut (user info, notifications)
│       ├── PageHeader.svelte       # Titre de page + actions contextuelles
│       └── BundleBadge.svelte      # Badge bundle affiché partout dans l'app
│
├── stores/
│   ├── auth.store.ts               # user courant, isAuthenticated, isAdmin
│   ├── toast.store.ts              # gestion des notifications globales
│   ├── modal.store.ts              # gestion des modals globales
│   └── bundle.store.ts             # bundle actif, limites, permissions
│
└── utils/
    ├── format.ts                   # formatDate, formatCurrency (XAF), formatName
    ├── bundle-guard.ts             # isFeatureAllowed(feature, bundle) → boolean
    └── validators.ts               # validations de formulaires
```

**Décisions de design importantes à prendre ici :**

- **Palette de couleurs** : Définir les tokens dans `layout.css` (primaire, secondaire, accents)
- **Typographie** : Choisir et importer les polices via CSS
- **Sidebar** : Décider si elle est fixe ou collapsible
- **Toast system** : Position (top-right), durée (3s), comportement empilement

**Le store `bundle.store.ts` est critique :**  
Il expose `canExport()`, `canDuplicate()`, `canUseTemplate(id)` etc. Tous les composants s'en servent pour afficher ou masquer des features. C'est ici que se traduit concrètement la logique métier des Bundles.

**Critère de "Done" :** Une page de démonstration `/dev/ui` affiche tous les composants dans leurs variantes. AppShell fonctionne avec un slot de contenu.

---

## Niveau 2 — Authentification

---

### M05 — Auth (Login / Register / Guards)
**Branche :** `feature/frontend-auth`  
**Durée :** 2-3 jours  
**Dépendances :** M03, M04

**Fichiers à créer :**

```
frontend/src/routes/
├── auth/
│   ├── +layout.svelte          # Layout minimal sans sidebar (centré, branding)
│   ├── login/
│   │   └── +page.svelte        # Formulaire connexion
│   └── register/
│       └── +page.svelte        # Formulaire inscription (nom, prénom, email, mdp, pays)
│
frontend/src/lib/
├── stores/
│   └── auth.store.ts           # Complété avec login(), logout(), register()
└── guards/
    ├── auth.guard.ts           # Redirige /login si non connecté
    └── admin.guard.ts          # Redirige /admin/login si non admin
```

**Points UX à soigner :**
- Validation temps réel des champs (email format, password strength)
- Gestion explicite des erreurs retournées par l'API (ex: "email déjà utilisé")
- Redirection intelligente post-login (vers l'URL d'origine si redirect)
- Loading state sur le bouton de soumission (pas de double submit)
- Page register : sélecteur de pays (pas juste un input text)

**Guards SvelteKit :**  
Utiliser les `+layout.server.ts` ou `+page.server.ts` load functions pour protéger les routes. Pas de guard côté client seul — un attaquant peut bypasser le JS.

**Critère de "Done" :** Login → Dashboard → Logout fonctionne avec les mocks. Les routes `/dashboard` redirigent vers `/auth/login` si non connecté.

---

## Niveau 3 — App Core (Espace Utilisateur)

---

### M06 — Dashboard Utilisateur
**Branche :** `feature/frontend-dashboard`  
**Durée :** 2-3 jours  
**Dépendances :** M04, M05

**Fichiers à créer :**

```
frontend/src/routes/(app)/
├── +layout.svelte              # Layout app avec AppShell, auth guard
├── dashboard/
│   ├── +page.svelte            # Page dashboard
│   └── _components/
│       ├── WelcomeCard.svelte  # Bonjour {prenom}, bundle actif
│       ├── RecentProjects.svelte    # 3-5 derniers projets
│       ├── QuickActions.svelte      # CTA : Nouveau projet, Upgrade
│       ├── BundleStatus.svelte      # Jauge exports restants, date expiration
│       └── ActivityFeed.svelte      # Dernières entrées de l'historique
```

**Décisions UX importantes :**
- Le dashboard est la **première chose que l'utilisateur voit**. Il doit répondre à : "Où en suis-je ? Que puis-je faire maintenant ?"
- `BundleStatus` est stratégique : un utilisateur Free qui voit clairement sa limite est plus enclin à upgrader
- `QuickActions` : le CTA "Nouveau projet" doit être visuellement dominant

**Critère de "Done" :** Le dashboard affiche des données mockées, est responsive, et le bundle actif de l'utilisateur est clairement visible.

---

### M07 — Liste des Projets
**Branche :** `feature/frontend-project-list`  
**Durée :** 2 jours  
**Dépendances :** M04, M05

**Fichiers à créer :**

```
frontend/src/routes/(app)/projects/
├── +page.svelte                    # Liste des projets
└── _components/
    ├── ProjectCard.svelte          # Carte projet (nom, type, template, date)
    ├── ProjectGrid.svelte          # Grille de cartes
    ├── ProjectListItem.svelte      # Vue liste (alternative)
    ├── ProjectFilters.svelte       # Filtrer par type, template, date
    ├── ProjectSearch.svelte        # Recherche par nom
    ├── ProjectActions.svelte       # Menu contextuel : edit, duplicate, delete
    ├── DeleteConfirmModal.svelte   # Confirmation suppression
    └── ViewToggle.svelte           # Basculer grille / liste
```

**Points UX :**
- `ProjectActions` : le bouton "Dupliquer" doit être grisé + tooltip explicatif si bundle Free
- Pagination ou infinite scroll ? → Recommandation : **pagination simple** pour commencer (plus prévisible)
- Empty state sympathique quand aucun projet ("Créez votre premier CDC !")
- Optimistic update pour la suppression (retire la carte immédiatement, annule si erreur)

**Critère de "Done" :** Liste affiche les projets mockés, filtres et recherche fonctionnent en local, les actions contextuelles respectent les droits du bundle.

---

### M08 — Formulaire Projet (Création / Édition)
**Branche :** `feature/frontend-project-form`  
**Durée :** 3 jours  
**Dépendances :** M06, M07

**C'est le module le plus complexe de l'app.** Le formulaire est "dynamique à N champs" selon le type de projet et le template choisi. C'est le cœur du produit.

**Fichiers à créer :**

```
frontend/src/routes/(app)/projects/
├── new/
│   └── +page.svelte                    # Création : wizard ou formulaire unique
├── [id]/
│   ├── +page.svelte                    # Détail / édition du projet
│   └── _components/
│       ├── ProjectHeader.svelte        # Nom, type, template, IA choisie
│       ├── DynamicFieldRenderer.svelte # Rend les champs selon le ProjectType
│       ├── FieldTypes/
│       │   ├── TextField.svelte
│       │   ├── TextareaField.svelte
│       │   ├── SelectField.svelte
│       │   ├── NumberField.svelte
│       │   └── BooleanField.svelte
│       ├── TypeSelector.svelte         # Choix du type de projet
│       ├── TemplateSelector.svelte     # Choix du template (limité par bundle)
│       ├── AISelector.svelte           # Choix de l'IA principale
│       ├── ProjectSidebar.svelte       # Actions (save, export, duplicate, AI)
│       └── GeneratedContent.svelte     # Contenu généré par l'IA (lecture)
```

**Décision d'architecture clé — `DynamicFieldRenderer` :**  
Le `ProjetData.json` a une structure à N champs définie par le `ProjectType`. Le composant `DynamicFieldRenderer` doit recevoir le schéma du type de projet et rendre les champs correspondants dynamiquement. C'est un mini-moteur de formulaire.

```typescript
// Le schema d'un ProjectType définit ses champs
interface ProjectTypeField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean'
  required: boolean
  options?: string[]  // Pour les selects
  placeholder?: string
}
```

**Points UX :**
- Auto-save toutes les 30 secondes (avec indicateur visuel discret)
- Wizard en étapes pour la création (Type → Template → Champs → IA) plutôt qu'un long formulaire
- Champs obligatoires clairement indiqués
- Preview du template avant sélection

**Critère de "Done" :** Création d'un projet complet, édition, et navigation entre projets fonctionnent avec les mocks. Les champs se génèrent correctement selon le type choisi.

---

### M09 — Page Bundles / Pricing
**Branche :** `feature/frontend-bundle-page`  
**Durée :** 2 jours  
**Dépendances :** M04, M05

**Fichiers à créer :**

```
frontend/src/routes/(app)/bundles/
├── +page.svelte                    # Page pricing/upgrade
└── _components/
    ├── BundleCard.svelte           # Carte par offre (Free/Starter/Pro/Business)
    ├── BundleComparison.svelte     # Tableau comparatif des features
    ├── BundleFeatureList.svelte    # Liste des features avec ✅/❌
    ├── CurrentBundleHighlight.svelte # Met en évidence le bundle actif
    └── SubscribeModal.svelte       # Confirmation souscription + infos paiement
```

**Points UX :**
- C'est une page de conversion — la plus importante pour le business
- L'offre **Pro** devrait avoir un highlight visuel "Recommandé"
- Prix en **XAF clairement affiché** (le public cible est africain)
- Le bundle actuel ne doit pas avoir de bouton "Souscrire" mais "Actif"
- Downgrade non possible directement (à préciser avec le backend)

**Critère de "Done" :** Les 4 cartes sont affichées avec le bon contenu depuis les mocks, le bundle actif est mis en évidence, le flow de souscription démarre (jusqu'à la confirmation mock).

---

### M10 — Paramètres Utilisateur
**Branche :** `feature/frontend-settings`  
**Durée :** 1-2 jours  
**Dépendances :** M04, M05

**Fichiers à créer :**

```
frontend/src/routes/(app)/settings/
├── +page.svelte                    # Page settings avec tabs/sections
└── _components/
    ├── ProfileForm.svelte          # Nom, prénom, email, pays, ville, GMT
    ├── PasswordForm.svelte         # Changer son mot de passe
    ├── DangerZone.svelte           # Supprimer le compte (destructive action)
    └── TimezoneSelector.svelte     # Sélecteur de fuseau horaire (GMT)
```

**Points UX :**
- Layout en sections verticales avec ancres plutôt que des tabs (plus de contenu visible)
- `DangerZone` visuellement séparée en bas, fond légèrement coloré en rouge/orange
- Confirmation suppression compte : taper son email pour confirmer

**Critère de "Done" :** Formulaire de profil se prérempli avec les données mock de l'utilisateur, validation et feedback de sauvegarde fonctionnels.

---

### M11 — Historique Utilisateur
**Branche :** `feature/frontend-history`  
**Durée :** 1-2 jours  
**Dépendances :** M04, M05

**Fichiers à créer :**

```
frontend/src/routes/(app)/history/
├── +page.svelte
└── _components/
    ├── HistoryTimeline.svelte      # Timeline d'événements (style feed)
    ├── HistoryItem.svelte          # Un événement (icône, titre, date, référence)
    ├── HistoryFilters.svelte       # Filtrer par type d'action, date
    └── HistoryLockBanner.svelte    # Bandeau si bundle Free (historique limité)
```

**Points UX :**
- Affichage en timeline verticale (plus lisible qu'un tableau pour ce type de données)
- Pour les bundles Free, afficher les entrées grisées au-delà de la limite avec un CTA upgrade
- Icônes différentes par type d'action (Lucide icons : `FolderOpen`, `Download`, `CreditCard`...)

**Critère de "Done" :** Timeline affiche 15 entrées mockées, le filtre par type fonctionne, le bandeau de restriction bundle s'affiche pour un mock de bundle Free.

---

## Niveau 4 — Features Avancées

---

### M12 — Streaming IA
**Branche :** `feature/frontend-ai-streaming`  
**Durée :** 3 jours  
**Dépendances :** M08

**Le module le plus technique du projet.** Le contenu généré par l'IA arrive en streaming (token par token). L'interface doit le refléter en temps réel.

**Fichiers à créer :**

```
frontend/src/lib/
├── api/
│   └── ai.api.ts                   # Complété : stream via fetch + ReadableStream
└── components/
    └── ai/
        ├── AIGenerateButton.svelte  # Bouton lancer la génération + état loading
        ├── StreamingOutput.svelte   # Affichage progressif du texte généré
        ├── AIProgress.svelte        # Indicateur de progression (indéterminé)
        ├── AIErrorCard.svelte       # Erreur API IA (502) avec retry
        ├── AIPromptEditor.svelte    # Modifier/personnaliser le prompt avant envoi
        └── RegenerateSection.svelte # Regénérer un bloc spécifique
```

**Architecture du streaming :**
```typescript
// ai.api.ts — skeleton de l'implémentation
async function* streamGenerate(payload): AsyncGenerator<string> {
  const response = await fetch('/api/ai/generate', { ... })
  const reader = response.body!.getReader()
  // ... décoder chunk par chunk et yield chaque token
}
```

**Mock du streaming :**  
Simuler le streaming en découpant une longue chaîne et en la yielding caractère par caractère avec un délai (`setTimeout` de 20-50ms par chunk).

**Critère de "Done" :** L'utilisateur clique "Générer", voit le texte apparaître progressivement, peut annuler la génération en cours, et l'erreur IA est gérée gracieusement.

---

### M13 — Export
**Branche :** `feature/frontend-export`  
**Durée :** 2 jours  
**Dépendances :** M08

**Fichiers à créer :**

```
frontend/src/lib/components/export/
├── ExportButton.svelte         # Bouton export (disabled si limite atteinte)
├── ExportModal.svelte          # Options export (format, branding selon bundle)
├── ExportProgress.svelte       # Progression du rendu PDF
├── ExportLimitBanner.svelte    # "Il vous reste X exports ce mois-ci"
├── WatermarkPreview.svelte     # Aperçu du watermark pour bundle Free
└── BrandingOptions.svelte      # Options branding (Starter+)
```

**Logique bundle dans l'export :**
- **Free** : export possible mais avec watermark, coût 500 XAF par export
- **Starter** : 5 exports sans watermark / mois
- **Pro** : 20 exports sans watermark / mois
- **Business** : illimité

Le composant `ExportButton` doit interroger le `bundle.store` pour décider de son état et de son label.

**Critère de "Done" :** Le flow complet d'export (bouton → options → confirmation → téléchargement mock) fonctionne, avec les restrictions de bundle correctement appliquées.

---

## Niveau 5 — Backoffice Admin

> Zone séparée de l'app utilisateur. Auth séparée, layout séparé, logique séparée.

---

### M14 — Layout & Auth Admin
**Branche :** `feature/frontend-admin-layout`  
**Durée :** 1-2 jours  
**Dépendances :** M04

**Fichiers à créer :**

```
frontend/src/routes/admin/
├── +layout.svelte              # Layout admin (sidebar admin, topbar admin)
├── login/
│   └── +page.svelte            # Page login admin (design distinct de l'app)
└── _components/
    ├── AdminSidebar.svelte     # Nav admin : Dashboard, Users, Analytics, Settings
    ├── AdminTopBar.svelte      # Barre admin avec rôle + logout
    └── AdminGuard.svelte       # Protection via admin.store
```

**Design intentionnellement différent de l'app user :**  
Le backoffice admin doit visuellement signaler qu'on est dans un espace différent et à risque. Utiliser un thème plus sobre/sombre/professionnel. Un admin qui confond l'interface admin et l'interface user peut faire des dégâts.

**Critère de "Done" :** Login admin → dashboard admin → logout admin fonctionne. Les routes `/admin/*` redirigent vers `/admin/login` si non connecté en tant qu'admin.

---

### M15 — Dashboard Admin
**Branche :** `feature/frontend-admin-dashboard`  
**Durée :** 3 jours  
**Dépendances :** M14

**Fichiers à créer :**

```
frontend/src/routes/admin/dashboard/
├── +page.svelte
└── _components/
    ├── LiveMetrics.svelte          # Connectés en temps réel, visiteurs actifs
    ├── KPICard.svelte              # Carte métrique réutilisable (valeur + tendance)
    ├── DailyRegistrations.svelte   # Inscriptions du jour + graphe semaine
    ├── RevenueOverview.svelte      # Revenus du mois (somme abonnements actifs)
    ├── BundleDistribution.svelte   # Graphe camembert des bundles actifs
    ├── RecentActivity.svelte       # Derniers admin_events
    └── AlertsPanel.svelte          # Churns détectés, anomalies
```

**Note sur les graphes :**  
Pas de dépendance externe pour les graphes — utiliser les composants de **DaisyUI** (progress bars, stats) pour les métriques simples. Pour les graphes plus complexes (linéaire, camembert), évaluer si une lib légère est nécessaire (voir si Chart.js ou une alternative SVG native suffit).

**Critère de "Done" :** Dashboard affiche toutes les métriques avec données mockées, les KPIs ont une tendance (hausse/baisse vs période précédente), les données "live" se rafraîchissent toutes les 30s (polling mock).

---

### M16 — Gestion Utilisateurs Admin
**Branche :** `feature/frontend-admin-users`  
**Durée :** 2-3 jours  
**Dépendances :** M14

**Fichiers à créer :**

```
frontend/src/routes/admin/users/
├── +page.svelte                        # Liste tous les utilisateurs
├── [id]/
│   └── +page.svelte                    # Détail d'un utilisateur
└── _components/
    ├── UserTable.svelte                # Tableau paginé avec sort/filter
    ├── UserTableRow.svelte             # Ligne : avatar, nom, email, bundle, statut
    ├── UserFilters.svelte              # Filtres : bundle, pays, statut, date
    ├── UserDetailCard.svelte           # Infos complètes de l'user
    ├── UserBundleEditor.svelte         # Modifier le bundle manuellement
    ├── UserSuspendModal.svelte         # Confirmer suspension
    ├── UserProjectsList.svelte         # Projets de l'utilisateur (en lecture)
    └── UserActivityLog.svelte          # Historique des actions de l'user
```

**Points UX :**
- Tableau avec **colonnes triables** (par date inscription, bundle, pays)
- Recherche par email en temps réel (debounce 300ms)
- Actions destructives (suspendre) nécessitent une confirmation modale
- Différencier visuellement les comptes suspendus dans la liste
- L'édition manuelle du bundle doit afficher un avertissement "Action manuelle — hors flux de paiement"

**Critère de "Done" :** Liste paginée de 20+ utilisateurs mockés, filtres fonctionnels, page détail avec actions (suspend, bundle edit) opérationnelles avec mocks.

---

### M17 — Analytics Admin
**Branche :** `feature/frontend-admin-analytics`  
**Durée :** 3 jours  
**Dépendances :** M14, M15

**Fichiers à créer :**

```
frontend/src/routes/admin/analytics/
├── +page.svelte                        # Page analytics principale
└── _components/
    ├── RegistrationChart.svelte        # Taux d'inscription (par jour/mois)
    ├── SubscriptionTrend.svelte        # Taux d'abonnement mensuel
    ├── ConversionFunnel.svelte         # Free → Starter → Pro → Business
    ├── ChurnPanel.svelte               # Abonnements non renouvelés
    ├── UsageRateCard.svelte            # Utilisateurs actifs / inscrits
    ├── GeoDistribution.svelte          # Carte mondiale (SVG ou lib légère)
    ├── TopCountries.svelte             # Classement pays (liste avec barres)
    ├── TimezoneDistribution.svelte     # Distribution GMT
    ├── DownloadOnlyUsers.svelte        # Inscrits sans engagement
    └── DateRangePicker.svelte          # Sélecteur de période pour tous les graphes
```

**Note sur `GeoDistribution` :**  
Une carte monde interactive peut être complexe. Option pragmatique : `TopCountries` avec des barres horizontales couvre 80% du besoin sans la complexité d'une carte. La carte peut être ajoutée en V2 si le temps le permet.

**Critère de "Done" :** Toutes les métriques listées dans le guide sont affichées avec données mockées. Le `DateRangePicker` filtre (côté mock) les résultats.

---

### M18 — Gestion Plateforme Admin
**Branche :** `feature/frontend-admin-platform`  
**Durée :** 2-3 jours  
**Dépendances :** M14

**Fichiers à créer :**

```
frontend/src/routes/admin/
├── settings/
│   ├── +page.svelte                    # Paramètres plateforme (layout en sections)
│   └── _components/
│       ├── BundleConfigEditor.svelte   # Modifier prix, features d'un bundle
│       ├── BundleToggle.svelte         # Activer/désactiver un bundle
│       ├── TemplateManager.svelte      # Liste templates + ajout + suppression
│       ├── TemplateUploadForm.svelte   # Ajouter un template
│       ├── ProjectTypeManager.svelte   # Liste des types de projets
│       └── AIConfigManager.svelte      # AIs disponibles et leur statut
```

**Points UX :**
- Modifications des prix de bundle = **action très risquée**. Ajouter une confirmation explicite avec résumé des changements avant validation.
- `BundleToggle` (désactiver un bundle) doit afficher "X utilisateurs actifs seront affectés" dans la confirmation
- `TemplateManager` : drag-and-drop pour réordonner les templates (ordre d'affichage pour les users)

**Critère de "Done" :** Les 4 sections (bundles, templates, types, AIs) sont éditables avec les mocks. Les confirmations pour actions destructives sont en place.

---

## Niveau 6 — Qualité

---

### M19 — Tests
**Branche :** `feature/frontend-tests`  
**Durée :** 2-3 jours  
**Dépendances :** tous les modules

**Stratégie de tests (Vitest + vitest-browser-svelte) :**

```
Tests unitaires (server) → logique pure, utils, stores
Tests composants (browser) → comportement des composants Svelte
```

**Priorités de tests :**

```
frontend/src/
├── lib/
│   ├── utils/
│   │   ├── format.spec.ts          # formatDate, formatCurrency
│   │   ├── bundle-guard.spec.ts    # Logique permissions bundle — CRITIQUE
│   │   └── validators.spec.ts      # Validations formulaires
│   ├── stores/
│   │   ├── auth.store.spec.ts
│   │   └── bundle.store.spec.ts
│   └── components/
│       ├── ui/
│       │   ├── Button.svelte.spec.ts
│       │   └── Input.svelte.spec.ts
│       └── layout/
│           └── Sidebar.svelte.spec.ts
```

**Ce qu'il faut absolument tester :**
1. `bundle-guard.ts` — si la logique de permissions est fausse, des utilisateurs Free accèdent à des features Pro
2. `format.ts` — `formatCurrency` doit afficher correctement en XAF
3. `auth.store` — les transitions d'état login/logout
4. `DynamicFieldRenderer` — rendu correct pour chaque type de champ

**Critère de "Done" :** `npm test` passe entièrement. Couverture > 80% sur les utils et stores.

---

## Résumé : Ordre d'exécution recommandé

```
Semaine 1
  └── M01 (Schemas) → M02 (Mocks) → M03 (API Client)
  └── M04 (UI Foundation) [en parallèle de M02-M03]

Semaine 2
  └── M05 (Auth)
  └── M06 (Dashboard) + M07 (Project List) [en parallèle]

Semaine 3
  └── M08 (Project Form) [le plus long, 3 jours]
  └── M09 (Bundles) + M10 (Settings) [en parallèle]

Semaine 4
  └── M11 (History)
  └── M12 (AI Streaming) [3 jours]
  └── M13 (Export) [peut chevaucher fin M12]

Semaine 5
  └── M14 (Admin Layout/Auth)
  └── M15 (Admin Dashboard) + M16 (Admin Users) [en parallèle]

Semaine 6
  └── M17 (Admin Analytics) + M18 (Admin Platform) [en parallèle]

Semaine 7
  └── M19 (Tests)
  └── Corrections et polish UI
```

---

## Notes transversales

### Ce qui s'applique à TOUS les modules

**Gestion des états :**  
Chaque appel API a 4 états : `idle | loading | success | error`. Chaque composant qui fait un appel API **doit** gérer ces 4 états visuellement. Pas d'exception.

**Responsive :**  
Tester mobile à chaque module. SvelteKit est SSR par défaut — s'assurer que le rendu initial est correct sans hydration.

**Accessibilité de base :**  
- Tous les boutons ont un label accessible
- Tous les inputs ont un label associé
- Navigation clavier fonctionnelle dans les modals

**Convention de nommage des fichiers :**
- Composants Svelte : `PascalCase.svelte`
- Fichiers TS : `kebab-case.ts`
- Composants locaux à une route : dans un dossier `_components/` dans la route

**Convention de commits :**  
Conformément au guide — commits en anglais, atomiques :
```
feat(dashboard): add bundle status widget
fix(auth): handle 401 redirect correctly
refactor(project-form): extract dynamic field renderer
```

---

*Document créé le 11/05/2026 — À mettre à jour au fil du projet*
