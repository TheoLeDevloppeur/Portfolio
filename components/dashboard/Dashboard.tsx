import type { ReactNode } from "react";
import { availabilityTone, type PortfolioStats } from "@/lib/stats";
import { cn, formatIsoDate } from "@/lib/utils";

/**
 * Tableau de bord inspiré d'une console d'administration.
 * Utilisé sur la page Overview et par la commande `status` (variante compacte).
 * Toutes les valeurs proviennent de la configuration du portfolio.
 */
export function Dashboard({ stats, compact = false }: { stats: PortfolioStats; compact?: boolean }) {
  const tone = availabilityTone[stats.availability.state];
  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-1 @md:grid-cols-2" : "grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-4")}>
      <Panel title="availability" compact={compact}>
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", tone.dot)} aria-hidden />
          <span className="font-mono text-sm text-fg">{tone.label}</span>
        </div>
        <p className="mt-1 text-sm text-muted">{stats.availability.label}</p>
      </Panel>

      <Panel title="projects" compact={compact}>
        <p className="font-mono text-2xl text-fg">
          {stats.projectsDocumented}
          <span className="text-base text-muted"> documenté{stats.projectsDocumented > 1 ? "s" : ""}</span>
        </p>
        <p className="mt-1 font-mono text-xs text-muted">
          {stats.projectsTotal} au total · {stats.projectsExample} exemple{stats.projectsExample > 1 ? "s" : ""}
        </p>
      </Panel>

      <Panel title="last_update" compact={compact}>
        <p className="font-mono text-sm text-fg">{stats.lastUpdated}</p>
        <p className="mt-1 text-sm text-muted">{formatIsoDate(stats.lastUpdated)}</p>
      </Panel>

      <Panel title="certifications" compact={compact}>
        <p className="font-mono text-2xl text-fg">
          {stats.certificationsObtained}
          <span className="text-base text-muted"> obtenue{stats.certificationsObtained > 1 ? "s" : ""}</span>
        </p>
        <p className="mt-1 font-mono text-xs text-muted">confirmées uniquement</p>
      </Panel>

      <Panel title="skill_domains" compact={compact} className={compact ? "@md:col-span-2" : "@xl:col-span-2"}>
        <ul className="grid grid-cols-1 gap-x-4 gap-y-1 @xl:grid-cols-2">
          {stats.skillCategories.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 font-mono text-xs">
              <span className="flex min-w-0 items-center gap-2 text-fg">
                <span className="size-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden />
                <span className="truncate">{c.title}</span>
              </span>
              <span className="shrink-0 text-muted">
                {c.count} techno{c.count > 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="focus" compact={compact} className={compact ? "@md:col-span-2" : "@xl:col-span-2"}>
        <ul className="flex flex-wrap gap-1.5">
          {stats.interests.map((i) => (
            <li key={i} className="rounded border border-line px-2 py-1 font-mono text-xs text-fg">
              {i}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
  className,
  compact,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section className={cn("rounded-lg border border-line bg-bg/30", compact ? "p-3" : "p-4", className)}>
      <h3 className="mb-2 font-mono text-[0.7rem] tracking-widest text-muted uppercase">
        <span className="text-accent/70">▍</span>
        {title}
      </h3>
      {children}
    </section>
  );
}
