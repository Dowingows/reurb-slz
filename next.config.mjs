/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "portal.ifma.edu.br" },
    ],
  },
};

export default nextConfig;
