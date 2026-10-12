"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Copie un texte dans le presse-papiers, avec retour visuel et message accessible. */
export function CopyButton({
  value,
  label = "Copier",
  className,
  compact = false,
}: {
  value: string;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  const text = state === "copied" ? "Copié" : state === "error" ? "Échec de la copie" : label;

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent",
        compact ? "p-1.5" : "px-2.5 py-1.5",
        state === "copied" && "border-accent/50 text-accent",
        className,
      )}
      aria-label={compact ? `${label} : ${value}` : undefined}
      title={compact ? label : undefined}
    >
      {state === "copied" ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {!compact && <span>{text}</span>}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Copié dans le presse-papiers" : state === "error" ? "La copie a échoué" : ""}
      </span>
    </button>
  );
}
