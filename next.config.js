/** @type {import('next').NextConfig} */
const withPwa = require('next-pwa')
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
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
    }
})

module.exports = nextConfig
