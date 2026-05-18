// src/lib/utils/bundle-guard.ts
import type { BundleType } from '$lib/schemas'; // Assure-toi que ce type existe dans tes schémas M01

// Définition des niveaux de bundles (du plus bas au plus haut)
const BUNDLE_RANKS: Record<BundleType, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3
};

// Vérifie si le bundle actuel est suffisant
export function hasBundleLevel(current: BundleType, required: BundleType): boolean {
  return BUNDLE_RANKS[current] >= BUNDLE_RANKS[required];
}

// Fonction spécifique pour vérifier l'accès à une fonctionnalité précise
export type Feature = 'export_no_watermark' | 'duplicate_project' | 'ai_streaming';

export function isFeatureAllowed(feature: Feature, currentBundle: BundleType): boolean {
  switch (feature) {
    case 'export_no_watermark':
      return hasBundleLevel(currentBundle, 'starter'); // Starter minimum
    case 'duplicate_project':
      return hasBundleLevel(currentBundle, 'pro'); // Pro minimum
    case 'ai_streaming':
      return hasBundleLevel(currentBundle, 'starter'); // Accessible dès Starter
    default:
      return false;
  }
}