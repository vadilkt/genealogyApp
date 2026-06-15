import i18n from 'i18next';

/** Locale Intl active, dérivée de la langue i18n courante. */
const intlLocale = (): string => ((i18n.language ?? 'fr').startsWith('en') ? 'en-GB' : 'fr-FR');

export const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(intlLocale(), {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export const formatDateShort = (iso: string | null | undefined): string => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(intlLocale(), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// ─── Dates généalogiques (qualificatif + précision) ────────────────────────────

const QUALIFIER_PREFIX_FR: Record<string, string> = {
    EXACT: '',
    ABOUT: 'vers ',
    BEFORE: 'avant ',
    AFTER: 'après ',
};

const QUALIFIER_PREFIX_EN: Record<string, string> = {
    EXACT: '',
    ABOUT: 'about ',
    BEFORE: 'before ',
    AFTER: 'after ',
};

/** Symbole compact pour les affichages denses (arbre) : ~ vers, &lt; avant, &gt; après. */
const QUALIFIER_SYMBOL: Record<string, string> = {
    EXACT: '',
    ABOUT: '~',
    BEFORE: '<',
    AFTER: '>',
};

export const qualifierSymbol = (qualifier?: string | null): string =>
    QUALIFIER_SYMBOL[qualifier ?? 'EXACT'] ?? '';

/**
 * Formate une date en respectant sa précision connue (année / mois / jour) et son
 * qualificatif d'incertitude (« vers », « avant », « après »).
 */
export const formatGenealogicalDate = (
    iso: string | null | undefined,
    qualifier?: string | null,
    precision?: string | null,
): string => {
    if (!iso) return '—';
    const d = new Date(iso);
    const locale = intlLocale();
    let body: string;
    switch (precision) {
        case 'YEAR':
            body = String(d.getFullYear());
            break;
        case 'MONTH':
            body = d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
            break;
        default:
            body = d.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
    }
    const prefixes = locale.startsWith('en') ? QUALIFIER_PREFIX_EN : QUALIFIER_PREFIX_FR;
    return `${prefixes[qualifier ?? 'EXACT'] ?? ''}${body}`;
};

/** Mode et format du DatePicker Ant Design selon la précision choisie. */
export const datePickerProps = (
    precision?: string | null,
): { picker: 'date' | 'month' | 'year'; format: string } => {
    if (precision === 'YEAR') return { picker: 'year', format: 'YYYY' };
    if (precision === 'MONTH') return { picker: 'month', format: 'MM/YYYY' };
    return { picker: 'date', format: 'DD/MM/YYYY' };
};
