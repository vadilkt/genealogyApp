import i18n from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { initReactI18next } from 'react-i18next';

// Client-side i18n initialization.
//
// Translations are loaded at runtime from `public/locales/{{lng}}/{{ns}}.json`
// through a chained localStorage + HTTP backend — there is no
// `serverSideTranslations`, so the i18next instance is only set up in the
// browser (the localStorage backend would crash during SSR).
if (typeof window !== 'undefined' && !i18n.isInitialized) {
    i18n
        .use(ChainedBackend)
        .use(initReactI18next)
        .init({
            lng: 'fr',
            fallbackLng: 'fr',
            supportedLngs: ['fr', 'en'],
            ns: ['common'],
            defaultNS: 'common',
            interpolation: { escapeValue: false },
            react: { useSuspense: false },
            backend: {
                backends: [LocalStorageBackend, HttpBackend],
                backendOptions: [
                    { prefix: 'i18next_res_', expirationTime: 7 * 24 * 60 * 60 * 1000 },
                    { loadPath: '/locales/{{lng}}/{{ns}}.json' },
                ],
            },
        });
}

export const initI18n = () => i18n;

export default i18n;
