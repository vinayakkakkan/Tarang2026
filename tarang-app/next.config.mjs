/** @type {import('next').NextConfig} */

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/Tarang2026',
    assetPrefix: '/Tarang2026/',
  }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
