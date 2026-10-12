import type { Project } from "@/lib/types";

/**
 * Projets techniques.
 * - `example: true` affiche un badge « EXEMPLE » : passe à `false` lorsque le contenu est réel.
 * - `result` : laisser vide tant que le résultat n'est pas documenté (un message « à compléter » s'affiche).
 * - `media` : images à placer dans /public/projects/<slug>/ (ex. { src: "/projects/windows-11-hardening/gpo.png", alt: "…" }).
 */
export const projects: Project[] = [
  {
    slug: "windows-11-hardening",
    title: "Windows 11 Hardening — Active Directory & GPO",
    category: "Sécurité",
    summary:
      "Projet de sécurisation de postes Windows 11 dans un environnement de test Active Directory, avec application de stratégies de groupe et évaluation de mesures de durcissement.",
    example: true,
    status: "en cours",
    year: "",
    problem:
      "[Exemple à adapter] Des postes Windows 11 installés avec la configuration par défaut exposent une surface d'attaque inutile (services, comptes locaux, paramètres permissifs). L'objectif est de définir et d'appliquer une configuration durcie de manière centralisée.",
    objectives: [
      "Mettre en place un domaine Active Directory de test.",
      "Définir une ligne de base de sécurité pour les postes Windows 11.",
      "Appliquer les paramètres de durcissement via des stratégies de groupe (GPO).",
      "Vérifier l'application des stratégies et évaluer l'impact sur l'utilisation.",
    ],
    architecture: {
      description:
        "[Schéma indicatif — à remplacer] Environnement isolé et virtualisé comprenant un contrôleur de domaine et un ou plusieurs postes clients joints au domaine.",
      components: [
        { name: "Contrôleur de domaine", role: "Windows Server — AD DS, DNS, gestion des GPO" },
        { name: "Postes clients", role: "Windows 11 joints au domaine" },
        { name: "Hyperviseur", role: "Hébergement des machines virtuelles du lab" },
      ],
    },
    technologies: ["Windows 11", "Windows Server", "Active Directory", "GPO", "PowerShell"],
    steps: [
      { title: "Préparation du lab", detail: "[À compléter] Création des machines virtuelles et du réseau isolé." },
      { title: "Déploiement d'AD DS", detail: "[À compléter] Promotion du contrôleur de domaine, structure des OU." },
      { title: "Définition de la ligne de base", detail: "[À compléter] Choix des paramètres de durcissement et du référentiel utilisé." },
      { title: "Application des GPO", detail: "[À compléter] Création, liaison et filtrage des stratégies." },
      { title: "Vérification", detail: "[À compléter] Contrôle de l'application (ex. gpresult) et tests fonctionnels." },
    ],
    security: [
      "[À compléter] Mesures de durcissement effectivement appliquées.",
      "[À compléter] Gestion des comptes et des privilèges.",
      "[À compléter] Journalisation et audit.",
    ],
    result: "",
    media: [],
    challenges: [
      {
        problem: "[À compléter] Difficulté rencontrée.",
        solution: "[À compléter] Solution mise en place.",
      },
    ],
    skills: ["Active Directory", "Stratégies de groupe", "Durcissement Windows", "Documentation technique"],
    links: [],
  },
];
