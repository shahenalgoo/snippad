/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();


const nextConfig = {
    experimental: {
        appDir: true,
        esmExternals: true
    }
}

module.exports = nextConfig