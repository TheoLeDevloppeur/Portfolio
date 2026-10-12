import type { SkillCategory } from "@/lib/types";

/**
 * `true` tant que la liste n'a pas été validée : un bandeau l'indique sur la page Skills.
 * Passe à `false` après avoir relu chaque catégorie.
 */
export const skillsNeedReview = true;

/**
 * Compétences par catégorie.
 * - `level` est optionnel : il n'est affiché que s'il est renseigné ("notions" | "pratique" | "autonome" | "avancé").
 * - `evidence` décrit un exemple concret ; `projectSlug` crée un lien vers un projet.
 * Aucune barre de progression n'est affichée volontairement.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "windows",
    title: "Systèmes Windows",
    description: "Installation, configuration et maintenance de postes et serveurs Windows.",
    items: [
      { name: "Windows 11", projectSlug: "windows-11-hardening" },
      { name: "Windows Server" },
      { name: "PowerShell (administration)" },
      { name: "Gestion des mises à jour" },
    ],
  },
  {
    id: "active-directory",
    title: "Active Directory & GPO",
    description: "Services d'annuaire, gestion des identités et application de stratégies de groupe.",
    items: [
      { name: "AD DS", projectSlug: "windows-11-hardening" },
      { name: "Stratégies de groupe (GPO)", projectSlug: "windows-11-hardening" },
      { name: "DNS intégré à AD" },
      { name: "Unités d'organisation & délégation" },
    ],
  },
  {
    id: "linux",
    title: "Linux",
    description: "Administration de distributions Linux en ligne de commande.",
    items: [
      { name: "Debian / Ubuntu Server" },
      { name: "Bash" },
      { name: "systemd & journaux" },
      { name: "Gestion des droits et des paquets" },
    ],
  },
  {
    id: "network",
    title: "Réseaux & protocoles",
    description: "Conception et dépannage de réseaux locaux.",
    items: [
      { name: "Modèle OSI / TCP-IP" },
      { name: "Adressage IPv4 & sous-réseaux" },
      { name: "VLAN" },
      { name: "DHCP · DNS" },
    ],
  },
  {
    id: "virtualization",
    title: "Virtualisation",
    description: "Création et gestion d'environnements virtualisés pour les tests et l'exploitation.",
    items: [
      { name: "Hyperviseur de type 1" },
      { name: "Hyperviseur de type 2" },
      { name: "Snapshots & modèles de VM" },
    ],
  },
  {
    id: "security",
    title: "Cybersécurité & hardening",
    description: "Réduction de la surface d'attaque et application des bonnes pratiques de sécurité.",
    items: [
      { name: "Durcissement Windows", projectSlug: "windows-11-hardening" },
      { name: "Principe du moindre privilège" },
      { name: "Référentiels de sécurité (ex. CIS Benchmarks)" },
    ],
  },
  {
    id: "scripting",
    title: "Scripting & automatisation",
    description: "Automatisation des tâches d'administration récurrentes.",
    items: [{ name: "PowerShell" }, { name: "Bash" }],
  },
  {
    id: "monitoring",
    title: "Monitoring & dépannage",
    description: "Supervision, diagnostic et résolution d'incidents.",
    items: [
      { name: "Observateur d'événements Windows" },
      { name: "Analyse de journaux" },
      { name: "Outils de diagnostic réseau" },
      { name: "Méthodologie de dépannage" },
    ],
  },
];
