"use client";

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { certifications, trainings } from "@/data/certifications";
import { contact } from "@/data/contact";
import { timeline } from "@/data/experience";
import { homelab } from "@/data/homelab";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories, skillsNeedReview } from "@/data/skills";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { CopyButton } from "@/components/ui/CopyButton";
import { availabilityTone, getPortfolioStats } from "@/lib/stats";
import type { Project } from "@/lib/types";
import { cn, isPlaceholder, isSafeExternalUrl, isValidEmail } from "@/lib/utils";
import { CommandLink } from "./CommandLink";
import { useTerminal } from "./terminal-context";

/* ---------- primitives ---------- */

export function Out({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-1 text-fg", className)}>{children}</div>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-muted">{children}</span>;
}

export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "warn" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] border px-1.5 align-[0.08em] text-[0.68rem] leading-[1.45] font-medium tracking-wider whitespace-nowrap uppercase",
        tone === "warn" && "border-warn/30 bg-warn/[0.07] text-warn",
        tone === "accent" && "border-accent/30 bg-accent/[0.07] text-accent",
        tone === "muted" && "border-line-strong/70 text-muted",
      )}
    >
      {children}
    </span>
  );
}

export function ErrorLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 text-err">
      <span aria-hidden>✗</span>
      <span>{children}</span>
    </div>
  );
}

/** Encadré signalant un contenu d'exemple ou à compléter. */
function Note({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 rounded-r border-l-2 border-warn/60 bg-warn/[0.06] py-1.5 pr-3 pl-3 text-[0.92em] text-warn/90">
      {children}
    </div>
  );
}

/** Titre de section : `## LIBELLÉ ─────` */
function Heading({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 mb-2 flex items-center gap-3 first:mt-0">
      <span className="shrink-0 text-[0.72rem] font-medium tracking-[0.2em] uppercase">
        <span className="text-accent-dim">## </span>
        <span className="text-accent">{children}</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" aria-hidden />
    </div>
  );
}

/** Texte : les gabarits « [À compléter] » sont atténués. */
function Text({ children }: { children: string }) {
  return <span className={isPlaceholder(children) || children.startsWith("[") ? "text-muted/80 italic" : undefined}>{children}</span>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-0.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="shrink-0 text-accent-dim" aria-hidden>
            ›
          </span>
          <Text>{t}</Text>
        </li>
      ))}
    </ul>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="thin-scroll -mx-1 overflow-x-auto px-1">
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="border-b border-line">
            {head.map((h) => (
              <th key={h} scope="col" className="pr-6 pb-1.5 text-[0.68rem] font-medium tracking-[0.16em] text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/40 last:border-0">
              {r.map((c, j) => (
                <td
                  key={j}
                  className={cn(
                    "py-1 pr-6 align-top",
                    j === 0 ? "text-fg" : "text-muted",
                    j === r.length - 1 && "min-w-[14rem] whitespace-normal",
                  )}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Ligne clé / valeur alignée. */
function KV({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 sm:grid-cols-[8rem_1fr]">
      <span className="text-muted">{k}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

const linkClass = "text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent";

/* ---------- commandes ---------- */

export function WhoamiOutput() {
  const tone = availabilityTone[profile.availability.state];
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`;
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-panel-2 via-panel to-panel p-5 sm:p-7">
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-accent/[0.06] blur-3xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-5">
        <div
          className="hidden size-14 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/[0.06] font-sans text-xl font-semibold text-accent sm:flex"
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-sans text-[2rem] leading-none font-semibold tracking-tight text-fg sm:text-5xl">
            {profile.displayName}
          </div>
          <div className="mt-3 text-[0.75rem] tracking-[0.28em] text-accent">{profile.role}</div>
          <div className="mt-1 text-muted">{profile.tagline}</div>
        </div>
      </div>
      <p className="relative mt-5 max-w-2xl font-sans text-[1.02rem] leading-relaxed text-fg/85">{profile.bio}</p>
      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        {profile.interests.map((i) => (
          <span key={i} className="rounded-full border border-line-strong/70 px-2.5 py-0.5 text-[0.72rem] text-fg/80">
            {i}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-2 text-[0.72rem] text-muted">
          <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden />
          disponibilité : {profile.availability.label.toLowerCase()}
        </span>
      </div>
    </div>
  );
}

export function HelpOutput({
  groups,
}: {
  groups: { title: string; commands: { name: string; usage?: string; description: string }[] }[];
}) {
  return (
    <Out>
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <Heading>{g.title}</Heading>
            <ul className="grid grid-cols-[minmax(8.5rem,auto)_1fr] gap-x-5 gap-y-0.5 sm:grid-cols-[minmax(10rem,auto)_1fr]">
              {g.commands.map((c) => (
                <li key={c.name} className="contents">
                  <span>
                    <CommandLink command={c.name}>{c.usage ?? c.name}</CommandLink>
                  </span>
                  <span className="text-muted">{c.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-4 text-[0.78rem] text-muted/80">
        Astuce : cliquez une commande, ou tapez les premières lettres puis <span className="text-fg/80">→</span> pour accepter
        la suggestion.
      </div>
    </Out>
  );
}

export function AboutOutput() {
  return (
    <Out>
      {profile.about.draft && <Note>Texte proposé — à relire et valider dans data/profile.ts</Note>}
      <Heading>Profil</Heading>
      <div className="max-w-3xl space-y-3 font-sans text-[1rem] leading-relaxed text-fg/90">
        {profile.about.paragraphs.map((p, i) => (
          <p key={i}>
            <Text>{p}</Text>
          </p>
        ))}
      </div>
      <Heading>Approche</Heading>
      <ol className="grid gap-2 sm:grid-cols-2">
        {profile.about.approach.map((a, i) => (
          <li key={a.title} className="rounded-lg border border-line bg-bg/30 px-4 py-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[0.72rem] text-accent-dim">0{i + 1}</span>
              <span className="font-medium text-fg">{a.title}</span>
            </div>
            <div className="mt-1 font-sans text-[0.92rem] leading-snug text-muted">{a.text}</div>
          </li>
        ))}
      </ol>
      <Heading>Centres d&apos;intérêt</Heading>
      <div className="text-fg/85">{profile.interests.join("  ·  ")}</div>
    </Out>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const { run } = useTerminal();
  return (
    <button
      type="button"
      onClick={() => run(`project ${p.slug}`)}
      className="group block w-full cursor-pointer rounded-lg border border-line bg-bg/30 px-4 py-3 text-left transition-colors hover:border-accent/40 hover:bg-accent/[0.03]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-accent">{p.slug}/</span>
        {p.example && <Tag tone="warn">exemple</Tag>}
        <Tag>{p.status}</Tag>
        <Tag>{p.category}</Tag>
        <ArrowUpRight
          className="ml-auto size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          aria-hidden
        />
      </div>
      <div className="mt-1 font-sans text-[1rem] font-medium text-fg">{p.title}</div>
      <div className="mt-0.5 line-clamp-2 font-sans text-[0.9rem] text-muted">{p.summary}</div>
      <div className="mt-2 text-[0.75rem] text-muted/80">{p.technologies.join(" · ")}</div>
    </button>
  );
}

export function ProjectsOutput({ list = projects, query }: { list?: Project[]; query?: string }) {
  return (
    <Out>
      <div className="text-muted">
        {query ? `${list.length} résultat(s) pour « ${query} »` : `${list.length} projet(s) — cliquez pour ouvrir la fiche`}
      </div>
      {list.length === 0 ? (
        <Muted>Aucun projet ne correspond.</Muted>
      ) : (
        <div className="grid gap-2 pt-1 lg:grid-cols-2">
          {list.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      )}
      <div className="pt-2 text-[0.78rem] text-muted/80">
        <span className="text-fg/80">project &lt;nom&gt;</span> pour la fiche ·{" "}
        <span className="text-fg/80">projects &lt;mot-clé&gt;</span> pour rechercher
      </div>
    </Out>
  );
}

export function ProjectDetailOutput({ project: p }: { project: Project }) {
  return (
    <Out>
      <div className="rounded-xl border border-line bg-gradient-to-br from-panel-2 to-panel p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <Tag>{p.category}</Tag>
          <Tag>{p.status}</Tag>
          {p.year && <Tag>{p.year}</Tag>}
          {p.example && <Tag tone="warn">exemple</Tag>}
        </div>
        <div className="mt-3 font-sans text-2xl leading-tight font-semibold tracking-tight text-fg sm:text-3xl">{p.title}</div>
        <p className="mt-3 max-w-3xl font-sans text-[1rem] leading-relaxed text-fg/85">{p.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.technologies.map((t) => (
            <span key={t} className="rounded border border-line-strong/70 px-2 py-0.5 text-[0.72rem] text-fg/80">
              {t}
            </span>
          ))}
        </div>
      </div>
      {p.example && (
        <div className="pt-3">
          <Note>Projet de démonstration — contenu, résultats et captures à compléter dans data/projects.ts</Note>
        </div>
      )}

      <Heading>Problématique</Heading>
      <p className="max-w-3xl">
        <Text>{p.problem}</Text>
      </p>

      <Heading>Objectifs</Heading>
      <Bullets items={p.objectives} />

      <Heading>Architecture</Heading>
      <p className="mb-2 max-w-3xl">
        <Text>{p.architecture.description}</Text>
      </p>
      <Table head={["COMPOSANT", "RÔLE"]} rows={p.architecture.components.map((c) => [c.name, c.role])} />

      <Heading>Étapes de réalisation</Heading>
      <ol className="space-y-1">
        {p.steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="w-5 shrink-0 text-right text-accent-dim">{i + 1}.</span>
            <span>
              <span className="text-fg">{s.title}</span> <Muted>— </Muted>
              <Text>{s.detail}</Text>
            </span>
          </li>
        ))}
      </ol>

      <Heading>Sécurité</Heading>
      <Bullets items={p.security} />

      <Heading>Résultat</Heading>
      {p.result ? <p className="max-w-3xl">{p.result}</p> : <span className="text-muted/80 italic">Non renseigné — à documenter une fois le projet terminé.</span>}

      <Heading>Captures & schémas</Heading>
      {p.media.length === 0 ? (
        <span className="text-muted/80 italic">Aucune capture ajoutée.</span>
      ) : (
        <ul>
          {p.media.map((m) => (
            <li key={m.src}>
              <a href={m.src} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {m.alt}
              </a>
              {m.caption && <Muted> — {m.caption}</Muted>}
            </li>
          ))}
        </ul>
      )}

      <Heading>Difficultés & solutions</Heading>
      <div className="space-y-2">
        {p.challenges.map((c, i) => (
          <div key={i} className="grid gap-0.5">
            <KV k="problème">
              <Text>{c.problem}</Text>
            </KV>
            <KV k="solution">
              <Text>{c.solution}</Text>
            </KV>
          </div>
        ))}
      </div>

      <Heading>Compétences démontrées</Heading>
      <div className="text-fg/85">{p.skills.join("  ·  ")}</div>

      {p.links && p.links.length > 0 && (
        <>
          <Heading>Liens</Heading>
          <ul>
            {p.links
              .filter((l) => isSafeExternalUrl(l.href) || l.href.startsWith("/"))
              .map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
          </ul>
        </>
      )}
      <div className="pt-4 text-muted">
        ← retour : <CommandLink command="projects" />
      </div>
    </Out>
  );
}

export function SkillsOutput() {
  return (
    <Out>
      {skillsNeedReview && <Note>Liste proposée à partir de la formation — à valider dans data/skills.ts</Note>}
      <div className="grid gap-2 md:grid-cols-2">
        {skillCategories.map((c, i) => (
          <div key={c.id} className="rounded-lg border border-line bg-bg/30 px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium text-accent">{c.title}</span>
              <span className="text-[0.7rem] text-muted/60">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-0.5 font-sans text-[0.88rem] leading-snug text-muted">{c.description}</div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {c.items.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-1.5 rounded border border-line-strong/60 px-2 py-0.5 text-[0.75rem] text-fg/85"
                  title={s.evidence}
                >
                  {s.name}
                  {s.level && <span className="text-accent">· {s.level}</span>}
                  {s.projectSlug && (
                    <CommandLink command={`project ${s.projectSlug}`} className="text-[0.95em] text-accent-dim hover:text-accent">
                      ↗
                    </CommandLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-2 text-[0.78rem] text-muted/80">
        ↗ = démontré dans un projet. Niveaux affichés uniquement lorsqu&apos;ils sont renseignés.
      </div>
    </Out>
  );
}

export function HomelabOutput() {
  return (
    <Out>
      {homelab.example && <Note>Données fictives — plages de documentation RFC 5737, aucune adresse réelle</Note>}
      <p className="max-w-3xl font-sans text-[1rem] leading-relaxed text-fg/90">{homelab.summary}</p>

      <Heading>Hyperviseur</Heading>
      <KV k={homelab.hypervisor.name}>
        <Text>{homelab.hypervisor.detail}</Text>
      </KV>

      <Heading>Plan d&apos;adressage</Heading>
      <Table
        head={["SEGMENT", "VLAN", "SUBNET", "GATEWAY", "USAGE"]}
        rows={homelab.segments.map((s) => [s.name, s.vlan, s.subnet, s.gateway, s.purpose])}
      />

      <Heading>Machines & services</Heading>
      <Table
        head={["HOST", "RÔLE", "OS", "ADRESSE", "SERVICES"]}
        rows={homelab.nodes.map((n) => [
          <span key="n" className="text-accent">
            {n.name}
          </span>,
          n.role,
          n.os,
          n.address,
          n.services.join(", "),
        ])}
      />

      <Heading>Environnements de test</Heading>
      {homelab.environments.map((e) => (
        <KV key={e.name} k={e.name}>
          <span className="text-muted">{e.description}</span>
        </KV>
      ))}

      <Heading>Expériences techniques</Heading>
      <ul className="space-y-1">
        {homelab.experiments.map((x) => (
          <li key={x.title} className="flex flex-wrap items-baseline gap-x-2">
            <Tag tone={x.status === "réalisé" ? "accent" : "muted"}>{x.status}</Tag>
            <Text>{x.title}</Text>
            <Muted>—</Muted>
            <Text>{x.description}</Text>
            {x.projectSlug && <CommandLink command={`project ${x.projectSlug}`}>↗ projet</CommandLink>}
          </li>
        ))}
      </ul>

      <Heading>Captures & documentation</Heading>
      {homelab.media.length === 0 && homelab.documentation.length === 0 ? (
        <span className="text-muted/80 italic">Rien de publié pour le moment.</span>
      ) : (
        <ul>
          {[...homelab.media.map((m) => ({ label: m.alt, href: m.src })), ...homelab.documentation]
            .filter((l) => isSafeExternalUrl(l.href) || l.href.startsWith("/"))
            .map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
        </ul>
      )}
    </Out>
  );
}

export function ExperienceOutput() {
  return (
    <ol className="relative ml-1.5 border-l border-line">
      {timeline.map((e) => (
        <li key={e.id} className="relative pb-6 pl-6 last:pb-1">
          <span
            className={cn(
              "absolute top-[0.55em] -left-[5px] size-[9px] rounded-full border",
              e.current ? "border-accent bg-accent shadow-[0_0_0_3px_rgb(166_255_143/0.15)]" : "border-line-strong bg-panel",
            )}
            aria-hidden
          />
          <div className="flex flex-wrap items-center gap-2 text-[0.78rem]">
            <span className={e.current ? "text-accent" : "text-muted"}>
              <Text>{e.period}</Text>
            </span>
            <Tag>{e.kind}</Tag>
            {e.placeholder && <Tag tone="warn">à compléter</Tag>}
          </div>
          <div className="mt-1 font-sans text-[1rem] font-medium text-fg">
            <Text>{e.title}</Text>
          </div>
          <div className="text-muted">
            <Text>{e.organization}</Text>
            {e.location && ` · ${e.location}`}
          </div>
          <div className="mt-1.5 max-w-3xl font-sans text-[0.95rem] leading-relaxed text-fg/85">
            <Text>{e.description}</Text>
          </div>
          {e.highlights.length > 0 && (
            <div className="mt-1.5">
              <Bullets items={e.highlights} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export function CertificationsOutput() {
  // Une certification n'est « obtenue » que si elle est explicitement confirmée.
  const obtained = certifications.filter((c) => c.status === "obtenue" && c.verified && !c.example);
  const others = certifications.filter((c) => !obtained.includes(c));
  return (
    <Out>
      <Heading>Obtenues</Heading>
      {obtained.length === 0 ? (
        <span className="text-muted/80 italic">Aucune renseignée pour le moment.</span>
      ) : (
        <ul className="space-y-1">
          {obtained.map((c) => (
            <li key={c.id}>
              <span className="text-accent">✓</span> {c.name}{" "}
              <Muted>
                — {c.issuer}
                {c.date && ` · ${c.date}`}
              </Muted>
              {c.credentialUrl && isSafeExternalUrl(c.credentialUrl) && (
                <>
                  {" "}
                  <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    vérifier
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <Heading>En préparation</Heading>
      {others.length === 0 ? (
        <span className="text-muted/80 italic">Aucune.</span>
      ) : (
        <ul className="space-y-1">
          {others.map((c) => (
            <li key={c.id} className="flex flex-wrap items-baseline gap-x-2">
              <Tag>{c.status === "obtenue" ? "à confirmer" : c.status}</Tag>
              <Text>{c.name}</Text>
              <Muted>— </Muted>
              <Text>{c.issuer}</Text>
              {c.example && <Tag tone="warn">exemple</Tag>}
            </li>
          ))}
        </ul>
      )}
      <Heading>Formations complémentaires</Heading>
      {trainings.length === 0 ? (
        <span className="text-muted/80 italic">Aucune.</span>
      ) : (
        <ul className="space-y-1">
          {trainings.map((t) => (
            <li key={t.id} className="flex flex-wrap items-baseline gap-x-2">
              <Text>{t.name}</Text>
              <Muted>— </Muted>
              <Text>{t.provider}</Text>
              {t.date && <Muted>· {t.date}</Muted>}
              {t.example && <Tag tone="warn">exemple</Tag>}
            </li>
          ))}
        </ul>
      )}
    </Out>
  );
}

export function ContactOutput({ cvAvailable }: { cvAvailable: boolean }) {
  const emailOk = isValidEmail(contact.email);
  const linkedinOk = isSafeExternalUrl(contact.linkedin);
  const githubOk = isSafeExternalUrl(contact.github);
  const off = <span className="text-muted/70 italic">non configuré</span>;
  return (
    <Out>
      <div className="max-w-2xl space-y-1.5 rounded-xl border border-line bg-bg/30 px-4 py-3 sm:px-5 sm:py-4">
        <KV k="email">
          {emailOk ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <a className={linkClass} href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <CopyButton value={contact.email} compact label="Copier l'adresse" />
            </span>
          ) : (
            off
          )}
        </KV>
        <KV k="linkedin">
          {linkedinOk ? (
            <a className={linkClass} href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              {contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          ) : (
            off
          )}
        </KV>
        {githubOk && (
          <KV k="github">
            <a className={linkClass} href={contact.github} target="_blank" rel="noopener noreferrer">
              {contact.github.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </KV>
        )}
        <KV k="cv">{cvAvailable ? <CommandLink command="cv">télécharger</CommandLink> : <span className="text-muted/70 italic">pas encore publié</span>}</KV>
      </div>
      <div className="pt-1 text-[0.78rem] text-muted/80">Pas de formulaire : aucun message ne transite par un service tiers.</div>
    </Out>
  );
}

export function CvOutput({ available }: { available: boolean }) {
  if (!available) {
    return (
      <Out>
        <div className="text-warn">Le CV n&apos;est pas encore disponible en ligne.</div>
        <div className="text-muted">
          En attendant : <CommandLink command="contact" />
        </div>
      </Out>
    );
  }
  return (
    <Out>
      <div className="flex flex-wrap gap-2">
        <a
          href={contact.cvPath}
          download={contact.cvFileName}
          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent transition-colors hover:bg-accent/20"
        >
          ⤓ {contact.cvFileName}
        </a>
        <a
          href={contact.cvPath}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-line px-3 py-1.5 text-muted transition-colors hover:text-fg"
        >
          ouvrir ↗
        </a>
      </div>
    </Out>
  );
}

export function StatusOutput() {
  return (
    <Out className="space-y-3">
      <div className="text-muted">portfolio status — données issues de la configuration (aucune métrique système)</div>
      <div className="@container max-w-4xl font-sans">
        <Dashboard stats={getPortfolioStats()} compact />
      </div>
    </Out>
  );
}

// ASCII pur : les caractères de dessin de boîte ne sont pas inclus dans la police monospace (sous-ensemble latin).
const LOGO = String.raw` +--------------+
 | >_           |
 |   THEO.exe   |
 |              |
 +------++------+
     ___||___
    [________]`;

export function NeofetchOutput({ sessionMinutes, modules }: { sessionMinutes: number; modules: number }) {
  const stats = getPortfolioStats();
  const user = `${profile.promptUser}@${profile.promptHost}`;
  const rows: [string, string][] = [
    ["OS", "THÉO.exe — portfolio web"],
    ["Role", profile.role],
    ["Formation", profile.tagline.replace(/^Étudiant\s+/, "")],
    ["Shell", "tsh — terminal simulé"],
    ["Modules", `${modules} fichiers`],
    ["Projects", `${stats.projectsTotal} (${stats.projectsExample} exemple)`],
    ["Skills", `${stats.skillCategories.length} domaines`],
    ["Focus", profile.interests.join(", ")],
    ["Session", `${sessionMinutes} min`],
    ["Updated", stats.lastUpdated],
  ];
  return (
    <Out>
      <div className="flex flex-wrap gap-x-10 gap-y-3">
        <pre className="m-0 leading-tight text-accent" aria-hidden>
          {LOGO}
        </pre>
        <div className="min-w-0">
          <div className="font-medium">
            <span className="text-accent">{profile.promptUser}</span>@<span className="text-accent">{profile.promptHost}</span>
          </div>
          <div className="text-muted/60" aria-hidden>
            {"-".repeat(user.length)}
          </div>
          {rows.map(([k, v]) => (
            <div key={k} className="break-words">
              <span className="font-medium text-accent">{k}</span>
              <span className="text-muted">:</span> {v}
            </div>
          ))}
          <div className="flex gap-1 pt-2" aria-hidden>
            {["bg-bg", "bg-panel", "bg-line", "bg-muted", "bg-accent-dim", "bg-accent", "bg-fg"].map((c) => (
              <span key={c} className={cn("h-3.5 w-6 rounded-[3px] ring-1 ring-line", c)} />
            ))}
          </div>
        </div>
      </div>
      <div className="pt-2 text-[0.78rem] text-muted/80">Informations de profil — aucune donnée matérielle réelle n&apos;est affichée.</div>
    </Out>
  );
}

export function LsOutput({ files }: { files: { name: string; command: string; dir: boolean }[] }) {
  return (
    <Out>
      <ul className="flex flex-wrap gap-x-7 gap-y-1">
        {files.map((f) => (
          <li key={f.name}>
            <CommandLink command={f.command} className={f.dir ? "font-medium" : "text-fg"}>
              {f.name}
            </CommandLink>
          </li>
        ))}
      </ul>
      <div className="pt-1 text-[0.78rem] text-muted/80">cliquez un fichier, ou tapez cat &lt;fichier&gt;</div>
    </Out>
  );
}

export function HistoryOutput({ history }: { history: string[] }) {
  if (history.length === 0) return <Muted>Historique vide.</Muted>;
  return (
    <ol>
      {history.map((h, i) => (
        <li key={i} className="flex gap-4">
          <span className="w-8 shrink-0 text-right text-muted/60 tabular-nums">{i + 1}</span>
          <CommandLink command={h} className="text-fg">
            {h}
          </CommandLink>
        </li>
      ))}
    </ol>
  );
}
