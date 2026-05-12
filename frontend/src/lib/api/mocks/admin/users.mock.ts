import type { User } from '$lib/schemas/user';
import { mockUserList } from '../user.mock';
import { generateMockId } from '../_utils';

export const mockAdminUserList: User[] = [
  ...mockUserList,
  ...Array.from({ length: 10 }, (_, i) => ({
    id: generateMockId('user'),
    nom: `AdminUser${i + 1}`,
    prenom: `Test${i + 1}`,
    email: `adminuser${i + 1}@example.com`,
    userFolderName: `user_adminuser${i + 1}_test${i + 1}`,
    country: ['Cameroon', 'Senegal', 'Ivory Coast'][i % 3],
    town: ['Douala', 'Dakar', 'Abidjan'][i % 3],
    gmt: [1, 0, -1][i % 3],
    createdAt: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: i % 4 === 0 ? null : new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
    isActive: i % 5 !== 0,
  })),
];