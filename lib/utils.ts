/** Concatène des classes CSS en ignorant les valeurs falsy. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Distance de Levenshtein — sert à suggérer une commande proche en cas de faute de frappe. */
export function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(prev[j]! + 1, prev[j - 1]! + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length]!;
}

/** Formate une date ISO (AAAA-MM-JJ) en français, sans décalage de fuseau. */
export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("fr-CH", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

/** Vérifie qu'une URL externe est bien en http(s) avant de l'utiliser dans un lien. */
export function isSafeExternalUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Validation simple d'une adresse e-mail configurée. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email);
}

/** Est-ce qu'un texte est encore un gabarit à compléter ? */
export function isPlaceholder(text: string | undefined): boolean {
  return !text || /^\s*\[.*\]\s*$/.test(text) || text.includes("[À compléter");
}
