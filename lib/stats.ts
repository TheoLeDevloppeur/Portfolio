import { certifications } from "@/data/certifications";
import { contact } from "@/data/contact";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import type { AvailabilityState } from "@/lib/types";
import { isSafeExternalUrl, isValidEmail } from "@/lib/utils";

/**
 * Indicateurs du tableau de bord `status`.
 * Tout est calculé à partir des fichiers de `data/` : aucune métrique système n'est inventée.
 */
export function getPortfolioStats() {
  const realProjects = projects.filter((p) => !p.example);
  return {
    skillCategories: skillCategories.map((c) => ({ id: c.id, title: c.title, count: c.items.length })),
    projectsTotal: projects.length,
    projectsDocumented: realProjects.length,
    projectsExample: projects.length - realProjects.length,
    certificationsObtained: certifications.filter((c) => c.status === "obtenue" && c.verified && !c.example).length,
    availability: profile.availability,
    interests: profile.interests,
    lastUpdated: profile.lastUpdated,
    contactConfigured: isValidEmail(contact.email) || isSafeExternalUrl(contact.linkedin),
  };
}

export type PortfolioStats = ReturnType<typeof getPortfolioStats>;

export const availabilityTone: Record<AvailabilityState, { label: string; dot: string }> = {
  open: { label: "OPEN", dot: "bg-ok" },
  limited: { label: "LIMITED", dot: "bg-warn" },
  unavailable: { label: "UNAVAILABLE", dot: "bg-err" },
  unset: { label: "NOT SET", dot: "bg-muted" },
};
