import type { ContactInfo } from "@/lib/types";

/**
 * Coordonnées professionnelles.
 * - Laisse une valeur vide ("") tant qu'elle n'est pas définie : le bouton correspondant
 *   s'affiche alors comme « non configuré » au lieu de mener vers un lien cassé.
 * - Le CV doit être déposé dans /public (par défaut : /public/cv/theo-nussbaum-cv.pdf).
 */
export const contact: ContactInfo = {
  email: "",
  linkedin: "",
  github: "",
  cvPath: "/cv/theo-nussbaum-cv.pdf",
  cvFileName: "Theo-Nussbaum-CV.pdf",
};
