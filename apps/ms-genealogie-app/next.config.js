const path = require('path');
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    // Required in monorepo: trace workspace packages (services, auth…) correctly
    outputFileTracingRoot: path.join(__dirname, '../../'),

    // ESLint and TypeScript checks run in CI — do not block production builds
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },

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
