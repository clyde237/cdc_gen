import type { Template } from '$lib/schemas/template';
import { generateMockId } from './_utils';

export const mockTemplateList: Template[] = [
  {
    id: generateMockId('template'),
    name: 'Template Moderne',
    description: 'Design épuré pour les CDC modernes.',
    minBundle: 'free',
    previewImage: '/thumbnails/template_moderne.png',
    category: 'Professionnel',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: generateMockId('template'),
    name: 'Template Classique',
    description: 'Structure traditionnelle pour les documents formels.',
    minBundle: 'free',
    previewImage: '/thumbnails/template_classique.png',
    category: 'Formel',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: generateMockId('template'),
    name: 'Template Technique',
    description: 'Optimisé pour les spécifications techniques.',
    minBundle: 'starter',
    previewImage: '/thumbnails/template_technique.png',
    category: 'Technique',
    displayOrder: 3,
    isActive: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: generateMockId('template'),
    name: 'Template Commercial',
    description: 'Conçu pour les propositions commerciales.',
    minBundle: 'pro',
    previewImage: '/thumbnails/template_commercial.png',
    category: 'Commercial',
    displayOrder: 4,
    isActive: true,
    createdAt: '2026-04-10T00:00:00Z',
  },
];