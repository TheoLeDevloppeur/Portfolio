import type { TimelineEntry } from "@/lib/types";

/**
 * Chronologie : formations et expériences, de la plus récente à la plus ancienne.
 * `placeholder: true` affiche un badge « À COMPLÉTER ».
 */
export const timeline: TimelineEntry[] = [
  {
    id: "es-systemes-exploitation",
    kind: "formation",
    title: "Formation ES — Informatique, systèmes et exploitation",
    organization: "[École à compléter]",
    location: "",
    period: "[Année de début] — en cours",
    current: true,
    description:
      "Formation supérieure orientée administration des systèmes, réseaux, virtualisation et exploitation d'infrastructures informatiques.",
    highlights: ["[À compléter : modules, projets ou spécialisations marquants]"],
    placeholder: true,
  },
  {
    id: "experience-modele",
    kind: "expérience",
    title: "[Intitulé du poste]",
    organization: "[Entreprise]",
    location: "",
    period: "[Début] — [Fin]",
    description: "[À compléter : contexte, responsabilités, environnement technique.]",
    highlights: ["[À compléter : réalisation concrète]"],
    placeholder: true,
  },
  {
    id: "formation-precedente",
    kind: "formation",
    title: "[Formation précédente — ex. CFC / maturité]",
    organization: "[Établissement]",
    location: "",
    period: "[Début] — [Fin]",
    description: "[À compléter]",
    highlights: [],
    placeholder: true,
  },
];
