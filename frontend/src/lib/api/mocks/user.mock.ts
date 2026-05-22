import type {
  User,
  UserRegister,
  UserLogin,
  UserUpdate,
  UserPasswordUpdate,
  AuthResponse,
} from '$lib/schemas/user';
import { generateMockId, now, oneWeekAgo, oneMonthAgo, twoMonthsAgo } from './_utils';

// --- Mock principal ---
export const mockUser: User = {
  id: generateMockId('user'),
  nom: 'Tate',
  prenom: 'Boris',
  email: 'boris.tate@example.com',
  userFolderName: 'user_boris_tate',
  country: 'Cameroon',
  town: 'Douala',
  gmt: 1,
  createdAt: oneWeekAgo,
  lastLogin: now,
  isActive: true,
};

// --- Liste de 20+ utilisateurs ---
export const mockUserList: User[] = [
  mockUser,
  {
    id: generateMockId('user'),
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    userFolderName: 'user_jean_dupont',
    country: 'France',
    town: 'Paris',
    gmt: 1,
    createdAt: oneMonthAgo,
    lastLogin: now,
    isActive: true,
  },
  {
    id: generateMockId('user'),
    nom: 'Nguimfack',
    prenom: 'Alice',
    email: 'alice.nguimfack@example.com',
    userFolderName: 'user_alice_nguimfack',
    country: 'Cameroon',
    town: 'Yaounde',
    gmt: 1,
    createdAt: twoMonthsAgo,
    lastLogin: '2026-05-10T14:30:00Z',
    isActive: false,
  },
  ...Array.from({ length: 17 }, (_, i) => ({
    id: generateMockId('user'),
    nom: `User${i + 1}`,
    prenom: `Test${i + 1}`,
    email: `test${i + 1}@example.com`,
    userFolderName: `user_test${i + 1}_user${i + 1}`,
    country: i % 2 === 0 ? 'Cameroon' : 'Senegal',
    town: i % 2 === 0 ? 'Douala' : 'Dakar',
    gmt: i % 2 === 0 ? 1 : 0,
    createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: i % 3 === 0 ? null : new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
    isActive: i % 4 !== 0,
  })),
];

// --- Payloads ---
export const mockUserRegister: UserRegister = {
  nom: 'Nouveau',
  prenom: 'Utilisateur',
  email: 'nouveau@example.com',
  password: 'SecurePassword123!',
  country: 'Cameroon',
  town: 'Bafoussam',
  gmt: 1,
};

export const mockUserLogin: UserLogin = {
  email: 'boris.tate@example.com',
  password: 'SecurePassword123!',
};

export const mockUserUpdate: UserUpdate = {
  nom: 'Tate-Updated',
  town: 'Yaounde',
  gmt: 1,
};

export const mockUserPasswordUpdate: UserPasswordUpdate = {
  currentPassword: 'OldPassword123!',
  newPassword: 'NewSecurePassword456!',
};

// --- Réponse de connexion (SANS expiresAt) ---
export const mockAuthResponse: AuthResponse = {
  user: mockUser,
  token: 'mock_jwt_token_abc123xyz',
};

// --- Helpers ---
export const mockInactiveUser: User = {
  ...mockUser,
  id: generateMockId('user'),
  email: 'inactive@example.com',
  userFolderName: 'user_inactive_user',
  isActive: false,
};

export const mockUserNeverLoggedIn: User = {
  ...mockUser,
  id: generateMockId('user'),
  email: 'no-login@example.com',
  userFolderName: 'user_no_login',
  lastLogin: null,
};