import { existsSync } from "node:fs";
import { join } from "node:path";
import { contact } from "@/data/contact";
import { profile } from "@/data/profile";

/** URL publique du site : variable d'environnement en priorité, sinon `profile.siteUrl`. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || profile.siteUrl).replace(/\/$/, "");

export const siteName = "THÉO.exe";
export const siteDescription = `${profile.firstName} ${profile.lastName} — ${profile.tagline}. Portfolio interactif : projets, homelab, compétences en administration systèmes, réseaux et cybersécurité.`;

/**
 * Le bouton CV n'est actif que si le fichier existe réellement dans /public.
 * Vérifié côté serveur, au moment du build.
 */
export function isCvAvailable(): boolean {
  const relative = contact.cvPath.replace(/^\/+/, "");
  if (!relative || relative.includes("..")) return false;
  return existsSync(join(process.cwd(), "public", relative));
}
