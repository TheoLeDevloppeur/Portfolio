import type { ReactNode } from "react";
import { projects } from "@/data/projects";
import {
  AboutOutput,
  CertificationsOutput,
  ContactOutput,
  CvOutput,
  ErrorLine,
  ExperienceOutput,
  HelpOutput,
  HistoryOutput,
  HomelabOutput,
  LsOutput,
  Muted,
  NeofetchOutput,
  Out,
  ProjectDetailOutput,
  ProjectsOutput,
  SkillsOutput,
  StatusOutput,
  WhoamiOutput,
} from "@/components/terminal/outputs";
import { CommandLink } from "@/components/terminal/CommandLink";
import { levenshtein } from "@/lib/utils";

/**
 * Registre explicite des commandes autorisées.
 * Les saisies ne sont JAMAIS évaluées ni transmises à un shell : seule une commande
 * présente dans ce registre peut produire une sortie. Tout le rendu passe par React,
 * qui échappe automatiquement le texte saisi.
 */

export interface CommandContext {
  history: string[];
  cvAvailable: boolean;
  sessionStart: number;
}

export interface CommandResult {
  output?: ReactNode;
  clear?: boolean;
}

interface CommandDef {
  name: string;
  aliases?: string[];
  usage?: string;
  description: string;
  /** Masquée de `help` (alias ludiques, commandes secondaires). */
  hidden?: boolean;
  /** Valeurs proposées pour l'autocomplétion du premier argument. */
  completions?: () => string[];
  run: (args: string[], ctx: CommandContext) => CommandResult;
}

export const MAX_INPUT_LENGTH = 200;

/** Regroupement thématique affiché par `help`. */
const HELP_GROUPS = [
  { title: "Profil", commands: ["whoami", "about", "experience", "certifications"] },
  { title: "Travaux", commands: ["projects", "project", "skills", "homelab"] },
  { title: "Contact", commands: ["contact", "cv"] },
  { title: "Système", commands: ["status", "neofetch", "date", "ls", "cat", "history", "clear", "help"] },
];

/** Raccourcis proposés dans la barre du bas. */
export const QUICK_COMMANDS = ["about", "projects", "skills", "homelab", "experience", "contact", "help"];

/** « Fichiers » affichés par `ls` et lisibles avec `cat`. */
const FILES = [
  { name: "about.txt", command: "about", dir: false },
  { name: "projects/", command: "projects", dir: true },
  { name: "skills/", command: "skills", dir: true },
  { name: "homelab/", command: "homelab", dir: true },
  { name: "experience.log", command: "experience", dir: false },
  { name: "certifications/", command: "certifications", dir: true },
  { name: "contact.txt", command: "contact", dir: false },
  { name: "cv.pdf", command: "cv", dir: false },
];

/** `projects/`, `about.txt`, `About` → nom de commande correspondant. */
function fileToCommand(name: string): string | undefined {
  const n = name.toLowerCase().replace(/^(~|\.)?\//, "").replace(/\/$/, "");
  return FILES.find((f) => f.name.replace(/\/$/, "") === n || f.command === n)?.command;
}

const projectSlugs = () => projects.map((p) => p.slug);

function findProject(query: string) {
  const q = query.toLowerCase().replace(/^projects\//, "").replace(/\/$/, "");
  return projects.find((p) => p.slug === q) ?? projects.find((p) => p.slug.startsWith(q));
}

function searchProjects(query: string) {
  const q = query.toLowerCase();
  return projects.filter((p) =>
    [p.slug, p.title, p.category, p.summary, ...p.technologies, ...p.skills].some((f) => f.toLowerCase().includes(q)),
  );
}

function showProject(slug: string): CommandResult {
  const project = findProject(slug);
  if (project) return { output: <ProjectDetailOutput project={project} /> };
  return {
    output: (
      <Out>
        <ErrorLine>projet introuvable : {slug}</ErrorLine>
        <div>
          <Muted>Liste des projets : </Muted>
          <CommandLink command="projects" />
        </div>
      </Out>
    ),
  };
}

const commands: CommandDef[] = [
  {
    name: "help",
    description: "Liste des commandes",
    run: () => ({
      output: (
        <HelpOutput
          groups={HELP_GROUPS.map((g) => ({
            title: g.title,
            commands: g.commands
              .map((name) => registry.get(name))
              .filter((c): c is CommandDef => !!c)
              .map((c) => ({ name: c.name, usage: c.usage, description: c.description })),
          }))}
        />
      ),
    }),
  },
  { name: "whoami", description: "Présentation", run: () => ({ output: <WhoamiOutput /> }) },
  { name: "about", description: "Parcours et profil", run: () => ({ output: <AboutOutput /> }) },
  {
    name: "projects",
    usage: "projects [mot-clé]",
    description: "Projets techniques (ou recherche)",
    completions: projectSlugs,
    run: (args) => {
      const query = args.join(" ").trim();
      if (!query) return { output: <ProjectsOutput /> };
      if (projects.some((p) => p.slug === query.toLowerCase())) return showProject(query);
      return { output: <ProjectsOutput list={searchProjects(query)} query={query} /> };
    },
  },
  {
    name: "project",
    usage: "project <nom>",
    description: "Détail d'un projet",
    completions: projectSlugs,
    run: (args) => (args[0] ? showProject(args[0]) : { output: <ProjectsOutput /> }),
  },
  { name: "skills", description: "Compétences techniques", run: () => ({ output: <SkillsOutput /> }) },
  { name: "homelab", aliases: ["lab"], description: "Laboratoire et virtualisation", run: () => ({ output: <HomelabOutput /> }) },
  {
    name: "experience",
    aliases: ["xp", "parcours"],
    description: "Expériences et formation",
    run: () => ({ output: <ExperienceOutput /> }),
  },
  {
    name: "certifications",
    aliases: ["certs"],
    description: "Certifications et formations",
    run: () => ({ output: <CertificationsOutput /> }),
  },
  {
    name: "contact",
    description: "Coordonnées et liens",
    run: (_a, ctx) => ({ output: <ContactOutput cvAvailable={ctx.cvAvailable} /> }),
  },
  { name: "cv", aliases: ["resume"], description: "Accès au CV", run: (_a, ctx) => ({ output: <CvOutput available={ctx.cvAvailable} /> }) },
  { name: "status", description: "Tableau de bord synthétique", run: () => ({ output: <StatusOutput /> }) },
  {
    name: "neofetch",
    description: "Profil façon neofetch",
    run: (_a, ctx) => ({
      output: (
        <NeofetchOutput
          sessionMinutes={Math.max(0, Math.floor((Date.now() - ctx.sessionStart) / 60000))}
          modules={FILES.length}
        />
      ),
    }),
  },
  {
    name: "date",
    description: "Date et heure locales",
    run: () => ({
      output: <Out>{new Intl.DateTimeFormat("fr-CH", { dateStyle: "full", timeStyle: "medium" }).format(new Date())}</Out>,
    }),
  },
  { name: "ls", aliases: ["dir", "ll"], description: "Fichiers disponibles", run: () => ({ output: <LsOutput files={FILES} /> }) },
  {
    name: "cat",
    usage: "cat <fichier>",
    description: "Lire un fichier (ex. cat about)",
    completions: () => FILES.map((f) => f.name.replace(/\/$/, "")),
    run: (args, ctx) => {
      const target = args[0];
      if (!target) return { output: <ErrorLine>cat: nom de fichier manquant (ex. « cat about »)</ErrorLine> };
      const command = fileToCommand(target);
      if (command) return execute(command, ctx);
      if (findProject(target)) return showProject(target);
      return { output: <ErrorLine>cat: {target}: aucun fichier de ce nom (essayez « ls »)</ErrorLine> };
    },
  },
  {
    name: "cd",
    hidden: true,
    description: "Alias de cat",
    completions: () => FILES.filter((f) => f.dir).map((f) => f.name.replace(/\/$/, "")),
    run: (args, ctx) => {
      const target = args[0];
      if (!target || target === "~" || target === ".." || target === ".") return {};
      return execute(`cat ${target}`, ctx);
    },
  },
  {
    name: "history",
    description: "Historique des commandes",
    run: (_a, ctx) => ({ output: <HistoryOutput history={ctx.history} /> }),
  },
  { name: "clear", aliases: ["cls"], description: "Effacer le terminal (Ctrl+L)", run: () => ({ clear: true }) },
  { name: "pwd", hidden: true, description: "—", run: () => ({ output: <Out>/home/theo</Out> }) },
  { name: "echo", hidden: true, description: "—", run: (args) => ({ output: <Out>{args.join(" ")}</Out> }) },
  {
    name: "sudo",
    hidden: true,
    description: "—",
    run: () => ({
      output: (
        <ErrorLine>
          visiteur n&apos;appartient pas au fichier sudoers. Cet incident sera signalé. <Muted>(c&apos;est une simulation)</Muted>
        </ErrorLine>
      ),
    }),
  },
  {
    name: "exit",
    aliases: ["logout", "quit"],
    hidden: true,
    description: "—",
    run: () => ({ output: <Muted>Session web : fermez simplement l&apos;onglet. À bientôt !</Muted> }),
  },
];

const registry = new Map<string, CommandDef>();
for (const c of commands) {
  registry.set(c.name, c);
  c.aliases?.forEach((a) => registry.set(a, c));
}

/** Découpe une saisie en commande + arguments (aucune interprétation shell : pas de pipes, variables, etc.). */
export function parseInput(raw: string): { name: string; args: string[] } {
  const parts = raw.slice(0, MAX_INPUT_LENGTH).trim().split(/\s+/).filter(Boolean);
  return { name: (parts[0] ?? "").toLowerCase(), args: parts.slice(1) };
}

export function execute(raw: string, ctx: CommandContext): CommandResult {
  const { name, args } = parseInput(raw);
  if (!name) return {};
  const cmd = registry.get(name);
  if (cmd) return cmd.run(args, ctx);

  // Nom de fichier tapé directement (`about.txt`, `projects/`)
  const fileCommand = fileToCommand(name);
  if (fileCommand && args.length === 0) return execute(fileCommand, ctx);

  const suggestion = suggest(name);
  return {
    output: (
      <Out>
        <ErrorLine>commande introuvable : {name}</ErrorLine>
        <div className="text-muted">
          {suggestion && (
            <>
              Vouliez-vous dire <CommandLink command={suggestion} /> ?{" "}
            </>
          )}
          Tapez <CommandLink command="help" /> pour afficher les commandes disponibles.
        </div>
      </Out>
    ),
  };
}

function suggest(name: string): string | undefined {
  let best: { name: string; d: number } | undefined;
  for (const key of registry.keys()) {
    const d = levenshtein(name, key);
    if (!best || d < best.d) best = { name: key, d };
  }
  return best && best.d <= Math.max(1, Math.floor(name.length / 3)) ? registry.get(best.name)!.name : undefined;
}

/** Autocomplétion (Tab) : commande puis premier argument. Renvoie les candidats possibles. */
export function complete(raw: string): { value: string; candidates: string[] } {
  const endsWithSpace = /\s$/.test(raw);
  const parts = raw.trimStart().split(/\s+/);
  if (parts.length <= 1 && !endsWithSpace) {
    const prefix = (parts[0] ?? "").toLowerCase();
    const candidates = commands.filter((c) => !c.hidden && c.name.startsWith(prefix)).map((c) => c.name);
    if (candidates.length === 1) return { value: `${candidates[0]} `, candidates };
    return { value: commonPrefix(candidates, raw), candidates };
  }
  const cmd = registry.get((parts[0] ?? "").toLowerCase());
  if (!cmd?.completions) return { value: raw, candidates: [] };
  const argPrefix = endsWithSpace ? "" : (parts[parts.length - 1] ?? "").toLowerCase();
  const base = endsWithSpace ? raw : raw.slice(0, raw.length - argPrefix.length);
  const candidates = cmd.completions().filter((c) => c.startsWith(argPrefix));
  if (candidates.length === 1) return { value: `${base}${candidates[0]}`, candidates };
  return { value: `${base}${commonPrefix(candidates, argPrefix)}`, candidates };
}

/**
 * Suggestion en ligne façon fish shell : la suite grisée de la saisie,
 * tirée de l'historique (le plus récent d'abord) puis des commandes connues.
 */
export function inlineSuggestion(raw: string, history: string[]): string {
  if (!raw.trim() || raw.length >= MAX_INPUT_LENGTH) return "";
  const lower = raw.toLowerCase();
  const fromHistory = [...history].reverse().find((h) => h.toLowerCase().startsWith(lower) && h.length > raw.length);
  if (fromHistory) return fromHistory.slice(raw.length);

  const candidates: string[] = [];
  for (const c of commands) {
    if (c.hidden) continue;
    candidates.push(c.name);
    c.completions?.().forEach((arg) => candidates.push(`${c.name} ${arg}`));
  }
  const match = candidates.find((c) => c.startsWith(lower) && c.length > raw.length);
  return match ? match.slice(raw.length) : "";
}

function commonPrefix(list: string[], fallback: string): string {
  if (list.length === 0) return fallback;
  let prefix = list[0]!;
  for (const item of list) while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  return prefix.length >= fallback.trim().length ? prefix : fallback;
}
