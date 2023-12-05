/** @type {import('next').NextConfig} */
const nextConfig = () => {
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
    };
};

module.exports = nextConfig;
