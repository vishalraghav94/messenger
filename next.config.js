/** @type {import('next').NextConfig} */
const withPwa = require('next-pwa')({
    dest: "public",
    register: true,
    skipWaiting: true,
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
    
})

module.exports = nextConfig
