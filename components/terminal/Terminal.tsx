"use client";

import { CornerDownLeft } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import { TitleBar } from "@/components/shell/TitleBar";
import { QUICK_COMMANDS } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { Prompt } from "./Prompt";
import { PromptLine } from "./PromptLine";
import { useTerminal, type TerminalEntry } from "./terminal-context";

function Entry({ entry, first }: { entry: TerminalEntry; first: boolean }) {
  switch (entry.kind) {
    case "boot":
      return (
        <div className="flex animate-line gap-3">
          <span className={cn("shrink-0 whitespace-pre", entry.status === "ok" ? "text-accent" : "text-accent-dim")} aria-hidden>
            {"[  OK  ]"}
          </span>
          <span className={entry.status === "ok" ? "font-medium text-fg" : "text-muted"}>{entry.text}</span>
        </div>
      );
    case "input":
      return (
        <div className={cn("group flex items-start gap-4", first ? "mt-5" : "mt-6 border-t border-line/70 pt-5")}>
          <div className="flex min-w-0 flex-1 flex-wrap">
            <Prompt />
            <span className="sr-only">Commande : </span>
            <span className="break-all text-fg">{entry.text}</span>
          </div>
          <time className="hidden shrink-0 pt-px text-[0.7rem] text-muted/50 tabular-nums sm:block">{entry.time}</time>
        </div>
      );
    case "output":
      return <div className="mt-3 animate-line whitespace-pre-wrap">{entry.node}</div>;
  }
}

/** Barre du bas : commandes en un clic, pour les visiteurs qui ne connaissent pas le shell. */
function QuickBar() {
  const { run, inputRef } = useTerminal();
  return (
    <footer className="flex h-11 shrink-0 items-center gap-3 border-t border-line bg-panel-2/60 pr-3 pl-1.5">
      <span className="hidden shrink-0 rounded bg-accent px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-widest text-bg sm:inline">
        TSH
      </span>
      <nav aria-label="Commandes rapides" className="no-scrollbar min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:[mask-image:none]">
        <ul className="flex items-center gap-1 px-1">
          {QUICK_COMMANDS.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => {
                  run(c);
                  if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
                }}
                className="cursor-pointer rounded-md px-2.5 py-1 text-[0.75rem] whitespace-nowrap text-muted transition-colors hover:bg-panel hover:text-accent focus-visible:text-accent"
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <span className="hidden shrink-0 items-center gap-3 text-[0.68rem] text-muted/70 lg:flex">
        <span>
          <kbd className="text-fg/70">Tab</kbd> compléter
        </span>
        <span>
          <kbd className="text-fg/70">→</kbd> suggestion
        </span>
        <span className="flex items-center gap-1">
          <CornerDownLeft className="size-3 text-fg/70" aria-hidden /> exécuter
        </span>
      </span>
    </footer>
  );
}

/** Le portfolio : une fenêtre de terminal plein écran. */
export function Terminal() {
  const { entries, inputRef } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Défilement automatique vers la dernière ligne.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  // Un clic dans le terminal redonne le focus à la saisie (sauf sélection de texte ou élément interactif).
  function onBodyClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a, button, input, table")) return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  }

  const firstInput = entries.find((e) => e.kind === "input")?.id;

  return (
    <section
      aria-label="Terminal interactif"
      className="window-shadow flex h-full min-h-0 animate-window flex-col overflow-clip bg-panel font-mono text-[0.8rem] leading-[1.7] sm:rounded-xl sm:border sm:border-line sm:text-[0.86rem]"
    >
      <TitleBar />

      <div
        ref={scrollRef}
        data-terminal-scroll
        onClick={onBodyClick}
        className="thin-scroll scroll-fade min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-8 sm:px-8 sm:pt-7"
      >
        <div className="mx-auto max-w-5xl">
          <div id="terminal-output" role="log" aria-live="polite" aria-label="Sortie du terminal" className="break-words">
            {entries.map((entry) => (
              <Entry key={entry.id} entry={entry} first={entry.id === firstInput} />
            ))}
          </div>
          <div className={cn("text-base sm:text-[0.86rem]", entries.length > 0 && "mt-6 border-t border-line/70 pt-5")}>
            <PromptLine />
          </div>
        </div>
      </div>

      <QuickBar />
    </section>
  );
}
