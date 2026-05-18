import { USE_MOCKS } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import { ApiErrors } from '$lib/schemas';

export interface GenerateRequest {
  projectId: string;
  /** Champs du formulaire projet à transmettre à l'IA */
  formData: Record<string, string | number | boolean | null>;
  /** Modèle IA à utiliser (défaut: 'mistral') */
  model?: string;
}

export interface GenerateStreamCallbacks {
  /** Appelé à chaque chunk de texte reçu */
  onChunk: (chunk: string) => void;
  /** Appelé quand la génération est terminée */
  onComplete: (fullText: string) => void;
  /** Appelé en cas d'erreur */
  onError: (error: string) => void;
}

// Contenu mock simulant une génération IA réaliste
const MOCK_CDC_CONTENT = `
# Cahier des Charges — Application Mobile

## 1. Contexte et Présentation du Projet

Ce document définit les spécifications fonctionnelles et techniques du projet.
L'objectif principal est de créer une solution digitale répondant aux besoins
identifiés lors de la phase d'analyse.

## 2. Objectifs du Projet

### 2.1 Objectifs Principaux
- Offrir une interface intuitive et accessible sur mobile
- Garantir la performance et la disponibilité du service
- Assurer la sécurité des données utilisateurs

### 2.2 Indicateurs de Succès
- Taux d'adoption à 3 mois : > 60%
- Note de satisfaction utilisateur : > 4/5
- Temps de chargement : < 2 secondes

## 3. Périmètre Fonctionnel

### 3.1 Fonctionnalités Principales
Les fonctionnalités suivantes constituent le cœur du produit...
`.trim();

/**
 * aiApi — Génération de contenu par l'IA
 *
 * Interface unifiée pour le streaming, que ce soit en mode mock ou réel.
 * Le composant appelant reçoit les chunks via des callbacks — il ne sait
 * pas si c'est un mock ou un vrai SSE.
 */
export const aiApi = {
  /**
   * Générer le contenu d'un projet via l'IA.
   *
   * En mode mock : simule un streaming token par token avec délai.
   * En mode réel : ouvre une connexion SSE vers le backend FastAPI.
   *
   * @example
   * ```typescript
   * await aiApi.generate(
   *   { projectId: 'proj_001', formData: { contexte: '...' } },
   *   {
   *     onChunk: (chunk) => { content += chunk },
   *     onComplete: (full) => { saveContent(full) },
   *     onError: (err) => { showError(err) },
   *   }
   * );
   * ```
   */
  generate: async (
    request: GenerateRequest,
    callbacks: GenerateStreamCallbacks
  ): Promise<void> => {
    if (USE_MOCKS) {
      return streamMock(callbacks);
    }
    return streamReal(request, callbacks);
  },

  /**
   * Annuler une génération en cours.
   * Retourne un AbortController que l'on passe à generate() en option avancée.
   * Pour l'instant, en mode mock, l'annulation n'est pas implémentée.
   */
  createAbortController: (): AbortController => new AbortController(),
};

// --- Implémentation Mock ---
async function streamMock(callbacks: GenerateStreamCallbacks): Promise<void> {
  const words = MOCK_CDC_CONTENT.split(' ');
  let accumulated = '';

  for (const word of words) {
    const chunk = word + ' ';
    accumulated += chunk;
    callbacks.onChunk(chunk);
    // Délai variable pour simuler le rythme naturel d'une IA
    await sleep(40 + Math.random() * 60);
  }

  callbacks.onComplete(accumulated.trim());
}

// --- Implémentation Réelle (SSE) ---
async function streamReal(
  request: GenerateRequest,
  callbacks: GenerateStreamCallbacks
): Promise<void> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const token = localStorage.getItem('token');

  // Pour le streaming, on utilise fetch avec ReadableStream
  // Le backend FastAPI doit exposer un endpoint SSE sur /api/ai/generate
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(request),
    });
  } catch {
    callbacks.onError('Impossible de joindre le serveur de génération.');
    return;
  }

  if (!response.ok || !response.body) {
    callbacks.onError(`Erreur serveur : ${response.status}`);
    return;
  }

  // Lecture du stream chunk par chunk
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulated += chunk;
      callbacks.onChunk(chunk);
    }

    callbacks.onComplete(accumulated);
  } catch (error) {
    callbacks.onError(`Erreur pendant la génération : ${error}`);
  } finally {
    reader.releaseLock();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}