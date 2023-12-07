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
    return {
        rewrites,
        images: {
            disableStaticImages: true,
        },
    };
};

module.exports = nextConfig;
