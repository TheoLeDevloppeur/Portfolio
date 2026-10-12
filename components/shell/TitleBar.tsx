import { Clock } from "./Clock";

/** Barre de fenêtre du terminal. Les trois pastilles sont purement décoratives. */
export function TitleBar() {
  return (
    <header className="relative flex h-11 shrink-0 items-center gap-3 border-b border-line bg-gradient-to-b from-panel-2 to-panel px-4 select-none">
      <div className="flex items-center gap-2" aria-hidden>
        <span className="size-3 rounded-full bg-err shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25)]" />
        <span className="size-3 rounded-full bg-warn shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25)]" />
        <span className="size-3 rounded-full bg-ok shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25)]" />
      </div>

      <h1 className="pointer-events-none absolute inset-x-0 text-center font-mono text-[0.72rem] font-medium tracking-[0.22em] text-fg/90 max-sm:static max-sm:text-left">
        THEO<span className="text-accent">@</span>PORTFOLIO
        <span className="hidden font-normal tracking-normal text-muted lg:inline"> — tsh</span>
      </h1>

      <div className="relative ml-auto flex items-center gap-3 font-mono text-[0.7rem] text-muted">
        <span className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5">
          <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex size-full rounded-full bg-ok/70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
          </span>
          <span className="tracking-[0.16em] text-accent/90 max-sm:sr-only">SYSTEM ONLINE</span>
        </span>
        <Clock className="tabular-nums text-fg/80" />
      </div>
    </header>
  );
}
