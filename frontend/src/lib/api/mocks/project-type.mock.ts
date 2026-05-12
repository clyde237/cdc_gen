import type { FieldType, ProjectType, ProjectTypeField, ProjectData } from '$lib/schemas/project_type';
import { generateMockId } from './_utils';

// --- Champs pour un CDC SaaS ---
const cdcSaasFields: ProjectTypeField[] = [
  { key: 'titre', label: 'Titre du projet', type: 'text', required: true, displayOrder: 1 },
  { key: 'description', label: 'Description', type: 'textarea', required: true, displayOrder: 2 },
  { key: 'objectifs', label: 'Objectifs', type: 'textarea', required: true, displayOrder: 3 },
  { key: 'publicCible', label: 'Public Cible', type: 'text', required: true, displayOrder: 4 },
  { key: 'fonctionnalites', label: 'Fonctionnalités', type: 'textarea', required: true, displayOrder: 5 },
  { key: 'contraintesTechniques', label: 'Contraintes Techniques', type: 'textarea', required: false, displayOrder: 6 },
  { key: 'budget', label: 'Budget (XAF)', type: 'number', required: false, min: 0, max: 100000000, displayOrder: 7 },
  { key: 'delai', label: 'Délai (jours)', type: 'number', required: false, min: 1, max: 730, displayOrder: 8 },
];

// --- Champs pour un CDC Mobile ---
const cdcMobileFields: ProjectTypeField[] = [
  { key: 'titre', label: 'Titre', type: 'text', required: true, displayOrder: 1 },
  { key: 'description', label: 'Description', type: 'textarea', required: true, displayOrder: 2 },
  { key: 'plateformes', label: 'Plateformes', type: 'select', required: true, options: ['iOS', 'Android', 'Les deux'], displayOrder: 3 },
  { key: 'fonctionnalites', label: 'Fonctionnalités', type: 'textarea', required: true, displayOrder: 4 },
  { key: 'technologies', label: 'Technologies', type: 'text', required: false, displayOrder: 5 },
];

// --- Types de projets ---
export const mockProjectTypeList: ProjectType[] = [
  {
    id: generateMockId('projtype'),
    name: 'CDC SaaS',
    description: 'Cahier des Charges pour une application SaaS.',
    fields: cdcSaasFields,
    icon: 'server',
    isActive: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: generateMockId('projtype'),
    name: 'CDC Mobile',
    description: 'Cahier des Charges pour une application mobile.',
    fields: cdcMobileFields,
    icon: 'smartphone',
    isActive: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: generateMockId('projtype'),
    name: 'Spécifications Techniques',
    description: 'Document technique détaillé.',
    fields: [
      { key: 'titre', label: 'Titre', type: 'text', required: true, displayOrder: 1 },
      { key: 'contexte', label: 'Contexte', type: 'textarea', required: true, displayOrder: 2 },
      { key: 'exigencesFonctionnelles', label: 'Exigences Fonctionnelles', type: 'textarea', required: true, displayOrder: 3 },
      { key: 'exigencesTechniques', label: 'Exigences Techniques', type: 'textarea', required: true, displayOrder: 4 },
    ],
    icon: 'file-text',
    isActive: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
];

// --- Exemples de ProjectData ---
export const mockProjectDataSaas: ProjectData = {
  titre: 'CDC-Gen - Plateforme SaaS',
  description: 'Plateforme de génération de CDC assistée par IA.',
  objectifs: 'Automatiser la création de CDC\nRéduire le temps de rédaction',
  publicCible: 'Startups, PME, Freelances',
  fonctionnalites: 'Génération par IA\nGestion des templates',
  contraintesTechniques: 'Mistral AI, FastAPI, SvelteKit',
  budget: 5000000,
  delai: 90,
};

export const mockProjectDataMobile: ProjectData = {
  titre: 'App Mobile',
  description: 'Application mobile pour la gestion des tâches.',
  plateformes: 'Les deux',
  fonctionnalites: 'Création de tâches\nSynchronisation cloud',
  technologies: 'React Native, Firebase',
};