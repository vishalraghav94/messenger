/** @type {import('next').NextConfig} */
const withPwa = require('next-pwa')({
    dest: "public",
    register: true,
    skipWaiting: true,
    buildExcludes: ["app-build-manifest.json"]
})
const nextConfig = withPwa({
    experimental: {
        appDir: true,
        swcPlugins: [
            'next-superjson-plugin',
            {}
        ]
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'avatars.githubusercontent.com']
    },
    reactStrictMode: true
    
})

module.exports = nextConfig
