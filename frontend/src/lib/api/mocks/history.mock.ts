import type { HistoryEntry, HistoryAction, HistoryResponse, HistoryFilters } from '$lib/schemas/history';
import { generateMockId, now, oneWeekAgo, oneMonthAgo } from './_utils';
import { mockUser, mockUserList } from './user.mock';
import { mockProjectList } from './project.mock';

const historyActions: HistoryAction[] = [
  'subscription', 'project_create', 'project_update', 'project_delete',
  'project_duplicate', 'project_export', 'ai_generate', 'login', 'logout'
];

function generateHistory(userId: string, email: string, count: number): HistoryEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const action = historyActions[i % historyActions.length];
    const randomProject = mockProjectList[Math.floor(Math.random() * mockProjectList.length)];
    let title, reference, metadata: Record<string, unknown> = {};

    switch (action) {
      case 'subscription': title = 'Souscription'; reference = '#Bundle.Pro'; metadata = { bundleType: 'pro' }; break;
      case 'project_create': title = 'Création du projet'; reference = `#${randomProject.name}`; metadata = { projectId: randomProject.id }; break;
      case 'project_update': title = 'Mise à jour'; reference = `#${randomProject.name}`; metadata = { projectId: randomProject.id }; break;
      case 'project_delete': title = 'Suppression'; reference = `#${randomProject.name}`; metadata = { projectId: randomProject.id }; break;
      case 'project_duplicate': title = 'Duplication'; reference = `#${randomProject.name}`; metadata = { projectId: randomProject.id }; break;
      case 'project_export': title = 'Export'; reference = `#${randomProject.name}`; metadata = { projectId: randomProject.id, format: 'pdf' }; break;
      case 'ai_generate': title = 'Génération IA'; reference = `#${randomProject.name}`; metadata = { projectId: randomProject.id }; break;
      case 'login': title = 'Connexion'; reference = email; metadata = { ip: `192.168.1.${i}` }; break;
      case 'logout': title = 'Déconnexion'; reference = email; metadata = {}; break;
    }

    const daysAgo = Math.floor(Math.random() * 30);
    return {
      id: generateMockId('history'),
      userId,
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      title,
      action,
      actionType: action,
      reference,
      metadata,
    };
  });
}

export const mockHistoryList: HistoryEntry[] = [
  ...generateHistory(mockUser.id, mockUser.email, 10),
  ...generateHistory(mockUserList[1].id, mockUserList[1].email, 5),
];

export const mockHistoryResponse: HistoryResponse = {
  entries: mockHistoryList,
  total: mockHistoryList.length,
  page: 1,
  pageSize: 15,
};

export const mockHistoryFilters: HistoryFilters = {
  actionType: 'project_create',
  dateFrom: oneMonthAgo,
  dateTo: now,
};