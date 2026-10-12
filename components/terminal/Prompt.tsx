import { profile } from "@/data/profile";

/** Prompt du shell : `théo@portfolio:~$`. */
export function Prompt() {
  return (
    <span className="shrink-0 select-none whitespace-pre" aria-hidden>
      <span className="font-medium text-accent">
        {profile.promptUser}@{profile.promptHost}
      </span>
      <span className="text-muted">:</span>
      <span className="text-fg">~</span>
      <span className="text-muted">$ </span>
    </span>
  );
}
