// frontend/src/lib/api/mocks/mocks.spec.ts
import { describe, it, expect } from 'vitest';
import {
  mockUser,
  mockUserList,
  mockBundleList,
  mockProjectList,
  mockProjectDetail,
  mockTemplateList,
  mockProjectTypeList,
  mockHistoryList,
  mockAdminUserList,
  mockUserStats,
  mockLiveConnected,
  mockAdminEventList
} from '$lib/api/mocks';

describe('Fixtures — intégrité des données mock', () => {

  it('mockUserList contient au moins un utilisateur', () => {
    console.log(`- Utilisateurs: ${mockUserList.length}`);
    expect(mockUserList.length).toBeGreaterThan(0);
  });

  it('mockUser est un utilisateur valide', () => {
    expect(mockUser).toHaveProperty('id');
    expect(mockUser).toHaveProperty('email');
    expect(mockUser).toHaveProperty('nom');
  });

  it('mockBundleList contient les 4 offres', () => {
    console.log(`- Bundles: ${mockBundleList.length}`);
    expect(mockBundleList.length).toBeGreaterThan(0);
  });

  it('mockProjectList contient au moins un projet', () => {
    console.log(`- Projets: ${mockProjectList.length}`);
    expect(mockProjectList.length).toBeGreaterThan(0);
  });

  it('mockProjectDetail contient les données IA', () => {
    expect(mockProjectDetail).toHaveProperty('data');
  });

  it('mockTemplateList contient au moins un template', () => {
    console.log(`- Templates: ${mockTemplateList.length}`);
    expect(mockTemplateList.length).toBeGreaterThan(0);
  });

  it('mockProjectTypeList contient au moins un type', () => {
    console.log(`- Types de projets: ${mockProjectTypeList.length}`);
    expect(mockProjectTypeList.length).toBeGreaterThan(0);
  });

  it('mockHistoryList contient des entrées', () => {
    console.log(`- Historique: ${mockHistoryList.length}`);
    expect(mockHistoryList.length).toBeGreaterThan(0);
  });

  it('mockAdminUserList contient des utilisateurs', () => {
    console.log(`- Utilisateurs admin: ${mockAdminUserList.length}`);
    expect(mockAdminUserList.length).toBeGreaterThan(0);
  });

  it('mockAdminEventList contient des événements', () => {
    console.log(`- Événements admin: ${mockAdminEventList.length}`);
    expect(mockAdminEventList.length).toBeGreaterThan(0);
  });

  it('mockLiveConnected a une structure valide', () => {
    expect(mockLiveConnected).toHaveProperty('count');
  });

  it('mockUserStats a une structure valide', () => {
    expect(mockUserStats).toHaveProperty('totalUsers');
  });

});