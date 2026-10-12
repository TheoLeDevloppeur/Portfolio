"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { complete, inlineSuggestion, MAX_INPUT_LENGTH } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { Prompt } from "./Prompt";
import { useTerminal } from "./terminal-context";

/**
 * Ligne de saisie : un vrai <input> transparent superposé à un « miroir » qui dessine
 * le texte, le curseur bloc et la suggestion grisée (→ pour l'accepter).
 */
export function PromptLine() {
  const { history, run, clear, inputRef } = useTerminal();
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState(0);
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState<string[]>([]);
  const historyIndex = useRef<number | null>(null);
  const draft = useRef("");

  const ghost = cursor === value.length ? inlineSuggestion(value, history) : "";

  /** Remplace la ligne et place le curseur à la fin. */
  function setLine(next: string) {
    setValue(next);
    setCursor(next.length);
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(next.length, next.length));
  }

  function syncCursor() {
    const el = inputRef.current;
    if (el) setCursor(el.selectionStart ?? el.value.length);
  }

  function submit() {
    run(value);
    setLine("");
    setHint([]);
    historyIndex.current = null;
    draft.current = "";
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const atEnd = (e.currentTarget.selectionStart ?? 0) === value.length;
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      clear();
      setHint([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      // Ctrl+C sans sélection : annule la saisie en cours, comme dans un shell.
      if (window.getSelection()?.toString()) return;
      e.preventDefault();
      setLine("");
      setHint([]);
    } else if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      if (historyIndex.current === null) {
        draft.current = value;
        historyIndex.current = history.length - 1;
      } else {
        historyIndex.current = Math.max(0, historyIndex.current - 1);
      }
      setLine(history[historyIndex.current] ?? "");
    } else if (e.key === "ArrowDown") {
      if (historyIndex.current === null) return;
      e.preventDefault();
      const next = historyIndex.current + 1;
      if (next >= history.length) {
        historyIndex.current = null;
        setLine(draft.current);
      } else {
        historyIndex.current = next;
        setLine(history[next] ?? "");
      }
    } else if ((e.key === "ArrowRight" || e.key === "End") && atEnd && ghost) {
      e.preventDefault();
      setLine(value + ghost);
    } else if (e.key === "Tab") {
      if (!value.trim()) return; // ligne vide : Tab garde son rôle de navigation clavier
      e.preventDefault();
      const { value: completed, candidates } = complete(value);
      setLine(completed);
      setHint(candidates.length > 1 ? candidates : []);
    } else if (e.key === "Escape") {
      setHint([]);
    }
  }

  const before = value.slice(0, cursor);
  const under = value.slice(cursor, cursor + 1) || ghost.slice(0, 1) || " ";
  const after = value.slice(cursor + 1);
  const ghostRest = value.length === cursor ? ghost.slice(1) : "";
  const showPlaceholder = !value && history.length === 0;

  return (
    <div>
      <form
        className="flex items-start"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Prompt />
        <label className="relative block min-w-0 flex-1 cursor-text">
          <span className="sr-only">Saisir une commande</span>
          {/* Miroir visuel */}
          <span aria-hidden className="pointer-events-none block whitespace-pre-wrap text-fg [overflow-wrap:anywhere]">
            {before}
            <span
              // la clé relance l'animation : le curseur reste plein pendant la frappe
              key={`${value}|${cursor}`}
              className={cn(
                "rounded-[2px]",
                focused ? "animate-blink bg-accent text-panel" : "text-fg outline outline-1 -outline-offset-1 outline-accent/60",
                !value.slice(cursor, cursor + 1) && ghost && !focused && "text-muted/50",
              )}
            >
              {under}
            </span>
            {after}
            {ghostRest && <span className="text-muted/45">{ghostRest}</span>}
            {showPlaceholder && (
              <span className="text-muted/45">
                <span className="max-sm:hidden"> tapez une commande, ex. help</span>
                <span className="sm:hidden"> ex. help</span>
              </span>
            )}
          </span>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value.slice(0, MAX_INPUT_LENGTH));
              setCursor(e.target.selectionStart ?? e.target.value.length);
              historyIndex.current = null;
              // si l'utilisateur avait remonté l'historique, on ramène la ligne de saisie à l'écran
              const scroller = e.target.closest("[data-terminal-scroll]");
              if (scroller) scroller.scrollTop = scroller.scrollHeight;
            }}
            onSelect={syncCursor}
            onKeyDown={onKeyDown}
            onFocus={() => {
              setFocused(true);
              syncCursor();
            }}
            onBlur={() => setFocused(false)}
            maxLength={MAX_INPUT_LENGTH}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            aria-describedby="terminal-help"
            className="absolute inset-0 h-full w-full bg-transparent text-transparent caret-transparent outline-none selection:bg-accent/30 focus-visible:outline-none"
          />
        </label>
      </form>
      <span id="terminal-help" className="sr-only">
        Entrée pour exécuter, flèches haut et bas pour l&apos;historique, Tab pour compléter, flèche droite pour accepter la
        suggestion, Ctrl+L pour effacer.
      </span>
      {hint.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-5 text-muted" aria-live="polite">
          {hint.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      )}
    </div>
  );
}
