const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',

    // Custom page extensions
    pageExtensions: ['page.ts', 'page.tsx'],

    // i18n configuration
    i18n,

    // Transpile internal packages
    transpilePackages: [
        '@ms-genealogie/services',
    ],

    // SCSS support is built-in with the `sass` package
    sassOptions: {
        includePaths: ['./src/styles'],
    },

    // Webpack customization
    webpack: (config) => {
        return config;
    },
};

module.exports = nextConfig;
