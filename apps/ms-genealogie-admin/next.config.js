/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',

    // Custom page extensions
    pageExtensions: ['page.ts', 'page.tsx'],

    // SCSS support
    sassOptions: {
        includePaths: ['./src/styles'],
    },
};

module.exports = nextConfig;
