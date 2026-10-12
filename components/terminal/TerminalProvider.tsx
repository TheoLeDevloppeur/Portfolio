"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { execute, MAX_INPUT_LENGTH } from "@/lib/commands";
import { TerminalContext, type TerminalEntry } from "./terminal-context";

type NewEntry =
  | { kind: "boot"; text: string; status: "ok" | "info" }
  | { kind: "input"; text: string; time: string }
  | { kind: "output"; node: ReactNode };

const timeFormat = new Intl.DateTimeFormat("fr-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const now = () => timeFormat.format(new Date());

type BootItem = { kind: "boot"; text: string; status: "ok" | "info" } | { kind: "command"; text: string };

/** Séquence d'ouverture de session : courte, non bloquante et interrompue dès la première saisie. */
const BOOT_SEQUENCE: BootItem[] = [
  { kind: "boot", text: "Initializing portfolio...", status: "info" },
  { kind: "boot", text: "Loading profile...", status: "info" },
  { kind: "boot", text: "Checking available modules...", status: "info" },
  { kind: "boot", text: "System ready.", status: "ok" },
  { kind: "command", text: "whoami" },
  { kind: "command", text: "help" },
];

export function TerminalProvider({ children, cvAvailable }: { children: ReactNode; cvAvailable: boolean }) {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextId = useRef(0);
  const historyRef = useRef<string[]>([]);
  const sessionStart = useRef(0);
  const bootQueue = useRef<BootItem[]>([]);
  const bootTimers = useRef<number[]>([]);

  const append = useCallback((...items: NewEntry[]) => {
    setEntries((prev) => [...prev, ...items.map((item) => ({ ...item, id: nextId.current++ }) as TerminalEntry)]);
  }, []);

  const context = useCallback(
    () => ({ history: historyRef.current, cvAvailable, sessionStart: sessionStart.current }),
    [cvAvailable],
  );

  /** Affiche la sortie d'une commande précédée de sa ligne de saisie. */
  const print = useCallback(
    (text: string) => {
      const result = execute(text, context());
      if (result.clear) {
        setEntries([]);
        return;
      }
      append({ kind: "input", text, time: now() }, ...(result.output ? [{ kind: "output" as const, node: result.output }] : []));
    },
    [append, context],
  );

  const emitBoot = useCallback(
    (item: BootItem) => (item.kind === "boot" ? append(item) : print(item.text)),
    [append, print],
  );

  /** Termine immédiatement la séquence de démarrage (si l'utilisateur tape avant la fin). */
  const flushBoot = useCallback(() => {
    bootTimers.current.forEach((t) => window.clearTimeout(t));
    bootTimers.current = [];
    const remaining = bootQueue.current;
    bootQueue.current = [];
    remaining.forEach(emitBoot);
    setBooting(false);
  }, [emitBoot]);

  useEffect(() => {
    sessionStart.current = Date.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? 0 : 210;
    bootQueue.current = [...BOOT_SEQUENCE];

    const tick = () => {
      const item = bootQueue.current.shift();
      if (!item) {
        setBooting(false);
        return;
      }
      emitBoot(item);
      bootTimers.current.push(window.setTimeout(tick, item.kind === "command" ? delay * 1.8 : delay));
    };
    bootTimers.current.push(window.setTimeout(tick, reduceMotion ? 0 : 180));

    // Focus automatique uniquement avec une souris (évite d'ouvrir le clavier virtuel sur mobile).
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });

    return () => {
      bootTimers.current.forEach((t) => window.clearTimeout(t));
      bootTimers.current = [];
    };
  }, [emitBoot]);

  const clear = useCallback(() => {
    flushBoot();
    setEntries([]);
  }, [flushBoot]);

  const run = useCallback(
    (raw: string) => {
      flushBoot();
      const text = raw.slice(0, MAX_INPUT_LENGTH).trim();
      if (!text) {
        append({ kind: "input", text: "", time: now() });
        return;
      }
      const last = historyRef.current[historyRef.current.length - 1];
      if (last !== text) historyRef.current = [...historyRef.current, text].slice(-100);
      setHistory(historyRef.current);
      print(text);
    },
    [append, flushBoot, print],
  );

  const focusInput = useCallback(() => inputRef.current?.focus({ preventScroll: true }), []);

  // Ctrl/Cmd+K ou « / » depuis n'importe où → retour à la ligne de saisie.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const editing = !!target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") || (e.key === "/" && !editing)) {
        e.preventDefault();
        focusInput();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusInput]);

  const value = useMemo(
    () => ({ entries, history, booting, run, clear, focusInput, inputRef }),
    [entries, history, booting, run, clear, focusInput],
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}
