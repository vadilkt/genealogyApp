// Application-level utilities
export const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

/** Normalise une réponse API en tableau.
 * Gère : tableau brut, objet Spring Page { content: [...] }, null/undefined. */
export function toArray<T>(data: unknown): T[] {
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as Record<string, unknown>).content)) {
        return (data as { content: T[] }).content;
    }
    return [];
}
