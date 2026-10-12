"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("fr-CH", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
}

/** Horloge locale HH:MM:SS (rendue côté client uniquement pour éviter un décalage d'hydratation). */
export function Clock({ className }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(new Date()),
    () => "--:--:--",
  );
  return (
    <time className={className} suppressHydrationWarning aria-label={`Heure locale ${time}`}>
      {time}
    </time>
  );
}
