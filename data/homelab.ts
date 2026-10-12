import type { HomeLab } from "@/lib/types";

/**
 * Laboratoire personnel.
 * ⚠ Les données ci-dessous sont FICTIVES (`example: true`).
 * Les adresses utilisent les plages de documentation RFC 5737 (192.0.2.0/24, 198.51.100.0/24,
 * 203.0.113.0/24) : elles ne correspondent à aucun réseau réel.
 * Évite de publier tes vraies adresses IP privées, noms de domaine internes ou identifiants.
 */
export const homelab: HomeLab = {
  example: true,
  summary:
    "Environnement virtualisé servant à tester des configurations, reproduire des incidents et préparer des projets avant de les documenter.",
  hypervisor: {
    name: "Hyperviseur (exemple)",
    detail: "[À compléter : solution utilisée, matériel hôte, ressources allouées]",
  },
  segments: [
    {
      id: "edge",
      name: "Accès / WAN",
      vlan: "—",
      subnet: "203.0.113.0/24",
      gateway: "203.0.113.1",
      purpose: "Lien vers l'extérieur via le pare-feu virtuel",
    },
    {
      id: "servers",
      name: "Serveurs",
      vlan: "VLAN 10",
      subnet: "192.0.2.0/25",
      gateway: "192.0.2.1",
      purpose: "Services d'infrastructure (annuaire, DNS, web)",
    },
    {
      id: "clients",
      name: "Postes clients",
      vlan: "VLAN 20",
      subnet: "198.51.100.0/25",
      gateway: "198.51.100.1",
      purpose: "Postes de test joints au domaine",
    },
    {
      id: "sandbox",
      name: "Sandbox",
      vlan: "VLAN 99",
      subnet: "198.51.100.128/25",
      gateway: "198.51.100.129",
      purpose: "Réseau isolé pour les essais risqués",
    },
  ],
  nodes: [
    {
      id: "fw01",
      name: "FW01",
      role: "Pare-feu / routeur",
      os: "Distribution pare-feu (exemple)",
      segment: "edge",
      address: "203.0.113.2",
      services: ["Routage inter-VLAN", "Filtrage"],
    },
    {
      id: "dc01",
      name: "DC01",
      role: "Contrôleur de domaine",
      os: "Windows Server",
      segment: "servers",
      address: "192.0.2.10",
      services: ["AD DS", "DNS", "GPO"],
    },
    {
      id: "srv-lnx01",
      name: "SRV-LNX01",
      role: "Serveur Linux",
      os: "Debian",
      segment: "servers",
      address: "192.0.2.20",
      services: ["Serveur web", "SSH"],
    },
    {
      id: "mon01",
      name: "MON01",
      role: "Supervision",
      os: "Linux",
      segment: "servers",
      address: "192.0.2.30",
      services: ["Supervision", "Centralisation des journaux"],
    },
    {
      id: "ws01",
      name: "WS-CLIENT01",
      role: "Poste client",
      os: "Windows 11",
      segment: "clients",
      address: "198.51.100.10",
      services: ["Joint au domaine"],
    },
    {
      id: "ws02",
      name: "WS-CLIENT02",
      role: "Poste client",
      os: "Windows 11",
      segment: "clients",
      address: "198.51.100.11",
      services: ["Joint au domaine"],
    },
    {
      id: "lab01",
      name: "LAB-TEST01",
      role: "Machine jetable",
      os: "Variable",
      segment: "sandbox",
      address: "198.51.100.140",
      services: ["Tests", "Snapshots"],
    },
  ],
  environments: [
    { name: "Domaine de test", description: "Forêt Active Directory isolée pour les essais de GPO et de délégation." },
    { name: "Bac à sable", description: "Segment isolé, restauré par snapshot après chaque essai." },
  ],
  experiments: [
    {
      title: "Durcissement de postes Windows 11 par GPO",
      description: "Application et vérification d'une ligne de base de sécurité.",
      status: "en cours",
      projectSlug: "windows-11-hardening",
    },
    {
      title: "[Expérience à compléter]",
      description: "[Décris ici un test, une panne reproduite ou une configuration étudiée.]",
      status: "idée",
    },
  ],
  media: [],
  documentation: [],
};
