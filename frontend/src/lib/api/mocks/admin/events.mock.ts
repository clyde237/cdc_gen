import type { AdminEvent, EventType } from '$lib/schemas/admin/events';
import { generateMockId, now, oneWeekAgo, oneMonthAgo } from '../_utils';
import { mockAdminUserList } from './users.mock';

const eventTypes: EventType[] = [
  'visit', 'register', 'login', 'logout', 'subscribe',
  'unsubscribe', 'project_create', 'project_export', 'download', 'ai_generate'
];

function generateAdminEvents(count: number): AdminEvent[] {
  return Array.from({ length: count }, (_, i) => {
    const eventType = eventTypes[i % eventTypes.length];
    const randomUser = mockAdminUserList[Math.floor(Math.random() * mockAdminUserList.length)];
    const isGuest = eventType === 'visit' || eventType === 'download';

    return {
      id: generateMockId('event'),
      eventType,
      userId: isGuest ? null : randomUser.id,
      bundleType: isGuest ? null : ['free', 'starter', 'pro', 'business'][Math.floor(Math.random() * 4)] as EventType extends 'subscribe' | 'unsubscribe' ? EventType : never,
      country: randomUser.country,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Mozilla/5.0 (Linux; Android 10)',
      ][Math.floor(Math.random() * 3)],
      metadata: generateMetadata(eventType, randomUser.id),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

function generateMetadata(eventType: EventType, userId: string): Record<string, unknown> {
  switch (eventType) {
    case 'register': return { referrer: Math.random() > 0.5 ? 'google.com' : 'direct' };
    case 'subscribe': return { previousBundle: 'free', newBundle: 'starter' };
    case 'project_create': return { projectId: generateMockId('proj'), projectName: 'Nouveau Projet' };
    case 'project_export': return { projectId: generateMockId('proj'), format: 'pdf' };
    case 'ai_generate': return { projectId: generateMockId('proj'), model: 'mistral' };
    case 'download': return { projectId: null, isGuest: true };
    default: return {};
  }
}

export const mockAdminEventList: AdminEvent[] = generateAdminEvents(50);