import type { Certification, Training } from "@/lib/types";

/**
 * Certifications.
 * Règle : une certification n'apparaît comme « obtenue » que si `status: "obtenue"` ET `verified: true`.
 * L'entrée ci-dessous est un modèle (`example: true`) à supprimer ou remplacer.
 */
export const certifications: Certification[] = [
  {
    id: "exemple-certification",
    name: "[Nom de la certification visée]",
    issuer: "[Organisme]",
    status: "planifiée",
    verified: false,
    example: true,
  },
];

/** Formations complémentaires (cours en ligne, ateliers, MOOC…). */
export const trainings: Training[] = [
  {
    id: "exemple-formation",
    name: "[Nom de la formation complémentaire]",
    provider: "[Plateforme / organisme]",
    example: true,
  },
];
