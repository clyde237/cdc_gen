import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';

export interface ExportOptions {
  /** Format d'export — seul 'pdf' est supporté pour l'instant */
  format: 'pdf';
  /** Si true, l'export ne contiendra pas de filigrane CDC-Gen */
  withoutWatermark?: boolean;
}

export interface ExportResult {
  /** URL temporaire de téléchargement du fichier généré */
  downloadUrl: string;
  /** Nom du fichier suggéré pour le téléchargement */
  filename: string;
  /** Indique si le filigrane est présent */
  hasWatermark: boolean;
  /** Nombre d'exports sans filigrane restants ce mois-ci */
  remainingExportsNoWatermark: number | 'unlimited';
}

export const exportApi = {
  /**
   * Exporter un projet en PDF.
   *
   * Le backend vérifie automatiquement le quota d'exports sans filigrane
   * du bundle courant. Si le quota est dépassé :
   * - Offre Free    → facture 500 XAF par export ou retourne 4032
   * - Autres offres → export avec filigrane automatiquement
   *
   * @param projectId - L'ID du projet à exporter
   * @param options   - Options d'export (format, filigrane)
   */
  exportProject: (
    projectId: string,
    options: ExportOptions = { format: 'pdf', withoutWatermark: true }
  ): Promise<ApiResponse<ExportResult>> =>
    apiFetch<ExportResult>(`/api/export/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(options),
    }),
};