import type { Profile } from "@/lib/types";

/**
 * Profil personnel — informations affichées par `whoami`, `about`, `neofetch` et `status`.
 * Tous les textes marqués « à compléter » sont à remplacer par tes informations réelles.
 */
export const profile: Profile = {
  firstName: "Théo",
  lastName: "Nussbaum",
  displayName: "THÉO NUSSBAUM",
  promptUser: "théo",
  promptHost: "portfolio",
  role: "IT SYSTEMS & OPERATIONS",
  tagline: "Étudiant ES · Informatique systèmes et exploitation",
  bio: "Passionné par les infrastructures informatiques, l'administration systèmes, les réseaux, l'automatisation et la cybersécurité. J'aime comprendre le fonctionnement des systèmes, résoudre des problèmes et concevoir des environnements fiables et sécurisés.",
  about: {
    paragraphs: [
      "Je suis actuellement en formation ES en informatique, orientation systèmes et exploitation. Cette formation me permet d'approfondir l'administration de serveurs et de postes de travail, les réseaux, la virtualisation et la sécurité des infrastructures.",
      "Ce qui me motive, c'est de comprendre comment les systèmes fonctionnent réellement : pourquoi un service tombe, comment une stratégie de groupe s'applique, ce qui se passe sur le réseau lorsqu'un poste s'authentifie. J'utilise mon laboratoire personnel pour tester, casser et reconstruire des environnements.",
      "[À compléter : ton parcours avant la formation ES, ton école, ce qui t'a amené à l'informatique.]",
    ],
    approach: [
      {
        title: "Comprendre avant d'agir",
        text: "Analyser l'existant, lire les journaux et reproduire un problème avant d'appliquer une correction.",
      },
      {
        title: "Documenter",
        text: "Chaque configuration doit pouvoir être expliquée, reproduite et reprise par quelqu'un d'autre.",
      },
      {
        title: "Sécuriser par défaut",
        text: "Moindre privilège, réduction de la surface d'attaque et durcissement dès la mise en place.",
      },
      {
        title: "Automatiser ce qui se répète",
        text: "Scripter les tâches récurrentes pour gagner en fiabilité et limiter les erreurs manuelles.",
      },
    ],
    draft: true,
  },
  location: "",
  availability: {
    // "open" | "limited" | "unavailable" | "unset"
    state: "unset",
    label: "Non renseignée",
  },
  interests: [
    "Infrastructures",
    "Administration systèmes",
    "Réseaux",
    "Automatisation",
    "Cybersécurité",
  ],
  lastUpdated: "2026-10-12",
  siteUrl: "https://example.com",
};
