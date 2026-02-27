/** @type {import('next-i18next').UserConfig} */
const HttpBackend = require('i18next-http-backend');
const LocalStorageBackend = require('i18next-localstorage-backend').default;
const ChainedBackend = require('i18next-chained-backend');

module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },

  use: [ChainedBackend],

  backend: {
    backends: [
      LocalStorageBackend,
      HttpBackend,
    ],
    backendOptions: [
      {
        prefix: 'i18next_res_',
        expirationTime: 7 * 24 * 60 * 60 * 1000,
      },
      {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    ],
  },

  serializeConfig: false,
};