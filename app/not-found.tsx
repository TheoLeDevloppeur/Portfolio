import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-panel font-mono text-sm">
        <div className="flex h-11 items-center gap-1.5 border-b border-line px-4" aria-hidden>
          <span className="size-3 rounded-full bg-err/90" />
          <span className="size-3 rounded-full bg-warn/90" />
          <span className="size-3 rounded-full bg-ok/90" />
        </div>
        <div className="space-y-2 p-5 leading-relaxed">
          <p>
            <span className="text-accent">théo@portfolio</span>
            <span className="text-muted">:~$ </span>cd ./page-demandee
          </p>
          <h1 className="text-err">tsh: cd: aucun fichier ou dossier de ce type (404)</h1>
          <p className="text-muted">La page demandée n&apos;existe pas : tout le portfolio tient dans le terminal.</p>
          <p className="pt-2">
            <Link href="/" className="text-accent underline underline-offset-4 hover:decoration-2">
              cd ~ ↵ retour au terminal
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
