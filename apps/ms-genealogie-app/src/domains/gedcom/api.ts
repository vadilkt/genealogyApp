const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

const authHeader = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Télécharge l'arbre complet au format GEDCOM (.ged). */
export const downloadGedcom = async (): Promise<void> => {
    const res = await fetch(`${API_BASE}/gedcom/export`, { headers: { ...authHeader() } });
    if (!res.ok) throw new Error('export-failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ms-genealogie.ged';
    a.click();
    URL.revokeObjectURL(url);
};

/** Importe un fichier GEDCOM (contenu texte). Retourne le nombre de profils créés. */
export const importGedcom = async (content: string): Promise<number> => {
    const res = await fetch(`${API_BASE}/gedcom/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', ...authHeader() },
        body: content,
    });
    if (!res.ok) throw new Error('import-failed');
    const data = (await res.json()) as { created: number };
    return data.created;
};
