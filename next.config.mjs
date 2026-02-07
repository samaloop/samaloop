/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co'
            }
        ]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    }
};

export default nextConfig;
