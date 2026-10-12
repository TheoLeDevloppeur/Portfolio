/**
 * Types partagés par les fichiers de données (`data/`) et les composants.
 * Modifier les données ne nécessite pas de toucher à ce fichier.
 */

/** Disponibilité professionnelle affichée dans le tableau de bord `status`. */
export type AvailabilityState = "open" | "limited" | "unavailable" | "unset";

export interface Profile {
  firstName: string;
  lastName: string;
  /** Nom affiché en grand dans le terminal (`whoami`). */
  displayName: string;
  /** Utilisateur et hôte du prompt : `user@host:~$`. */
  promptUser: string;
  promptHost: string;
  role: string;
  tagline: string;
  bio: string;
  about: {
    paragraphs: string[];
    approach: { title: string; text: string }[];
    /** `true` tant que les textes n'ont pas été relus et validés. */
    draft: boolean;
  };
  location?: string;
  availability: { state: AvailabilityState; label: string };
  interests: string[];
  /** Date de dernière mise à jour du portfolio (format ISO AAAA-MM-JJ). */
  lastUpdated: string;
  siteUrl: string;
}

/** Niveau de maîtrise optionnel, uniquement s'il est renseigné par l'auteur. */
export type SkillLevel = "notions" | "pratique" | "autonome" | "avancé";

export interface SkillItem {
  name: string;
  level?: SkillLevel;
  /** Exemple concret d'utilisation (projet, lab, stage…). */
  evidence?: string;
  /** Slug d'un projet qui démontre la compétence. */
  projectSlug?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  items: SkillItem[];
}

export interface ProjectStep {
  title: string;
  detail: string;
}

export interface ProjectChallenge {
  problem: string;
  solution: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Catégorie principale (sert au filtrage). */
  category: string;
  summary: string;
  /** `true` pour un projet de démonstration dont le contenu reste à remplacer. */
  example: boolean;
  status: "en cours" | "terminé" | "planifié";
  year?: string;
  problem: string;
  objectives: string[];
  architecture: { description: string; components: { name: string; role: string }[] };
  technologies: string[];
  steps: ProjectStep[];
  security: string[];
  /** Résultat réel. Laisser vide tant qu'il n'est pas documenté. */
  result: string;
  media: ProjectMedia[];
  challenges: ProjectChallenge[];
  skills: string[];
  links?: { label: string; href: string }[];
}

export interface TimelineEntry {
  id: string;
  kind: "formation" | "expérience";
  title: string;
  organization: string;
  location?: string;
  period: string;
  current?: boolean;
  description: string;
  highlights: string[];
  /** `true` si l'entrée est un modèle à compléter. */
  placeholder: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  /** Une certification n'est affichée comme « obtenue » que si `status === "obtenue"` ET `verified === true`. */
  status: "obtenue" | "en préparation" | "planifiée";
  verified: boolean;
  date?: string;
  credentialUrl?: string;
  example: boolean;
}

export interface Training {
  id: string;
  name: string;
  provider: string;
  date?: string;
  example: boolean;
}

export interface ContactInfo {
  /** Laisser vide ("") tant que l'adresse n'est pas choisie : les boutons s'affichent alors désactivés. */
  email: string;
  linkedin: string;
  github: string;
  /** Chemin public du CV (dans /public). Le bouton n'est actif que si le fichier existe. */
  cvPath: string;
  cvFileName: string;
}

export interface LabNode {
  id: string;
  name: string;
  role: string;
  os: string;
  segment: string;
  address: string;
  services: string[];
}

export interface LabSegment {
  id: string;
  name: string;
  vlan: string;
  subnet: string;
  gateway: string;
  purpose: string;
}

export interface HomeLab {
  /** `true` tant que les données sont fictives. */
  example: boolean;
  summary: string;
  hypervisor: { name: string; detail: string };
  segments: LabSegment[];
  nodes: LabNode[];
  environments: { name: string; description: string }[];
  experiments: { title: string; description: string; status: "réalisé" | "en cours" | "idée"; projectSlug?: string }[];
  media: ProjectMedia[];
  documentation: { label: string; href: string }[];
}
