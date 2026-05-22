import type {
  Project,
  ProjectDetail,
  ProjectCreate,
  ProjectUpdate,
  ExportRequest,
  ExportResponse,
} from '$lib/schemas/project';
import { generateMockId, now, oneWeekAgo, oneMonthAgo, twoMonthsAgo } from './_utils';
import { mockUser, mockUserList } from './user.mock';
import { mockProjectTypeList } from './project-type.mock';
import { mockTemplateList } from './template.mock';
import { mockProjectDataSaas, mockProjectDataMobile } from './project-type.mock';

// --- Mocks des projets ---
export const mockProject: Project = {
  id: generateMockId('proj'),
  userId: mockUser.id,
  name: 'CDC Plateforme SaaS',
  projetType: mockProjectTypeList[0].id,
  template: mockTemplateList[0].id,
  mainAI_API: 'mistral',
  createdAt: oneWeekAgo,
  lastModif: now,
  dataFile: `users/${mockUser.userFolderName}/ProjetsFolder/${generateMockId('proj')}.json`,
};

export const mockProjectList: Project[] = [
  mockProject,
  {
    id: generateMockId('proj'),
    userId: mockUser.id,
    name: 'CDC Application Mobile',
    projetType: mockProjectTypeList[1].id,
    template: mockTemplateList[2].id,
    mainAI_API: 'mistral',
    createdAt: oneMonthAgo,
    lastModif: '2026-05-08T10:00:00Z',
    dataFile: `users/${mockUser.userFolderName}/ProjetsFolder/${generateMockId('proj')}.json`,
  },
  {
    id: generateMockId('proj'),
    userId: mockUserList[1].id,
    name: 'Spécifications Techniques',
    projetType: mockProjectTypeList[2].id,
    template: mockTemplateList[2].id,
    mainAI_API: 'mistral',
    createdAt: twoMonthsAgo,
    lastModif: '2026-04-25T09:30:00Z',
    dataFile: `users/${mockUserList[1].userFolderName}/ProjetsFolder/${generateMockId('proj')}.json`,
  },
];

// --- Projet détaillé (avec data) ---
export const mockProjectDetail: ProjectDetail = {
  ...mockProject,
  data: mockProjectDataSaas,
};

export const mockProjectDetailMobile: ProjectDetail = {
  ...mockProjectList[1],
  data: mockProjectDataMobile,
};

// --- Payloads ---
export const mockProjectCreate: ProjectCreate = {
  name: 'Nouveau Projet',
  projetType: mockProjectTypeList[0].id,
  template: mockTemplateList[0].id,
  mainAI_API: 'mistral',
};

export const mockProjectUpdate: ProjectUpdate = {
  name: 'Projet Renommé',
  template: mockTemplateList[1].id,
  data: { titre: 'Titre mis à jour' },
};

// --- Export ---
export const mockExportRequest: ExportRequest = {
  projectId: mockProject.id,
  format: 'pdf',
};

export const mockExportResponse: ExportResponse = {
  downloadUrl: 'https://cdn.cdc-gen.com/exports/proj_abc123.pdf?token=xyz456&expires=1715424000',
  exportsRemaining: 18,
};