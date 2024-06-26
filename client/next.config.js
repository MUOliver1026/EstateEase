const API_URL = process.env.API_URL

/** @type {import('next').NextConfig} */

const redirects = async () => {
    return [
        {
            source: '/api/:path*',
            destination: `${API_URL}/:path*`,
            permanent: true,
        },
    ];
}

const nextConfig = {
  reactStrictMode: true,
  redirects,
  async headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: `${API_URL}/api` }, // replace this your actual origin
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    },
    images: {
        domains: [
            "lh3.googleusercontent.com", 
            "firebasestorage.googleapis.com",
            "cdn.pixabay.com"
        ],
    },
};

module.exports = nextConfig;
