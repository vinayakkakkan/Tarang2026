// Base path for static assets - matches next.config.mjs basePath
// Set NEXT_PUBLIC_BASE_PATH during GitHub Actions build
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default BASE_PATH;
