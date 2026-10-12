"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTerminal } from "./terminal-context";

/** Commande cliquable : l'exécute dans le terminal comme si elle avait été saisie. */
export function CommandLink({
  command,
  children,
  className,
}: {
  command: string;
  children?: ReactNode;
  className?: string;
}) {
  const { run } = useTerminal();
  return (
    <button
      type="button"
      onClick={() => run(command)}
      className={cn(
        "cursor-pointer rounded-sm font-mono text-accent decoration-accent/50 underline-offset-4 transition-colors hover:underline",
        className,
      )}
      title={`Exécuter « ${command} »`}
    >
      {children ?? command}
    </button>
  );
}
