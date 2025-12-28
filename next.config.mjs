/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from dev.internal.defnf.com during development
  allowedDevOrigins: [
    'dev.internal.defnf.com'
  ],
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    SHOW_CONTRIBUTIONS: process.env.GITHUB_TOKEN ? 'true' : ''
  }
}

export default nextConfig
