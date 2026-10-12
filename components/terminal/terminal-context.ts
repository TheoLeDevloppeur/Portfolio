"use client";

import { createContext, useContext, type ReactNode, type RefObject } from "react";

export type TerminalEntry =
  | { id: number; kind: "boot"; text: string; status: "ok" | "info" }
  | { id: number; kind: "input"; text: string; time: string }
  | { id: number; kind: "output"; node: ReactNode };

export interface TerminalContextValue {
  entries: TerminalEntry[];
  history: string[];
  booting: boolean;
  /** Exécute une commande comme si elle avait été saisie. */
  run: (input: string) => void;
  clear: () => void;
  focusInput: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export const TerminalContext = createContext<TerminalContextValue | null>(null);

export function useTerminal(): TerminalContextValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal doit être utilisé dans <TerminalProvider>.");
  return ctx;
}
