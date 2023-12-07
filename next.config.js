/** @type {import('next').NextConfig} */
const nextConfig = () => {
    const withImages = require('next-images')
    const rewrites = () => {
        return [
            {
                source: "/api/:path*",
                destination: process.env.DEST_DEV,
            },
        ];
    };
    return withImages({
        rewrites,
        images: {
            disableStaticImages: true,
        },
        webpack: (config) => {
            config.resolve.alias.canvas = false;
            return config;
        },
    });
};

module.exports = nextConfig;
