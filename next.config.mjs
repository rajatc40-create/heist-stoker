/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  serverExternalPackages: ["better-sqlite3"],
  typedRoutes: false
};

export default nextConfig;
