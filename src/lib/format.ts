const KMF_PER_EUR = Number(process.env.NEXT_PUBLIC_KMF_PER_EUR ?? 491.96775);

const kmfFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

/** 12500 -> "12 500 KMF" */
export function formatKMF(amount: number): string {
  // Remplace l'espace insécable fine par une espace insécable classique (meilleur rendu WhatsApp)
  return `${kmfFormatter.format(amount).replace(/\u202f/g, "\u00a0")}\u00a0KMF`;
}

/** Conversion indicative KMF -> EUR (parité fixe). */
export function toEUR(amountKMF: number): number {
  return amountKMF / KMF_PER_EUR;
}

export function formatEUR(amountKMF: number): string {
  return `≈ ${eurFormatter.format(toEUR(amountKMF))}`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** "Bijoux en or" -> "bijoux-en-or" */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Normalise un numéro comorien vers le format international +269XXXXXXX. */
export function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("269")) return `+${digits}`;
  if (digits.length === 7) return `+269${digits}`;
  return digits;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
